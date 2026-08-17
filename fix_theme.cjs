const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix Hero Background Gradient
code = code.replace(
  /<div className="absolute inset-0 bg-gradient-to-b from-\[#0B1120\] via-\[#0B1120\] to-\[#111827\] pointer-events-none"><\/div>/,
  '<div className="absolute inset-0 bg-gradient-to-b from-surface-1 via-surface-1 to-surface-2 pointer-events-none"></div>'
);

code = code.replace(
  /<div className="absolute inset-0 bg-\[linear-gradient\(to_right,#ffffff10_1px,transparent_1px\),linear-gradient\(to_bottom,#ffffff10_1px,transparent_1px\)\] bg-\[size:4rem_4rem\] \[mask-image:radial-gradient\(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%\)\] opacity-30 pointer-events-none"><\/div>/,
  '<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>'
);

// Fix Theme Toggle Button visibility
code = code.replace(
  /className="fixed bottom-12 right-0 z-\[100\] bg-surface-2 dark:bg-\[#1f2937\] text-text-main p-4 pl-5 pr-2 rounded-l-full shadow-\[-8px_4px_24px_rgba\(0,0,0,0\.1\)\] hover:pr-4 transition-all duration-300 border border-r-0 border-border-main group flex items-center justify-center cursor-pointer"/,
  'className="fixed bottom-6 md:bottom-12 right-0 z-[100] bg-white dark:bg-surface-3 text-slate-800 dark:text-white p-3 pl-4 pr-2 rounded-l-full shadow-[-8px_4px_24px_rgba(0,0,0,0.15)] dark:shadow-[-8px_4px_24px_rgba(0,0,0,0.4)] hover:pr-4 transition-all duration-300 border border-r-0 border-slate-200 dark:border-slate-700 group flex items-center justify-center cursor-pointer"'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed theme issues');
