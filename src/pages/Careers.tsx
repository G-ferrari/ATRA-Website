import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Award, 
  CheckCircle2, 
  Briefcase,
  Upload,
  ArrowRight,
  TrendingUp,
  Star,
  GraduationCap,
  Heart,
  Coffee,
  Zap,
  Sparkles,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BackgroundDecorations } from '@/components/Decorations';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { GlowCard } from '@/components/ui/spotlight-card';
import { TechCornerBraces } from '@/components/TechDetails';
import { StatusBadge, MetricChip } from '@/components/ui/badge-status';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import liptSealImage from '@/assets/images/lipt-2026.png';

const Careers = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<string | null>('jeito-atra');
  const [isSticky, setIsSticky] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
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

    ['jeito-atra', 'premiacoes', 'processo-seletivo', 'trabalhe-conosco', 'vantagens', 'trainee'].forEach((id) => {
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
    { label: t('careers.m1'), id: 'jeito-atra' },
    { label: t('careers.m2'), id: 'premiacoes' },
    { label: t('careers.m3'), id: 'processo-seletivo' },
    { label: t('careers.m4'), id: 'trabalhe-conosco' },
    { label: t('careers.m5'), id: 'vantagens' },
    { label: t('careers.m6'), id: 'trainee' },
  ];

  return (
    <main className="pt-24 md:pt-36 pb-0 bg-surface-1 min-h-screen text-text-main">
      <div ref={observerRef} className="h-0" />
      
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 overflow-hidden bg-surface-1 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="rounded-[6px] bg-gradient-to-br from-[#12151c] via-[#1a2130] to-[#0e1015] border border-white/5 text-white p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden vort-dot-grid text-center">
            
            <TechCornerBraces color="blue" position="top-left" size={16} />
            <TechCornerBraces color="orange" position="bottom-right" size={16} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto relative z-10"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <StatusBadge 
                  label="Vagas Abertas & Banco de Talentos" 
                  variant="primary" 
                  size="sm" 
                  pulse={true} 
                  icon={<Sparkles size={12} />} 
                />
                <MetricChip label="GPTW Certificado" variant="neutral" size="sm" />
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display mb-4 tracking-tight leading-tight">
                Construa sua história na <span className="text-primary font-normal">ATRA</span>
              </h1>
              <p className="text-sm md:text-lg font-medium text-white/90 mb-3">
                {t('careers.subtitle')}
              </p>
              <p className="text-xs sm:text-sm text-white/70 font-light max-w-xl mx-auto mb-8">
                {t('careers.desc')}
              </p>

              {/* Metric Highlights */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="p-3 rounded-[6px] bg-white/5 border border-white/10 text-center">
                  <div className="text-lg sm:text-xl font-bold text-primary">
                    <AnimatedCounter end={94} suffix="%" />
                  </div>
                  <div className="text-[10px] text-white/60 font-medium mt-0.5">Satisfação GPTW</div>
                </div>
                <div className="p-3 rounded-[6px] bg-white/5 border border-white/10 text-center">
                  <div className="text-lg sm:text-xl font-bold text-secondary">
                    <AnimatedCounter end={100} suffix="%" />
                  </div>
                  <div className="text-[10px] text-white/60 font-medium mt-0.5">Trabalho Remoto/Flex</div>
                </div>
                <div className="p-3 rounded-[6px] bg-white/5 border border-white/10 text-center">
                  <div className="text-lg sm:text-xl font-bold text-emerald-400">
                    <AnimatedCounter end={120} suffix="+" />
                  </div>
                  <div className="text-[10px] text-white/60 font-medium mt-0.5">Especialistas</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Sticky In-Page Navigation */}
      <div className={cn(
        "sticky z-30 w-full flex flex-col items-center px-3 sm:px-4 pointer-events-none transition-all duration-300",
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

      {/* 1. Jeito ATRA de ser */}
      <section id="jeito-atra" className="py-20 md:py-24 bg-surface-1 dark:bg-[#0e1015] relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[40vw] max-w-[800px] opacity-25 dark:opacity-10 pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, rgba(60, 152, 250, 0.35) 0%, transparent 70%)'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[4px] bg-primary/10 dark:bg-primary/20 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-widest mb-3">
              <Sparkles size={12} />
              <span>Nossa Essência</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main dark:text-white mb-4 tracking-tight">
              O <span className="text-primary font-normal">Jeito ATRA</span> de Ser
            </h2>
            <p className="text-text-muted dark:text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-light">
              Nossos valores guiam cada ação e decisão. É assim que construímos relações duradouras, promovemos o desenvolvimento contínuo e entregamos excelência aos nossos clientes e colaboradores.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {/* Card 1: Pessoas */}
            <div className="group relative flex flex-col justify-between bg-surface-2 dark:bg-[#181b22] border border-slate-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/60 rounded-[8px] p-7 sm:p-8 lg:p-9 shadow-sm hover:shadow-xl dark:shadow-black/60 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary/0 group-hover:bg-primary transition-all duration-300 rounded-t-[8px]" />
              <div>
                <div className="w-14 h-14 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-xs group-hover:scale-105 transition-transform">
                  <Users size={26} strokeWidth={1.75} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-text-main dark:text-white mb-2">
                  Pessoas
                </h3>
                <p className="text-xs sm:text-[13px] text-primary dark:text-[#3C98FA] font-medium mb-5 min-h-[36px] flex items-center">
                  Proatividade, Liderança, Diversidade, Equidade, Ética, Respeito e Confiança.
                </p>
                <div className="h-px w-full bg-slate-200 dark:bg-white/10 mb-6" />
                <ul className="space-y-3.5 text-xs sm:text-[13px] text-text-muted dark:text-gray-300 font-light leading-relaxed">
                  <li className="flex gap-3 items-start">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>Proporcionamos um ambiente de aprendizado e crescimento contínuo.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>Atuamos em equipe, priorizando o relacionamento humano e a empatia.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Qualidade */}
            <div className="group relative flex flex-col justify-between bg-surface-2 dark:bg-[#181b22] border border-slate-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/60 rounded-[8px] p-7 sm:p-8 lg:p-9 shadow-sm hover:shadow-xl dark:shadow-black/60 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-1 bg-primary/0 group-hover:bg-primary transition-all duration-300 rounded-t-[8px]" />
              <div>
                <div className="w-14 h-14 rounded-[8px] bg-primary/10 text-primary flex items-center justify-center mb-6 shadow-xs group-hover:scale-105 transition-transform">
                  <Award size={26} strokeWidth={1.75} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-text-main dark:text-white mb-2">
                  Qualidade
                </h3>
                <p className="text-xs sm:text-[13px] text-primary dark:text-[#3C98FA] font-medium mb-5 min-h-[36px] flex items-center">
                  Responsabilidade, Transparência, Consciência, Excelência e Flexibilidade.
                </p>
                <div className="h-px w-full bg-slate-200 dark:bg-white/10 mb-6" />
                <ul className="space-y-3.5 text-xs sm:text-[13px] text-text-muted dark:text-gray-300 font-light leading-relaxed">
                  <li className="flex gap-3 items-start">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>Segurança e qualidade nas entregas com clareza arquitetural e rigor técnico.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                    <span>Comprometimento com a evolução constante de processos e metodologias.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 3: Inovação */}
            <div className="group relative flex flex-col justify-between bg-surface-2 dark:bg-[#181b22] border border-slate-200 dark:border-white/10 hover:border-secondary/50 dark:hover:border-secondary/60 rounded-[8px] p-7 sm:p-8 lg:p-9 shadow-sm hover:shadow-xl dark:shadow-black/60 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 left-0 right-0 h-1 bg-secondary/0 group-hover:bg-secondary transition-all duration-300 rounded-t-[8px]" />
              <div>
                <div className="w-14 h-14 rounded-[8px] bg-secondary/10 text-secondary flex items-center justify-center mb-6 shadow-xs group-hover:scale-105 transition-transform">
                  <Zap size={26} strokeWidth={1.75} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-text-main dark:text-white mb-2">
                  Inovação
                </h3>
                <p className="text-xs sm:text-[13px] text-secondary font-medium mb-5 min-h-[36px] flex items-center">
                  Solução, Tecnologia, Transformação Digital e Aprendizado Contínuo.
                </p>
                <div className="h-px w-full bg-slate-200 dark:bg-white/10 mb-6" />
                <ul className="space-y-3.5 text-xs sm:text-[13px] text-text-muted dark:text-gray-300 font-light leading-relaxed">
                  <li className="flex gap-3 items-start">
                    <CheckCircle2 size={16} className="text-secondary mt-0.5 shrink-0" />
                    <span>Inovação contínua como alicerce do nosso modelo de engenharia de software.</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <CheckCircle2 size={16} className="text-secondary mt-0.5 shrink-0" />
                    <span>Buscamos superar expectativas dos clientes com soluções criativas e escaláveis.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2 & 3. Selos e Premiações */}
      <section id="premiacoes" className="py-16 md:py-20 bg-surface-2 dark:bg-[#13161c] border-y border-slate-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-display text-text-main dark:text-white mb-10">
            Uma das melhores empresas para trabalhar no Brasil
          </h2>
          
          <div className="flex overflow-x-auto no-scrollbar justify-center items-center gap-6 md:gap-10 pb-4">
            <div className="bg-white p-3 sm:p-4 rounded-[8px] border border-slate-200/80 dark:border-white/20 shadow-sm flex items-center justify-center shrink-0 min-w-[140px] h-[100px] sm:h-[120px] md:h-[136px]">
              <img 
                src="https://www.atra.com.br/wp-content/uploads/2025/08/GPTW-Selos-site.jpg" 
                alt="Great Place To Work" 
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="max-h-full max-w-[160px] object-contain shrink-0" 
              />
            </div>
            
            <div className="bg-white p-3 sm:p-4 rounded-[8px] border border-slate-200/80 dark:border-white/20 shadow-sm flex items-center justify-center shrink-0 min-w-[140px] h-[100px] sm:h-[120px] md:h-[136px]">
              <img 
                src={liptSealImage} 
                alt="Selo LIPT 2026 - Lugares Incríveis Para Trabalhar" 
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="max-h-full max-w-[160px] object-contain shrink-0" 
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (target.src !== '/imgs/lipt-2026.png' && target.src !== '/imgs/LIPT%202026.png') {
                    target.src = '/imgs/lipt-2026.png';
                  }
                }}
              />
            </div>

            <div className="bg-white p-3 sm:p-4 rounded-[8px] border border-slate-200/80 dark:border-white/20 shadow-sm flex items-center justify-center shrink-0 min-w-[140px] h-[100px] sm:h-[120px] md:h-[136px]">
              <img 
                src="https://www.atra.com.br/wp-content/uploads/2024/08/GPTW-Selos-site-1-768x768.png" 
                alt="FEEx" 
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="max-h-full max-w-[160px] object-contain shrink-0" 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Processo Seletivo */}
      <section id="processo-seletivo" className="py-20 md:py-24 bg-surface-1 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Transparência</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-4">
              Como funciona nosso processo seletivo
            </h2>
            <p className="text-text-muted text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-light leading-relaxed">
              Um processo estruturado e transparente, focado em conhecer o seu potencial e apresentar nossa cultura.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Candidate-se à vaga",
                content: "Envie sua inscrição na vaga que melhor combina com seu perfil ou cadastre seu currículo no nosso banco de talentos."
              },
              {
                title: "Etapa RH & Cultura",
                content: "Bate-papo online para alinhamento de expectativas, trajetória e identificação com o Jeito ATRA de ser."
              },
              {
                title: "Etapa Técnica",
                content: "Entrevista prática com especialistas para avaliar hard skills, arquitetura e discutir soluções reais de dados."
              },
              {
                title: "Etapa Final & Proposta",
                content: "Apresentação ao gestor da squad e envio da proposta formal de contratação com todos os benefícios."
              }
            ].map((step, idx) => (
              <div key={idx} className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-6 shadow-sm flex flex-col justify-between group hover:border-primary/30 transition-colors">
                <div>
                  <div className="w-10 h-10 rounded-[6px] bg-primary/10 text-primary font-bold text-sm flex items-center justify-center mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-text-main mb-2">{step.title}</h3>
                  <p className="text-xs text-text-muted font-light leading-relaxed">
                    {step.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trabalhe Conosco (Vagas + Form) */}
      <section id="trabalhe-conosco" className="py-20 md:py-24 bg-surface-2 border-t border-slate-200 dark:border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Oportunidades</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-4">
              Vagas Abertas
            </h2>
            <p className="text-text-muted text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-light">
              Venha desenvolver sua carreira e fazer parte do nosso time de elite.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto mb-20">
            {[
              "Engenheiro(a) de Dados SR",
              "Engenheiro(a) de Dados SR - Azure / Databricks",
              "Trainee Engenheiro de Data Analytics & AI",
              "Engenheiro(a) de Dados SR (DBT Core e GCP)",
              "Engenheiro Analytics Sr",
              "Engenheiro(a) de Dados - Looker Platform / LookML"
            ].map((vaga, idx) => (
              <a 
                key={idx}
                href="#banco-talentos"
                className="group flex items-center justify-between p-5 bg-surface-1 border border-slate-200 dark:border-white/5 rounded-[6px] hover:border-primary/40 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Briefcase size={18} />
                  </div>
                  <span className="font-semibold text-text-main text-xs sm:text-sm group-hover:text-primary transition-colors">
                    {vaga}
                  </span>
                </div>
                <ArrowRight size={16} className="text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </a>
            ))}
          </div>

          {/* Banco de Talentos Form */}
          <div id="banco-talentos" className="bg-surface-1 border border-slate-200 dark:border-white/5 rounded-[6px] shadow-xl overflow-hidden max-w-5xl mx-auto flex flex-col lg:flex-row relative">
            <div className="lg:w-5/12 bg-gradient-to-br from-[#12151c] via-[#1a2130] to-[#0e1015] p-8 lg:p-12 text-white flex flex-col justify-center relative">
              <TechCornerBraces color="blue" position="top-left" size={14} />
              <div className="relative z-10">
                <span className="text-primary font-bold uppercase tracking-wider text-xs mb-3 block">Banco de Talentos</span>
                <h3 className="text-2xl lg:text-3xl font-bold font-display leading-tight mb-4">
                  Não encontrou a <span className="text-secondary">vaga ideal?</span>
                </h3>
                <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-6 font-light">
                  Deixe seu currículo conosco. Estamos sempre em busca de profissionais incríveis para fazer parte do nosso time.
                </p>
                
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-[6px]">
                  <Upload size={20} className="text-primary shrink-0" />
                  <p className="text-xs text-white/80 font-light leading-relaxed">Nossa equipe de recrutamento avaliará seu perfil com atenção.</p>
                </div>
              </div>
            </div>

            <div className="lg:w-7/12 p-8 lg:p-12 flex flex-col justify-center">
              {isSubmitted ? (
                <div className="p-6 rounded-[6px] bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                    <CheckCircle2 size={24} />
                  </div>
                  <h4 className="text-base font-bold text-text-main">Candidatura Recebida!</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Agradecemos o interesse em fazer parte da ATRA. Nosso time de Gente & Gestão avaliará seu perfil e entrará em contato em breve.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs font-semibold text-primary hover:underline pt-2 cursor-pointer"
                  >
                    Enviar outro currículo
                  </button>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }} className="space-y-3.5">
                  <input 
                    type="text" 
                    required
                    placeholder="Nome Completo *" 
                    className="w-full bg-surface-2 border border-slate-200 dark:border-white/10 rounded-[6px] px-3.5 py-2.5 text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" 
                  />
                  <input 
                    type="email" 
                    required
                    placeholder="E-mail Corporativo/Pessoal *" 
                    className="w-full bg-surface-2 border border-slate-200 dark:border-white/10 rounded-[6px] px-3.5 py-2.5 text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" 
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <input 
                      type="text" 
                      placeholder="LinkedIn" 
                      className="w-full bg-surface-2 border border-slate-200 dark:border-white/10 rounded-[6px] px-3.5 py-2.5 text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" 
                    />
                    <input 
                      type="tel" 
                      placeholder="Telefone / WhatsApp" 
                      className="w-full bg-surface-2 border border-slate-200 dark:border-white/10 rounded-[6px] px-3.5 py-2.5 text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <select className="w-full bg-surface-2 border border-slate-200 dark:border-white/10 rounded-[6px] px-3.5 py-2.5 text-xs text-text-main focus:outline-none focus:border-primary transition-colors">
                      <option value="">Área de atuação</option>
                      <option value="dados">Engenharia de Dados</option>
                      <option value="ai">Inteligência Artificial / ML</option>
                      <option value="analytics">Analytics & BI</option>
                      <option value="cloud">Arquitetura Cloud</option>
                      <option value="outros">Outros</option>
                    </select>

                    <select className="w-full bg-surface-2 border border-slate-200 dark:border-white/10 rounded-[6px] px-3.5 py-2.5 text-xs text-text-main focus:outline-none focus:border-primary transition-colors">
                      <option value="">Senioridade</option>
                      <option value="jr">Júnior</option>
                      <option value="pl">Pleno</option>
                      <option value="sr">Sênior</option>
                      <option value="lead">Lead / Principal</option>
                      <option value="trainee">Trainee</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-7 py-3 rounded-[6px] text-xs font-semibold transition-all cursor-pointer shadow-md shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Send size={13} />
                      <span>Enviar Candidatura</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Vantagens */}
      <section id="vantagens" className="py-20 md:py-24 bg-surface-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Benefícios</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main">
              Vantagens de ser ATRA
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: GraduationCap, title: "Desenvolvimento Contínuo", desc: "Acesso a treinamentos, certificações e workshops para seu crescimento profissional." },
              { icon: Heart, title: "Ambiente Acolhedor", desc: "Cultura focada nas pessoas, promovendo diversidade, equidade e respeito mútuo." },
              { icon: Zap, title: "Inovação Diária", desc: "Trabalhe com grandes marcas e desafios complexos usando as tecnologias líderes do mercado." },
              { icon: Coffee, title: "Flexibilidade & Bem-estar", desc: "Pacote de benefícios completo e suporte à flexibilidade de rotina." }
            ].map((v, i) => (
              <div key={i} className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-6 text-center group hover:border-primary/30 transition-all">
                <div className="w-12 h-12 mx-auto bg-primary/10 text-primary rounded-[6px] flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
                  <v.icon size={22} />
                </div>
                <h3 className="font-bold text-text-main text-sm mb-2">{v.title}</h3>
                <p className="text-xs text-text-muted font-light leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Trainee */}
      <section id="trainee" className="py-20 md:py-24 bg-surface-2 border-t border-slate-200 dark:border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Futuro dos Dados</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-4">
              Programa de Trainee ATRA
            </h2>
            <p className="text-text-muted text-xs sm:text-sm md:text-base max-w-2xl mx-auto font-light">
              Venha começar sua carreira em Engenharia de Data Analytics & AI com acompanhamento próximo de arquitetos mentores.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-center mb-16">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-text-main leading-tight">
                Mentoria e imersão prática do primeiro ao último dia.
              </h3>
              <p className="text-xs sm:text-sm text-text-muted font-light leading-relaxed">
                Nosso programa oferece trilhas técnicas em Python, SQL, Databricks, Google Cloud e boas práticas de engenharia de software voltadas a dados.
              </p>
              <div className="p-4 rounded-[6px] bg-surface-1 border border-slate-200 dark:border-white/5 text-xs text-text-muted font-light">
                <strong className="text-primary font-semibold block mb-1">Status do Ciclo Atual:</strong>
                Inscrições para a próxima turma abrirão em breve. Cadastre seu currículo no banco de talentos para ser notificado com prioridade.
              </div>
            </div>
            <div className="aspect-[16/10] rounded-[6px] overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Equipe colaborando" 
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Careers;
