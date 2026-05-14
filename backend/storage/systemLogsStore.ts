/** Append-only admin audit-style events (`backend/data/systemLogs.json`). */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type SystemLog = {
  id: string;
  type: 'user_login' | 'burn_assessment_saved' | 'prediction_request' | 'profile_update' | 'password_changed' | 'admin_action' | 'error';
  message: string;
  userId?: string;
  createdAt: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const LOGS_PATH = path.resolve(DATA_DIR, 'systemLogs.json');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readSystemLogs(): Promise<SystemLog[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(LOGS_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SystemLog[]) : [];
  } catch {
    return [];
  }
}

export async function writeSystemLogs(logs: SystemLog[]) {
  await ensureDataDir();
  const tmp = LOGS_PATH + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(logs, null, 2), 'utf8');
  await fs.rename(tmp, LOGS_PATH);
}

export async function addSystemLog(log: Omit<SystemLog, 'id' | 'createdAt'>) {
  const logs = await readSystemLogs();
  const newLog: SystemLog = {
    ...log,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  logs.push(newLog);
  await writeSystemLogs(logs);
}
