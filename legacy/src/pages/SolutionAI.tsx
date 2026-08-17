import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  Bot, 
  Cpu, 
  CheckCircle2, 
  ChevronDown, 
  Search, 
  Settings, 
  BarChart,
  ArrowRight,
  ArrowUpRight,
  Target, 
  Zap, 
  ShieldCheck, 
  Sparkles, 
  TrendingUp,
  Layers,
  Code2,
  Workflow,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTranslation, Trans } from 'react-i18next';
import { GlowCard } from '@/components/ui/spotlight-card';
import { TechCornerBraces, TechHorizontalLine, TechVerticalLine } from '@/components/TechDetails';
import { StatusBadge, MetricChip } from '@/components/ui/badge-status';
import { AnimatedCounter } from '@/components/ui/animated-counter';

const SolutionAI = () => {
  const { t } = useTranslation();
  const [activeAccordion, setActiveAccordion] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 130;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const [activeSection, setActiveSection] = useState<string | null>('como-funciona');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-100px 0px -40% 0px" }
    );

    ['como-funciona', 'beneficios', 'para-quem', 'como-fazemos'].forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const [isSticky, setIsSticky] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const sticky = !entry.isIntersecting;
        setIsSticky(sticky);
        window.dispatchEvent(new CustomEvent('internalMenuSticky', { detail: sticky }));
      },
      { threshold: 1, rootMargin: "-89px 0px 0px 0px" }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      observer.disconnect();
      window.dispatchEvent(new CustomEvent('internalMenuSticky', { detail: false }));
    };
  }, []);

  return (
    <main className="pt-24 md:pt-36 pb-0 bg-surface-1 text-text-main">
      <div ref={observerRef} className="h-0" />
      
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 overflow-hidden bg-surface-1 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="rounded-[6px] bg-gradient-to-br from-[#12151c] via-[#1a2130] to-[#0e1015] border border-white/5 text-white p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden vort-dot-grid">
            
            <TechCornerBraces color="blue" position="top-left" size={16} />
            <TechCornerBraces color="orange" position="bottom-right" size={16} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-7"
              >
                <div className="flex items-center gap-2 mb-4">
                  <StatusBadge 
                    label={t('solution.categoryBadge')} 
                    variant="primary" 
                    size="sm" 
                    pulse={true} 
                    icon={<Brain size={12} />} 
                  />
                  <MetricChip label="Pronto para Produção" variant="neutral" size="sm" />
                </div>
                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display mb-4 tracking-tight leading-tight">
                  <Trans i18nKey="solution.heroTitle">
                    Soluções em <span className="text-primary font-normal">Inteligência Artificial</span> & IA Generativa
                  </Trans>
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-white/70 mb-6 leading-relaxed font-light max-w-2xl">
                  {t('solution.heroDesc')}
                </p>

                {/* Performance & Metric Highlights */}
                <div className="grid grid-cols-3 gap-3 mb-6 max-w-lg">
                  <div className="p-3 rounded-[6px] bg-white/5 border border-white/10 text-center">
                    <div className="text-lg sm:text-xl font-bold text-primary">
                      <AnimatedCounter end={70} suffix="%" />
                    </div>
                    <div className="text-[10px] text-white/60 font-medium mt-0.5">Automação de Rotinas</div>
                  </div>
                  <div className="p-3 rounded-[6px] bg-white/5 border border-white/10 text-center">
                    <div className="text-lg sm:text-xl font-bold text-secondary">
                      <AnimatedCounter end={3} suffix="x" />
                    </div>
                    <div className="text-[10px] text-white/60 font-medium mt-0.5">Velocidade de Análise</div>
                  </div>
                  <div className="p-3 rounded-[6px] bg-white/5 border border-white/10 text-center">
                    <div className="text-lg sm:text-xl font-bold text-emerald-400">
                      <AnimatedCounter end={99} suffix=".8%" />
                    </div>
                    <div className="text-[10px] text-white/60 font-medium mt-0.5">Precisão de RAG</div>
                  </div>
                </div>

                <a 
                  href="#contato" 
                  className="inline-flex items-center justify-center bg-secondary hover:bg-orange-600 text-white px-6 py-3 rounded-[6px] text-xs sm:text-sm font-semibold transition-all shadow-lg hover:-translate-y-0.5 cursor-pointer"
                  onClick={(e) => { e.preventDefault(); scrollToSection('contato'); }}
                >
                  {t('solution.hireService')}
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-5 relative hidden lg:block"
              >
                <div className="relative w-full aspect-[4/3] rounded-[6px] overflow-hidden shadow-2xl border border-white/10">
                  <img 
                    src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="AI Illustration" 
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky In-Page Navigation */}
      <div className={cn(
        "sticky z-50 hidden md:block w-full flex flex-col items-center px-4 pointer-events-none transition-all duration-300",
        isSticky ? "top-[62px] md:top-[74px]" : "top-[76px] md:top-[88px]"
      )}>
        <div className={cn(
          "pointer-events-auto w-full max-w-7xl mx-auto flex items-center py-4 md:py-4.5 min-h-[52px] md:min-h-[56px] px-6 md:px-8 overflow-x-auto no-scrollbar justify-center transition-all duration-300 shadow-xl bg-surface-2",
          isSticky 
            ? "rounded-b-[6px] rounded-t-none" 
            : "rounded-[6px] mt-2"
        )}>
          <div className="flex gap-6 md:gap-8 items-center">
            {[
              { label: t('solution.menu.howItWorks'), id: 'como-funciona' },
              { label: t('solution.menu.benefits'), id: 'beneficios' },
              { label: t('solution.menu.whoIsFor'), id: 'para-quem' },
              { label: t('solution.menu.howWeDo'), id: 'como-fazemos' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  scrollToSection(item.id);
                }}
                className={cn(
                  "font-medium transition-all duration-200 text-xs sm:text-sm cursor-pointer py-1",
                  activeSection === item.id 
                    ? "text-primary font-semibold underline underline-offset-[10px] decoration-2" 
                    : "text-text-muted hover:text-text-main"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 01. Como Funciona - Reformulado com Grid Horizontal Expansiva */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        id="como-funciona" 
        className="py-16 md:py-24 bg-surface-1 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header Introdutório de Largura Completa */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                <Workflow size={13} /> 01. Metodologia & Arquitetura
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-text-main leading-tight tracking-tight mb-4">
                {t('solution.section1.title')}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-text-muted leading-relaxed font-light">
                {t('solution.section1.p1')} {t('solution.section1.p2')}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <button 
                onClick={() => scrollToSection('contato')}
                className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-[6px] text-xs sm:text-sm font-semibold transition-all shadow-md shadow-primary/30 cursor-pointer"
              >
                {t('solution.contact.contactUs')}
              </button>
            </div>
          </div>

          {/* Cards Horizontais Balanceados (3 Colunas com Espaçamento e Largura Perfeitas) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Card 1: Análise de Oportunidades de IA */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="h-full"
            >
              <GlowCard 
                glowColor="blue" 
                customSize={true} 
                radius={6} 
                className="p-6 sm:p-8 bg-surface-2 text-text-main shadow-md flex flex-col justify-between h-full rounded-[6px] border border-slate-200 dark:border-white/5 hover:border-primary/40 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-xs">
                      <Search size={22} />
                    </div>
                    <span className="text-xs font-bold text-primary font-mono bg-primary/10 px-2.5 py-1 rounded-[6px]">
                      01 / DIAGNÓSTICO
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-display text-text-main mb-3 group-hover:text-primary transition-colors leading-snug">
                    {t('solution.section1.card1Title')}
                  </h3>

                  <p className="text-text-muted text-xs sm:text-sm leading-relaxed font-light mb-6">
                    {t('solution.section1.card1Desc')}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-text-muted font-light">
                    <CheckCircle2 size={14} className="text-primary shrink-0" />
                    <span>Mapeamento de casos de alto ROI</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted font-light">
                    <CheckCircle2 size={14} className="text-primary shrink-0" />
                    <span>Análise de prontidão de dados</span>
                  </div>
                </div>
              </GlowCard>
            </motion.div>

            {/* Card 2: Desenvolvimento de Agentes e LLMs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="h-full"
            >
              <GlowCard 
                glowColor="blue" 
                customSize={true} 
                radius={6} 
                className="p-6 sm:p-8 bg-surface-2 text-text-main shadow-md flex flex-col justify-between h-full rounded-[6px] border border-slate-200 dark:border-white/5 hover:border-primary/40 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-xs">
                      <Brain size={22} />
                    </div>
                    <span className="text-xs font-bold text-primary font-mono bg-primary/10 px-2.5 py-1 rounded-[6px]">
                      02 / DESENVOLVIMENTO
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-display text-text-main mb-3 group-hover:text-primary transition-colors leading-snug">
                    {t('solution.section1.card2Title')}
                  </h3>

                  <p className="text-text-muted text-xs sm:text-sm leading-relaxed font-light mb-6">
                    {t('solution.section1.card2Desc')}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-text-muted font-light">
                    <CheckCircle2 size={14} className="text-primary shrink-0" />
                    <span>Copilotos corporativos & RAG</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted font-light">
                    <CheckCircle2 size={14} className="text-primary shrink-0" />
                    <span>Agentes autônomos multi-tarefa</span>
                  </div>
                </div>
              </GlowCard>
            </motion.div>

            {/* Card 3: Operacionalização (MLOps) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="h-full"
            >
              <GlowCard 
                glowColor="orange" 
                customSize={true} 
                radius={6} 
                className="p-6 sm:p-8 bg-surface-2 text-text-main shadow-md flex flex-col justify-between h-full rounded-[6px] border border-slate-200 dark:border-white/5 hover:border-secondary/40 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-[6px] bg-secondary/10 text-secondary flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-300 shadow-xs">
                      <Settings size={22} />
                    </div>
                    <span className="text-xs font-bold text-secondary font-mono bg-secondary/10 px-2.5 py-1 rounded-[6px]">
                      03 / OPERAÇÃO
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-display text-text-main mb-3 group-hover:text-secondary transition-colors leading-snug">
                    {t('solution.section1.card3Title')}
                  </h3>

                  <p className="text-text-muted text-xs sm:text-sm leading-relaxed font-light mb-6">
                    {t('solution.section1.card3Desc')}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-white/5 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-text-muted font-light">
                    <CheckCircle2 size={14} className="text-secondary shrink-0" />
                    <span>Governança & mitigação de alucinações</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted font-light">
                    <CheckCircle2 size={14} className="text-secondary shrink-0" />
                    <span>Observabilidade & MLOps contínuo</span>
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 02. Benefícios - Estruturado como Bento Box da Home Page */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        id="beneficios" 
        className="py-16 md:py-24 bg-surface-2 relative overflow-hidden px-4 sm:px-6 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={13} /> 02. Vantagens Estratégicas
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-text-main tracking-tight leading-tight mb-3">
              {t('solution.section2.title')}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted font-light leading-relaxed">
              Resultados mensuráveis com tecnologia de ponta, governança nativa e foco contínuo em impacto nos negócios.
            </p>
          </div>

          {/* Bento Grid (12 Colunas como na Home Page) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* FEATURED BENTO CARD 1: Eficiência Operacional & Automação Inteligente (7 colunas) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="lg:col-span-7 h-full"
            >
              <GlowCard
                glowColor="orange"
                customSize={true}
                radius={6}
                className="p-6 sm:p-8 bg-surface-1 text-text-main shadow-lg h-full flex flex-col justify-between relative overflow-hidden group transition-all duration-300 rounded-[6px] border border-slate-200 dark:border-white/5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
                      <Zap size={14} /> Alto Impacto Operacional
                    </div>
                    <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-[6px]">
                      +70% Automação
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold font-display text-text-main mb-3 leading-tight">
                    {t('solution.section2.b1Title')}
                  </h3>

                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-light mb-6">
                    {t('solution.section2.b1Desc')} Substitua fluxos manuais lentos por agentes conversacionais inteligentes conectados às suas bases de dados e APIs internas.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                    <div className="p-3 rounded-[6px] bg-surface-2 border border-slate-200 dark:border-white/5">
                      <div className="text-base font-bold text-secondary">24/7</div>
                      <div className="text-[11px] text-text-muted font-light mt-0.5">Disponibilidade contínua</div>
                    </div>
                    <div className="p-3 rounded-[6px] bg-surface-2 border border-slate-200 dark:border-white/5">
                      <div className="text-base font-bold text-primary">0s</div>
                      <div className="text-[11px] text-text-muted font-light mt-0.5">Fila de espera em SAC</div>
                    </div>
                    <div className="p-3 rounded-[6px] bg-surface-2 border border-slate-200 dark:border-white/5">
                      <div className="text-base font-bold text-emerald-500">-60%</div>
                      <div className="text-[11px] text-text-muted font-light mt-0.5">Custo por interação</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-text-muted font-light">
                  <span>Agilidade sem perder a governança corporativa.</span>
                  <ArrowUpRight size={18} className="text-secondary shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </GlowCard>
            </motion.div>

            {/* FEATURED BENTO CARD 2: Inovação em Conteúdo & IA Generativa (5 colunas) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="lg:col-span-5 h-full"
            >
              <GlowCard
                glowColor="blue"
                customSize={true}
                radius={6}
                className="p-6 sm:p-8 bg-surface-1 text-text-main shadow-lg h-full flex flex-col justify-between relative overflow-hidden group transition-all duration-300 rounded-[6px] border border-slate-200 dark:border-white/5"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                      <Cpu size={14} /> Geração & Síntese
                    </div>
                    <Sparkles size={16} className="text-primary animate-pulse" />
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold font-display text-text-main mb-3 leading-tight">
                    {t('solution.section2.b2Title')}
                  </h3>

                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-light mb-6">
                    {t('solution.section2.b2Desc')}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {["LLMs Customizadas", "RAG Proprietário", "Síntese de Relatórios", "Extração de PDFs"].map((tag, i) => (
                      <span key={i} className="text-[11px] font-medium px-2.5 py-1 rounded-[6px] bg-surface-2 border border-slate-200 dark:border-white/5 text-text-main">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-text-muted font-light">
                  <span>Inteligência criativa aliada à precisão analítica.</span>
                  <Cpu size={16} className="text-primary shrink-0" />
                </div>
              </GlowCard>
            </motion.div>

            {/* SUPPORTING BENTO CARD 3: Escalabilidade Inteligente & MLOps (6 colunas) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="lg:col-span-6 h-full"
            >
              <GlowCard
                glowColor="blue"
                customSize={true}
                radius={6}
                className="p-6 sm:p-7 bg-surface-1 text-text-main shadow-md h-full flex flex-col justify-between rounded-[6px] border border-slate-200 dark:border-white/5 hover:border-primary/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <ShieldCheck size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Governança & MLOps</span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold font-display text-text-main mb-2">
                    {t('solution.section2.b3Title')}
                  </h4>

                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-light mb-4">
                    {t('solution.section2.b3Desc')}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-text-main font-light">
                      <CheckCircle2 size={14} className="text-primary shrink-0" />
                      <span>Pipelines de CI/CD para modelos e prompts</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-main font-light">
                      <CheckCircle2 size={14} className="text-primary shrink-0" />
                      <span>Segurança de dados e conformidade LGPD</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 text-[11px] text-text-muted">
                  Monitoramento contínuo de latência, custo e acurácia.
                </div>
              </GlowCard>
            </motion.div>

            {/* SUPPORTING BENTO CARD 4: Adoção Ágil & Retorno sobre Investimento (6 colunas) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="lg:col-span-6 h-full"
            >
              <GlowCard
                glowColor="orange"
                customSize={true}
                radius={6}
                className="p-6 sm:p-7 bg-surface-1 text-text-main shadow-md h-full flex flex-col justify-between rounded-[6px] border border-slate-200 dark:border-white/5 hover:border-secondary/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-[6px] bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                      <TrendingUp size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">ROI Mensurável</span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-bold font-display text-text-main mb-2">
                    Adoção Acelerada & Retorno Rápido
                  </h4>

                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-light mb-4">
                    Abordagem orientada a PoCs rápidas em 4 a 6 semanas para validação técnica e comprovação de valor antes da escala corporativa.
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-text-main font-light">
                      <CheckCircle2 size={14} className="text-secondary shrink-0" />
                      <span>Integração nativa com Lakehouses em Nuvem</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-text-main font-light">
                      <CheckCircle2 size={14} className="text-secondary shrink-0" />
                      <span>Capacitação e Enablement para times de negócios</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 text-[11px] text-text-muted">
                  Implementação pragmática sem fricção com sistemas existentes.
                </div>
              </GlowCard>
            </motion.div>

          </div>
        </div>
      </motion.section>

      {/* 03. Para quem é esse serviço? */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        id="para-quem" 
        className="py-16 md:py-24 bg-surface-1 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
                <Target size={13} /> 03. Perfil de Aplicação
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-text-main mb-4 leading-tight tracking-tight">
                {t('solution.section3.title')}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-text-muted mb-8 leading-relaxed font-light">
                {t('solution.section3.desc')}
              </p>
              <button 
                onClick={() => scrollToSection('contato')}
                className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-7 py-3 rounded-[6px] text-xs sm:text-sm font-semibold transition-all shadow-md shadow-primary/30 cursor-pointer"
              >
                {t('solution.contact.contactUs')}
              </button>
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: <Target className="text-primary" size={22} />,
                  text: t('solution.section3.item1'),
                  title: "Assistentes & Atendimento"
                },
                {
                  icon: <Zap className="text-secondary" size={22} />,
                  text: t('solution.section3.item2'),
                  title: "Automação de Conteúdo & Análise"
                },
                {
                  icon: <ShieldCheck className="text-primary" size={22} />,
                  text: t('solution.section3.item3'),
                  title: "Governança & MLOps Seguro"
                }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-5 rounded-[6px] bg-surface-2 border border-slate-200 dark:border-white/5 shadow-xs hover:border-primary/40 transition-all">
                  <div className="shrink-0 p-3 rounded-[6px] bg-primary/10">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-text-main mb-1">{item.title}</h4>
                    <p className="text-text-muted font-light text-xs sm:text-sm leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* 04. Como fazemos? - Distância Perfeitamente Calibrada entre Menu e Imagem */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        id="como-fazemos" 
        className="py-16 md:py-24 bg-surface-2 scroll-mt-28 md:scroll-mt-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header da Seção */}
          <div className="mb-10 lg:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Settings size={13} /> 04. Etapas do Processo
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-text-main leading-tight tracking-tight">
              {t('solution.section4.title')}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted font-light mt-2 max-w-2xl">
              Da identificação do problema à entrega escalável com ciclos contínuos de melhoria.
            </p>
          </div>

          {/* Grid com distância perfeita e equilibrada entre a imagem e as etapas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
            
            {/* Imagem (5 colunas) */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-[6px] overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 aspect-[4/3] lg:aspect-square w-full">
                <img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Como fazemos IA" 
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                
                {/* Floating badge */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-auto bg-surface-1/95 backdrop-blur-md p-3 rounded-[6px] shadow-lg border border-slate-200 dark:border-white/10 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[4px] bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Workflow size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-main">Metodologia Ágil ATRA</div>
                    <div className="text-[10px] text-text-muted">Sprint-driven • Foco em ROI</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu de Etapas / Acordeões (7 colunas) */}
            <div className="lg:col-span-7">
              <div className="space-y-3.5">
                {[
                  {
                    step: "01",
                    title: t('solution.section4.acc1Title'),
                    content: t('solution.section4.acc1Desc'),
                    icon: Target
                  },
                  {
                    step: "02",
                    title: t('solution.section4.acc2Title'),
                    content: t('solution.section4.acc2Desc'),
                    icon: Cpu
                  },
                  {
                    step: "03",
                    title: t('solution.section4.acc3Title'),
                    content: t('solution.section4.acc3Desc'),
                    icon: Settings
                  }
                ].map((item, idx) => {
                  const IconCmp = item.icon;
                  const isActive = activeAccordion === idx;
                  return (
                    <div 
                      key={idx} 
                      className={cn(
                        "rounded-[6px] overflow-hidden border transition-all duration-300",
                        isActive 
                          ? "bg-surface-1 border-primary/40 shadow-md" 
                          : "bg-surface-1/60 hover:bg-surface-1 border-slate-200 dark:border-white/5"
                      )}
                    >
                      <button 
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer"
                        onClick={() => toggleAccordion(idx)}
                      >
                        <div className="flex items-center gap-3.5">
                          <span className={cn(
                            "w-7 h-7 rounded-[4px] flex items-center justify-center text-xs font-bold font-mono transition-colors",
                            isActive ? "bg-primary text-white" : "bg-surface-2 text-text-muted"
                          )}>
                            {item.step}
                          </span>
                          <span className={cn(
                            "font-bold text-xs sm:text-sm md:text-base transition-colors",
                            isActive ? "text-primary" : "text-text-main"
                          )}>
                            {item.title}
                          </span>
                        </div>
                        <div className={cn(
                          "w-7 h-7 rounded-[6px] flex items-center justify-center transition-colors shrink-0",
                          isActive ? "bg-primary/20 text-primary" : "bg-surface-2 text-text-muted"
                        )}>
                          {isActive ? <span className="text-sm font-bold leading-none">-</span> : <span className="text-sm font-bold leading-none">+</span>}
                        </div>
                      </button>
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-0 text-text-muted text-xs sm:text-sm leading-relaxed font-light pl-14">
                              {item.content}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* Bottom CTA */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        id="contato" 
        className="py-16 md:py-24 bg-surface-1 relative overflow-hidden px-3 sm:px-6"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="rounded-[6px] bg-gradient-to-br from-[#12151c] via-[#1a2130] to-[#0e1015] border border-white/10 text-white p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden vort-dot-grid">
            <TechCornerBraces color="blue" position="top-left" size={14} />
            <TechCornerBraces color="orange" position="bottom-right" size={14} />
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-white mb-3 leading-tight">
                  <Trans i18nKey="solution.contact.title">
                    Comece a <span className="text-secondary font-normal">revolução da IA</span> na sua empresa
                  </Trans>
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-white/70 leading-relaxed max-w-xl font-light">
                  {t('solution.contact.desc')}
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-center md:items-end gap-3 w-full md:w-auto">
                <a 
                  href="https://wa.me/5511963052391" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full md:w-auto items-center justify-center bg-secondary hover:bg-orange-600 text-white px-8 py-3 rounded-[6px] text-xs sm:text-sm font-semibold transition-all shadow-lg hover:-translate-y-0.5 whitespace-nowrap cursor-pointer"
                >
                  {t('solution.contact.contactUs')}
                </a>
                <div className="flex flex-col items-center w-full">
                  <Link 
                    to="/chat"
                    className="inline-flex w-full md:w-auto items-center justify-center bg-white/10 hover:bg-white/20 text-white px-8 py-2.5 rounded-[6px] text-xs font-medium transition-all whitespace-nowrap border border-white/10"
                  >
                    {t('solution.contact.quickDoubt')}
                  </Link>
                  <span className="text-white/40 text-[10px] mt-1.5 uppercase tracking-wider font-semibold text-center">{t('solution.contact.talkToAI')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
};

export default SolutionAI;
