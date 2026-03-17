import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const rules = [
  {
    label: 'pages',
    baseDir: path.join(root, 'src', 'pages'),
    expectedSuffix: 'Page.tsx',
  },
  {
    label: 'components',
    baseDir: path.join(root, 'src', 'components'),
    expectedSuffix: '.tsx',
  },
];

function listDirectories(baseDir) {
  return readdirSync(baseDir)
    .map(name => ({ name, fullPath: path.join(baseDir, name) }))
    .filter(entry => statSync(entry.fullPath).isDirectory());
}

function fail(message) {
  console.error(`\n[structure] ${message}`);
  process.exitCode = 1;
}

for (const rule of rules) {
  const entries = readdirSync(rule.baseDir).map(name => ({
    name,
    fullPath: path.join(rule.baseDir, name),
  }));

  for (const entry of entries) {
    if (!statSync(entry.fullPath).isDirectory()) {
      fail(`${rule.label} entry "${entry.name}" must be a folder.`);
    }
  }

  for (const folder of listDirectories(rule.baseDir)) {
    const files = readdirSync(folder.fullPath);
    const hasTsxFile = files.some(file => file.endsWith(rule.expectedSuffix));
    if (!hasTsxFile) {
      fail(`${rule.label} folder "${folder.name}" must contain a ${rule.expectedSuffix} file.`);
    }

    const hasIndex = files.includes('index.ts');
    if (!hasIndex) {
      fail(`${rule.label} folder "${folder.name}" must contain an index.ts barrel.`);
    }
  }
}

if (process.exitCode === 1) {
  process.exit(1);
}

console.info('[structure] OK');
