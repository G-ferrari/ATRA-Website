const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let changed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip if it contains input, textarea, select
    if (line.includes('<input') || line.includes('<textarea') || line.includes('<select')) {
      continue;
    }
    
    let newLine = line;
    // Replace various border patterns
    newLine = newLine.replace(/border border-[a-zA-Z0-9/.-]*/g, '');
    newLine = newLine.replace(/border-t border-[a-zA-Z0-9/.-]*/g, '');
    newLine = newLine.replace(/border-b border-[a-zA-Z0-9/.-]*/g, '');
    newLine = newLine.replace(/border-r border-[a-zA-Z0-9/.-]*/g, '');
    newLine = newLine.replace(/border-l border-[a-zA-Z0-9/.-]*/g, '');
    newLine = newLine.replace(/border-y border-[a-zA-Z0-9/.-]*/g, '');
    newLine = newLine.replace(/border-x border-[a-zA-Z0-9/.-]*/g, '');
    // Replace border-slate-XXX, border-border-main, border-white/XX
    newLine = newLine.replace(/border-slate-[0-9]+/g, '');
    newLine = newLine.replace(/border-border-main/g, '');
    newLine = newLine.replace(/border-white\/[0-9]+/g, '');
    
    if (newLine !== line) {
      lines[i] = newLine;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

walkDir('./src');
