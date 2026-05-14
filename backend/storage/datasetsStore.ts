/** Read-only dataset metadata for the admin portal (`backend/data/`). */
import { promises as fs } from 'node:fs';
import path from 'node:path';

export type Dataset = {
  id: string;
  name: string;
  description: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  imageCount: number;
  status: 'active' | 'archived' | 'processing';
};

const DATA_DIR = path.resolve(process.cwd(), 'backend', 'data');
const DATASETS_PATH = path.resolve(DATA_DIR, 'datasets.json');

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readDatasets(): Promise<Dataset[]> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(DATASETS_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Dataset[]) : [];
  } catch {
    return [];
  }
}

export async function writeDatasets(datasets: Dataset[]) {
  await ensureDataDir();
  const tmp = DATASETS_PATH + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(datasets, null, 2), 'utf8');
  await fs.rename(tmp, DATASETS_PATH);
}

export async function addDataset(dataset: Dataset): Promise<Dataset> {
  const datasets = await readDatasets();
  datasets.push(dataset);
  await writeDatasets(datasets);
  return dataset;
}

export async function deleteDataset(id: string): Promise<boolean> {
  const datasets = await readDatasets();
  const index = datasets.findIndex((d) => d.id === id);
  if (index === -1) return false;
  datasets.splice(index, 1);
  await writeDatasets(datasets);
  return true;
}

export async function updateDataset(id: string, updates: Partial<Dataset>): Promise<Dataset | null> {
  const datasets = await readDatasets();
  const dataset = datasets.find((d) => d.id === id);
  if (!dataset) return null;
  const updated = { ...dataset, ...updates };
  const index = datasets.findIndex((d) => d.id === id);
  datasets[index] = updated;
  await writeDatasets(datasets);
  return updated;
}
