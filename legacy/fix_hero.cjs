const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const oldFormReg = /<form onSubmit=\{handleSubmit\} className="w-full max-w-2xl relative mb-4">[\s\S]*?<\/form>/;

const newForm = `<form onSubmit={handleSubmit} className="w-full max-w-[48rem] relative mb-2">
          <div className="relative flex flex-col shadow-2xl shadow-primary/5 rounded-[1.5rem] bg-surface-2 p-3 pb-2 border border-border-main focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all min-h-[140px] text-left">
             
             <textarea 
               value={inputVal}
               onChange={(e) => setInputVal(e.target.value)}
               placeholder={t('hero.input_placeholder')} 
               className="w-full bg-transparent px-2 md:px-3 py-2 text-text-main text-sm md:text-base focus:outline-none placeholder:text-text-muted font-light resize-none flex-1 min-h-[72px]"
             />
             
             <div className="flex items-center justify-between mt-2 pt-2">
               <div className="pl-2 flex items-center gap-2 text-text-muted">
                  <Icon icon="fluent:sparkle-24-regular" width={22} height={22} className="text-primary" />
               </div>
               
               <div className="flex items-center gap-3">
                 <span className="text-text-muted text-sm font-medium mr-1">ATRA AI</span>
                 <button 
                   type="submit"
                   disabled={!inputVal.trim()}
                   className="bg-text-main text-surface-1 w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity shrink-0 disabled:opacity-50"
                 >
                   <ArrowUpRight size={18} />
                 </button>
               </div>
             </div>
          </div>
        </form>`;

const oldChipsReg = /<div className="w-full overflow-hidden">\s*<div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:pb-0 md:mx-0 md:px-0 md:flex-wrap md:justify-center gap-3 no-scrollbar">[\s\S]*?<\/div>\s*<\/div>/;

const newChips = `<div className="w-full overflow-hidden mt-2 md:mt-4">
          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:pb-0 md:mx-0 md:px-0 md:flex-wrap md:justify-center gap-2 md:gap-3 no-scrollbar snap-x">
            {suggestionsKeys.map((suggestion, idx) => {
              const label = t(suggestion);
              const suggestionIcons = ['lucide:pen-line', 'lucide:graduation-cap', 'lucide:code', 'lucide:briefcase'];
              
              return (
                <button 
                  key={idx}
                  onClick={() => {
                    setInputVal(label);
                    handleSubmit(new Event('submit') as any);
                  }}
                  className="whitespace-nowrap px-4 py-2.5 rounded-xl border border-border-main hover:bg-surface-3 bg-surface-2 transition-colors text-xs md:text-sm text-text-muted hover:text-text-main font-light snap-start flex-shrink-0 flex items-center gap-2 shadow-sm"
                >
                  <Icon icon={suggestionIcons[idx % suggestionIcons.length]} width={16} height={16} className="opacity-70" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>`;

code = code.replace(oldFormReg, newForm);
code = code.replace(oldChipsReg, newChips);

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed");
