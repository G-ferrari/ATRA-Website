const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Hero Title
code = code.replace(/text-4xl md:text-5xl lg:text-5xl xl:text-6xl/g, 'text-4xl md:text-4xl lg:text-5xl');

// Stats Counters
code = code.replace(/text-5xl font-light font-display/g, 'text-4xl font-light font-display');

// Section Titles (e.g., text-3xl md:text-4xl, md:text-5xl)
code = code.replace(/text-3xl md:text-5xl/g, 'text-3xl md:text-4xl');
code = code.replace(/text-3xl md:text-4xl/g, 'text-2xl md:text-3xl');
code = code.replace(/text-4xl font-light/g, 'text-3xl font-light');
code = code.replace(/text-2xl md:text-3xl/g, 'text-2xl');

// Features text
code = code.replace(/font-light text-lg/g, 'font-light text-base');
code = code.replace(/text-lg text-text-muted mb-8/g, 'text-base text-text-muted mb-8');
code = code.replace(/text-lg font-light flex items-center/g, 'text-base font-light flex items-center');

// CTA Title
code = code.replace(/text-3xl md:text-4xl font-light font-display text-text-main mb-6 leading-tight/g, 'text-2xl md:text-3xl font-light font-display text-text-main mb-6 leading-tight');
// Paragraphs generally use text-lg
code = code.replace(/text-base md:text-lg/g, 'text-sm md:text-base');
// Testimonials text sizes
code = code.replace(/text-lg md:text-2xl font-light/g, 'text-lg md:text-xl font-light');

fs.writeFileSync('src/App.tsx', code);
console.log('Done Minifying text sizes.');
