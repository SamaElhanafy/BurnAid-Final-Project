/**
 * BURN-AID HTTP API: auth, burn result history, admin video config, first-aid rules, and map/nearby helpers.
 * Data is stored under ./data as JSON (suitable for development; use a real DB for production scale).
 * Nearby / geospatial logic lives in `services/nearbyFacilities.ts`; JWT helpers in `middleware/auth.ts`.
 */
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { PORT } from './env';
import { adminMiddleware, authMiddleware, signToken } from './middleware/auth';
import {
  findFallbackEgyptFacilities,
  findGoogleNearbyPlaces,
  findNearbyFacilities,
  type NearbyResult,
} from './services/nearbyFacilities';
import { readUsers, writeUsers, updateUser, type StoredUser } from './storage/usersStore';
import { readDatasets } from './storage/datasetsStore';
import { readBurnResults, addBurnResult, getBurnResult, deleteBurnResult, type BurnResult } from './storage/burnResultsStore';
import { readFirstAidRules, addFirstAidRule, updateFirstAidRule, deleteFirstAidRule, type FirstAidRule } from './storage/firstAidRulesStore';
import { readSystemLogs, addSystemLog } from './storage/systemLogsStore';
import { readHowItWorksVideo, readVideoSettings, writeVideoSettings } from './storage/videosStore';

const app = express();
app.use(express.json({ limit: '1mb' }));

app.use(
  cors({
    origin: true,
    credentials: false,
  }),
);

const emailSchema = z.string().trim().min(3).max(254).email();
const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
const egyptianPhoneSchema = z.string().trim().regex(/^01\d{9}$/, 'Phone number must be 11 digits and start with 01');

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: emailSchema,
  password: z.string().min(6).max(200),
  phone: egyptianPhoneSchema,
  bloodType: z.enum(bloodTypes),
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(200),
});

const profileUpdateSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  email: emailSchema.optional(),
  phone: egyptianPhoneSchema.optional(),
  bloodType: z.enum(bloodTypes).optional(),
  allergies: z.string().trim().max(500).optional(),
  medications: z.string().trim().max(500).optional(),
});

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1).max(200),
  newPassword: z.string().min(6).max(200),
  confirmPassword: z.string().min(1).max(200),
});

const burnResultSchema = z.object({
  burnType: z.string().trim().min(1).max(200),
  confidence: z.number().min(0).max(1),
  description: z.string().max(2000).optional(),
  recommendations: z.array(z.string().max(500)).optional(),
});

function isBcryptHash(value: string | undefined) {
  return typeof value === 'string' && /^\$2[aby]\$\d{2}\$/.test(value);
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.post('/api/overpass', express.text({ type: '*/*', limit: '64kb' }), async (req, res) => {
  const query = typeof req.body === 'string' ? req.body : '';
  if (!query.trim()) return res.status(400).json({ error: 'Missing Overpass query' });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 18000);
  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=UTF-8',
        Accept: 'application/json',
      },
      body: query,
      signal: controller.signal,
    });
    const text = await response.text();
    res.status(response.status).type(response.headers.get('content-type') || 'application/json').send(text);
  } catch {
    res.status(502).json({ error: 'Nearby facility search is unavailable' });
  } finally {
    clearTimeout(timeout);
  }
});

app.post('/api/nearby-facilities', async (req, res) => {
  const schema = z.object({
    lat: z.number().min(21.5).max(31.8),
    lon: z.number().min(24.5).max(36.9),
    mode: z.enum(['emergency', 'burn', 'both']).default('burn'),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Location must be inside Egypt' });

  try {
    const first = await findNearbyFacilities(parsed.data.mode, parsed.data.lat, parsed.data.lon);
    if (first.results.length > 0) return res.json(first);

    const retry = await findNearbyFacilities(parsed.data.mode, parsed.data.lat, parsed.data.lon);
    return res.json(retry);
  } catch (error) {
    try {
      const retry = await findNearbyFacilities(parsed.data.mode, parsed.data.lat, parsed.data.lon);
      return res.json(retry);
    } catch {
      return res.status(502).json({ error: 'Nearby facility search is temporarily unavailable' });
    }
  }
});

app.get('/api/places/nearby', async (req, res) => {
  const schema = z.object({
    lat: z.coerce.number().min(21.5).max(31.8),
    lng: z.coerce.number().min(24.5).max(36.9),
    type: z.enum(['emergency', 'burn', 'both']).default('burn'),
  });
  const parsed = schema.safeParse(req.query);
  if (!parsed.success) return res.status(400).json({ error: 'lat/lng must be inside Egypt' });

  const { lat, lng, type } = parsed.data;
  try {
    let results: NearbyResult[] = [];
    try {
      results = await findGoogleNearbyPlaces(type, lat, lng);
    } catch (error) {
      console.error('Google Places nearby failed, using server-side fallback', {
        type,
        lat,
        lng,
        error: error instanceof Error ? error.message : String(error),
      });
      const fallback = await findNearbyFacilities(type, lat, lng);
      results = fallback.results;
    }

    if (!results.length && type === 'burn') {
      const fallback = await findNearbyFacilities('emergency', lat, lng);
      results = fallback.results;
    }

    if (!results.length) {
      results = findFallbackEgyptFacilities(type, lat, lng);
    }

    return res.json(results.sort((a, b) => a.distanceKm - b.distanceKm));
  } catch (error) {
    console.error('Nearby places proxy failed', {
      type,
      lat,
      lng,
      error: error instanceof Error ? error.message : String(error),
    });
    return res.json(findFallbackEgyptFacilities(type, lat, lng));
  }
});

app.post('/api/auth/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid input' });

  const { name, email, password, phone, bloodType } = parsed.data;
  const users = await readUsers();
  const exists = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return res.status(409).json({ error: 'Email already registered' });
  const phoneExists = users.find((u) => u.phone === phone);
  if (phoneExists) return res.status(409).json({ error: 'Phone number already registered' });

  const passwordHash = await bcrypt.hash(password, 10);
  const isFirstUser = users.length === 0;
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email,
    phone,
    bloodType,
    passwordHash,
    createdAt: new Date().toISOString(),
    role: isFirstUser ? 'admin' : 'user',
  };
  users.push(user);
  await writeUsers(users);

  const token = signToken(user.id);
  return res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, bloodType: user.bloodType },
  });
});

app.post('/api/auth/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const { email, password } = parsed.data;
  const users = await readUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  console.log(`[login] email=${email.toLowerCase()} found=${Boolean(user)}`);
  if (!user) return res.status(401).json({ error: 'No account found for this email' });

  if (!isBcryptHash(user.passwordHash)) {
    console.error(`[login] invalid stored password hash user=${user.id}`);
    return res.status(500).json({ error: 'Stored password is invalid. Reset this account password.' });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  console.log(`[login] passwordMatch=${ok} user=${user.id}`);
  if (!ok) return res.status(401).json({ error: 'Password is incorrect' });

  const token = signToken(user.id);
  await addSystemLog({ type: 'user_login', message: `User ${user.email} logged in`, userId: user.id });
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, bloodType: user.bloodType },
  });
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const userId = (req as any).userId as string;
  const users = await readUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(401).json({ error: 'Unknown user' });
  return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, bloodType: user.bloodType, allergies: user.allergies, medications: user.medications } });
});

app.put('/api/auth/profile', authMiddleware, async (req, res) => {
  const parsed = profileUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0]?.message || 'Invalid input' });
  if (Object.keys(parsed.data).length === 0) return res.status(400).json({ error: 'No profile changes provided' });

  const userId = (req as any).userId as string;
  const users = await readUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(401).json({ error: 'Unknown user' });

  if (parsed.data.email) {
    const existing = users.find((u) => u.email.toLowerCase() === parsed.data.email!.toLowerCase() && u.id !== userId);
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    user.email = parsed.data.email;
  }
  if (parsed.data.name) {
    user.name = parsed.data.name;
  }
  if (parsed.data.phone !== undefined) {
    const existingPhone = users.find((u) => u.phone === parsed.data.phone && u.id !== userId);
    if (existingPhone) return res.status(409).json({ error: 'Phone number already registered' });
    user.phone = parsed.data.phone || undefined;
  }
  if (parsed.data.bloodType !== undefined) {
    user.bloodType = parsed.data.bloodType || undefined;
  }
  if (parsed.data.allergies !== undefined) {
    user.allergies = parsed.data.allergies || undefined;
  }
  if (parsed.data.medications !== undefined) {
    user.medications = parsed.data.medications || undefined;
  }

  await updateUser(user);
  return res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone, bloodType: user.bloodType, allergies: user.allergies, medications: user.medications } });
});

app.put('/api/auth/password', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).userId as string;
    console.log(`[password-change] request user=${userId || 'unknown'}`);

    const parsed = passwordChangeSchema.safeParse(req.body);
    if (!parsed.success) {
      console.warn('[password-change] invalid payload', parsed.error.flatten().fieldErrors);
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    if (parsed.data.newPassword !== parsed.data.confirmPassword) {
      console.warn(`[password-change] password confirmation mismatch user=${userId}`);
      return res.status(400).json({ error: 'New password and confirmation do not match' });
    }

    const users = await readUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) {
      console.warn(`[password-change] unknown user=${userId}`);
      return res.status(401).json({ error: 'Unknown user' });
    }

    console.log(`[password-change] user found=${Boolean(user)} hashValid=${isBcryptHash(user?.passwordHash)} user=${userId}`);
    if (!isBcryptHash(user.passwordHash)) {
      console.error(`[password-change] invalid stored password hash user=${userId}`);
      return res.status(500).json({ error: 'Stored password is invalid. Reset this account password.' });
    }

    const currentPasswordOk = await bcrypt.compare(parsed.data.currentPassword, user.passwordHash);
    console.log(`[password-change] currentPasswordMatch=${currentPasswordOk} user=${userId}`);
    if (!currentPasswordOk) {
      console.warn(`[password-change] incorrect current password user=${userId}`);
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const newPasswordHash = await bcrypt.hash(parsed.data.newPassword, 10);
    const newHashMatches = await bcrypt.compare(parsed.data.newPassword, newPasswordHash);
    if (!isBcryptHash(newPasswordHash) || !newHashMatches) {
      console.error(`[password-change] generated hash verification failed user=${userId}`);
      return res.status(500).json({ error: 'Password hash verification failed' });
    }

    user.passwordHash = newPasswordHash;
    await updateUser(user);
    const savedUser = (await readUsers()).find((u) => u.id === userId);
    const savedPasswordOk = savedUser ? await bcrypt.compare(parsed.data.newPassword, savedUser.passwordHash) : false;
    console.log(`[password-change] saved=${Boolean(savedUser)} savedPasswordMatch=${savedPasswordOk} user=${userId}`);
    if (!savedUser || !isBcryptHash(savedUser.passwordHash) || !savedPasswordOk) {
      console.error(`[password-change] saved password verification failed user=${userId}`);
      return res.status(500).json({ error: 'Password was not saved correctly' });
    }

    await addSystemLog({ type: 'password_changed', message: `User ${user.email} changed password`, userId });
    console.log(`[password-change] success user=${userId}`);
    return res.json({ ok: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('[password-change] failed', error);
    return res.status(500).json({ error: 'Password change failed on the server' });
  }
});

app.post('/api/burn-results', authMiddleware, async (req, res) => {
  const parsed = burnResultSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const userId = (req as any).userId as string;
  const result: BurnResult = {
    id: crypto.randomUUID(),
    userId,
    burnType: parsed.data.burnType,
    confidence: parsed.data.confidence,
    description: parsed.data.description,
    recommendations: parsed.data.recommendations,
    createdAt: new Date().toISOString(),
  };

  await addBurnResult(result);
  await addSystemLog({ type: 'burn_assessment_saved', message: `Burn assessment saved: ${result.burnType}`, userId: userId });
  return res.status(201).json({
    burnResult: result,
    result: result.burnType,
    confidence: result.confidence,
    emergencyLevel: result.burnType.includes('3rd') || result.burnType.includes('Third')
      ? 'emergencyNow'
      : result.burnType.includes('2nd') || result.burnType.includes('Second')
        ? 'seeDoctor'
        : 'homeCare',
    firstAid: result.recommendations ?? [],
  });
});

app.get('/api/burn-results', authMiddleware, async (req, res) => {
  const userId = (req as any).userId as string;
  const results = await readBurnResults();
  const userResults = results
    .filter((result) => result.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json({ burnResults: userResults });
});

app.get('/api/burn-results/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = (req as any).userId as string;
  const result = await getBurnResult(id);
  if (!result) return res.status(404).json({ error: 'Burn result not found' });

  const users = await readUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(401).json({ error: 'Unknown user' });
  if (result.userId !== userId && user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  return res.json({ burnResult: result });
});

app.delete('/api/burn-results/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const userId = (req as any).userId as string;
  const result = await getBurnResult(id);
  if (!result) return res.status(404).json({ error: 'Burn result not found' });

  const users = await readUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(401).json({ error: 'Unknown user' });
  if (result.userId !== userId && user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  const deleted = await deleteBurnResult(id);
  if (!deleted) return res.status(500).json({ error: 'Failed to delete burn result' });
  return res.json({ ok: true });
});

app.post('/api/auth/logout', (_req, res) => res.json({ ok: true }));

app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  const users = await readUsers();
  return res.json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      bloodType: u.bloodType,
      createdAt: u.createdAt,
      role: u.role,
    })),
  });
});

app.delete('/api/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const users = await readUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  users.splice(index, 1);
  await writeUsers(users);
  return res.json({ ok: true });
});

app.get('/api/admin/datasets', authMiddleware, adminMiddleware, async (req, res) => {
  const datasets = await readDatasets();
  return res.json({ datasets });
});
app.get('/api/first-aid-rules', async (req, res) => {
  const rules = await readFirstAidRules();
  return res.json({ rules });
});

app.get('/api/first-aid-rules/:burnDegree', async (req, res) => {
  const { burnDegree } = req.params;
  const rules = await readFirstAidRules();
  const filtered = rules.filter((r) => r.burnDegree === burnDegree);
  return res.json({ rules: filtered });
});

app.post('/api/admin/first-aid-rules', authMiddleware, adminMiddleware, async (req, res) => {
  const ruleSchema = z.object({
    burnDegree: z.enum(['1st Degree', '2nd Degree', '3rd Degree']),
    title: z.string().min(1).max(200),
    steps: z.array(z.string().min(1).max(500)).min(1),
    emergencyWarning: z.string().min(1).max(500),
  });
  const parsed = ruleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const rule: FirstAidRule = {
    id: crypto.randomUUID(),
    burnDegree: parsed.data.burnDegree,
    title: parsed.data.title,
    steps: parsed.data.steps,
    emergencyWarning: parsed.data.emergencyWarning,
    lastUpdated: new Date().toISOString(),
  };
  await addFirstAidRule(rule);
  return res.status(201).json({ rule });
});

app.put('/api/admin/first-aid-rules/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const ruleSchema = z.object({
    burnDegree: z.enum(['1st Degree', '2nd Degree', '3rd Degree']),
    title: z.string().min(1).max(200),
    steps: z.array(z.string().min(1).max(500)).min(1),
    emergencyWarning: z.string().min(1).max(500),
  });
  const parsed = ruleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });

  const rules = await readFirstAidRules();
  const existing = rules.find((r) => r.id === id);
  if (!existing) return res.status(404).json({ error: 'Rule not found' });

  const updatedRule: FirstAidRule = {
    ...existing,
    burnDegree: parsed.data.burnDegree,
    title: parsed.data.title,
    steps: parsed.data.steps,
    emergencyWarning: parsed.data.emergencyWarning,
    lastUpdated: new Date().toISOString(),
  };
  await updateFirstAidRule(updatedRule);
  return res.json({ rule: updatedRule });
});

app.delete('/api/admin/first-aid-rules/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const deleted = await deleteFirstAidRule(id);
  if (!deleted) return res.status(404).json({ error: 'Rule not found' });
  return res.json({ ok: true });
});
app.get('/api/admin/logs', authMiddleware, adminMiddleware, async (req, res) => {
  const logs = await readSystemLogs();
  return res.json({ logs });
});

app.get('/api/videos', async (_req, res) => {
  const settings = await readVideoSettings();
  return res.json(settings);
});

app.get('/api/how-it-works-video', async (_req, res) => {
  const video = await readHowItWorksVideo();
  return res.json({ video });
});

app.get('/api/admin/videos', authMiddleware, adminMiddleware, async (req, res) => {
  const settings = await readVideoSettings();
  return res.json(settings);
});

app.put('/api/admin/video-settings', authMiddleware, adminMiddleware, async (req, res) => {
  const videoSchema = z.object({
    title: z.string().min(1).max(200),
    duration: z.string().min(1).max(100),
    thumbnail: z.string().url(),
    youtubeUrl: z.string().url(),
    id: z.string().optional(),
  });
  const howItWorksSchema = z.object({
    thumbnail: z.string().url(),
    youtubeUrl: z.string().url(),
  });
  const settingsSchema = z.object({
    enVideos: z.array(videoSchema).min(1),
    arVideos: z.array(videoSchema).min(1),
    howItWorks: z.object({
      en: howItWorksSchema,
      ar: howItWorksSchema,
    }),
  });
  const parsed = settingsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid video settings' });

  const settings = await writeVideoSettings(parsed.data);
  return res.json(settings);
});

app.get('/api/admin/how-it-works-video', authMiddleware, adminMiddleware, async (_req, res) => {
  const video = await readHowItWorksVideo();
  return res.json({ video });
});

/** Local `tsx`/Node server; on Vercel the platform invokes the app without listening on a port. */
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend listening on http://127.0.0.1:${PORT}`);
  });
}

export default app;
