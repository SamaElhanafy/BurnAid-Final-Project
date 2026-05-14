/** Editable first-aid rule cards keyed by burn degree (`backend/data/`). */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type FirstAidRule = {
  id: string;
  burnDegree: '1st Degree' | '2nd Degree' | '3rd Degree';
  title: string;
  steps: string[];
  emergencyWarning: string;
  lastUpdated: string;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data');
const RULES_PATH = path.resolve(DATA_DIR, 'firstAidRules.json');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readFirstAidRules(): Promise<FirstAidRule[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(RULES_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FirstAidRule[]) : [];
  } catch {
    return [];
  }
}

export async function writeFirstAidRules(rules: FirstAidRule[]) {
  await ensureDataDir();
  const tmp = RULES_PATH + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(rules, null, 2), 'utf8');
  await fs.rename(tmp, RULES_PATH);
}

export async function addFirstAidRule(rule: FirstAidRule) {
  const rules = await readFirstAidRules();
  rules.push(rule);
  await writeFirstAidRules(rules);
}

export async function updateFirstAidRule(updatedRule: FirstAidRule) {
  const rules = await readFirstAidRules();
  const index = rules.findIndex((r) => r.id === updatedRule.id);
  if (index === -1) {
    throw new Error('Rule not found');
  }
  rules[index] = updatedRule;
  await writeFirstAidRules(rules);
}

export async function deleteFirstAidRule(id: string) {
  const rules = await readFirstAidRules();
  const index = rules.findIndex((r) => r.id === id);
  if (index === -1) {
    return false;
  }
  rules.splice(index, 1);
  await writeFirstAidRules(rules);
  return true;
}