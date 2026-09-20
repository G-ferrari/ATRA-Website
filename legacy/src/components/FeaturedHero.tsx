import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Play, Download, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { congelado } from '@/lib/e2e';

export interface FeaturedItem {
  id: string | number;
  title: string;
  description?: string;
  date?: string;
  client?: string;
  tags?: string[];
  image: string;
  slug?: string;
  link?: string;
}

interface FeaturedHeroProps {
  items: FeaturedItem[];
  type?: 'blog' | 'webinar' | 'ebook' | 'report' | 'case';
}

export const FeaturedHero = ({ items, type = 'blog' }: FeaturedHeroProps) => {
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(0);

  useEffect(() => {
    if (congelado()) return;  // regressão visual: fixa no primeiro destaque
    const timer = setTimeout(() => {
      setActiveFeaturedIndex((current) => (current + 1) % items.length);
    }, 5000); // 5 seconds per slide
    return () => clearTimeout(timer);
  }, [activeFeaturedIndex, items.length]);

  const activeItem = items[activeFeaturedIndex] || items[0];

  const getActionText = () => {
    if (type === 'blog') return 'Ler artigo completo';
    if (type === 'webinar') return 'Garantir minha vaga';
    if (type === 'ebook') return 'Baixar E-book agora';
    if (type === 'report') return 'Baixar Relatório Grátis';
    if (type === 'case') return 'Continuar lendo';
    return 'Saiba mais';
  };

  const getActionIcon = () => {
    if (type === 'ebook' || type === 'report') return <Download size={20} />;
    if (type === 'webinar') return <Play size={20} />;
    return null;
  };

  const getSubtext = () => {
    if (type === 'case') return `${activeItem.client || ''} • ${activeItem.date || ''}`;
    if (type === 'report') return `Relatório Técnico • ${activeItem.date || ''}`;
    if (type === 'webinar') return `Próximo Evento • ${activeItem.date || ''}`;
    return activeItem.date;
  };

  return (
    <section className="bg-surface-1 text-text-main pt-28 sm:pt-36 md:pt-44 pb-10 sm:pb-14 relative overflow-hidden flex flex-col justify-center border-b border-border-main/40">
      {/* Dynamic Background with Dark/Light Support */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 bg-surface-1">
        <div 
          className="absolute -top-[20%] -left-[10%] w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] mix-blend-multiply dark:mix-blend-screen opacity-70 dark:opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(147, 197, 253, 0.7) 0%, rgba(147, 197, 253, 0) 60%)'
          }}
        />
        <div 
          className="absolute top-[10%] -right-[15%] w-[90vw] h-[90vw] md:w-[60vw] md:h-[60vw] mix-blend-multiply dark:mix-blend-screen opacity-60 dark:opacity-15 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(253, 186, 116, 0.6) 0%, rgba(253, 186, 116, 0) 60%)'
          }}
        />
        <div 
          className="absolute -bottom-[20%] left-[25%] w-[75vw] h-[75vw] md:w-[45vw] md:h-[45vw] mix-blend-multiply dark:mix-blend-screen opacity-70 dark:opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(191, 219, 254, 0.8) 0%, rgba(191, 219, 254, 0) 60%)'
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10 w-full max-w-7xl">
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeItem.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-16"
          >
            <div className="w-full">
              {getSubtext() && (
                <div className="text-xs sm:text-sm font-bold text-primary mb-3 sm:mb-5 flex items-center gap-2 uppercase tracking-widest">
                  {type === 'report' ? <FileText size={15} /> : <Calendar size={15} />}
                  <span>{getSubtext()}</span>
                </div>
              )}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-5 leading-tight tracking-tight text-text-main font-display">
                {activeItem.title}
              </h1>
              {activeItem.description && (
                <p className="text-xs sm:text-base lg:text-lg text-text-muted mb-5 sm:mb-7 max-w-2xl leading-relaxed font-light">
                  {activeItem.description}
                </p>
              )}
              {activeItem.tags && activeItem.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-7">
                  {activeItem.tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-primary shadow-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link to={activeItem.slug ? `/${type === 'case' ? 'cases-de-sucesso' : type}s/${activeItem.slug}` : (activeItem.link || '#')} className="pill-btn-primary py-3 px-6 text-xs sm:text-sm font-bold justify-center">
                  {getActionIcon()}
                  <span>{getActionText()}</span>
                  {(!getActionIcon()) && <ArrowRight size={16} />}
                </Link>
                {type === 'webinar' && (
                  <Link to={activeItem.slug ? `/webinars/${activeItem.slug}` : (activeItem.link || '#')} className="pill-btn-outline py-3 px-6 text-xs sm:text-sm font-bold justify-center">
                    Ver detalhes
                  </Link>
                )}
              </div>
            </div>
            
            <div className="w-full flex justify-center lg:justify-end relative group">
              <div className={cn(
                "overflow-hidden shadow-xl sm:shadow-2xl relative w-full border border-slate-200 dark:border-white/10",
                (type === 'ebook' || type === 'report') ? "aspect-[3/4] max-w-xs sm:max-w-sm rounded-[6px] bg-surface-2 p-2" : "aspect-[16/10] rounded-[6px] bg-surface-2"
              )}>
                <img 
                  src={activeItem.image} 
                  alt={activeItem.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-[6px]" 
                />

                {(type === 'ebook' || type === 'report') && (
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-5 sm:p-6">
                     <div className="text-white font-bold text-base sm:text-lg uppercase tracking-widest opacity-90">{type === 'ebook' ? 'E-book' : 'Report 2026'}</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 md:mt-12 w-full flex overflow-x-auto no-scrollbar gap-3 sm:gap-6 pt-5 border-t border-border-main/30">
          {items.map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => {
                setActiveFeaturedIndex(idx);
              }}
              className={cn(
                "opacity-50 hover:opacity-100 transition-all cursor-pointer group min-w-[200px] sm:min-w-[240px] flex-1",
                activeFeaturedIndex === idx && "opacity-100"
              )}
            >
              <div className="h-1 w-full bg-slate-200 dark:bg-white/10 mb-3 overflow-hidden rounded-sm relative">
                {activeFeaturedIndex === idx && (
                  <motion.div 
                    key={activeFeaturedIndex}
                    className="absolute top-0 left-0 h-full bg-primary origin-left w-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ ease: "linear", duration: 5 }}
                  />
                )}
                {activeFeaturedIndex > idx && (
                  <div className="absolute top-0 left-0 h-full bg-slate-300 dark:bg-white/20 w-full" />
                )}
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-text-main mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              {(item.date || item.client) && (
                <div className="text-[10px] sm:text-[11px] text-text-muted uppercase tracking-widest font-semibold">
                  {type === 'case' ? item.client : item.date}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
