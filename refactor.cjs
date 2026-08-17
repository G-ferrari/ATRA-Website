const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

const newCSS = css.replace('@theme {', `
@theme {
  --color-surface-1: #f8fafc;
  --color-surface-2: #ffffff;
  --color-surface-3: #f1f5f9;
  --color-surface-inverse: #0f172a;
  
  --color-text-main: #0f172a;
  --color-text-muted: #64748b;
  --color-text-subtle: #334155;
  
  --color-border-main: #e2e8f0;
  --color-border-subtle: transparent;
`) + `
html.dark {
  --color-surface-1: #0B1120;
  --color-surface-2: #111827;
  --color-surface-3: #1F2937;
  --color-surface-inverse: #0B1120;
  
  --color-text-main: #ffffff;
  --color-text-muted: #9ca3af;
  --color-text-subtle: #d1d5db;
  
  --color-border-main: rgba(255, 255, 255, 0.1);
  --color-border-subtle: rgba(255, 255, 255, 0.05);
}

body {
  background-color: var(--color-surface-1);
  color: var(--color-text-main);
}
`;

fs.writeFileSync('src/index.css', newCSS);

let app = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace backgrounds
app = app.replace(/bg-\[\#0B1120\]/g, 'bg-surface-1');
app = app.replace(/bg-\[\#111827\]/g, 'bg-surface-2');
app = app.replace(/bg-\[\#1F2937\]/g, 'bg-surface-3');
app = app.replace(/bg-\[\#020617\]/g, 'bg-surface-inverse');

// Replace texts (carefully)
// Avoid replacing text-white where it's part of a button or similar by targeting specific known class segments.
// Let's replace 'text-white' -> 'text-text-main' universally, and then fix 'bg-primary text-text-main' -> 'bg-primary text-white'.
app = app.replace(/text-white/g, 'text-text-main');
// Some strings might be 'hover:text-white', which becomes 'hover:text-text-main', which is okay as long as 'text-text-main' changes.
// But buttons:
app = app.replace(/bg-primary text-text-main/g, 'bg-primary text-white');
app = app.replace(/text-text-main group-hover:text-primary/g, 'text-slate-900 dark:text-white group-hover:text-primary');

// Specific classes for gray text
app = app.replace(/text-slate-400/g, 'text-text-muted');
app = app.replace(/text-slate-300/g, 'text-text-subtle');

// Borders
app = app.replace(/border-white\/10/g, 'border-border-main');
app = app.replace(/border-white\/5/g, 'border-border-subtle');

// A few more fixes for hover
app = app.replace(/hover:bg-white\/5/g, 'hover:bg-slate-100 dark:hover:bg-white/5');

fs.writeFileSync('src/App.tsx', app);
console.log("Done refactoring");
