import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const p = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'src', 'App.tsx');
const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/);
const start = lines.findIndex((l) => l.startsWith('  const LoginView = () => {'));
const end = lines.findIndex((l) => l.startsWith('  const AccountView = () =>'));
if (start === -1 || end === -1) {
  console.log('skip: markers', start, end);
  process.exit(0);
}
const out = [...lines.slice(0, start), ...lines.slice(end)].join('\n');
fs.writeFileSync(p, out, 'utf8');
console.log('Removed LoginView/RegisterView', { start, end });
