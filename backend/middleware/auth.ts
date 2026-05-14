/**
 * JWT bearer auth for protected routes and a small admin role check backed by `users.json`.
 */
import type express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../env';
import { readUsers } from '../storage/usersStore';

export type JwtPayload = { sub: string };

export function signToken(userId: string) {
  return jwt.sign({ sub: userId } satisfies JwtPayload, JWT_SECRET_KEY, { expiresIn: '7d' });
}

export function authMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const header = req.header('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice('Bearer '.length) : '';
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY) as JwtPayload;
    (req as any).userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

export async function adminMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
  const userId = (req as any).userId as string;
  if (!userId) return res.status(401).json({ error: 'Missing auth' });
  const users = await readUsers();
  const user = users.find((u) => u.id === userId);
  if (user?.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  next();
}
