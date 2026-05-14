/** JSON persistence for registered accounts (`backend/data/users.json`). */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  role: 'user' | 'admin';
  // Required for new signups; optional here so older JSON records can still load.
  phone?: string;
  bloodType?: string;
  allergies?: string;
  medications?: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const USERS_PATH = path.resolve(DATA_DIR, 'users.json');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readUsers(): Promise<StoredUser[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(USERS_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
}

export async function writeUsers(users: StoredUser[]) {
  await ensureDataDir();
  const tmp = USERS_PATH + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(users, null, 2), 'utf8');
  await fs.rename(tmp, USERS_PATH);
}

export async function updateUser(updatedUser: StoredUser) {
  const users = await readUsers();
  const index = users.findIndex((u) => u.id === updatedUser.id);
  if (index === -1) {
    throw new Error('User not found');
  }
  users[index] = updatedUser;
  await writeUsers(users);
}

