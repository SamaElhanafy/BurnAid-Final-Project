/** Saved assessment history per user (`backend/data/burnResults.json`). */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type BurnResult = {
  id: string;
  userId: string;
  burnType: string;
  confidence: number;
  description?: string;
  recommendations?: string[];
  createdAt: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const BURN_RESULTS_PATH = path.resolve(DATA_DIR, 'burnResults.json');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readBurnResults(): Promise<BurnResult[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(BURN_RESULTS_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as BurnResult[]) : [];
  } catch {
    return [];
  }
}

export async function writeBurnResults(results: BurnResult[]) {
  await ensureDataDir();
  const tmp = BURN_RESULTS_PATH + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(results, null, 2), 'utf8');
  await fs.rename(tmp, BURN_RESULTS_PATH);
}

export async function addBurnResult(result: BurnResult): Promise<BurnResult> {
  const results = await readBurnResults();
  results.push(result);
  await writeBurnResults(results);
  return result;
}

export async function getBurnResult(id: string): Promise<BurnResult | null> {
  const results = await readBurnResults();
  return results.find((r) => r.id === id) ?? null;
}

export async function getBurnResultsByUser(userId: string): Promise<BurnResult[]> {
  const results = await readBurnResults();
  return results.filter((result) => result.userId === userId);
}

export async function deleteBurnResult(id: string): Promise<boolean> {
  const results = await readBurnResults();
  const index = results.findIndex((r) => r.id === id);
  if (index === -1) return false;
  results.splice(index, 1);
  await writeBurnResults(results);
  return true;
}
