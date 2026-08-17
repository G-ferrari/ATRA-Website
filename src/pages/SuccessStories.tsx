import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Search, Filter, Landmark, Cpu, TrendingUp, Building2, Tag, ShieldCheck, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FeaturedHero } from '@/components/FeaturedHero';
import { StatusBadge, MetricChip } from '@/components/ui/badge-status';

import caseMarketplaceGov from '@/assets/images/case_marketplace_gov_1785848321737.jpg';
import caseLegacyMigration from '@/assets/images/case_legacy_migration_1785848338358.jpg';
import caseRiskEfficiency from '@/assets/images/case_risk_efficiency_1785848355083.jpg';
import caseStrategicDashboards from '@/assets/images/case_strategic_dashboards_1785848371031.jpg';

// Mock data for success stories
const successStories = [
  {
    id: 1,
    slug: "marketplace-governanca-dados",
    title: "Gerando valor através de Marketplace e Governança de dados",
    client: "Banco ABC",
    description: "Estabelecimento de fluxo de trabalho entre Informatica e GCP para democratizar dados corporativos com segurança e alta performance.",
    tags: ["Governança", "Marketplace", "GCP"],
    icon: Landmark,
    image: caseMarketplaceGov,
    impact: "+300% de adoção de dados"
  },
  {
    id: 2,
    slug: "migracao-legado-gcp",
    title: "Migrando cargas de trabalho legadas para Google Cloud",
    client: "Banco ABC",
    description: "Alimentação automática de aplicação de Risco de Mercado a partir de sistemas legados em prazo recorde com arquitetura moderna.",
    tags: ["Cloud", "Migração", "Python"],
    icon: Cpu,
    image: caseLegacyMigration,
    impact: "-40% tempo de processamento"
  },
  {
    id: 3,
    slug: "eficiencia-processos-risco",
    title: "Ingestão impulsionando a eficiência em processos de risco com GCP",
    client: "Banco Carrefour",
    description: "Processamento de dados 51 vezes mais rápido para relatórios regulatórios e compliance contínuo no Google Cloud.",
    tags: ["Risco", "Eficiência", "Carrefour"],
    icon: TrendingUp,
    image: caseRiskEfficiency,
    impact: "51x mais rápido"
  },
  {
    id: 4,
    slug: "dashboards-estrategicos",
    title: "Criação de dashboards estratégico para financeira",
    client: "Banco ABC",
    description: "Desenvolvimento de KPIs analíticos de alta fidelidade para performance de produtos de Crédito Pessoal e Consignado.",
    tags: ["Dashboards", "Looker", "Analytics"],
    icon: Building2,
    image: caseStrategicDashboards,
    impact: "Visão executiva em tempo real"
  }
];

const CATEGORIES = ["Todos", "Governança", "Cloud", "Risco", "Analytics", "Migração"];

const SuccessStories = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  
  const featuredCases = successStories.slice(0, 3);

  const filteredCases = useMemo(() => {
    return successStories.filter(item => {
      const matchesCategory = selectedCategory === "Todos" || 
        item.tags.some(tag => tag.toLowerCase() === selectedCategory.toLowerCase());
      const matchesSearch = searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-surface-1 text-text-main">
      <FeaturedHero items={featuredCases} type="case" />

      {/* Main Content with Spacious Lateral Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          {/* Header & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-12 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <StatusBadge 
                  label="Histórias Reais de Sucesso" 
                  variant="primary" 
                  size="sm" 
                  pulse={true} 
                  icon={<Sparkles size={12} />} 
                />
                <MetricChip label="Grandes Instituições" variant="neutral" size="sm" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main leading-tight">
                Todos os <span className="text-primary font-normal">cases de sucesso</span>
              </h2>
            </div>
            
            {/* Search and Category Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar por cliente, tema..." 
                  className="pl-10 pr-4 py-2.5 rounded-[6px] bg-surface-2 text-text-main border border-slate-200 dark:border-white/10 text-xs sm:text-sm focus:outline-none focus:border-primary w-full transition-colors"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
            <span className="text-[11px] font-bold text-text-muted uppercase mr-1 shrink-0">Categorias:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1 rounded-[4px] text-xs font-medium transition-all duration-200 cursor-pointer whitespace-nowrap",
                  selectedCategory === cat
                    ? "bg-primary text-white font-semibold shadow-xs"
                    : "bg-surface-2 text-text-muted hover:text-text-main border border-slate-200 dark:border-white/5 hover:bg-surface-3"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 2-Column Wide Cards Grid for Generous Lateral Breathing Room */}
          {filteredCases.length === 0 ? (
            <div className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-10 text-center max-w-md mx-auto">
              <Search size={32} className="mx-auto text-text-muted mb-3" />
              <h3 className="text-base font-bold text-text-main mb-1">Nenhum case encontrado</h3>
              <p className="text-xs text-text-muted font-light mb-4">Tente buscar por outro termo ou selecione a categoria "Todos".</p>
              <button
                onClick={() => { setSelectedCategory("Todos"); setSearchQuery(""); }}
                className="px-4 py-2 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all cursor-pointer"
              >
                Resetar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              <AnimatePresence>
                {filteredCases.map((item, idx) => {
                  const IconComp = item.icon;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="flex"
                    >
                      <Link 
                        to={`/cases-de-sucesso/${item.slug}`}
                        className="group flex flex-col bg-surface-2 border border-slate-200 dark:border-white/5 hover:border-primary/40 rounded-[6px] overflow-hidden shadow-sm hover:shadow-xl hover:bg-surface-3 transition-all duration-300 w-full focus:outline-none"
                      >
                        {/* Card Image Banner */}
                        <div className="aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/9] overflow-hidden relative border-b border-slate-200 dark:border-white/5">
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                          
                          <div className="absolute top-4 left-4 flex items-center gap-2">
                            <span className="px-3 py-1.5 rounded-[4px] bg-secondary text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-md shadow-md flex items-center gap-1.5">
                              <ShieldCheck size={12} /> Case ATRA
                            </span>
                          </div>

                          {item.impact && (
                            <div className="absolute bottom-3 right-3 bg-surface-1/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-[4px] border border-white/10 text-[11px] font-bold text-emerald-400">
                              {item.impact}
                            </div>
                          )}
                        </div>

                        {/* Card Content with Generous Lateral Padding */}
                        <div className="p-6 sm:p-8 flex flex-col flex-1 justify-between">
                          <div>
                            <div className="text-xs text-primary mb-3 flex items-center gap-2 font-bold uppercase tracking-widest">
                              <IconComp size={15} />
                              <span>{item.client}</span>
                            </div>

                            <h3 className="text-lg sm:text-xl font-bold font-display text-text-main mb-3 leading-snug group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>

                            <p className="text-text-muted text-xs sm:text-sm font-light leading-relaxed mb-6 line-clamp-3">
                              {item.description}
                            </p>
                          </div>

                          <div>
                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                              {item.tags.map((tag, tIdx) => (
                                <span 
                                  key={tIdx} 
                                  className="px-2.5 py-1 rounded-[4px] bg-surface-1 text-[11px] font-medium text-text-muted uppercase flex items-center gap-1.5 border border-slate-200 dark:border-white/5"
                                >
                                  <Tag size={11} className="text-primary/70" /> {tag}
                                </span>
                              ))}
                            </div>

                            {/* Footer Action */}
                            <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between">
                              <div className="inline-flex items-center gap-2 text-primary font-bold text-xs sm:text-sm group-hover:gap-3 transition-all">
                                <span>Ver estudo de caso completo</span>
                                <ArrowRight size={15} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default SuccessStories;
