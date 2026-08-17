import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Calendar, Search, Filter, ChevronLeft, ChevronRight, Play, ArrowRight, Tag, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FeaturedHero } from '@/components/FeaturedHero';
import { StatusBadge, MetricChip } from '@/components/ui/badge-status';

// Mock data for Blog
const blogPosts = [
  {
    id: 1,
    title: "Squad Gerenciada: como estruturar equipes de TI mais eficientes",
    description: "Saiba como o modelo de squads pode escalar sua operação de tecnologia mantendo a qualidade e cultura.",
    date: "23 de março de 2026",
    tags: ["Business", "Managed IT", "Strategy"],
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
  },
  {
    id: 2,
    title: "IA Generativa e Preditiva: O Futuro da Análise de Dados",
    description: "Como a combinação de diferentes tipos de IA está criando uma nova era de insights de negócios.",
    date: "2 de fevereiro de 2026",
    tags: ["Analytics", "IA", "Innovation"],
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 3,
    title: "Arquitetura Multicloud: O que é, por que importa e como fortalecer sua TI",
    description: "Explore os benefícios e desafios de manter uma estratégia de nuvem distribuída e resiliente.",
    date: "5 de janeiro de 2026",
    tags: ["Cloud", "Infraestrutura", "Security"],
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 4,
    title: "Data Center no Varejo: O Que Está em Jogo Quando as Vendas Disparam",
    description: "Garantindo a disponibilidade e performance durante os maiores eventos do varejo digital.",
    date: "14 de outubro de 2025",
    tags: ["Cloud", "Infraestrutura", "Retail"],
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 5,
    title: "ROI em TI: do cálculo ao impacto real no crescimento da empresa",
    description: "Métricas e metodologias que o C-level espera ver ao investir em modernização de plataformas de dados.",
    date: "13 de agosto de 2025",
    tags: ["Business", "Finance", "Strategy"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600"
  },
  {
    id: 6,
    title: "Segurança de Dados em 2026: O que mudou e o que virá",
    description: "As novas ameaças cibernéticas e as defesas essenciais para um ecossistema corporativo hiperconectado.",
    date: "10 de julho de 2025",
    tags: ["Cybersecurity", "Data", "Privacy"],
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600"
  }
];

const CATEGORIES = ["Todos", "Business", "IA", "Cloud", "Analytics", "Cybersecurity", "Strategy"];

const Blog = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);

  const featuredPosts = [
    blogPosts[0],
    blogPosts[1],
    blogPosts[2]
  ];

  const filteredPosts = useMemo(() => {
    return blogPosts.filter(item => {
      const matchesCategory = selectedCategory === "Todos" ||
        item.tags.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase());
      const matchesSearch = searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-surface-1 dark:bg-[#0e1015] text-text-main dark:text-[#f3f4f6]">
      <FeaturedHero items={featuredPosts} type="blog" />

      {/* Articles Grid Section */}
      <section className="py-20 md:py-24 bg-surface-1 dark:bg-[#0e1015]">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          
          {/* Header and Search Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <StatusBadge 
                  label="Conhecimento & Inovação" 
                  variant="primary" 
                  size="sm" 
                  pulse={true} 
                  icon={<Sparkles size={12} />} 
                />
                <MetricChip label="Artigos Técnicos" variant="neutral" size="sm" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main dark:text-white leading-tight">
                Todos os <span className="text-primary font-normal">artigos</span>
              </h2>
            </div>
            
            {/* Search Input */}
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted dark:text-gray-400" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar artigos..." 
                  className="pl-10 pr-8 py-2.5 rounded-[6px] bg-surface-2 dark:bg-[#181b22] text-text-main dark:text-white border border-slate-200 dark:border-white/10 text-xs sm:text-sm focus:outline-none focus:border-primary w-full transition-colors"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main dark:hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Categories Bar */}
          <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
            <span className="text-[11px] font-bold text-text-muted dark:text-gray-400 uppercase mr-1 shrink-0">Categorias:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1 rounded-[4px] text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap",
                  selectedCategory === cat
                    ? "bg-primary text-white font-semibold shadow-xs"
                    : "bg-surface-2 dark:bg-[#181b22] text-text-muted dark:text-gray-300 hover:text-text-main dark:hover:text-white border border-slate-200 dark:border-white/5 hover:bg-surface-3 dark:hover:bg-[#1e222b]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          {filteredPosts.length === 0 ? (
            <div className="bg-surface-2 dark:bg-[#181b22] border border-slate-200 dark:border-white/10 rounded-[6px] p-10 text-center max-w-md mx-auto">
              <Search size={32} className="mx-auto text-text-muted dark:text-gray-400 mb-3" />
              <h3 className="text-base font-bold text-text-main dark:text-white mb-1">Nenhum artigo encontrado</h3>
              <p className="text-xs text-text-muted dark:text-gray-400 font-light mb-4">Tente buscar por outro termo ou selecione a categoria "Todos".</p>
              <button
                onClick={() => { setSelectedCategory("Todos"); setSearchQuery(""); }}
                className="px-4 py-2 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all cursor-pointer"
              >
                Resetar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              <AnimatePresence>
                {filteredPosts.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="group flex flex-col bg-surface-2 dark:bg-[#181b22] border border-slate-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/60 rounded-[6px] overflow-hidden shadow-sm hover:shadow-xl dark:shadow-black/60 hover:bg-surface-3 dark:hover:bg-[#1e222b] transition-all duration-300"
                  >
                    <div className="aspect-[16/10] overflow-hidden relative border-b border-slate-200 dark:border-white/10">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-slate-950/20 dark:bg-black/40 group-hover:bg-transparent transition-all"></div>
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-[4px] bg-primary text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm shadow-sm">
                          Artigo
                        </span>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 flex flex-col flex-1 justify-between">
                      <div>
                        <div className="text-[11px] text-text-muted dark:text-gray-400 mb-3 flex items-center gap-1.5 font-medium">
                          <Calendar size={13} className="text-primary" />
                          <span>{item.date}</span>
                        </div>

                        <h3 className="text-lg md:text-xl font-bold font-display text-text-main dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>

                        <p className="text-text-muted dark:text-gray-300 text-xs sm:text-sm font-light leading-relaxed line-clamp-3 mb-6">
                          {item.description}
                        </p>
                      </div>

                      <div>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {item.tags.map((tag, tIdx) => (
                            <span 
                              key={tIdx} 
                              className="px-2 py-0.5 rounded-[4px] bg-surface-1 dark:bg-[#0e1015] text-[10px] font-medium text-text-muted dark:text-gray-400 uppercase flex items-center gap-1 border border-slate-200 dark:border-white/5"
                            >
                              <Tag size={10} className="text-primary/70" /> {tag}
                            </span>
                          ))}
                        </div>

                        {/* Card Link */}
                        <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                          <Link 
                            to="#" 
                            className="inline-flex items-center gap-2 text-primary dark:text-[#3C98FA] font-bold text-xs sm:text-sm group-hover:gap-3 transition-all"
                          >
                            <span>Continuar lendo</span>
                            <ArrowRight size={14} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          {/* Pagination */}
          <div className="mt-14 md:mt-16 flex justify-center items-center gap-3">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="w-9 h-9 rounded-[6px] border border-slate-200 dark:border-white/10 bg-surface-2 dark:bg-[#181b22] flex items-center justify-center text-text-muted dark:text-gray-400 hover:text-primary hover:border-primary transition-all cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(1)}
                className={cn(
                  "w-9 h-9 rounded-[6px] font-bold text-xs cursor-pointer transition-all",
                  currentPage === 1 ? "bg-primary text-white shadow-sm" : "bg-surface-2 dark:bg-[#181b22] border border-slate-200 dark:border-white/10 text-text-main dark:text-gray-300 hover:border-primary"
                )}
              >
                1
              </button>
              <button 
                onClick={() => setCurrentPage(2)}
                className={cn(
                  "w-9 h-9 rounded-[6px] font-bold text-xs cursor-pointer transition-all",
                  currentPage === 2 ? "bg-primary text-white shadow-sm" : "bg-surface-2 dark:bg-[#181b22] border border-slate-200 dark:border-white/10 text-text-main dark:text-gray-300 hover:border-primary"
                )}
              >
                2
              </button>
            </div>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(2, prev + 1))}
              className="w-9 h-9 rounded-[6px] border border-slate-200 dark:border-white/10 bg-surface-2 dark:bg-[#181b22] flex items-center justify-center text-text-muted dark:text-gray-400 hover:text-primary hover:border-primary transition-all cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Webinars Highlight Section - Harmonized with Site Design */}
      <section className="py-20 md:py-24 bg-surface-2 dark:bg-[#13161c] border-t border-b border-slate-200 dark:border-white/10 text-text-main dark:text-white overflow-hidden relative">
        {/* Subtle Ambient Radial Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div 
            className="absolute top-1/2 -left-[10%] -translate-y-1/2 w-[60vw] h-[60vw] md:w-[35vw] md:h-[35vw] opacity-40 dark:opacity-15 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(60, 152, 250, 0.4) 0%, rgba(60, 152, 250, 0) 70%)'
            }}
          />
          <div 
            className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] md:w-[35vw] md:h-[35vw] opacity-30 dark:opacity-10 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(253, 186, 116, 0.35) 0%, rgba(253, 186, 116, 0) 70%)'
            }}
          />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[4px] bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest mb-6">
                <Sparkles size={13} />
                <span>Destaque Multimídia</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4 md:mb-6 leading-tight text-text-main dark:text-white">
                Assista aos nossos <span className="text-primary font-normal">Webinars</span> técnicos
              </h2>
              <p className="text-sm md:text-base text-text-muted dark:text-gray-300 mb-8 max-w-xl font-light leading-relaxed">
                Aprenda com nossos especialistas as melhores práticas, tendências e casos reais de uso de dados, nuvem e Inteligência Artificial no ecossistema corporativo.
              </p>
              <Link 
                to="/webinars"
                className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white px-7 py-3.5 rounded-[6px] font-bold text-xs sm:text-sm transition-all shadow-md shadow-primary/25 cursor-pointer active:scale-95"
              >
                <Play size={16} fill="currentColor" />
                <span>Começar a assistir</span>
              </Link>
            </div>

            <div className="flex-1 w-full max-w-2xl">
              <Link 
                to="/webinars"
                className="block aspect-video rounded-[6px] overflow-hidden relative group shadow-2xl border border-slate-200 dark:border-white/10 cursor-pointer bg-surface-1 dark:bg-[#0e1015]"
              >
                <img 
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200" 
                  alt="Webinar técnico em destaque sobre Dados e IA"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-all flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary text-white flex items-center justify-center group-hover:scale-110 transition-all shadow-xl shadow-primary/30">
                    <Play className="fill-white ml-0.5" size={24} />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <span className="px-3 py-1 rounded-[4px] bg-black/70 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                    Disponível Gravado • 45 min
                  </span>
                  <span className="px-2.5 py-1 rounded-[4px] bg-primary/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider">
                    HD 1080p
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Blog;
