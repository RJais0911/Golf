const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectRoot = path.resolve(__dirname, '..');
const includeRoots = [
  path.join(projectRoot, 'server.js'),
  path.join(projectRoot, 'seed.js'),
  path.join(projectRoot, 'src')
];

function collectJsFiles(targetPath) {
  const stats = fs.statSync(targetPath);

  if (stats.isFile()) {
    return targetPath.endsWith('.js') ? [targetPath] : [];
  }

  return fs.readdirSync(targetPath, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(targetPath, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') {
        return [];
      }

      return collectJsFiles(entryPath);
    }

    return entry.name.endsWith('.js') ? [entryPath] : [];
  });
}

const files = includeRoots.flatMap(collectJsFiles);
const failures = [];

for (const file of files) {
  try {
    const source = fs.readFileSync(file, 'utf8');
    new vm.Script(source, { filename: file });
  } catch (error) {
    failures.push({
      file,
      output: error instanceof Error ? error.message : String(error)
    });
  }
}

if (failures.length > 0) {
  console.error('Backend build check failed.\n');

  for (const failure of failures) {
    console.error(failure.file);
    console.error(failure.output);
    console.error('');
  }

  process.exit(1);
}

console.log(`Backend build check passed for ${files.length} files.`);
