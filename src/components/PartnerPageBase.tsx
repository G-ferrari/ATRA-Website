import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Bot, Award, Database, Cloud, Server, Code, Users, Headset, Shield, BarChart, Sparkles } from 'lucide-react';
import { BackgroundDecorations } from '@/components/Decorations';
import { Link } from 'react-router-dom';
import { GlowCard } from '@/components/ui/spotlight-card';
import { TechCornerBraces } from '@/components/TechDetails';
import { StatusBadge, MetricChip } from '@/components/ui/badge-status';

export interface PartnerBadge {
  id: string;
  topText?: string;
  title: string;
  highlightText?: string;
  logoUrl?: string;
}

export interface PartnerService {
  text: string;
}

export interface PartnerSpecialization {
  name: string;
}

export interface PartnerPageBaseProps {
  partnerName: string;
  titleText: React.ReactNode;
  subtitleText: string;
  partnerLogoUrl: string;
  
  badges: PartnerBadge[];
  
  // Achievements
  achievementsTitle: string;
  achievementsP1: string;
  achievementsP2?: string;
  achievementsImage: string;
  achievementsImageLabel?: string;
  
  // Services
  servicesTitle: string;
  servicesDesc: string;
  servicesList: PartnerService[];
  
  // Specializations
  specTitle: string;
  specDesc: string;
  specList: PartnerSpecialization[];
  
  // CTA
  contactTitle: string;
  contactDesc: string;
  contactUsText: string;
  contactUsLink: string;
  aiAgentText: string;
  aiAgentLink: string;
}

const getSpecIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('data') || lower.includes('analytics')) return BarChart;
  if (lower.includes('cloud')) return Cloud;
  if (lower.includes('infrastructure')) return Server;
  if (lower.includes('development') || lower.includes('app')) return Code;
  if (lower.includes('workplace') || lower.includes('user')) return Users;
  if (lower.includes('managed') || lower.includes('support')) return Headset;
  if (lower.includes('security')) return Shield;
  return Award;
};

export const PartnerPageBase: React.FC<PartnerPageBaseProps> = ({
  partnerName,
  titleText,
  subtitleText,
  partnerLogoUrl,
  badges,
  achievementsTitle,
  achievementsP1,
  achievementsP2,
  achievementsImage,
  achievementsImageLabel,
  servicesTitle,
  servicesDesc,
  servicesList,
  specTitle,
  specDesc,
  specList,
  contactTitle,
  contactDesc,
  contactUsText,
  contactUsLink,
  aiAgentText,
  aiAgentLink,
}) => {
  return (
    <main className="pt-24 md:pt-36 pb-12 bg-surface-1 text-text-main">
      {/* Hero Section */}
      <section className="relative pt-4 pb-12 overflow-hidden px-3 sm:px-6">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="rounded-[6px] bg-gradient-to-br from-[#12151c] via-[#1a2130] to-[#0e1015] border border-white/5 text-white p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden vort-dot-grid text-center">
            <TechCornerBraces color="blue" position="top-left" size={16} />
            <TechCornerBraces color="orange" position="bottom-right" size={16} />

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto relative z-10"
            >
              <div className="flex items-center justify-center gap-2 mb-4">
                <StatusBadge 
                  label="Parceria Estratégica" 
                  variant="primary" 
                  size="sm" 
                  pulse={true} 
                  icon={<Sparkles size={12} />} 
                />
                <MetricChip label={partnerName} variant="neutral" size="sm" />
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-display text-white mb-4 tracking-tight leading-tight">
                {titleText}
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-white/70 mb-8 font-light leading-relaxed max-w-2xl mx-auto">
                {subtitleText}
              </p>
            </motion.div>

            {/* Badges */}
            {badges.length > 0 && (
              <div className="overflow-x-auto -mx-4 px-4 no-scrollbar mb-8 relative z-10">
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="flex justify-start md:justify-center gap-3 w-max md:w-auto mx-auto pb-2"
                >
                  {badges.map((badge) => (
                    <div key={badge.id} className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-[6px] shadow-sm flex flex-col items-center justify-center min-w-[140px] shrink-0">
                      <img src={badge.logoUrl || partnerLogoUrl} alt={partnerName} className="h-6 mb-2 pointer-events-none object-contain brightness-110" />
                      {badge.topText && <div className="text-[9px] font-bold text-white/50 mb-0.5 uppercase tracking-wider">{badge.topText}</div>}
                      <div className="text-xs font-semibold text-white leading-tight text-center whitespace-pre-line">{badge.title}</div>
                      {badge.highlightText && <div className="mt-2 text-primary text-xs font-bold">{badge.highlightText}</div>}
                    </div>
                  ))}
                </motion.div>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="relative z-10"
            >
              <a href="#about" className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-[6px] text-xs sm:text-sm font-semibold transition-all shadow-md shadow-primary/20">
                Saiba Mais Sobre a Parceria
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Achievements (About) Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        id="about" 
        className="py-16 md:py-20 bg-surface-1"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Trajetória Conjunta</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-4 leading-tight">
                {achievementsTitle}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-text-muted mb-4 leading-relaxed font-light whitespace-pre-line">
                {achievementsP1}
              </p>
              {achievementsP2 && (
                <p className="text-xs sm:text-sm md:text-base text-text-muted mb-6 leading-relaxed font-light whitespace-pre-line">
                  {achievementsP2}
                </p>
              )}
              <a href="#services" className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-[6px] text-xs sm:text-sm font-semibold transition-all shadow-md shadow-primary/20">
                Conheça nossos serviços
              </a>
            </div>
            
            <div className="relative">
              <img 
                src={achievementsImage} 
                alt={`${partnerName} achievements`} 
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="relative rounded-[6px] shadow-xl object-cover w-full h-[360px] md:h-[420px] border border-slate-200 dark:border-white/10"
              />
              <div className="absolute bottom-4 left-4 bg-surface-1/95 backdrop-blur-md p-3.5 rounded-[6px] shadow-xl flex items-center gap-3 border border-slate-200 dark:border-white/10">
                <img src={partnerLogoUrl} alt={partnerName} className="h-7 w-auto object-contain max-w-[120px]" />
                <div className="text-xs font-bold text-text-main">{achievementsImageLabel || "Partner"}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        id="services" 
        className="py-16 md:py-20 bg-surface-2 border-y border-slate-200 dark:border-white/5 text-text-main relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            <div>
              <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Capacidades</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-4 leading-tight">
                {servicesTitle}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-text-muted mb-6 leading-relaxed font-light whitespace-pre-line">
                {servicesDesc}
              </p>
              <a href={contactUsLink} className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-[6px] text-xs sm:text-sm font-semibold transition-all shadow-md shadow-primary/20">
                {contactUsText}
              </a>
            </div>
            
            <div className="space-y-3">
              {servicesList.map((service, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-surface-1 border border-slate-200 dark:border-white/5 p-4 rounded-[6px] shadow-xs">
                  <CheckCircle2 className="text-primary shrink-0 mt-0.5" size={16} />
                  <p className="text-text-main text-xs sm:text-sm font-light leading-relaxed">{service.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Specializations Section */}
      {specList.length > 0 && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="py-16 md:py-20 bg-surface-1"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
              <div>
                <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">Especializações Técnicas</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main mb-4 leading-tight">
                  {specTitle}
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-text-muted mb-6 leading-relaxed font-light whitespace-pre-line">
                  {specDesc}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                  {specList.map((spec, idx) => {
                    const SpecIcon = getSpecIcon(spec.name);
                    return (
                      <div 
                        key={idx}
                        className="group flex items-center gap-3 p-3 bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] shadow-xs hover:border-primary/40 transition-all duration-300"
                      >
                        <div className="w-8 h-8 rounded-[6px] bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                          <SpecIcon size={16} />
                        </div>
                        <span className="font-semibold text-text-main text-xs group-hover:text-primary transition-colors leading-tight">
                          {spec.name}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <a href={contactUsLink} className="inline-flex items-center gap-2 text-primary font-semibold text-xs sm:text-sm hover:underline group">
                  <span>Fale com um especialista {partnerName}</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              <div className="relative">
                <div className="bg-surface-2 border border-slate-200 dark:border-white/5 p-6 rounded-[6px] shadow-sm flex items-center justify-center min-h-[320px]">
                  <div className="grid grid-cols-2 gap-3 relative w-full max-w-sm mx-auto">
                    {specList.map((spec, idx) => (
                      <div key={idx} className="bg-surface-1 border border-slate-200 dark:border-white/5 p-4 rounded-[6px] aspect-square flex flex-col items-center justify-center text-center shadow-xs hover:border-primary/40 transition-all">
                        <img src={partnerLogoUrl} alt={partnerName} className="h-5 mb-2 object-contain" />
                        <div className="text-[9px] font-bold text-primary uppercase tracking-wider mb-1">Especialização</div>
                        <div className="text-xs font-semibold text-text-main leading-tight line-clamp-2">{spec.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Contact CTA */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="py-16 md:py-20 bg-surface-1 relative overflow-hidden px-3 sm:px-6"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="rounded-[6px] bg-gradient-to-br from-[#12151c] via-[#1a2130] to-[#0e1015] border border-white/5 text-white p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden vort-dot-grid text-center">
            <TechCornerBraces color="blue" position="top-left" size={14} />
            <TechCornerBraces color="orange" position="bottom-right" size={14} />

            <div className="max-w-3xl mx-auto relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display text-white mb-3 leading-tight">
                {contactTitle}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-white/70 mb-8 font-light leading-relaxed whitespace-pre-line max-w-xl mx-auto">
                {contactDesc}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to={contactUsLink} className="w-full sm:w-auto inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white px-6 py-2.5 rounded-[6px] text-xs sm:text-sm font-semibold transition-all shadow-md shadow-primary/20">
                  {contactUsText}
                </Link>
                <Link to={aiAgentLink} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-2.5 rounded-[6px] text-xs sm:text-sm font-medium transition-all">
                  <Bot size={16} />
                  <span>{aiAgentText}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  );
};
