import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const appPath = path.join(root, 'src', 'App.tsx');
const ctrlPath = path.join(root, 'src', 'context', 'useBurnAidController.ts');

const ctrl = fs.readFileSync(ctrlPath, 'utf8');
const retMarker = '  return {\n    lang, setLang, view, setView, t, isRtl, backendUrl,';
const retStart = ctrl.lastIndexOf(retMarker);
if (retStart < 0) throw new Error('hook return block marker not found');
const retOpen = retStart + '  return {'.length;
const retEnd = ctrl.indexOf('\n  };', retOpen);
if (retEnd < 0) throw new Error('hook return end not found');
const retBody = ctrl.slice(retOpen, retEnd);
const RETURN_KEYS = [
  ...new Set(
    retBody
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.split(/\s+/).pop())
      .filter((k) => k && /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(k)),
  ),
];

const appLines = fs.readFileSync(appPath, 'utf8').split(/\r?\n/);
let returnLineIdx = -1;
for (let i = appLines.length - 1; i >= 0; i--) {
  if (appLines[i] === '  return (' && appLines[i + 1]?.includes('min-h-screen')) {
    returnLineIdx = i;
    break;
  }
}
if (returnLineIdx < 0) throw new Error('App shell return ( not found');

const viewHeaderIdx = [];
for (let i = 0; i < appLines.length; i++) {
  if (/^  \/\*\*/.test(appLines[i])) viewHeaderIdx.push(i);
}

const chunks = [];
for (let i = 0; i < viewHeaderIdx.length; i++) {
  const start = viewHeaderIdx[i];
  const end = i + 1 < viewHeaderIdx.length ? viewHeaderIdx[i + 1] : returnLineIdx;
  chunks.push(appLines.slice(start, end));
}

function parseViewName(chunk) {
  const line = chunk.find((l) => /const (\w+View) = \(\) =>/.test(l));
  if (!line) throw new Error(`no view decl in chunk starting: ${chunk[0]?.slice(0, 60)}`);
  return line.match(/const (\w+View)/)[1];
}

function extractInner(chunk, name) {
  const declIdx = chunk.findIndex((l) => l.includes(`const ${name}`));
  if (declIdx < 0) throw new Error(`decl ${name} not found`);
  const decl = chunk[declIdx];
  const lastLine = chunk[chunk.length - 1]?.trim() ?? '';
  if (decl.includes('=> (')) {
    if (lastLine !== ');') throw new Error(`${name}: expected ); got ${JSON.stringify(lastLine)}`);
    const bodyLines = chunk.slice(declIdx + 1, -1);
    return { kind: 'jsx', text: bodyLines.join('\n') };
  }
  if (decl.includes('=> {')) {
    if (lastLine !== '};') throw new Error(`${name}: expected }; got ${lastLine}`);
    const bodyLines = chunk.slice(declIdx + 1, -1);
    return { kind: 'fn', text: bodyLines.join('\n') };
  }
  throw new Error(`bad decl ${decl}`);
}

function keysUsedIn(text) {
  const used = new Set();
  for (const key of RETURN_KEYS) {
    const re = new RegExp(`\\b${key}\\b`);
    if (re.test(text)) used.add(key);
  }
  return [...used].sort();
}

const NON_LUCIDE_COMPONENTS = new Set(['ChangePasswordCard', 'AuthFormView']);

function lucideUsedIn(text) {
  const found = new Set();
  const re = /<([A-Z][a-zA-Z0-9]*)\b/g;
  let m;
  while ((m = re.exec(text))) {
    const n = m[1];
    if (n === 'motion' || n === 'AnimatePresence' || n === 'iframe' || n === 'img' || n === 'video' || n === 'svg') continue;
    if (NON_LUCIDE_COMPONENTS.has(n)) continue;
    found.add(n);
  }
  return [...found].sort();
}

const outDir = path.join(root, 'src', 'components', 'views');
fs.mkdirSync(outDir, { recursive: true });

const exports = [];

for (const rawChunk of chunks) {
  let chunk = rawChunk;
  while (chunk.length && chunk[chunk.length - 1].trim() === '') chunk = chunk.slice(0, -1);
  const name = parseViewName(chunk);
  const comment = chunk[0].replace(/^  \/\*\*?\s*/, '').replace(/\s*\*\/$/, '').trim();
  const { kind, text } = extractInner(chunk, name);
  const keys = keysUsedIn(text);
  const destructure = keys.length ? `const {\n    ${keys.join(',\n    ')},\n  } = useBurnAid();\n\n` : '';

  const icons = lucideUsedIn(text);
  const motionUsed = /\bmotion\./.test(text) || /<motion\./.test(text);
  const apUsed = text.includes('AnimatePresence');

  let imports = `import { useBurnAid } from '../../context/BurnAidContext';\n`;
  if (icons.length) imports += `import { ${icons.join(', ')} } from 'lucide-react';\n`;
  if (motionUsed || apUsed) {
    imports += `import { ${[motionUsed ? 'motion' : '', apUsed ? 'AnimatePresence' : ''].filter(Boolean).join(', ')} } from 'motion/react';\n`;
  }
  if (text.includes('ChangeEvent')) imports += `import type { ChangeEvent } from 'react';\n`;
  if (text.includes('ManagedVideo')) imports += `import type { ManagedVideo } from '../../types/burnAid';\n`;
  if (text.includes('normalizeBloodType')) imports += `import { normalizeBloodType } from '../../constants/auth';\n`;
  if (text.includes('BLOOD_TYPE_OPTIONS')) imports += `import { BLOOD_TYPE_OPTIONS } from '../../constants/auth';\n`;
  if (text.includes('ChangePasswordCard')) imports += `import { ChangePasswordCard } from '../auth/ChangePasswordCard';\n`;
  if (text.includes('AuthFormView')) imports += `import { AuthFormView } from '../auth/AuthFormView';\n`;
  if (text.includes('DEFAULT_MANAGED_VIDEOS'))
    imports += `import { DEFAULT_MANAGED_VIDEOS } from '../../constants/videoDefaults';\n`;
  if (text.includes('DEFAULT_AR_MANAGED_VIDEOS'))
    imports += `import { DEFAULT_AR_MANAGED_VIDEOS } from '../../constants/videoDefaults';\n`;
  if (text.includes('DEFAULT_HOW_IT_WORKS_VIDEO'))
    imports += `import { DEFAULT_HOW_IT_WORKS_VIDEO } from '../../constants/videoDefaults';\n`;
  if (text.includes('EGYPT_FALLBACK_FACILITIES'))
    imports += `import { EGYPT_FALLBACK_FACILITIES } from '../../constants/egyptFacilities';\n`;
  imports += '\n';

  let body;
  if (kind === 'jsx') {
    body = `${imports}/**\n * ${comment}\n */\nexport function ${name}() {\n  ${destructure}  return (\n${text}\n  );\n}\n`;
  } else {
    body = `${imports}/**\n * ${comment}\n */\nexport function ${name}() {\n  ${destructure}${text}\n}\n`;
  }

  fs.writeFileSync(path.join(outDir, `${name}.tsx`), body, 'utf8');
  exports.push(name);
}

const indexContent =
  exports.map((n) => `export { ${n} } from './${n}';`).join('\n') + '\n';
fs.writeFileSync(path.join(outDir, 'index.ts'), indexContent, 'utf8');
console.log('Wrote', exports.length, 'views:', exports.join(', '));
