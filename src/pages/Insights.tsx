import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

import caseMarketplaceGov from '@/assets/images/case_marketplace_gov_1785848321737.jpg';
import caseLegacyMigration from '@/assets/images/case_legacy_migration_1785848338358.jpg';
import caseRiskEfficiency from '@/assets/images/case_risk_efficiency_1785848355083.jpg';
import caseStrategicDashboards from '@/assets/images/case_strategic_dashboards_1785848371031.jpg';
import { 
  Sparkles, 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  Video, 
  BookMarked, 
  Star, 
  ArrowRight, 
  Clock, 
  Tag, 
  ShieldCheck, 
  TrendingUp, 
  CheckCircle2, 
  Mail, 
  Send,
  Building2,
  Cpu,
  Layers,
  ChevronRight,
  Download
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { BackgroundDecorations } from '@/components/Decorations';
import { GlowCard } from '@/components/ui/spotlight-card';
import { TechCornerBraces } from '@/components/TechDetails';
import { StatusBadge, MetricChip } from '@/components/ui/badge-status';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface InsightItem {
  id: string;
  type: 'case' | 'blog' | 'report' | 'webinar' | 'ebook';
  title: string;
  description: string;
  category: string;
  readTimeOrDuration: string;
  date: string;
  image: string;
  link: string;
  featured?: boolean;
  tags: string[];
  authorOrClient?: string;
}

const CATEGORIES = [
  { id: 'all', label: 'Todos os Formatos', icon: Layers },
  { id: 'case', label: 'Cases de Sucesso', icon: Star, count: 4, link: '/cases-de-sucesso' },
  { id: 'blog', label: 'Artigos & Blog', icon: FileText, count: 6, link: '/blog' },
  { id: 'report', label: 'Relatórios', icon: BookOpen, count: 3, link: '/relatorios' },
  { id: 'webinar', label: 'Webinars', icon: Video, count: 4, link: '/webinars' },
  { id: 'ebook', label: 'Ebooks & Guias', icon: BookMarked, count: 4, link: '/ebooks' },
];

const TOPICS = [
  "Todos os Tópicos",
  "IA Generativa",
  "Governança & LGPD",
  "Google Cloud",
  "Databricks",
  "Lakehouse",
  "FinOps",
  "Analytics & BI",
  "Migração de Legados"
];

const INSIGHTS_ITEMS: InsightItem[] = [
  {
    id: "case-1",
    type: "case",
    title: "Gerando valor através de Marketplace e Governança de dados",
    description: "Como o Banco ABC estabeleceu um fluxo de trabalho entre Informatica e GCP para democratizar o acesso seguro a dados.",
    category: "Cases de Sucesso",
    readTimeOrDuration: "Case de Sucesso",
    date: "Março 2026",
    image: caseMarketplaceGov,
    link: "/cases-de-sucesso/marketplace-governanca-dados",
    featured: true,
    tags: ["Governança & LGPD", "Google Cloud", "Marketplace"],
    authorOrClient: "Banco ABC"
  },
  {
    id: "report-1",
    type: "report",
    title: "Panorama de Dados & IA Generativa nas Empresas 2026",
    description: "Estudo exclusivo com mais de 200 líderes de TI mostrando como as empresas brasileiras estão investindo em IA Generativa e Lakehouse.",
    category: "Relatórios",
    readTimeOrDuration: "Leitura de 12 min",
    date: "Fevereiro 2026",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000",
    link: "/relatorios",
    featured: true,
    tags: ["IA Generativa", "Analytics & BI", "Pesquisa"],
    authorOrClient: "ATRA Research Labs"
  },
  {
    id: "blog-1",
    type: "blog",
    title: "Squad Gerenciada: como estruturar equipes de TI mais eficientes",
    description: "Saiba como o modelo de squads ágeis pode escalar sua operação de tecnologia mantendo a qualidade, velocidade e cultura de dados.",
    category: "Artigos & Blog",
    readTimeOrDuration: "Leitura de 6 min",
    date: "23 de março de 2026",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000",
    link: "/blog",
    featured: true,
    tags: ["Squads", "Gestão de TI", "FinOps"],
    authorOrClient: "Engenharia ATRA"
  },
  {
    id: "case-2",
    type: "case",
    title: "Processamento de Dados 51x Mais Rápido no Google Cloud",
    description: "Automação de ingestão de dados de risco no Banco Carrefour com otimização extrema de performance e custos.",
    category: "Cases de Sucesso",
    readTimeOrDuration: "Case de Sucesso",
    date: "Fevereiro 2026",
    image: caseRiskEfficiency,
    link: "/cases-de-sucesso/eficiencia-processos-risco",
    featured: false,
    tags: ["Google Cloud", "Migração de Legados", "FinOps"],
    authorOrClient: "Banco Carrefour"
  },
  {
    id: "ebook-1",
    type: "ebook",
    title: "Guia Definitivo de Governança de Dados para o Setor Financeiro",
    description: "Aprenda a implementar catálogos de dados, políticas de classificação PII e compliance com LGPD e Bacen sem engessar a inovação.",
    category: "Ebooks & Guias",
    readTimeOrDuration: "Ebook em PDF (48 págs)",
    date: "Janeiro 2026",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000",
    link: "/ebooks",
    featured: false,
    tags: ["Governança & LGPD", "Analytics & BI"],
    authorOrClient: "Especialistas de Governança ATRA"
  },
  {
    id: "webinar-1",
    type: "webinar",
    title: "IA Generativa Corporativa: Do Protótipo ao RAG em Produção",
    description: "Assista à demonstração prática de arquitetura RAG usando Vertex AI, LangChain e bancos vetoriais para buscas em linguagem natural.",
    category: "Webinars",
    readTimeOrDuration: "Vídeo de 55 min",
    date: "Janeiro 2026",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000",
    link: "/webinars",
    featured: false,
    tags: ["IA Generativa", "Google Cloud", "Databricks"],
    authorOrClient: "AI Architects Team"
  },
  {
    id: "blog-2",
    type: "blog",
    title: "Arquitetura Multicloud: O que é, por que importa e como fortalecer sua TI",
    description: "Explore os benefícios, estratégias e desafios de manter uma infraestrutura de nuvem distribuída e resiliente entre AWS, GCP e Azure.",
    category: "Artigos & Blog",
    readTimeOrDuration: "Leitura de 8 min",
    date: "5 de janeiro de 2026",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000",
    link: "/blog",
    featured: false,
    tags: ["Google Cloud", "Migração de Legados", "FinOps"],
    authorOrClient: "Time de Cloud ATRA"
  },
  {
    id: "report-2",
    type: "report",
    title: "FinOps Benchmark 2026: Otimização de Custos em Data Lakes",
    description: "Estratégias práticas e métricas de economias reais obtidas por grandes empresas ao otimizar BigQuery, Databricks e Snowflake.",
    category: "Relatórios",
    readTimeOrDuration: "Leitura de 15 min",
    date: "Dezembro 2025",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1000",
    link: "/relatorios",
    featured: false,
    tags: ["FinOps", "Databricks", "Google Cloud"],
    authorOrClient: "ATRA FinOps Team"
  },
  {
    id: "case-3",
    type: "case",
    title: "Migrando Cargas de Trabalho Legadas para Google Cloud",
    description: "Alimentação automática de aplicação de Risco de Mercado a partir de sistema mainframe legado em prazo recorde.",
    category: "Cases de Sucesso",
    readTimeOrDuration: "Case de Sucesso",
    date: "Novembro 2025",
    image: caseLegacyMigration,
    link: "/cases-de-sucesso/migracao-legado-gcp",
    featured: false,
    tags: ["Migração de Legados", "Google Cloud"],
    authorOrClient: "Banco ABC"
  },
  {
    id: "ebook-2",
    type: "ebook",
    title: "Playbook de Migração para Data Lakehouse Moderno",
    description: "Passo a passo com boas práticas para transicionar de data warehouses legados para a Medallion Architecture no Databricks.",
    category: "Ebooks & Guias",
    readTimeOrDuration: "Ebook em PDF (36 págs)",
    date: "Outubro 2025",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000",
    link: "/ebooks",
    featured: false,
    tags: ["Lakehouse", "Databricks", "Migração de Legados"],
    authorOrClient: "Arquitetura de Dados ATRA"
  }
];

export default function Insights() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('Todos os Tópicos');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setTimeout(() => {
        setNewsletterEmail('');
      }, 3000);
    }
  };

  // Performance: Memoize filtered items
  const filteredItems = useMemo(() => {
    return INSIGHTS_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
      const matchesTopic = selectedTopic === 'Todos os Tópicos' || item.tags.includes(selectedTopic);
      const matchesSearch = searchQuery.trim() === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.authorOrClient && item.authorOrClient.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesTopic && matchesSearch;
    });
  }, [selectedCategory, selectedTopic, searchQuery]);

  const featuredItems = useMemo(() => INSIGHTS_ITEMS.filter(item => item.featured), []);

  return (
    <main className="pt-24 md:pt-36 pb-20 bg-surface-1 min-h-screen text-text-main relative overflow-hidden">
      <BackgroundDecorations />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-left"
        >
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <StatusBadge 
              label="Hub Central de Conhecimento" 
              variant="primary" 
              size="sm" 
              pulse={true} 
              icon={<Sparkles size={12} />} 
            />
            <MetricChip label="ATRA Insights" variant="neutral" size="sm" />
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-text-main mb-6 leading-tight">
            Transformando inteligência técnica em <span className="text-primary font-normal">vantagem competitiva</span>.
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-text-muted max-w-3xl font-light leading-relaxed mb-8">
            Explore nossos cases de sucesso com grandes marcas, relatórios de mercado, artigos de arquitetos especialistas, webinars ao vivo e ebooks estratégicos sobre Dados & IA.
          </p>

          {/* Hub Category Quick Selector Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={cat.id}
                  to={cat.link || "#"}
                  onClick={(e) => {
                    if (!cat.link) {
                      e.preventDefault();
                      setSelectedCategory(cat.id);
                    }
                  }}
                  className={cn(
                    "inline-flex items-center gap-2 px-3.5 py-2 rounded-[6px] text-xs font-semibold transition-all duration-200 cursor-pointer",
                    selectedCategory === cat.id
                      ? "bg-primary text-white shadow-xs"
                      : "bg-surface-2 text-text-muted hover:text-text-main border border-slate-200 dark:border-white/5 hover:bg-surface-3"
                  )}
                >
                  <IconComp size={14} />
                  <span>{cat.label}</span>
                  {cat.count && (
                    <span className="px-1.5 py-0.5 rounded-[6px] bg-white/20 text-[10px] font-bold">
                      {cat.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Featured Insights Spotlight */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-amber-400 fill-amber-400" />
            <h2 className="text-xl md:text-2xl font-bold font-display text-text-main">
              Destaques de Impacto
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {featuredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
            >
              <GlowCard glowColor="blue" className="overflow-hidden flex flex-col justify-between h-full group">
                <div>
                  <div className="aspect-[16/9] overflow-hidden relative rounded-t-[5px]">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-[6px] bg-surface-1/90 text-text-main text-[10px] font-bold border border-slate-200/40 dark:border-white/10 backdrop-blur-md">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-3 text-xs text-text-muted mb-3 font-light">
                      <span className="font-semibold text-primary">{item.authorOrClient}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>

                    <h3 className="text-base font-bold text-text-main mb-2.5 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-text-muted font-light leading-relaxed line-clamp-3 mb-4">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-[6px] bg-surface-1 text-text-muted border border-slate-200 dark:border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-dark group-hover:translate-x-1 transition-all"
                  >
                    <span>Acessar conteúdo</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Filter and Search Bar Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-primary" />
              <h2 className="text-sm md:text-base font-bold text-text-main">
                Explorar Todos os Conteúdos
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Buscar por palavra-chave ou tema..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-surface-1 border border-slate-200 dark:border-white/10 rounded-[6px] text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Format Tabs Filter */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-[6px] text-xs font-semibold transition-all whitespace-nowrap cursor-pointer",
                  selectedCategory === cat.id
                    ? "bg-primary text-white shadow-xs"
                    : "bg-surface-1 text-text-muted hover:text-text-main border border-slate-200 dark:border-white/5 hover:bg-surface-3"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Topic Pills */}
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={cn(
                  "px-3 py-1 rounded-[6px] text-xs transition-all cursor-pointer whitespace-nowrap",
                  selectedTopic === topic
                    ? "bg-primary text-white font-semibold shadow-xs"
                    : "bg-surface-1 text-text-muted hover:text-text-main border border-slate-200 dark:border-white/5 hover:bg-surface-3"
                )}
              >
                {topic}
              </button>
            ))}
          </div>

          {(selectedCategory !== 'all' || selectedTopic !== 'Todos os Tópicos' || searchQuery !== '') && (
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-text-muted">
              <span>
                Filtros aplicados: {selectedCategory !== 'all' && <strong className="text-primary mr-2">{CATEGORIES.find(c => c.id === selectedCategory)?.label}</strong>}
                {selectedTopic !== 'Todos os Tópicos' && <strong className="text-secondary mr-2">[{selectedTopic}]</strong>}
                {searchQuery && <span className="text-amber-400 font-semibold">"{searchQuery}"</span>}
              </span>
              <button 
                onClick={() => { setSelectedCategory('all'); setSelectedTopic('Todos os Tópicos'); setSearchQuery(''); }} 
                className="text-primary hover:underline font-semibold cursor-pointer"
              >
                Limpar todos os filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Insights Content Cards Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl md:text-2xl font-bold font-display text-text-main">
              {selectedCategory === 'all' ? 'Todos os Registros de Conhecimento' : CATEGORIES.find(c => c.id === selectedCategory)?.label}
            </h3>
            <p className="text-xs text-text-muted font-light mt-0.5">
              Exibindo {filteredItems.length} de {INSIGHTS_ITEMS.length} conteúdos publicados
            </p>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-12 text-center max-w-md mx-auto">
            <BookOpen size={48} className="mx-auto text-text-muted mb-4" />
            <h4 className="text-base font-bold text-text-main mb-2">Nenhum conteúdo encontrado</h4>
            <p className="text-xs text-text-muted font-light mb-6">Tente ajustar a busca por termo ou selecione outro tópico.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedTopic('Todos os Tópicos'); setSearchQuery(''); }}
              className="px-5 py-2.5 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all cursor-pointer"
            >
              Resetar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlowCard glowColor="blue" className="overflow-hidden flex flex-col justify-between h-full group">
                    <div>
                      <div className="aspect-[16/9] overflow-hidden relative rounded-t-[5px]">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-[6px] bg-surface-1/90 text-text-main text-[10px] font-bold border border-slate-200/40 dark:border-white/10 backdrop-blur-md">
                            {item.category}
                          </span>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <span className="px-2.5 py-1 rounded-[6px] bg-black/60 text-white text-[10px] font-medium backdrop-blur-md flex items-center gap-1">
                            <Clock size={12} />
                            {item.readTimeOrDuration}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="text-[11px] font-semibold text-primary mb-2">
                          {item.authorOrClient} • {item.date}
                        </div>

                        <h4 className="text-base font-bold text-text-main mb-2.5 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                          {item.title}
                        </h4>

                        <p className="text-xs text-text-muted font-light leading-relaxed line-clamp-3 mb-4">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {item.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-[6px] bg-surface-1 text-text-muted border border-slate-200 dark:border-white/5">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        to={item.link}
                        className="w-full py-2.5 px-4 rounded-[6px] bg-surface-1 hover:bg-primary hover:text-white text-text-main border border-slate-200 dark:border-white/10 text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-2 group/btn cursor-pointer"
                      >
                        <span>{item.type === 'ebook' ? 'Baixar Ebook' : item.type === 'webinar' ? 'Assistir Webinar' : 'Acessar Conteúdo'}</span>
                        <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Direct Category Portals Banner Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl md:text-3xl font-bold font-display text-text-main mb-2">
            Nossos Canais de Conteúdo
          </h2>
          <p className="text-xs md:text-sm text-text-muted font-light">
            Acesse as seções dedicadas para cada formato de material.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CATEGORIES.filter(c => c.id !== 'all').map((cat) => {
            const IconComp = cat.icon;
            return (
              <Link
                key={cat.id}
                to={cat.link || "#"}
                className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-5 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group"
              >
                <div className="w-12 h-12 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all">
                  <IconComp size={22} />
                </div>
                <h4 className="text-sm font-bold text-text-main mb-1 group-hover:text-primary transition-colors">
                  {cat.label}
                </h4>
                <span className="text-[11px] text-text-muted font-medium flex items-center gap-1">
                  Ver seção <ChevronRight size={12} />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Newsletter Subscription Box */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-16">
        <div className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-8 md:p-12 shadow-xl relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
          <TechCornerBraces color="blue" position="top-left" size={14} />
          <TechCornerBraces color="orange" position="bottom-right" size={14} />

          <div className="max-w-xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-primary/10 text-primary text-xs font-semibold mb-3 border border-primary/20">
              <Mail size={14} />
              <span>ATRA Knowledge Club</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold font-display text-text-main mb-2">
              Receba os melhores Insights quinzenalmente
            </h3>
            <p className="text-xs md:text-sm text-text-muted font-light">
              Junte-se a mais de 5.000 líderes de dados e receba nossos artigos, pesquisas de mercado e convites de webinars direto na sua caixa de entrada.
            </p>
          </div>

          <div className="w-full md:w-80 shrink-0 relative z-10">
            {newsletterSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[6px] p-4 text-center">
                <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-1" />
                <span className="text-xs font-bold text-text-main block">Inscrição realizada!</span>
                <span className="text-[11px] text-text-muted font-light">Em breve você receberá nosso conteúdo.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  placeholder="Seu e-mail corporativo"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-1 border border-slate-200 dark:border-white/10 rounded-[6px] text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-[6px] text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Inscrever-se Grátis</span>
                  <Send size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Bottom CTA to Consultants */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-8 md:p-10 shadow-sm">
          <h3 className="text-xl md:text-2xl font-bold font-display text-text-main mb-3">
            Quer implementar esses conceitos na sua empresa?
          </h3>
          <p className="text-xs md:text-sm text-text-muted font-light max-w-2xl mx-auto mb-6">
            Nossos consultores e arquitetos seniores estão prontos para ajudar sua equipe a desenhar e executar soluções em Dados, IA e Cloud.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/consultores"
              className="px-6 py-3 rounded-[6px] bg-primary hover:bg-primary-dark text-white text-xs md:text-sm font-semibold transition-all shadow-md shadow-primary/20"
            >
              Conhecer Nossos Consultores
            </Link>
            <Link
              to="/#fale-conosco"
              className="px-6 py-3 rounded-[6px] bg-surface-1 hover:bg-surface-3 text-text-main border border-slate-200 dark:border-white/10 text-xs md:text-sm font-semibold transition-all"
            >
              Falar com Especialista
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
