const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Fix Nav size
code = code.replace(
  'isScrolled ? "px-4 pt-4 md:pt-6" : "px-4 pt-6 md:pt-8"',
  'isScrolled ? "px-4 pt-2 md:pt-3" : "px-4 pt-4 md:pt-5"'
);
code = code.replace(
  /className="h-10 md:h-16 w-auto object-contain"/,
  'className="h-7 md:h-9 w-auto object-contain"'
);
code = code.replace(
  'isScrolled \n            ? "max-w-7xl bg-surface-2/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-border-main py-3 md:py-3.5 text-text-main"\n            : "max-w-7xl bg-surface-2/90 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.2)] border border-border-main py-4 md:py-5 text-text-main"',
  'isScrolled \n            ? "max-w-7xl bg-surface-2/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-border-main py-2 md:py-2 text-text-main"\n            : "max-w-7xl bg-surface-2/90 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.2)] border border-border-main py-3 md:py-3 text-text-main"'
);

// 2. Fix Hero layout
code = code.replace(
  /<section className="relative min-h-screen bg-surface-1 flex flex-col justify-center pt-24 md:pt-40 pb-32 overflow-hidden">/,
  '<section className="relative h-[100dvh] bg-surface-1 flex flex-col pt-20 md:pt-28 pb-6 md:pb-8 overflow-hidden">'
);
code = code.replace(
  /<div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center text-center max-w-6xl">/,
  '<div className="container mx-auto px-4 relative z-10 flex-1 w-full flex flex-col justify-end items-center text-center max-w-6xl">'
);
code = code.replace(
  /<div className="h-32 md:h-40 lg:h-40 flex items-center justify-center mb-12 md:mb-16 w-full">/,
  '<div className="flex-1 w-full flex flex-col items-center justify-center min-h-[25vh] mb-6 md:mb-10">\n          <div className="h-24 md:h-32 w-full flex items-center justify-center">'
);
code = code.replace(
  /<\/AnimatePresence>\n        <\/div>\n\n        {\/\* Input Form \*\/}/,
  '</AnimatePresence>\n          </div>\n        </div>\n\n        {/* Input Form */}'
);

// 3. Fix Input size
code = code.replace(
  /min-h-\[140px\] text-left/,
  'min-h-[90px] text-left'
);
code = code.replace(
  /min-h-\[72px\]"/,
  'min-h-[48px] py-1.5"'
);
code = code.replace(
  /<Icon icon="fluent:sparkle-24-regular" width=\{22\} height=\{22\} className="text-primary" \/>/,
  '<Icon icon="fluent:sparkle-24-regular" width={18} height={18} className="text-primary" />'
);
code = code.replace(
  /className="text-text-muted text-sm font-medium mr-1">ATRA AI<\/span>/,
  'className="text-text-muted text-[11px] md:text-sm font-medium mr-1">ATRA AI</span>'
);
code = code.replace(
  /className="bg-text-main text-surface-1 w-9 h-9 rounded-full flex items-center justify-center/g,
  'className="bg-text-main text-surface-1 w-8 h-8 rounded-full flex items-center justify-center'
);

// 4. Fix Subtitle
code = code.replace(
  /<p className="text-sm text-text-muted mb-8 font-light">/,
  '<p className="text-[10px] md:text-xs text-text-muted mb-3 font-light">'
);

// 5. Fix Chips size
code = code.replace(
  /className="flex overflow-x-auto pb-4 -mx-4 px-4 md:pb-0 md:mx-0 md:px-0 md:flex-wrap md:justify-center gap-2 md:gap-3 no-scrollbar snap-x"/,
  'className="flex overflow-x-auto pb-2 -mx-4 px-4 md:pb-0 md:mx-0 md:px-0 md:flex-wrap md:justify-center gap-1.5 md:gap-2 no-scrollbar snap-x"'
);
code = code.replace(
  /className="whitespace-nowrap px-4 py-2\.5 rounded-xl border border-border-main hover:bg-surface-3 bg-surface-2 transition-colors text-xs md:text-sm text-text-muted hover:text-text-main font-light snap-start flex-shrink-0 flex items-center gap-2 shadow-sm"/,
  'className="whitespace-nowrap px-3 py-1.5 md:py-2 rounded-lg border border-border-main hover:bg-surface-3 bg-surface-2 transition-colors text-[11px] md:text-xs text-text-muted hover:text-text-main font-light snap-start flex-shrink-0 flex items-center gap-1.5 shadow-sm"'
);
code = code.replace(
  /<Icon icon=\{iconName\} width=\{16\} height=\{16\} className="opacity-70" \/>/,
  '<Icon icon={iconName} width={14} height={14} className="opacity-70" />'
);

fs.writeFileSync('src/App.tsx', code);
console.log('Fixed sizes and layout for Chat interface format');
