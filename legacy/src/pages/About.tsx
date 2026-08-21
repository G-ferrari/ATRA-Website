import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Award, 
  Zap, 
  Target, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Cloud, 
  LineChart, 
  Globe, 
  Search, 
  Settings, 
  GraduationCap, 
  MessageSquare, 
  Headset, 
  Clock, 
  Heart, 
  Handshake, 
  Compass,
  Sparkles
} from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { cn } from '@/lib/utils';
import { BackgroundDecorations } from '@/components/Decorations';
import { Link } from 'react-router-dom';
import { GlowCard } from '@/components/ui/spotlight-card';
import { TechCornerBraces } from '@/components/TechDetails';
import { StatusBadge, MetricChip } from '@/components/ui/badge-status';
import { AnimatedCounter } from '@/components/ui/animated-counter';

const getSolutionIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('alocação')) return Users;
  if (lower.includes('inteligência') || lower.includes('ia')) return Cpu;
  if (lower.includes('cloud')) return Cloud;
  if (lower.includes('customer')) return Target;
  if (lower.includes('analytics')) return LineChart;
  if (lower.includes('discovery')) return Search;
  if (lower.includes('governance') || lower.includes('governança')) return ShieldCheck;
  if (lower.includes('integration') || lower.includes('integração') || lower.includes('master')) return Database;
  if (lower.includes('transformação') || lower.includes('fábrica')) return Settings;
  if (lower.includes('sustentação')) return Headset;
  if (lower.includes('treinamento')) return GraduationCap;
  return Target;
};

const getWhyChooseIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('experts') || lower.includes('15 anos')) return Clock;
  if (lower.includes('profissionais')) return Users;
  if (lower.includes('valor')) return Heart;
  if (lower.includes('valores') || lower.includes('inovação')) return Zap;
  if (lower.includes('parceiros')) return Handshake;
  if (lower.includes('suporte')) return Headset;
  if (lower.includes('estratégias')) return Compass;
  if (lower.includes('qualidade') || lower.includes('comprometimento')) return ShieldCheck;
  return CheckCircle2;
};

const carouselPhotos = [
  "/fotos/2018_Evento global parceiro Informatica Las Vegas.jpg",
  "/fotos/2024_ATRA Summit_Dinamica.jpg",
  "/fotos/2024_Evento corporativo com parceiro Denodo.jpg",
  "/fotos/2024_Evento parceiro Google.jpeg",
  "/fotos/2025_ATRA Summit.JPG"
];

const About = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<string | null>('quem-somos');
  const [isSticky, setIsSticky] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-120px 0px -40% 0px" }
    );

    ['quem-somos', 'nossos-valores', 'nossas-solucoes', 'porque-escolher'].forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const menuItems = [
    { label: t('about.whoWeAre.title'), id: 'quem-somos' },
    { label: t('about.values.title'), id: 'nossos-valores' },
    { label: t('about.solutions.title'), id: 'nossas-solucoes' },
    { label: t('about.purpose.title'), id: 'porque-escolher' },
  ];

  const stats = [
    { value: 15, suffix: "+", label: t('aboutStats.years') },
    { value: 140, suffix: "+", label: t('aboutStats.professionals') },
    { value: 30, suffix: "+", label: t('aboutStats.clients') },
    { value: 9, suffix: "", label: t('aboutStats.partners') },
    { value: 4, suffix: "x", label: t('aboutStats.gptw') },
  ];

  const whyChooseItems = t('about.whyChoose.items', { returnObjects: true }) as string[];
  const solutionItems = t('about.solutions.items', { returnObjects: true }) as string[];

  return (
    <main className="pt-24 md:pt-36 pb-0 bg-surface-1 min-h-screen text-text-main">
      <div ref={observerRef} className="h-0" />
      
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 overflow-hidden bg-surface-1 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="rounded-[6px] bg-gradient-to-br from-[#12151c] via-[#1a2130] to-[#0e1015] border border-white/5 text-white p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden vort-dot-grid">
            <TechCornerBraces color="blue" position="top-left" size={16} />
            <TechCornerBraces color="orange" position="bottom-right" size={16} />

            <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="lg:col-span-7"
              >
                <div className="flex items-center gap-2 mb-4">
                  <StatusBadge 
                    label="Sobre a ATRA" 
                    variant="primary" 
                    size="sm" 
                    pulse={true} 
                    icon={<Sparkles size={12} />} 
                  />
                  <MetricChip label="Desde 2011" variant="neutral" size="sm" />
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display mb-4 tracking-tight leading-tight">
                  <Trans i18nKey="about.heroSubtitle">
                    A <span className="text-primary font-normal">ATRA</span> transforma desafios em oportunidades na era da <span className="text-secondary font-normal">Transformação Digital</span>.
                  </Trans>
                </h1>

                <p className="text-xs sm:text-sm md:text-base text-white/70 font-light leading-relaxed mb-6 max-w-xl">
                  Somos especialistas em Engenharia de Dados, Inteligência Artificial e Governança Corporativa com histórico de sucesso nos maiores bancos e empresas do Brasil.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => scrollToSection('quem-somos')}
                    className="px-5 py-2.5 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all cursor-pointer shadow-md shadow-primary/20"
                  >
                    Conhecer Nossa História
                  </button>
                  <Link
                    to="/carreiras"
                    className="px-5 py-2.5 rounded-[6px] bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-all"
                  >
                    Trabalhe Conosco
                  </Link>
                </div>
              </motion.div>

              {/* Vertical Marquee Showcase */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="lg:col-span-5 relative hidden lg:block"
              >
                <div 
                  className="w-full h-[400px] rounded-[6px] overflow-hidden relative bg-black/40 border border-white/10 shadow-2xl"
                  style={{
                    maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
                    WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
                  }}
                >
                  <div className="absolute inset-x-0 w-full animate-marquee-vertical hover:[animation-play-state:paused] flex flex-col gap-3 py-3 px-3">
                    {[...carouselPhotos, ...carouselPhotos].map((photo, i) => (
                      <div key={i} className="relative w-full aspect-[16/10] rounded-[6px] overflow-hidden shrink-0 shadow-sm border border-white/5">
                        <img 
                          src={photo} 
                          alt="ATRA Moment" 
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className="bg-surface-2 border border-slate-200 dark:border-white/5 p-5 rounded-[6px] shadow-sm flex flex-col items-center text-center group hover:border-primary/30 transition-all duration-300"
            >
              <div className="text-2xl sm:text-3xl font-bold font-display text-primary mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-text-muted uppercase tracking-wider leading-tight">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sticky In-Page Navigation */}
      <div className={cn(
        "sticky z-30 w-full flex flex-col items-center px-3 sm:px-4 mb-8 sm:mb-10 pointer-events-none transition-all duration-300",
        isSticky ? "top-[58px] sm:top-[66px] md:top-[74px]" : "top-[70px] sm:top-[80px] md:top-[88px]"
      )}>
        <div className={cn(
          "pointer-events-auto w-full max-w-7xl mx-auto flex items-center py-2.5 sm:py-3.5 md:py-4.5 min-h-[46px] sm:min-h-[52px] md:min-h-[56px] px-3 sm:px-6 md:px-8 overflow-x-auto no-scrollbar justify-start md:justify-center transition-all duration-300 shadow-xl bg-surface-2 border border-slate-200/60 dark:border-white/5",
          isSticky 
            ? "rounded-b-[6px] rounded-t-none" 
            : "rounded-[6px] mt-2"
        )}>
          <div className="flex gap-4 sm:gap-6 md:gap-8 whitespace-nowrap items-center shrink-0">
            {menuItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  scrollToSection(item.id);
                }}
                className={cn(
                  "font-medium transition-all duration-200 text-xs sm:text-sm cursor-pointer py-1 px-1.5 shrink-0",
                  activeSection === item.id 
                    ? "text-primary font-semibold underline underline-offset-[8px] decoration-2" 
                    : "text-text-muted hover:text-text-main"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Quem Somos */}
      <section id="quem-somos" className="py-16 md:py-20 bg-surface-1 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">{t('about.whoWeAre.title')}</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-6 leading-tight">
                {t('about.history.title')}
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-text-muted font-light leading-relaxed">
                <p>{t('about.whoWeAre.p1')}</p>
                <p>{t('about.whoWeAre.p2')}</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link 
                  to="/carreiras"
                  className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-[6px] text-xs font-semibold transition-all shadow-md shadow-primary/20 flex items-center gap-2 group"
                >
                  <span>{t('about.whoWeAre.saibaMais')}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-[6px] overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 relative">
                <img 
                  src="/imagens/unsplash-1522071820081-009f0129c71c-w1200-42d314.jpg" 
                  alt="ATRA Team" 
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Nossos Valores */}
      <section id="nossos-valores" className="py-16 md:py-20 bg-surface-2 border-y border-slate-200 dark:border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Manifesto</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-3">
              {t('about.values.title')}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Users, glow: "blue" as const, title: t('about.values.items.0'), desc: "Proatividade, Liderança, Diversidade, Equidade, Ética, Respeito e Confiança." },
              { icon: Award, glow: "blue" as const, title: t('about.values.items.1'), desc: "Responsabilidade, Transparência, Consciência, Excelência e Flexibilidade." },
              { icon: Zap, glow: "orange" as const, title: t('about.values.items.2'), desc: "Solução, Tecnologia, Transformação Digital e Aprendizado Contínuo." },
            ].map((value, idx) => (
              <GlowCard key={idx} glowColor={value.glow} className="p-8 flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center mb-6">
                    <value.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold font-display text-text-main mb-3 group-hover:text-primary transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-xs text-text-muted font-light leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-surface-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 font-display">
              {t('about.partners.title')}
            </h3>
            <div className="w-12 h-0.5 bg-primary/40 mx-auto rounded-full"></div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-700">
            <img src="/imagens/Microsoft_Azure-Logo.wine_-1536x1024-370d06.png" alt="Azure" className="h-10 md:h-12 object-contain" />
            <img src="/imagens/Google_Cloud_Platform-Logo.wine_-2048x1365-02fd56.png" alt="Google Cloud" className="h-8 md:h-10 object-contain" />
            <img src="/imagens/Databricks_Logo2-1536x813-aa2d3d.png" alt="Databricks" className="h-6 md:h-8 object-contain" />
            <img src="/imagens/Atlan-logo-full.svg_-6ccbc8.png" alt="Atlan" className="h-6 md:h-8 object-contain" />
          </div>
        </div>
      </section>

      {/* 3. Nossas Soluções */}
      <section id="nossas-solucoes" className="py-16 md:py-20 bg-surface-2 border-t border-slate-200 dark:border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">{t('about.solutions.title')}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-3">
              Transformando Desafios em Resultados
            </h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {solutionItems.map((item, idx) => {
              const SolutionIcon = getSolutionIcon(item);
              return (
                <div
                  key={idx}
                  className="p-5 bg-surface-1 border border-slate-200 dark:border-white/5 rounded-[6px] hover:border-primary/40 hover:shadow-md transition-all duration-300 flex flex-col justify-center items-center text-center group"
                >
                  <div className="w-10 h-10 rounded-[6px] bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-all">
                    <SolutionIcon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-xs font-semibold text-text-main group-hover:text-primary transition-colors leading-relaxed">
                    {item}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Por que escolher nossos serviços em dados */}
      <section id="porque-escolher" className="py-16 md:py-20 bg-surface-1 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">{t('about.purpose.title')}</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-3">
              {t('about.whyChoose.title')}
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseItems.map((item, idx) => {
              const Icon = getWhyChooseIcon(item);
              return (
                <div
                  key={idx}
                  className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-6 group hover:border-primary/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                    <Icon size={20} />
                  </div>
                  <p className="text-xs text-text-muted font-light group-hover:text-text-main transition-colors leading-relaxed">
                    {item}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-20 bg-surface-2 border-t border-slate-200 dark:border-white/5 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-4 tracking-tight">
            {t('about.cta.title')}
          </h2>
          <p className="text-xs sm:text-sm text-text-muted font-light mb-8 max-w-xl mx-auto leading-relaxed">
            {t('about.cta.desc')}
          </p>
          <Link 
            to="/carreiras"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-[6px] bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-primary/20"
          >
            {t('about.cta.button')}
          </Link>
        </div>
      </section>
    </main>
  );
};

export default About;
