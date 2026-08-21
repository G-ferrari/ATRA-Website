import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useTranslation, Trans } from 'react-i18next';
import { Menu, X, ArrowRight, ArrowUpRight, Linkedin, Instagram, Youtube, Phone, Mail, MapPin, ChevronDown, ChevronRight, ChevronLeft, Globe, Clock, Users, Award, Target, Trophy, Briefcase, Sun, Moon, Quote, Star, ShieldCheck, CheckCircle2, TrendingUp, Sparkles, Cpu, Zap, SlidersHorizontal, BookOpen, FileText, Building2, Landmark, UserCheck, Handshake, Plus, Mic, AudioLines } from 'lucide-react';
import { motion, AnimatePresence, useInView, animate, useMotionValue, useTransform, useAnimationFrame, useMotionTemplate } from 'motion/react';
import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { BackgroundDecorations, RoundedDiamond, HomeParallaxDecorations } from '@/components/Decorations';
import { SmoothScroll } from '@/components/SmoothScroll';
import { congelado } from '@/lib/e2e';

// Lazy loading secondary pages for optimal bundle size and instant initial load performance
const Glossary = lazy(() => import('@/pages/Glossary'));
const Consultants = lazy(() => import('@/pages/Consultants'));
const Insights = lazy(() => import('@/pages/Insights'));
const PartnerGoogleCloud = lazy(() => import('@/pages/PartnerGoogleCloud'));
const SolutionAI = lazy(() => import('@/pages/SolutionAI'));
const Chat = lazy(() => import('@/pages/Chat'));
const DesignSystem = lazy(() => import('@/pages/DesignSystem'));
const Careers = lazy(() => import('@/pages/Careers'));
const SuccessStories = lazy(() => import('@/pages/SuccessStories'));
const Reports = lazy(() => import('@/pages/Reports'));
const Blog = lazy(() => import('@/pages/Blog'));
const Webinars = lazy(() => import('@/pages/Webinars'));
const Ebooks = lazy(() => import('@/pages/Ebooks'));
const About = lazy(() => import('@/pages/About'));
const MarketplaceGovernance = lazy(() => import('@/pages/cases/MarketplaceGovernance'));
const LegacyMigration = lazy(() => import('@/pages/cases/LegacyMigration'));
const RiskEfficiency = lazy(() => import('@/pages/cases/RiskEfficiency'));
const StrategicDashboards = lazy(() => import('@/pages/cases/StrategicDashboards'));
import ScrollToTop from '@/components/ScrollToTop';
import { GlowCard } from '@/components/ui/spotlight-card';
import LogoCloudSwap, { LogoEntry } from '@/components/ui/logo-clouds';
import { TechHorizontalLine, TechVerticalLine, TechCornerBraces, TechSectionBoundary } from '@/components/TechDetails';
import AetherFlowHero from '@/components/aether-flow-hero';

import caseMarketplaceGov from '@/assets/images/case_marketplace_gov_1785848321737.jpg';
import caseLegacyMigration from '@/assets/images/case_legacy_migration_1785848338358.jpg';
import caseRiskEfficiency from '@/assets/images/case_risk_efficiency_1785848355083.jpg';
import caseStrategicDashboards from '@/assets/images/case_strategic_dashboards_1785848371031.jpg';
import liptSealImage from '@/assets/images/lipt-2026.png';

// --- Data ---

const solutionsData = [
  {
    title: "Inovação & IA",
    sections: [
      {
        title: "Inteligência Artificial & IA Generativa",
        icon: "fluent:brain-circuit-24-regular",
        link: "/solucoes/inteligencia-artificial",
        desc: "Soluções de IA Generativa, agentes conversacionais, modelos preditivos e extração inteligente de documentos com governança e uso responsável."
      },
      {
        title: "Apps & Soluções Digitais",
        icon: "fluent:app-generic-24-regular",
        link: "#",
        desc: "Aplicações web e mobile integradas ao Lakehouse e modernização de sistemas legados para colocar inteligência e dados na ponta da decisão."
      }
    ]
  },
  {
    title: "Dados, BI & Advanced Analytics",
    sections: [
      {
        title: "Engenharia de Dados & Cloud",
        icon: "fluent:database-24-regular",
        link: "#",
        desc: "Arquiteturas Lakehouse modernas em nuvem com pipelines de alta performance para unificar dados e suportar BI, analytics e IA."
      },
      {
        title: "Business Intelligence & Advanced Analytics",
        icon: "fluent:chart-person-24-regular",
        link: "#",
        desc: "Dashboards executivos, análises preditivas e estruturas de Self-Service BI para transformar dados operacionais em decisões estratégicas."
      }
    ]
  },
  {
    title: "Governança & Cultura",
    sections: [
      {
        title: "Governança de Dados & FinOps",
        icon: "fluent:shield-lock-24-regular",
        link: "#",
        desc: "Catálogo, conformidade e qualidade de dados alinhados a práticas de FinOps para otimização contínua dos custos em nuvem."
      },
      {
        title: "Cultura de Dados (Enablement)",
        icon: "fluent:people-community-24-regular",
        link: "#",
        desc: "Programas de alfabetização em dados e IA (Data Literacy) para capacitar times, acelerar a adoção e maximizar o ROI de tecnologia."
      }
    ]
  }
];

const insightsData = [
  { title: "Cases de Sucesso", icon: "fluent:star-24-regular", desc: "Histórias reais de transformação digital.", link: "/cases-de-sucesso" },
  { title: "Relatórios", icon: "fluent:document-text-24-regular", desc: "Análises profundas do mercado de dados.", link: "/relatorios" },
  { title: "Blog", icon: "fluent:news-24-regular", desc: "Artigos, tendências e novidades técnicas.", link: "/blog" },
  { title: "Webinars", icon: "fluent:video-clip-24-regular", desc: "Conteúdo em vídeo com nossos especialistas.", link: "/webinars" },
  { title: "Ebooks", icon: "fluent:book-24-regular", desc: "Guias completos para sua jornada de dados.", link: "/ebooks" },
];

const partnersDropdownData = [
  { name: "Google Cloud", url: "/imagens/Google_Cloud_Platform-Logo.wine_-2048x1365-02fd56.png", desc: "Nuvem pública líder em dados e IA.", link: "/parceiros/google-cloud" },
  { name: "Denodo", url: "/imagens/denodo-tranparent-logo-01f5ab.png", desc: "Virtualização de dados para agilidade.", link: "#" },
  { name: "BigID", url: "/imagens/Horizontal_BigID_Logo-2048x1072-925fa0.jpg", desc: "Descoberta e proteção de dados sensíveis.", link: "#" },
  { name: "Partner", url: "/imagens/image-removebg-preview-4-138596.png", desc: "Parceiro estratégico em tecnologia.", link: "#" },
  { name: "Azure", url: "/imagens/Microsoft_Azure-Logo.wine_-1536x1024-370d06.png", desc: "Plataforma de nuvem abrangente da Microsoft.", link: "#" },
  { name: "Atlan", url: "/imagens/Atlan-logo-full.svg_-6ccbc8.png", desc: "Catálogo de dados moderno e colaborativo.", link: "#" },
  { name: "IBM", url: "/imagens/logo-ibm-5a3ca7.png", desc: "Inovação em IA e nuvem híbrida.", link: "#" },
  { name: "Salesforce Informatica", url: "/imgs/salesforceinformatica.png", desc: "Gestão de dados em nuvem líder de mercado.", link: "#" },
  { name: "Databricks", url: "/imagens/Databricks_Logo2-1536x813-aa2d3d.png", desc: "Lakehouse unificado para dados e IA.", link: "#" }
];



// --- Components ---

const PartnersDropdown = ({ activeMenu, setActiveMenu }: { activeMenu: string | null, setActiveMenu: (menu: string | null) => void }) => {
  const { t } = useTranslation();
  if (activeMenu !== 'Parceiros') return null;

  const translatedPartners = t('megaMenu.partners', { returnObjects: true }) as any[];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-[-1px] w-[calc(100%+2px)] bg-surface-2 rounded-b-lg shadow-2xl overflow-hidden z-50 p-8"
      onMouseEnter={() => setActiveMenu('Parceiros')}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="grid grid-cols-5 gap-4">
        {partnersDropdownData.map((item, index) => (
          <Link 
            key={index} 
            to={item.link} 
            className="flex flex-col items-center text-center gap-3 p-5 rounded-md bg-surface-2 hover:bg-slate-100 dark:hover:bg-slate-800/60  transition-all group shadow-xs"
          >
            <div className="w-16 h-12 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-200">
              <img src={item.url} alt={item.name} loading="lazy" decoding="async" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="text-xs font-bold text-text-main mb-1 uppercase tracking-wide">{translatedPartners[index]?.name || item.name}</div>
              <div className="text-[11px] text-text-muted leading-relaxed line-clamp-2">{translatedPartners[index]?.desc || item.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

const InsightsDropdown = ({ activeMenu, setActiveMenu }: { activeMenu: string | null, setActiveMenu: (menu: string | null) => void }) => {
  const { t } = useTranslation();
  if (activeMenu !== 'Insights') return null;

  const translatedInsights = t('megaMenu.insights', { returnObjects: true }) as any[];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-[-1px] w-[calc(100%+2px)] bg-surface-2 rounded-b-lg shadow-2xl overflow-hidden z-50 p-8"
      onMouseEnter={() => setActiveMenu('Insights')}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="grid grid-cols-5 gap-4">
        {insightsData.map((item, index) => (
          <Link 
            key={index} 
            to={item.link} 
            className="flex flex-col items-center text-center gap-3 p-5 rounded-md bg-surface-2 hover:bg-slate-100 dark:hover:bg-slate-800/60  transition-all group shadow-xs"
          >
            <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-200">
              <Icon icon={item.icon} width="24" height="24" />
            </div>
            <div>
              <div className="text-xs font-bold text-text-main mb-1 uppercase tracking-wide">{translatedInsights[index]?.title || item.title}</div>
              <div className="text-[11px] text-text-muted leading-relaxed line-clamp-2">{translatedInsights[index]?.desc || item.desc}</div>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};



const MegaMenu = ({ activeMenu, setActiveMenu }: { activeMenu: string | null, setActiveMenu: (menu: string | null) => void }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  if (activeMenu !== 'Soluções') return null;

  const translatedSolutions = t('megaMenu.solutions', { returnObjects: true }) as any[];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-[-1px] w-[calc(100%+2px)] bg-surface-2 rounded-b-lg shadow-2xl overflow-hidden z-50 flex"
      onMouseEnter={() => setActiveMenu('Soluções')}
      onMouseLeave={() => setActiveMenu(null)}
    >
      {/* Sidebar */}
      <div className="w-1/4 bg-surface-2 p-3">
        {solutionsData.map((category, index) => (
          <button
            key={index}
            className={cn(
              "w-full text-left px-4 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-between group cursor-pointer mb-1 ",
              activeTab === index 
                ? "bg-primary/10 text-primary border-primary/20" 
                : "text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-text-main"
            )}
            onMouseEnter={() => setActiveTab(index)}
          >
            {translatedSolutions[index]?.title || category.title}
            {activeTab === index && <ChevronRight size={16} className="text-primary" />}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="w-3/4 p-8 bg-surface-2 min-h-[420px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-5"
          >
            {solutionsData[activeTab].sections.map((section, idx) => {
              const translatedSection = translatedSolutions[activeTab]?.sections[idx];
              return (
                <Link 
                  key={idx} 
                  to={section.link || "#"}
                  onClick={() => setActiveMenu(null)}
                  className="flex flex-col p-5 rounded-md bg-surface-2 hover:bg-slate-100 dark:hover:bg-slate-800/60  transition-all hover:shadow-lg group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon icon={section.icon} width="20" height="20" />
                    </div>
                    <h4 className="text-text-main font-bold text-sm leading-tight group-hover:text-primary transition-colors">
                      {translatedSection?.title || section.title}
                    </h4>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed group-hover:text-text-main/90 transition-colors">
                    {translatedSection?.desc || section.desc}
                  </p>
                </Link>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSubMenu, setActiveMobileSubMenu] = useState<string | null>(null);
  const [activeDesktopCategory, setActiveDesktopCategory] = useState<string>('Soluções');
  const [activeDesktopSubcategory, setActiveDesktopSubcategory] = useState<number>(0);

  const toggleMobileSubMenu = (menu: string) => {
    setActiveMobileSubMenu(activeMobileSubMenu === menu ? null : menu);
  };
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isInternalMenuSticky, setIsInternalMenuSticky] = useState(false);

  useEffect(() => {
    const handleInternalMenuSticky = (e: any) => {
      setIsInternalMenuSticky(e.detail);
    };
    window.addEventListener('internalMenuSticky', handleInternalMenuSticky);
    return () => window.removeEventListener('internalMenuSticky', handleInternalMenuSticky);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-40 transition-all duration-500 flex flex-col items-center pointer-events-none",
      isScrolled ? "px-4 pt-2 md:pt-3" : "px-4 pt-4 md:pt-5"
    )}>
      <div 
        className={cn(
          "pointer-events-auto w-full max-w-7xl mx-auto transition-all duration-500 flex flex-col px-6 md:px-8 relative z-40",
          isMobileMenuOpen 
            ? "rounded-[6px] bg-surface-2 shadow-2xl py-5 text-text-main"
            : "rounded-[6px]",
          isInternalMenuSticky ? "shadow-none" : "",
          isScrolled 
            ? "bg-surface-2 shadow-md py-2 md:py-2 text-text-main"
            : (!isMobileMenuOpen ? "bg-transparent py-3 md:py-3 text-text-main dark:text-white" : "")
        )}
        onMouseLeave={() => {
          setIsMobileMenuOpen(false);
          setActiveMenu(null);
        }}
      >
        {/* Top Row: Logo, Menu Categories / Toggle Button, Fale Conosco */}
        <div className="w-full flex items-center justify-between relative">
          <Link to="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
            <img 
              src="/imagens/atra_horizontal_cor-2048x1134-ba220b.png" 
              alt="ATRA Logo" 
              decoding="async"
              fetchPriority="high"
              className="h-10 md:h-12 w-auto object-contain transition-all"
            />
          </Link>

          {/* Centered Menu Area with AnimatePresence for seamless transitions */}
          <div className="flex items-center absolute left-1/2 -translate-x-1/2 h-full pointer-events-auto">
            <AnimatePresence mode="wait">
              {!isMobileMenuOpen ? (
                <motion.button 
                  key="menu-closed"
                  initial={{ opacity: 0, scale: 0.9, y: -2 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 2 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className={cn("p-1.5 px-3.5 rounded-[6px] transition-all flex items-center gap-1.5 text-[13px] font-semibold tracking-normal cursor-pointer hover:scale-105 active:scale-95 bg-transparent",
                    isScrolled 
                      ? "text-text-main hover:opacity-80" 
                      : "text-text-main dark:text-white hover:opacity-80"
                  )}
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <span>Menu</span> <Menu size={14} className="text-primary animate-pulse" />
                </motion.button>
              ) : (
                <motion.div 
                  key="menu-open-cats"
                  initial={{ opacity: 0, scale: 0.98, y: 4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -4 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="hidden md:flex items-center gap-3.5"
                >
                  {/* ⚠️ "Segmentos" é a 8ª categoria, e não existia no desenho original.
                      Entrou junto com a rota `/segmentos` do site novo: as 8 verticais
                      existem no WordPress e o protótipo não as cobria. O gabarito da
                      regressão visual sai daqui, então acrescentar só do outro lado
                      faria a comparação medir a diferença em vez da regressão. */}
                  {['Soluções', 'Segmentos', 'Consultores', 'Insights', 'Parceiros', 'Carreiras', 'Sobre', 'Glossário'].map((item) => {
                    const label = item === 'Soluções' ? t('nav.solutions') : 
                                  item === 'Segmentos' ? t('nav.segments') : 
                                  item === 'Consultores' ? t('nav.consultants') : 
                                  item === 'Insights' ? t('nav.insights') : 
                                  item === 'Parceiros' ? t('nav.partners') : 
                                  item === 'Carreiras' ? t('nav.careers') : 
                                  item === 'Sobre' ? t('nav.about') : 
                                  item === 'Glossário' ? t('nav.glossary') : item;

                    const isSelected = activeDesktopCategory === item;
                    /* ⚠️ `/solucoes` e não `#`: a rota existe aqui (`:2636`) e serve a
                       página de IA. Apontava para `#` porque a categoria só abria o
                       painel, e o site novo herdou o link morto junto com o desenho.
                       Ligada dos dois lados na mesma mudança, senão o gabarito passaria
                       a medir a diferença.

                       Parceiros continua em `#`: lá não há índice de parceiros para
                       onde ir, nem aqui nem no site novo. */
                    const menuLink = item === 'Soluções' ? '/solucoes' :
                                     /* `#`, como Soluções e Parceiros: o protótipo não tem a
                                        página de segmentos — ela nasce no site novo. O rótulo
                                        existe aqui para o cabeçalho bater no gabarito, e um link
                                        para rota inexistente seria pior do que nenhum. */
                                     item === 'Segmentos' ? '#' :
                                     item === 'Consultores' ? '/consultores' :
                                     item === 'Insights' ? '/insights' :
                                     item === 'Parceiros' ? '#' :
                                     item === 'Carreiras' ? '/carreiras' :
                                     item === 'Sobre' ? '/sobre' :
                                     item === 'Glossário' ? '/glossario' : '#';

                    return (
                      <div key={item} className="relative py-1">
                        <Link
                          to={menuLink}
                          onClick={(e) => {
                            if (item === 'Segmentos' || item === 'Parceiros') {
                              e.preventDefault();
                            } else {
                              setIsMobileMenuOpen(false);
                            }
                          }}
                          onMouseEnter={() => {
                            setActiveDesktopCategory(item);
                          }}
                          className={cn(
                            "text-[13px] font-semibold transition-colors flex items-center gap-1 cursor-pointer relative pb-1 tracking-normal",
                            isSelected ? "text-primary font-bold" : "text-text-muted hover:text-text-main"
                          )}
                        >
                          <span>{label}</span>
                          <ChevronDown size={12} className={cn("transition-transform duration-300", isSelected ? "rotate-180 text-primary" : "text-text-muted")} />
                          
                          {/* Underline on selection/hover */}
                          {isSelected && (
                            <motion.div 
                              layoutId="desktopMenuUnderline"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-atra rounded-full"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                          )}
                        </Link>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right actions: Fale Conosco button */}
          <div className="flex items-center gap-2 lg:gap-4 pointer-events-auto">
            <Link 
              to="/#fale-conosco" 
              className="hidden lg:flex items-center gap-2 rounded-[6px] text-sm font-normal transition-all shadow-md hover:shadow-lg capitalize border border-primary text-primary hover:bg-primary/10 bg-transparent px-5 py-2.5 active:scale-95 cursor-pointer"
            >
              {t('nav.contact')} <ArrowRight size={16} />
            </Link>

            {/* Mobile-only toggle close button */}
            {isMobileMenuOpen && (
              <button 
                className="p-2 rounded-[6px] hover:bg-slate-100 dark:hover:bg-slate-800 text-text-main md:hidden cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Content Area for submenus and sub-submenus with height & opacity animation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="hidden md:block w-full mt-4 overflow-hidden border-t border-slate-100 dark:border-white/5 pt-4"
            >
              <AnimatePresence mode="wait">
              {/* activeDesktopCategory === 'Soluções' */}
              {activeDesktopCategory === 'Soluções' && (
                <motion.div
                  key="solucoes"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col w-full gap-4 pt-2"
                >
                  {/* Submenu level: Inovação & IA, Dados, BI & Advanced Analytics, Governança & Cultura */}
                  <div className="flex items-center gap-8 border-none pb-2">
                    {solutionsData.map((category, idx) => {
                      const translatedSolutions = t('megaMenu.solutions', { returnObjects: true }) as any[];
                      const title = translatedSolutions[idx]?.title || category.title;
                      const isSubSelected = activeDesktopSubcategory === idx;

                      return (
                        <button
                          key={idx}
                          onMouseEnter={() => setActiveDesktopSubcategory(idx)}
                          className={cn(
                            "text-xs font-normal transition-all relative pb-1 cursor-pointer capitalize",
                            isSubSelected ? "text-primary" : "text-text-muted hover:text-text-main"
                          )}
                        >
                          <span>{title}</span>
                          {isSubSelected && (
                            <motion.div 
                              layoutId="desktopSubmenuUnderline"
                              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Sub-submenu content level */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeDesktopSubcategory}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="grid grid-cols-2 gap-6 pt-2"
                    >
                      {solutionsData[activeDesktopSubcategory]?.sections.map((section, idx) => {
                        const translatedSolutions = t('megaMenu.solutions', { returnObjects: true }) as any[];
                        const translatedSection = translatedSolutions[activeDesktopSubcategory]?.sections[idx];

                        return (
                          <Link 
                            key={idx} 
                            to={section.link || "#"}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex flex-col p-4 rounded-lg bg-surface-1 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all hover:shadow-md group"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <Icon icon={section.icon} width="18" height="18" />
                              </div>
                              <h4 className="text-text-main font-normal text-xs leading-tight group-hover:text-primary transition-colors capitalize">
                                {translatedSection?.title || section.title}
                              </h4>
                            </div>
                            <p className="text-[11px] text-text-muted leading-relaxed group-hover:text-text-main/90 transition-colors">
                              {translatedSection?.desc || section.desc}
                            </p>
                          </Link>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}

              {/* activeDesktopCategory === 'Insights' */}
              {activeDesktopCategory === 'Insights' && (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-5 gap-3 pt-3"
                >
                  {(t('megaMenu.insights', { returnObjects: true }) as any[]).map((sub, idx) => (
                    <Link
                      key={idx}
                      to={insightsData[idx]?.link || "#"}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-surface-1 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all group shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition-all duration-200">
                        <Icon icon={insightsData[idx]?.icon || 'fluent:news-24-regular'} width="20" height="20" />
                      </div>
                      <div>
                        <div className="text-[11px] font-normal text-text-main mb-0.5 capitalize tracking-wide group-hover:text-primary transition-colors">{sub.title}</div>
                        <div className="text-[10px] text-text-muted leading-relaxed line-clamp-2">{sub.desc}</div>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}

              {/* activeDesktopCategory === 'Parceiros' */}
              {activeDesktopCategory === 'Parceiros' && (
                <motion.div
                  key="parceiros"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-5 gap-3 pt-3"
                >
                  {(t('megaMenu.partners', { returnObjects: true }) as any[]).map((sub, idx) => (
                    <Link
                      key={idx}
                      to={partnersDropdownData[idx]?.link || '#'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex flex-col items-center text-center gap-2 p-4 rounded-lg bg-surface-1 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all group shadow-sm"
                    >
                      <div className="w-14 h-10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-all duration-200">
                        <img src={partnersDropdownData[idx]?.url} alt={sub.name} loading="lazy" decoding="async" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <div className="text-[11px] font-normal text-text-main mb-0.5 capitalize tracking-wide group-hover:text-primary transition-colors">{sub.name}</div>
                        <div className="text-[10px] text-text-muted leading-relaxed line-clamp-2">{sub.desc}</div>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}

              {/* activeDesktopCategory === 'Consultores' */}
              {activeDesktopCategory === 'Consultores' && (
                <motion.div
                  key="consultores"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-12 gap-6 pt-3 text-left items-center"
                >
                  <div className="col-span-6 flex flex-col justify-center gap-4 pr-2">
                    <p className="text-xs text-text-muted leading-relaxed">
                      Conecte sua empresa a especialistas em IA, Engenharia de Dados e BI com atuação de ponta a ponta na jornada analítica.
                    </p>

                    <div className="space-y-3 pt-3 border-t border-slate-200/50 dark:border-white/5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
                          <Icon icon="fluent:checkbox-person-24-regular" width="18" height="18" />
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-text-main mb-0.5">Squads de IA & Dados</h5>
                          <p className="text-[10px] text-text-muted leading-relaxed">Equipes integradas e autogerenciáveis focadas na aceleração das entregas de valor.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500 shrink-0 mt-0.5">
                          <Icon icon="fluent:organization-24-regular" width="18" height="18" />
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-text-main mb-0.5">Consultoria Estratégica</h5>
                          <p className="text-[10px] text-text-muted leading-relaxed">Mapeamento de maturidade analítica e roadmap de tecnologia personalizado.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/consultores"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="col-span-6 flex flex-col justify-between p-5 rounded-[6px] bg-surface-1 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:shadow-md transition-all group cursor-pointer border border-transparent hover:border-primary/20 h-full"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-[6px] bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
                          <Icon icon="fluent:people-community-24-regular" width="18" height="18" />
                        </div>
                        <h4 className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors capitalize">Consultores Especializados</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2.5 text-[11px] text-text-muted my-3">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>Alocação Ágil & Sob Demanda</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>Especialistas Certificados</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>Foco em Resultados de Negócio</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>Suporte e Mentoria Técnica</span>
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:text-primary/80 transition-colors self-start mt-2">
                      Encontrar Consultores <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* activeDesktopCategory === 'Carreiras' */}
              {activeDesktopCategory === 'Carreiras' && (
                <motion.div
                  key="carreiras"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-12 gap-6 pt-3 text-left items-center"
                >
                  <div className="col-span-6 flex flex-col justify-center gap-4 pr-2">
                    <p className="text-xs text-text-muted leading-relaxed">
                      Faça parte de um time apaixonado por inovação, dados e IA. Na ATRA, acreditamos na colaboração, diversidade e excelência técnica para construir o futuro da tecnologia.
                    </p>

                    <div className="space-y-3 pt-3 border-t border-slate-200/50 dark:border-white/5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-[6px] bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0 mt-0.5">
                          <Icon icon="fluent:hat-graduation-24-regular" width="18" height="18" />
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-text-main mb-0.5">Capacitação Contínua</h5>
                          <p className="text-[10px] text-text-muted leading-relaxed">Suporte para certificações (AWS, GCP, Azure, Databricks) e treinamentos internos.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-[6px] bg-pink-500/10 flex items-center justify-center text-pink-500 shrink-0 mt-0.5">
                          <Icon icon="fluent:heart-24-regular" width="18" height="18" />
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-text-main mb-0.5">Bem-estar e Saúde</h5>
                          <p className="text-[10px] text-text-muted leading-relaxed">Benefícios flexíveis, foco em saúde mental e excelente equilíbrio vida-trabalho.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/carreiras"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="col-span-6 flex flex-col justify-between p-5 rounded-[6px] bg-surface-1 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:shadow-md transition-all group cursor-pointer border border-transparent hover:border-primary/20 h-full"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-[6px] bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
                          <Icon icon="fluent:briefcase-24-regular" width="18" height="18" />
                        </div>
                        <h4 className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors capitalize">Trabalhe Conosco</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2.5 text-[11px] text-text-muted my-3">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>Trabalho 100% Remoto</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>Cultura Horizontal</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>Plano de Carreira</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>Projetos Desafiadores</span>
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:text-primary/80 transition-colors self-start mt-2">
                      Ver Vagas Disponíveis <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* activeDesktopCategory === 'Sobre' */}
              {activeDesktopCategory === 'Sobre' && (
                <motion.div
                  key="sobre"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-12 gap-6 pt-3 text-left items-center"
                >
                  <div className="col-span-6 flex flex-col justify-center gap-4 pr-2">
                    <p className="text-xs text-text-muted leading-relaxed">
                      A ATRA aproxima a IA e a análise de dados das reais necessidades dos negócios, movida pela engenhosidade, ética e entregas de alto impacto.
                    </p>

                    <div className="space-y-3 pt-3 border-t border-slate-200/50 dark:border-white/5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-[6px] bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0 mt-0.5">
                          <Icon icon="fluent:shield-keyhole-24-regular" width="18" height="18" />
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-text-main mb-0.5">Segurança de Dados</h5>
                          <p className="text-[10px] text-text-muted leading-relaxed">Processos rigorosos em conformidade com as diretrizes da LGPD e melhores práticas corporativas.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-[6px] bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
                          <Icon icon="fluent:star-24-regular" width="18" height="18" />
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-text-main mb-0.5">Metodologia Ágil ATRA</h5>
                          <p className="text-[10px] text-text-muted leading-relaxed">Abordagem proprietária de desenvolvimento focada em ciclos rápidos e entregas contínuas.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/sobre"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="col-span-6 flex flex-col justify-between p-5 rounded-[6px] bg-surface-1 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:shadow-md transition-all group cursor-pointer border border-transparent hover:border-primary/20 h-full"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-[6px] bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
                          <Icon icon="fluent:info-24-regular" width="18" height="18" />
                        </div>
                        <h4 className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors capitalize">Quem Somos</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2.5 text-[11px] text-text-muted my-3">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>Foco no Cliente</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>Inovação Ética</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>Grandes Marcas</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>Excelência Técnica</span>
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:text-primary/80 transition-colors self-start mt-2">
                      Conhecer Nossa História <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* activeDesktopCategory === 'Glossário' */}
              {activeDesktopCategory === 'Glossário' && (
                <motion.div
                  key="glossario"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-12 gap-6 pt-3 text-left items-center"
                >
                  <div className="col-span-6 flex flex-col justify-center gap-4 pr-2">
                    <p className="text-xs text-text-muted leading-relaxed">
                      Desvende a complexidade técnica com nosso guia prático e descomplicado sobre conceitos essenciais de dados, BI, IA e metodologias.
                    </p>

                    <div className="space-y-3 pt-3 border-t border-slate-200/50 dark:border-white/5">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-[6px] bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
                          <Icon icon="fluent:brain-circuit-24-regular" width="18" height="18" />
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-text-main mb-0.5">O que é LLM e RAG?</h5>
                          <p className="text-[10px] text-text-muted leading-relaxed">Conceitos fundamentais explicados de forma simples para entender inteligência artificial generativa corporativa.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-[6px] bg-cyan-500/10 flex items-center justify-center text-cyan-500 shrink-0 mt-0.5">
                          <Icon icon="fluent:database-search-24-regular" width="18" height="18" />
                        </div>
                        <div>
                          <h5 className="text-xs font-semibold text-text-main mb-0.5">O que é Lakehouse?</h5>
                          <p className="text-[10px] text-text-muted leading-relaxed">A fusão ideal entre Data Lakes e Data Warehouses explicada com clareza conceitual e prática.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link
                    to="/glossario"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="col-span-6 flex flex-col justify-between p-5 rounded-[6px] bg-surface-1 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:shadow-md transition-all group cursor-pointer border border-transparent hover:border-primary/20 h-full"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
                          <Icon icon="fluent:book-search-24-regular" width="18" height="18" />
                        </div>
                        <h4 className="text-sm font-semibold text-text-main group-hover:text-primary transition-colors capitalize">Glossário Técnico</h4>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2.5 text-[11px] text-text-muted my-3">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>Termos de IA</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>Conceitos de BI</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>Arquitetura de Dados</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-primary shrink-0" />
                          <span>Frameworks & Métodos</span>
                        </div>
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary group-hover:text-primary/80 transition-colors self-start mt-2">
                      Explorar Glossário <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu Drawer - strictly md:hidden */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 pointer-events-auto"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto w-full max-w-lg mt-2 bg-surface-2 border border-slate-200/80 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden relative z-40 mx-auto md:hidden max-h-[82vh] flex flex-col"
            >
              <div className="overflow-y-auto no-scrollbar p-4 space-y-1.5 flex-1">
                {['Soluções', 'Segmentos', 'Consultores', 'Insights', 'Parceiros', 'Carreiras', 'Sobre', 'Glossário'].map((item) => (
                  <div key={item} className="flex flex-col rounded-lg overflow-hidden">
                    <div 
                      className="flex items-center justify-between py-3 px-3.5 hover:bg-slate-100 dark:hover:bg-white/5 active:bg-slate-200/60 dark:active:bg-white/10 rounded-lg transition-colors cursor-pointer"
                      onClick={() => {
                        if (item === 'Soluções' || item === 'Insights' || item === 'Parceiros') {
                          toggleMobileSubMenu(item);
                        } else {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                    >
                      <Link 
                        to={item === 'Soluções' ? '/solucoes' : item === 'Consultores' ? '/consultores' : item === 'Insights' ? '/insights' : item === 'Glossário' ? '/glossario' : item === 'Carreiras' ? '/carreiras' : item === 'Sobre' ? '/sobre' : '/'} 
                        className="text-sm font-semibold text-text-main capitalize tracking-wide flex items-center gap-2.5"
                        onClick={(e) => {
                          if (item === 'Soluções' || item === 'Insights' || item === 'Parceiros') {
                            e.preventDefault();
                          }
                        }}
                      >
                       {item === 'Soluções' ? t('nav.solutions') : 
                        item === 'Consultores' ? t('nav.consultants') : 
                        item === 'Insights' ? t('nav.insights') : 
                        item === 'Parceiros' ? t('nav.partners') : 
                        item === 'Carreiras' ? t('nav.careers') : 
                        item === 'Sobre' ? t('nav.about') : 
                        item === 'Segmentos' ? t('nav.segments') :
                        item === 'Glossário' ? t('nav.glossary') : item}
                      </Link>
                      {(item === 'Soluções' || item === 'Insights' || item === 'Parceiros') && (
                        <div className="p-1 rounded-md text-text-muted">
                          <ChevronDown 
                            size={18} 
                            className={cn("transition-transform duration-200", activeMobileSubMenu === item ? "rotate-180 text-primary" : "")} 
                          />
                        </div>
                      )}
                    </div>

                    {/* Sub-menu content */}
                    <AnimatePresence>
                      {activeMobileSubMenu === item && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden bg-surface-1/60 dark:bg-surface-1/40 rounded-lg mx-1 mb-2 border border-slate-200/50 dark:border-white/5"
                        >
                          <div className="p-2.5 grid grid-cols-1 gap-1.5">
                            {item === 'Soluções' && solutionsData.map((sol, idx) => {
                              const translatedSolutions = t('megaMenu.solutions', { returnObjects: true }) as any[];
                              return (
                                <Link 
                                  key={idx} 
                                  to={sol.sections[0].link || "#"} 
                                  className="text-text-main hover:text-primary font-medium py-2.5 px-3 flex items-center gap-3 bg-surface-2/80 hover:bg-surface-2 rounded-lg hover:shadow-xs transition-all active:scale-[0.99]"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                    <Icon icon={sol.sections[0].icon} width="18" height="18" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-xs font-semibold capitalize tracking-wide leading-tight">{translatedSolutions[idx]?.title || sol.title}</span>
                                    <span className="text-[10px] text-text-muted leading-tight mt-0.5 line-clamp-1">{sol.sections[0]?.desc}</span>
                                  </div>
                                </Link>
                              );
                            })}
                            {item === 'Insights' && (
                              <>
                                {(t('megaMenu.insights', { returnObjects: true }) as any[]).map((sub, idx) => (
                                  <Link 
                                    key={idx} 
                                    to={insightsData[idx]?.link || "#"} 
                                    className="text-text-main hover:text-primary font-medium py-2 px-3 flex items-center gap-3 bg-surface-2/80 hover:bg-surface-2 rounded-lg hover:shadow-xs transition-all active:scale-[0.99]" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0">
                                      <Icon icon={insightsData[idx]?.icon || 'fluent:news-24-regular'} width="18" height="18" />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-xs font-semibold capitalize tracking-wide leading-tight">{sub.title}</span>
                                      <span className="text-[10px] text-text-muted leading-tight line-clamp-1">{sub.desc}</span>
                                    </div>
                                  </Link>
                                ))}
                              </>
                            )}
                            {item === 'Parceiros' && (
                              <>
                                {(t('megaMenu.partners', { returnObjects: true }) as any[]).map((sub, idx) => (
                                  <Link 
                                    key={idx} 
                                    to={partnersDropdownData[idx]?.link || '#'} 
                                    className="text-text-main hover:text-primary font-medium py-2 px-3 flex items-center gap-3 bg-surface-2/80 hover:bg-surface-2 rounded-lg hover:shadow-xs transition-all active:scale-[0.99]" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    <div className="w-8 h-8 rounded-md bg-white dark:bg-white/10 flex items-center justify-center text-primary shrink-0 p-1">
                                      <img src={partnersDropdownData[idx]?.url} alt={sub.name} loading="lazy" decoding="async" className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-xs font-semibold capitalize tracking-wide leading-tight">{sub.name}</span>
                                  </Link>
                                ))}
                              </>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Bottom Actions of Mobile Menu: Language Switcher + Contact CTA */}
              <div className="p-4 bg-surface-1/80 border-t border-slate-200/80 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 p-1 bg-surface-2 rounded-lg border border-slate-200 dark:border-white/10">
                    <button
                      onClick={() => i18n.changeLanguage('pt')}
                      className={cn(
                        "px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                        i18n.language.startsWith('pt') 
                          ? "bg-primary text-white shadow-xs" 
                          : "text-text-muted hover:text-text-main"
                      )}
                    >
                      PT
                    </button>
                    <button
                      onClick={() => i18n.changeLanguage('en')}
                      className={cn(
                        "px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer",
                        i18n.language.startsWith('en') 
                          ? "bg-primary text-white shadow-xs" 
                          : "text-text-muted hover:text-text-main"
                      )}
                    >
                      EN
                    </button>
                  </div>

                  <Link 
                    to="/carreiras" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    Vagas Abertas →
                  </Link>
                </div>

                <Link 
                  to="/#fale-conosco" 
                  className="bg-primary text-white px-5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider w-full text-center flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>{t('nav.contact')}</span>
                  <ArrowRight size={15} />
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Counter = ({ value }: { value: string }) => {
  const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
  const suffix = value.replace(/[0-9]/g, '');
  const [displayCount, setDisplayCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  // Use a flexible margin and amount so it triggers as soon as 10% is in viewport, especially on mobile
  const isInView = useInView(ref, { once: true, amount: 0.1, margin: "0px 0px 50px 0px" });

  useEffect(() => {
    // If reduced motion is requested, display immediately
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayCount(numericValue);
      return;
    }

    if (isInView) {
      const controls = animate(0, numericValue, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => setDisplayCount(Math.round(v)),
      });
      return () => controls.stop();
    }
  }, [isInView, numericValue]);

  // Fallback safety timeout for mobile browsers where IntersectionObserver might lag on initial scroll
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayCount((prev) => (prev === 0 && numericValue > 0 ? numericValue : prev));
    }, 1500);
    return () => clearTimeout(timer);
  }, [numericValue]);

  return <span ref={ref}>{displayCount}{suffix}</span>;
};

const Stats = () => {
  const { t } = useTranslation();

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-16 sm:py-20 bg-surface-1 relative z-20"
    >
      {/* Technological detail lines */}
      <TechHorizontalLine color="blue" sectionName="STATS_METRICS" align="left" side="bottom" delay={0.2} />
      <TechVerticalLine color="orange" sectionName="PERF_TRACK" align="right" alignY="top" delay={0.3} />

      <div className="container mx-auto px-4 max-w-7xl touch-pan-y">
        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-5 touch-pan-y">
          
          {/* FEATURED BENTO CARD 1: Parceiros Oficiais (GCP, Azure, AWS, etc.) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-12 lg:col-span-5 h-full touch-pan-y"
          >
            <GlowCard
              glowColor="blue"
              customSize={true}
              radius={6}
              className="p-6 sm:p-7 bg-surface-2 text-text-main shadow-lg h-full flex flex-col justify-between relative overflow-hidden group transition-all duration-300 rounded-[6px] touch-pan-y"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                    <Handshake size={14} /> Parceiros Oficiais
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold font-display text-text-main mb-2">
                  Ecossistema Global
                </h3>
                <p className="text-xs text-text-muted leading-relaxed mb-5 font-light">
                  Alianças estratégicas e soluções integradas com os maiores provedores de nuvem e IA do mundo.
                </p>
              </div>

              {/* Cloud & Data Partners Grid (Google Cloud, Azure, AWS) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-2.5 mt-2">
                {/* Google Cloud */}
                <div className="p-2.5 rounded-[6px] border border-border-main/50 flex items-center gap-2.5 hover:border-primary/50 transition-all group/item bg-surface-1/40">
                  <div className="w-7 h-7 rounded-[6px] bg-white/10 dark:bg-white/5 flex items-center justify-center shrink-0">
                    <Icon icon="logos:google-cloud" width={20} className="shrink-0" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-text-main truncate group-hover/item:text-primary transition-colors">Google Cloud</p>
                    <p className="text-[9px] text-text-muted truncate">Premier Partner</p>
                  </div>
                </div>

                {/* Microsoft Azure */}
                <div className="p-2.5 rounded-[6px] border border-border-main/50 flex items-center gap-2.5 hover:border-primary/50 transition-all group/item bg-surface-1/40">
                  <div className="w-7 h-7 rounded-[6px] bg-white/10 dark:bg-white/5 flex items-center justify-center shrink-0">
                    <Icon icon="logos:microsoft-azure" width={18} className="shrink-0" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-text-main truncate group-hover/item:text-primary transition-colors">Azure</p>
                    <p className="text-[9px] text-text-muted truncate">Cloud Solutions</p>
                  </div>
                </div>

                {/* AWS */}
                <div className="p-2.5 rounded-[6px] border border-border-main/50 flex items-center gap-2.5 hover:border-primary/50 transition-all group/item bg-surface-1/40">
                  <div className="w-7 h-7 rounded-[6px] bg-white/10 dark:bg-white/5 flex items-center justify-center shrink-0">
                    <Icon icon="logos:aws" width={20} className="shrink-0" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-text-main truncate group-hover/item:text-primary transition-colors">AWS</p>
                    <p className="text-[9px] text-text-muted truncate">Advanced Net</p>
                  </div>
                </div>
              </div>
            </GlowCard>
          </motion.div>

          {/* FEATURED BENTO CARD 2: 5x GPTW & LIPT 2026 (Selos de Excelência) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-12 lg:col-span-7 h-full"
          >
            <GlowCard
              glowColor="orange"
              customSize={true}
              radius={6}
              className="p-6 sm:p-8 bg-surface-2 text-text-main shadow-lg h-full flex flex-col justify-between relative overflow-hidden group transition-all duration-300 rounded-[6px]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[6px] bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
                    <Trophy size={14} /> Selos de Reconhecimento
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 my-2">
                  {/* Official GPTW & LIPT Seals in a single shared white box */}
                  <div className="flex items-center justify-center gap-4 shrink-0 bg-white p-3 sm:p-3.5 rounded-[8px] shadow-sm border border-slate-200/80 dark:border-white/20 transform group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src="/imagens/GPTW-Selos-site-65306b.jpg" 
                      alt="Selo Great Place to Work 5x ATRA" 
                      loading="lazy"
                      decoding="async"
                      className="h-28 sm:h-32 w-auto object-contain shrink-0"
                    />
                    <div className="w-[1px] h-20 sm:h-24 bg-slate-200" />
                    <img 
                      src={liptSealImage} 
                      alt="Selo LIPT 2026 - Lugares Incríveis Para Trabalhar" 
                      loading="lazy"
                      decoding="async"
                      className="h-22 sm:h-26 w-auto object-contain shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // target.src é absoluta ("http://host/imgs/..."), então comparar
                        // com um caminho relativo nunca casa: sem esta flag o fallback
                        // se reatribui em loop quando a própria imagem de fallback falha.
                        if (target.dataset.fallbackApplied) {
                          target.style.display = 'none';
                          return;
                        }
                        target.dataset.fallbackApplied = 'true';
                        target.src = '/imgs/lipt-2026.png';
                      }}
                    />
                  </div>

                  <div className="text-center sm:text-left flex-1">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-text-main tracking-tight leading-none mb-2">
                      <Counter value="5x" /> GPTW & LIPT
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-light">
                      Certificações oficiais Great Place to Work® e Lugares Incríveis para Trabalhar, comprovando nossa cultura acolhedora e excelência contínua.
                    </p>
                    <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-[5px] bg-amber-400/10 text-amber-500 text-xs font-bold">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>Cultura de Elite</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border-main/60 flex items-center justify-between text-xs text-text-muted font-light">
                <span>Pessoas, inovação e tecnologia no nosso DNA.</span>
                <Award size={18} className="text-secondary shrink-0" />
              </div>
            </GlowCard>
          </motion.div>

          {/* SUPPORTING BENTO CARDS (4 cards below aligned start-to-end with top cards) */}
          <div className="md:col-span-12 lg:col-span-12 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 lg:gap-5">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <GlowCard glowColor="blue" customSize={true} radius={6} className="p-4 sm:p-5 bg-surface-2 text-text-main shadow-md flex flex-col justify-between gap-4 h-full rounded-[6px]">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Clock size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Tradição</span>
                </div>
                <div className="mt-5 mb-5 pl-[1px]">
                  <h4 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-text-main leading-none mb-1">
                    <Counter value="15+" />
                  </h4>
                  <p className="text-[11px] sm:text-xs font-normal text-text-muted leading-relaxed">{t('stats.years')}</p>
                </div>
              </GlowCard>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <GlowCard glowColor="orange" customSize={true} radius={6} className="p-4 sm:p-5 bg-surface-2 text-text-main shadow-md flex flex-col justify-between gap-4 h-full rounded-[6px]">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-[6px] bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <Users size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Time</span>
                </div>
                <div className="mt-5 mb-5 pl-[1px]">
                  <h4 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-text-main leading-none mb-1">
                    <Counter value="150+" />
                  </h4>
                  <p className="text-[11px] sm:text-xs font-normal text-text-muted leading-relaxed">{t('stats.professionals')}</p>
                </div>
              </GlowCard>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <GlowCard glowColor="blue" customSize={true} radius={6} className="p-4 sm:p-5 bg-surface-2 text-text-main shadow-md flex flex-col justify-between gap-4 h-full rounded-[6px]">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Award size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Excelência</span>
                </div>
                <div className="mt-5 mb-5 pl-[1px]">
                  <h4 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-text-main leading-none mb-1">
                    <Counter value="40+" />
                  </h4>
                  <p className="text-[11px] sm:text-xs font-normal text-text-muted leading-relaxed">{t('stats.certifications')}</p>
                </div>
              </GlowCard>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              <GlowCard glowColor="orange" customSize={true} radius={6} className="p-4 sm:p-5 bg-surface-2 text-text-main shadow-md flex flex-col justify-between gap-4 h-full rounded-[6px]">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-[6px] bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <Target size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Enterprise</span>
                </div>
                <div className="mt-5 mb-5 pl-[1px]">
                  <h4 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-text-main leading-none mb-1">
                    <Counter value="20+" />
                  </h4>
                  <p className="text-[11px] sm:text-xs font-normal text-text-muted leading-relaxed">{t('stats.clients')}</p>
                </div>
              </GlowCard>
            </motion.div>
          </div>

        </div>
      </div>
    </motion.section>
  );
};

const Partners = () => {
  const { t } = useTranslation();
  const partners = [
    { name: "Google Cloud", url: "/imagens/Google_Cloud_Platform-Logo.wine_-2048x1365-02fd56.png" },
    { name: "Denodo", url: "/imagens/denodo-tranparent-logo-01f5ab.png" },
    { name: "BigID", url: "/imagens/Horizontal_BigID_Logo-2048x1072-925fa0.jpg" },
    { name: "Partner", url: "/imagens/image-removebg-preview-4-138596.png" },
    { name: "Azure", url: "/imagens/Microsoft_Azure-Logo.wine_-1536x1024-370d06.png" },
    { name: "Atlan", url: "/imagens/Atlan-logo-full.svg_-6ccbc8.png" },
    { name: "IBM", url: "/imagens/logo-ibm-5a3ca7.png" },
    { name: "Salesforce Informatica", url: "/imgs/salesforceinformatica.png" },
    { name: "Databricks", url: "/imagens/Databricks_Logo2-1536x813-aa2d3d.png" }
  ];

  const logoEntries: LogoEntry[] = partners.map((partner) => ({
    name: partner.name,
    id: partner.name,
    icon: (
      <img 
        src={partner.url} 
        alt={partner.name} 
        loading="lazy"
        decoding="async"
        className="w-full h-full object-contain pointer-events-none opacity-90 hover:opacity-100 transition-opacity"
      />
    ),
  }));

  return (
    <section className="py-8 bg-surface-2 overflow-hidden shadow-inner relative">
      {/* Technological detail lines */}
      <TechHorizontalLine color="blue" sectionName="PARTNERS_CORE" align="left" side="top" delay={0.2} />
      <TechVerticalLine color="orange" sectionName="CONN_HUB" align="left" alignY="top" delay={0.3} />

      <LogoCloudSwap
        logos={logoEntries}
        title={t('sections.partnersTitle')}
        className="bg-transparent py-4 sm:py-6"
      />
    </section>
  );
};

const Features = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  
  const features = [
    {
      title: "Acelere sua Transformação",
      description: "Modernize sua infraestrutura, integre sistemas e construa uma base de dados escalável em cloud com suporte de ponta a ponta.",
      icon: Zap,
      badge: "Inovação Cloud",
      image: "/imagens/unsplash-1522071820081-009f0129c71c-w1200-d4d8bc.jpg"
    },
    {
      title: "Eficiência Operacional",
      description: "Automatize processos complexos, gere insights em tempo real e aumente exponencialmente a produtividade das equipes com BI e Analytics.",
      icon: SlidersHorizontal,
      badge: "Automação & Analytics",
      image: "/imagens/unsplash-1551836022-d5d88e9218df-w1200-40c9aa.jpg"
    },
    {
      title: "Governança, Segurança e FinOps",
      description: "Assegure máxima qualidade de dados, proteção e controle rigoroso de custos de nuvem com compliance e governança contínua.",
      icon: ShieldCheck,
      badge: "Governança & FinOps",
      image: "/imagens/unsplash-1573496359142-b8d87734a5a2-w1200-4a8584.jpg"
    },
    {
      title: "Decisões Inteligentes e IA",
      description: "Aplique IA Generativa, modelos preditivos e soluções digitais avançadas para antecipar cenários e acelerar tomada de decisão.",
      icon: Sparkles,
      badge: "Inteligência Artificial",
      image: "/imagens/unsplash-1531482615713-2afd69097998-w1200-f14c6f.jpg"
    }
  ];

  useEffect(() => {
    if (congelado()) return;  // regressão visual: fixa no índice 0
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % features.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [activeTab, features.length]);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-20 bg-surface-1 relative overflow-hidden"
    >
      {/* Technological detail lines */}
      <TechHorizontalLine color="orange" sectionName="FEATURES_PROCESS" align="right" side="top" delay={0.2} />
      <TechVerticalLine color="blue" sectionName="VAL_ENG" align="right" alignY="bottom" delay={0.3} />
      <TechCornerBraces color="blue" position="bottom-left" delay={0.4} />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10  text-primary text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={13} /> Nosso Processo de Valor
            </div>
            <h2 className="text-2xl md:text-4xl font-light font-display text-text-main leading-tight">
              {t('sections.featuresTitle')}
            </h2>
          </div>
          <p className="text-text-muted font-light max-w-md text-xs md:text-sm">
            Abordagem estruturada para acelerar resultados de negócios através da modernização e inteligência de dados.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          {/* List of Clickable Rows */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-2.5 lg:gap-0 lg:h-full">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              const isActive = activeTab === index;
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={cn(
                    "w-full text-left p-4 sm:p-5 rounded-lg transition-all duration-300 flex items-center justify-between gap-4 cursor-pointer group border",
                    isActive 
                      ? "bg-surface-2 shadow-md border-primary/40 text-text-main" 
                      : "bg-surface-2/60 hover:bg-surface-2 border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={cn(
                      "w-10 h-10 rounded-md flex items-center justify-center shrink-0 transition-all duration-300 border",
                      isActive ? "bg-primary text-white border-primary shadow-sm" : "bg-surface-3 text-text-muted border-transparent group-hover:text-primary"
                    )}>
                      <IconComponent size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary block mb-0.5">0{index + 1} • {feature.badge}</span>
                      <h3 className="font-medium text-xs sm:text-sm md:text-base text-text-main">{feature.title}</h3>
                    </div>
                  </div>

                  <div className={cn(
                    "w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-transform duration-300",
                    isActive ? "bg-primary/20 text-primary rotate-45" : "bg-surface-3 text-text-muted opacity-50 group-hover:opacity-100"
                  )}>
                    <ArrowUpRight size={16} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Card Showcase */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="vort-card dark:vort-card-dark border border-border-main dark:border-white/10 h-full min-h-[380px] flex flex-col justify-between p-6 sm:p-10 relative overflow-hidden rounded-lg shadow-xl dark:shadow-2xl transition-colors duration-300 group"
              >
                {/* Background human image with subtle gradient overlay */}
                <img 
                  src={features[activeTab].image} 
                  alt={features[activeTab].title} 
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover opacity-15 dark:opacity-25 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-surface-1/90 to-surface-1/40 dark:from-[#0f1117] dark:via-[#0f1117]/90 dark:to-transparent pointer-events-none" />

                {/* Feature content */}
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-primary/10 text-xs font-bold uppercase tracking-wider text-primary mb-6">
                    {features[activeTab].badge}
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-light font-display text-text-main dark:text-white mb-4 leading-snug">
                    {features[activeTab].title}
                  </h3>
                  
                  <p className="text-text-muted dark:text-white/70 font-light text-xs sm:text-sm md:text-base leading-relaxed max-w-lg">
                    {features[activeTab].description}
                  </p>
                </div>

                <div className="relative z-10 mt-8 pt-6 border-t border-border-main dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-text-muted dark:text-white/50 font-light">
                    <CheckCircle2 size={15} className="text-primary" /> Metodologia comprovada ATRA
                  </div>
                  
                  <Link to="/#fale-conosco" className="pill-btn-primary py-2.5 px-6 text-xs">
                    <span>{t('sections.learnMore')}</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const CustomerStories = () => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const stories = [
    {
      id: 1,
      company: "Banco ABC",
      logo: "/logos/anbima.jpg",
      title: "Marketplace & Governança de Dados",
      description: "Estabelecimento de fluxo automatizado entre Informatica e GCP para democratizar dados com total segurança, governança e eficiência regulatória.",
      slug: "marketplace-governanca-dados",
      icon: Landmark,
      bgColor: "bg-[#2A75C5]",
      image: caseMarketplaceGov,
      tags: ["Governança", "GCP", "Marketplace"]
    },
    {
      id: 2,
      company: "Banco Carrefour",
      logo: "/logos/bcarrefour.jpg",
      title: "Eficiência em Processos de Risco com GCP",
      description: "Ingestão e processamento de dados 51 vezes mais rápido para relatórios regulatórios de risco financeiro no Google Cloud com otimização de FinOps.",
      slug: "eficiencia-processos-risco",
      icon: TrendingUp,
      bgColor: "bg-[#1A5FB4]",
      image: caseRiskEfficiency,
      tags: ["Risco", "Carrefour", "BigQuery"]
    },
    {
      id: 3,
      company: "Banco ABC",
      logo: "/logos/anbima.jpg",
      title: "Migração de Legado para Google Cloud",
      description: "Alimentação automática de aplicação de Risco de Mercado a partir de ambiente legado em curto prazo e migração contínua.",
      slug: "migracao-legado-gcp",
      icon: Cpu,
      bgColor: "bg-[#124185]",
      image: caseLegacyMigration,
      tags: ["Migração", "Python", "GCP"]
    },
    {
      id: 4,
      company: "Banco ABC",
      logo: "/logos/anbima.jpg",
      title: "Dashboards Estratégicos de BI",
      description: "Desenvolvimento de KPIs executivos e painéis de acompanhamento em tempo real para produtos de Crédito Pessoal e Consignado.",
      slug: "dashboards-estrategicos",
      icon: Building2,
      bgColor: "bg-[#3C98FA]",
      image: caseStrategicDashboards,
      tags: ["Dashboards", "Looker", "Analytics"]
    },
    {
      id: 5,
      company: "RD Saúde",
      logo: "/logos/rdsaude.jpg",
      title: "Plataforma de Inteligência de Saúde",
      description: "Consolidação de ecossistema analítico para inteligência preventiva de saúde, melhorando a experiência do usuário e otimizando processos.",
      slug: "marketplace-governanca-dados",
      icon: ShieldCheck,
      bgColor: "bg-[#0B2545]",
      image: caseMarketplaceGov,
      tags: ["HealthTech", "Big Data", "AI"]
    }
  ];

  // Auto-scroll effect with loop
  useEffect(() => {
    if (congelado()) return;  // regressão visual: fixa no índice 0
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stories.length);
    }, 5000); // Auto-scroll every 5 seconds
    return () => clearInterval(interval);
  }, [activeIndex, stories.length]);

  // Smooth scroll to activeIndex when it changes
  useEffect(() => {
    if (scrollRef.current) {
      const child = scrollRef.current.children[activeIndex] as HTMLElement;
      if (child) {
        scrollRef.current.scrollTo({
          left: child.offsetLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [activeIndex]);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      return;
    }
    const progress = (scrollLeft / maxScroll) * 100;
    setScrollProgress(progress);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setActiveIndex((prev) => (prev - 1 + stories.length) % stories.length);
    } else {
      setActiveIndex((prev) => (prev + 1) % stories.length);
    }
  };

  useEffect(() => {
    handleScroll();
  }, []);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-16 md:py-24 bg-surface-2 overflow-hidden relative"
    >
      {/* Technological detail lines */}
      <TechHorizontalLine color="blue" sectionName="CASE_LEDGER" align="left" side="bottom" delay={0.2} />
      <TechVerticalLine color="orange" sectionName="STORY_MATRIX" align="left" alignY="top" delay={0.3} />

      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        {/* Top Header matching reference image layout */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-14 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider mb-3">
              Histórias de Impacto
            </div>
            <h2 className="text-3xl md:text-5xl font-light font-display text-text-main leading-tight">
              Investindo no Sucesso dos Nossos Clientes
            </h2>
          </div>
          
          <div className="flex flex-col items-start md:items-end text-left md:text-right max-w-md gap-3">
            <p className="text-xs md:text-sm text-text-muted leading-relaxed font-light">
              Nosso portfólio reflete foco e excelência em arquitetura de dados, nuvem e inteligência artificial — transformando visão estratégica em valor de longo prazo.
            </p>
            <Link 
              to="/cases-de-sucesso" 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[6px] bg-primary hover:bg-[#2B7FDB] text-white text-xs font-semibold transition-all shadow-md hover:shadow-lg active:scale-95 group cursor-pointer shrink-0"
            >
              <span>Ver todos os cases</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Carousel Container: Shows 1 full case (Text Card + Image Card) and part of the next */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-5 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {stories.map((story) => {
            const IconComp = story.icon;
            return (
              <div 
                key={story.id} 
                className="flex flex-col sm:flex-row gap-2 shrink-0 snap-start w-[85vw] sm:w-[680px] md:w-[740px] lg:w-[780px]"
              >
                {/* TEXT CARD */}
                <div className={`w-full sm:w-[42%] shrink-0 rounded-[6px] p-5 sm:p-6 md:p-7 flex flex-col justify-between ${story.bgColor} text-white shadow-xl relative overflow-hidden group transition-all`}>
                  {/* Background geometric accents */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full pointer-events-none" />
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/10 rounded-full pointer-events-none" />

                  <div>
                    {/* Company Header */}
                    <div className="flex items-center justify-between gap-2 mb-3 sm:mb-6">
                      <span className="text-xs sm:text-sm font-semibold tracking-wider text-white/90 uppercase font-display">
                        {story.company}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-white/10 backdrop-blur-md flex items-center justify-center text-white shrink-0">
                        <IconComp size={14} />
                      </div>
                    </div>

                    {/* Case Title */}
                    <h3 className="text-base sm:text-lg md:text-xl font-normal font-display leading-snug mb-2 sm:mb-3 text-white">
                      {story.title}
                    </h3>

                    {/* Case Description */}
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light line-clamp-3 sm:line-clamp-4 md:line-clamp-5">
                      {story.description}
                    </p>
                  </div>

                  {/* Case Footer / Link */}
                  <div className="mt-4 sm:mt-5 pt-3.5 border-t border-white/15 flex items-center justify-between">
                    <Link 
                      to={`/cases-de-sucesso/${story.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-white/90 hover:text-white group-hover:translate-x-1 transition-all"
                    >
                      <span>Ler estudo de caso</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {/* IMAGE CARD */}
                <div className="w-full sm:w-[58%] shrink-0 rounded-[6px] overflow-hidden shadow-xl relative group h-[200px] sm:h-auto sm:min-h-[340px] md:min-h-[400px]">
                  <img 
                    src={story.image} 
                    alt={story.title} 
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation Bar with Progress Line and Arrow Controls (closer to the cards) */}
        <div className="mt-3 md:mt-4 flex items-center justify-between gap-6 pt-2">
          {/* Progress Indicator Bar */}
          <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden relative max-w-xl">
            <motion.div 
              className="h-full bg-primary rounded-full transition-all duration-200"
              style={{ width: `${Math.max(15, scrollProgress)}%` }}
            />
          </div>

          {/* Nav Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => scroll('left')}
              className="w-10 h-10 md:w-11 md:h-11 rounded-[6px] border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-primary hover:border-primary hover:text-white dark:hover:bg-primary dark:hover:border-primary transition-all active:scale-90 cursor-pointer shadow-xs"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-10 h-10 md:w-11 md:h-11 rounded-[6px] border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-primary hover:border-primary hover:text-white dark:hover:bg-primary dark:hover:border-primary transition-all active:scale-90 cursor-pointer shadow-xs"
              aria-label="Próximo"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const ClientCarousel = () => {
  const clients = [
     { name: "RD Saúde", file: "rdsaude.jpg", boost: false },
     { name: "ANBIMA", file: "anbima.jpg", boost: true },
     { name: "Afya", file: "afya.jpg", boost: true },
     { name: "Oncoclínicas", file: "oncoclinicas.jpg", boost: false },
     { name: "Carrefour Banco", file: "bcarrefour.jpg", boost: false },
     { name: "Icatu", file: "icatu.jpg", boost: true },
     { name: "Porto", file: "porto.jpg", boost: false }
  ];

  // Two sets for infinite seamless hardware-accelerated CSS marquee
  const doubleClients = [...clients, ...clients];

  return (
    <div className="w-full py-2 bg-transparent overflow-hidden">
      <div 
        className="w-full overflow-hidden" 
        style={{ 
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', 
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' 
        }}
      >
        <div className="animate-marquee-horizontal py-1">
          {doubleClients.map((client, index) => (
            <div 
              key={`${client.name}-${index}`} 
              className="flex items-center justify-center bg-white dark:bg-white px-4 py-2.5 rounded-[7px] h-14 w-[156px] mx-3.5 shrink-0 shadow-xs border border-slate-200/80 dark:border-white/10 hover:scale-105 transition-transform duration-200 cursor-default"
            >
              <img 
                src={`/logos/${client.file}`}
                alt={`Logo ${client.name}`}
                loading="lazy"
                decoding="async"
                className={`${client.boost ? 'max-h-10 scale-110' : 'max-h-8'} max-w-full object-contain pointer-events-none opacity-90 hover:opacity-100 transition-all`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes('/public/')) {
                    target.src = `/public/logos/${client.file}`;
                  } else if (!target.src.includes('/imgs/')) {
                    target.src = `/imgs/${client.file}`;
                  } else {
                    target.style.display = 'none';
                    if (target.nextElementSibling) {
                      target.nextElementSibling.classList.remove('hidden');
                    }
                  }
                }}
              />
              <span className="hidden text-xs font-semibold font-display text-slate-800 tracking-tight text-center truncate">
                {client.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const { t } = useTranslation();
  
  const testimonials = [
    {
      client: "ABC Brasil",
      role: "Gerente de Arquitetura de Dados",
      text: "Integrar nossos serviços do Google Cloud com as soluções Informatica CDGC nos proporcionou agilidade, escalabilidade e eficiência em nossa transformação digital.",
      avatar: "/imagens/unsplash-1573496359142-b8d87734a5a2-w300-83893e.jpg"
    },
    {
      client: "ABC Brasil",
      role: "Especialista Cloud & DevOps",
      text: "Com o uso de Pub/Sub e Cloud Functions, conseguimos alcançar dados quase em tempo real e escalabilidade em nossos processos, ao mesmo tempo em que reduzimos significativamente os custos e esforços operacionais.",
      avatar: "/imagens/unsplash-1507003211169-0a1dd7228f2d-w300-0cf429.jpg"
    },
    {
      client: "Banco Carrefour",
      role: "Líder de Engenharia de Dados",
      text: "Gostaria de expressar meu reconhecimento e gratidão à Equipe de Fábrica da ATRA pelo trabalho realizado nos processos de ingestão de dados. A equipe desempenhou um papel fundamental na aceleração das implementações e contribuiu de forma consistente para os procedimentos de validação estabelecidos. A colaboração constante resultou em uma melhoria na qualidade das entregas e possibilitou o avanço do nosso projeto de migração da plataforma de dados para o Google Cloud.",
      avatar: "/imagens/unsplash-1573497019940-1c28c88b4f3e-w300-828d67.jpg"
    },
    {
      client: "Banco Carrefour",
      role: "Superintendente de Risco",
      text: "A parceria com a ATRA foi essencial para o nosso sucesso na modernização do processamento de dados financeiros no Google Cloud. A capacidade da equipe em se alinhar às necessidades do nosso time de Risco resultou em uma solução totalmente automatizada e 51 vezes mais rápida, garantindo conformidade e excelência operacional.",
      avatar: "/imagens/unsplash-1500648767791-00dcc994a43e-w300-caea79.jpg"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (congelado()) return;  // regressão visual: fixa no índice 0
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-10 bg-surface-2 relative overflow-hidden"
    >
      {/* Technological detail lines */}
      <TechHorizontalLine color="blue" sectionName="CLIENT_FEEDBACK" align="right" side="top" delay={0.2} />
      <TechVerticalLine color="orange" sectionName="SAT_SYS" align="right" alignY="bottom" delay={0.3} />
      <TechCornerBraces color="orange" position="bottom-right" delay={0.4} />

      <div className="container mx-auto px-4 md:px-6 text-center relative z-10 max-w-7xl">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-light font-display mb-10 text-text-main">{t('sections.whyClientsTitle')}</h2>
        
        <div className="max-w-3xl mx-auto bg-surface-3 p-6 md:p-10 rounded-lg shadow-xl relative flex flex-col items-center justify-center">
          <Quote size={32} className="text-primary/40 mb-4" />
          
          <div className="flex gap-1 justify-center mb-4 text-amber-400">
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
            <Star size={16} fill="currentColor" />
          </div>

          <div className="flex items-center justify-between w-full gap-2 sm:gap-4 md:gap-6">
            <button
              onClick={() => setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length)}
              className="flex w-8 h-8 sm:w-10 sm:h-10 rounded-[6px] border border-border-main items-center justify-center text-text-muted hover:text-white hover:bg-primary transition-all shrink-0 cursor-pointer active:scale-95"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="relative w-full overflow-hidden flex-1 grid grid-cols-1 grid-rows-1 items-center px-1 sm:px-4">
              {testimonials.map((item, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "col-start-1 row-start-1 w-full transition-all duration-500 ease-out flex flex-col items-center",
                    activeIndex === idx 
                      ? "opacity-100 scale-100 pointer-events-auto z-10 translate-y-0" 
                      : "opacity-0 scale-95 pointer-events-none z-0 translate-y-4"
                  )}
                >
                  <p className="text-xs sm:text-sm md:text-base font-light leading-relaxed mb-5 sm:mb-6 text-text-main italic">
                    "{item.text}"
                  </p>
                  
                  <div className="flex items-center justify-center gap-3">
                    <img 
                      src={item.avatar} 
                      alt={item.role} 
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-primary/40 shadow-sm shrink-0" 
                    />
                    <div className="flex flex-col items-start justify-center text-left">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[6px] bg-primary/20 text-primary text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                        <ShieldCheck size={12} /> {item.role}
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-text-main mt-0.5">{item.client}</h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveIndex((current) => (current + 1) % testimonials.length)}
              className="flex w-8 h-8 sm:w-10 sm:h-10 rounded-[6px] border border-border-main items-center justify-center text-text-muted hover:text-white hover:bg-primary transition-all shrink-0 cursor-pointer active:scale-95"
              aria-label="Próximo depoimento"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex gap-2 justify-center mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-xs transition-all duration-300 cursor-pointer ${activeIndex === idx ? 'w-6 bg-primary' : 'w-2 bg-text-muted/30 hover:bg-text-muted'}`}
                aria-label={`Ir para depoimento ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const Clients = () => {
  const { t } = useTranslation();
  const [inputVal, setInputVal] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    navigate('/chat', { state: { initialMessage: inputVal } });
  };

  return (
    <section className="py-10 md:py-12 bg-transparent overflow-hidden border-b border-border-main/50 relative z-20">
      {/* Technological detail lines */}
      <TechHorizontalLine color="orange" sectionName="CLIENT_INTELLIGENCE" align="right" side="top" delay={0.2} />
      <TechVerticalLine color="blue" sectionName="CLIENT_LEDGER" align="left" alignY="bottom" delay={0.3} />
      
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center mb-8">
        <h2 className="text-xl sm:text-2xl md:text-[28px] font-normal font-display text-text-main mb-6 min-h-[50px] sm:h-[90px] flex items-center justify-center tracking-tight leading-tight">
          Nossos clientes já transformaram suas operações com a ATRA.
        </h2>

        {/* AI Prompt Box */}
        <div className="w-full max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="bg-surface-2 dark:bg-[#141720] border border-slate-200 dark:border-white/10 rounded-2xl p-3 sm:p-4 flex flex-col gap-2 shadow-lg focus-within:border-primary/50 transition-all text-left">
              
              {/* Input Area */}
              <div className="w-full px-1">
                <textarea 
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Escreva uma mensagem..." 
                  className="w-full bg-transparent text-text-main dark:text-white text-xs sm:text-sm focus:outline-none placeholder:text-text-muted/60 font-light resize-none h-11 sm:h-12 border-0 focus:ring-0 p-0 leading-relaxed"
                  rows={2}
                />
              </div>

              {/* Bottom Control Bar */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 dark:border-white/5">
                {/* Left: Static ATRA AI Label */}
                <span className="text-[11px] sm:text-xs font-semibold text-text-muted select-none pl-1">
                  ATRA AI
                </span>

                {/* Right: Submit button */}
                <button
                  type="submit"
                  disabled={!inputVal.trim()}
                  title="Enviar mensagem"
                  aria-label="Enviar mensagem"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark disabled:opacity-40 disabled:hover:bg-primary active:scale-95 transition-all shadow-xs cursor-pointer"
                >
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </form>
          
          {/* Disclaimer Footer */}
          <p className="text-[10px] md:text-xs text-text-muted tracking-wide mt-3 text-center">
            ATRA Intelligence é uma IA e pode cometer erros. Por favor verifique informações críticas.
          </p>
        </div>
      </div>

      {/* Clients Carousel Below - Remodeled to match reference */}
      <div className="w-full max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-200/40 dark:border-slate-800/80">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          {/* Left Title with Vertical Line */}
          <div className="flex-shrink-0 flex items-center gap-6 justify-center md:justify-start w-full md:w-auto">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-100 uppercase tracking-widest max-w-[180px] leading-relaxed text-center md:text-left whitespace-normal">
              {t('sections.clientsTitle')}
            </span>
            <div className="hidden md:block w-[1px] h-8 bg-slate-300 dark:bg-slate-700" />
          </div>
          
          {/* Right Scrolling Carousel */}
          <div className="flex-1 min-w-0 w-full">
            <ClientCarousel />
          </div>
        </div>
      </div>
    </section>
  );
};

const BlogCard = ({ category, title, image, aspect, icon: IconComp }: { category: string, title: string, image: string, aspect: string, icon?: any }) => (
  <a href="#" className={`relative group overflow-hidden rounded-lg ${aspect} block shadow-xl"`}>
    <img 
      src={image} 
      alt={title} 
      loading="lazy"
      decoding="async"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-surface-1/95 via-surface-1/60 to-transparent p-5 flex flex-col justify-end">
      <div className="flex items-center gap-1.5 mb-1.5">
        {IconComp && <IconComp size={13} className="text-secondary" />}
        <span className="text-[10px] font-bold tracking-widest uppercase text-secondary">{category}</span>
      </div>
      <h3 className="text-sm sm:text-base font-medium leading-tight text-text-main group-hover:text-primary transition-colors">
        {title} <ArrowRight size={13} className="inline ml-1" />
      </h3>
    </div>
  </a>
);

const BlogSection = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="bg-surface-1 py-20 text-text-subtle overflow-hidden relative"
    >
      {/* Technological detail lines */}
      <TechHorizontalLine color="blue" sectionName="BLOG_TRENDS" align="left" side="top" delay={0.2} />
      <TechVerticalLine color="orange" sectionName="INSIGHT_STREAM" align="left" alignY="bottom" delay={0.3} />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          {/* Column 1 - Intro + Small Cards */}
          <div className="flex flex-col gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider mb-3 ">
                <BookOpen size={13} /> Insights & Tendências
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-light leading-tight mb-4 text-text-main">
                Qual é o seu próximo passo brilhante?
              </h2>
              <p className="text-text-muted font-light text-xs sm:text-sm leading-relaxed">
                Trabalho que muda o jogo. Crescimento impulsionado por pessoas. Na ATRA, ajudamos você a pensar maior, construir mais forte e expandir oportunidades para todos.
              </p>
            </div>
            
            <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-4 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar">
              <div className="min-w-[240px] md:min-w-0 w-full shrink-0">
                <BlogCard 
                  category="BLOG POST"
                  icon={Sparkles}
                  title="Inovação em ação: Onde a criatividade encontra a colaboração"
                  image="/imagens/picsum-tech1x600x400-6656d3.jpg"
                  aspect="aspect-[4/3]"
                />
              </div>
              <div className="min-w-[240px] md:min-w-0 w-full shrink-0">
                <BlogCard 
                  category="BLOG POST"
                  icon={TrendingUp}
                  title="Focado no impacto: Três estratégias essenciais"
                  image="/imagens/picsum-tech2x600x400-7656a4.jpg"
                  aspect="aspect-[4/3]"
                />
              </div>
            </div>
          </div>

          {/* Column 2 - Vertical scroll/stack cards */}
          <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible gap-4 pb-4 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 no-scrollbar items-start">
            <div className="min-w-[240px] md:min-w-0 w-full shrink-0">
              <BlogCard 
                category="ARTIGO"
                icon={UserCheck}
                title="Liderando em meio a mudanças: 5 imperativos para CEOs"
                image="/imagens/picsum-tech3x600x600-80827c.jpg"
                aspect="aspect-square"
              />
            </div>
            <div className="min-w-[240px] md:min-w-0 w-full shrink-0">
              <BlogCard 
                category="ARTIGO"
                icon={Cpu}
                title="O futuro da IA generativa nas empresas"
                image="/imagens/picsum-tech4x600x600-8054dd.jpg"
                aspect="aspect-square"
              />
            </div>
          </div>

          {/* Column 3 - Featured + Subscribe */}
          <div className="flex flex-col gap-6">
            <div className="relative group overflow-hidden rounded-lg min-h-[280px] md:min-h-[340px] shadow-xl">
               <img 
                src="/imagens/picsum-tech5x600x800-aa403b.jpg" 
                alt="Case Study" 
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-1/95 via-surface-1/50 to-transparent p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase mb-1.5 block text-secondary">CASE STUDY</span>
                  <h3 className="text-base font-display leading-snug text-text-main">
                    Uma empresa familiar traz o poder da IA para a mesa de jantar
                  </h3>
                </div>
                <button className="bg-secondary hover:bg-orange-600 text-white px-5 py-2.5 rounded-[6px] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 w-fit transition-colors shadow-md cursor-pointer active:scale-95">
                  Ler estudo de caso <ArrowRight size={14} />
                </button>
              </div>
            </div>

            <div className="bg-surface-2 p-6 rounded-[6px] shadow-xl">
              <h4 className="text-base md:text-lg font-light font-display mb-4 text-text-main">
                Inscreva-se para receber os últimos insights da ATRA.
              </h4>
              <div className="flex mt-4">
                <input 
                  type="email" 
                  placeholder="Endereço de e-mail" 
                  className="flex-1 bg-surface-1 p-3 text-text-main border-r-0 focus:ring-1 focus:ring-primary outline-none text-xs rounded-l-[6px] font-light"
                />
                <button className="bg-secondary hover:bg-orange-600 text-white px-4 transition-colors rounded-r-[6px] cursor-pointer active:scale-95">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

const CTA = () => {
  return (
    <section 
      id="fale-conosco" 
      className="py-16 bg-surface-2 dark:bg-[#12151c] relative overflow-hidden px-3 sm:px-6 transition-colors duration-500"
    >
      {/* Technological detail lines */}
      <TechHorizontalLine color="mixed" sectionName="CTA_CONNECT" align="right" side="top" delay={0.2} />
      <TechVerticalLine color="blue" sectionName="NEGOCIOS" align="right" alignY="top" delay={0.3} />
      <TechCornerBraces color="orange" position="bottom-left" delay={0.4} />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch relative z-10">
          
          {/* Left Side: Contact Form */}
          <div className="flex flex-col text-left py-8 md:py-12 pr-0 lg:pr-12">
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-display text-text-main dark:text-white mb-8 leading-tight">
              Vamos construir o próximo nível do seu negócio?
            </h2>

            <h3 className="text-xl md:text-2xl font-light font-display text-text-main dark:text-white mb-6">
              Comece seu projeto de dados!
            </h3>
            
            <form className="flex flex-col space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input 
                  type="text" 
                  className="w-full bg-transparent border-b border-border-main dark:border-white/20 focus:border-primary dark:focus:border-white outline-none py-2 text-sm text-text-main dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 font-light transition-colors" 
                  placeholder="Nome completo" 
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <input 
                  type="email" 
                  className="w-full bg-transparent border-b border-border-main dark:border-white/20 focus:border-primary dark:focus:border-white outline-none py-2 text-sm text-text-main dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 font-light transition-colors" 
                  placeholder="E-mail" 
                />
                <input 
                  type="tel" 
                  className="w-full bg-transparent border-b border-border-main dark:border-white/20 focus:border-primary dark:focus:border-white outline-none py-2 text-sm text-text-main dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 font-light transition-colors" 
                  placeholder="Telefone" 
                />
              </div>
              <div className="pt-2">
                <input 
                  type="text" 
                  className="w-full bg-transparent border-b border-border-main dark:border-white/20 focus:border-primary dark:focus:border-white outline-none py-2 pb-16 text-sm text-text-main dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 font-light transition-colors" 
                  placeholder="Sua mensagem" 
                />
              </div>
              <div className="flex justify-end pt-4">
                <button className="bg-primary hover:bg-primary-dark text-white dark:bg-white dark:text-[#12151c] dark:hover:bg-white/90 py-3 px-6 rounded-[6px] text-sm font-medium transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95">
                  <span>Enviar</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>

          {/* Right Side: Human Team Image Card */}
          <div className="relative rounded-[6px] overflow-hidden flex flex-col justify-between p-8 sm:p-10 min-h-[500px] shadow-xl dark:shadow-2xl bg-surface-1 dark:bg-[#12151c]">
            {/* Background image (happy tech team collaborating) */}
            <img 
              src="/imagens/unsplash-1556761175-5973dc0f32e7-w1600-fee708.jpg" 
              alt="Equipe ATRA reunida e motivada" 
              loading="lazy"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover opacity-25 dark:opacity-35 scale-105"
            />
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-surface-1/90 via-surface-1/80 to-surface-2/95 dark:from-black/90 dark:via-black/60 dark:to-[#12151c]/95 mix-blend-multiply" />
            <div className="absolute inset-0 bg-surface-1/40 dark:bg-[#12151c]/30" />

            {/* Top Content: Contact Information */}
            <div className="relative z-10 text-text-main dark:text-white">
              <h3 className="text-xl md:text-2xl font-light font-display text-text-main dark:text-white mb-6">
                Nossos Contatos
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg">
                <div>
                  <p className="text-[10px] text-text-muted dark:text-white/50 font-bold uppercase tracking-wider mb-2">E-mail</p>
                  <p className="text-sm font-light text-text-main dark:text-white/90">negocios@atra.<br/>com.br</p>
                </div>
                <div>
                  <p className="text-[10px] text-text-muted dark:text-white/50 font-bold uppercase tracking-wider mb-2">Endereço</p>
                  <p className="text-sm font-light text-text-main dark:text-white/90">Av. Queiroz Filho, 1700<br/>Torre D Sala 802<br/>Vila Hamburguesa – SP</p>
                </div>
              </div>
            </div>

            {/* Bottom Content: WhatsApp Direct Call & Social Networks */}
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-8">
              {/* WhatsApp Quick CTA Box */}
              <a 
                href="https://wa.me/5511963052391" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-surface-2/95 dark:bg-[#181b22]/95 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 backdrop-blur-sm border border-border-main dark:border-white/10 hover:border-emerald-500/40 rounded-[6px] px-4 py-3 shadow-lg flex items-center justify-between gap-4 transition-all duration-300 flex-1 sm:flex-initial h-[76px]"
              >
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] uppercase font-normal tracking-wider text-emerald-600 dark:text-emerald-400">Conversar agora</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-sm font-medium text-text-main dark:text-white tracking-tight">
                    +55 (11) 96305-2391
                  </p>
                </div>
                <div className="w-9 h-9 rounded-[6px] bg-emerald-500/15 text-emerald-500 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Icon icon="mdi:whatsapp" width={19} />
                </div>
              </a>

              {/* Social Networks Box */}
              <div className="bg-surface-2/95 dark:bg-[#181b22]/95 backdrop-blur-sm border border-border-main dark:border-white/10 rounded-[6px] px-4 py-3 shadow-lg flex flex-col justify-center gap-1.5 flex-1 sm:flex-initial h-[76px]">
                <p className="text-[10px] uppercase font-normal tracking-wider text-text-muted dark:text-white/60">
                  Nossas redes sociais
                </p>
                <div className="flex items-center gap-3">
                  {/* LinkedIn (#0A66C2) */}
                  <a 
                    href="https://www.linkedin.com/company/atra-tecnologia/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-[6px] bg-[#0A66C2]/15 text-[#0A66C2] dark:bg-[#0A66C2]/20 dark:text-[#388DFF] flex items-center justify-center transition-transform hover:scale-105"
                    aria-label="LinkedIn da ATRA"
                  >
                    <Icon icon="mdi:linkedin" width={19} />
                  </a>
                  {/* Instagram (#E4405F / Pink gradient feel) */}
                  <a 
                    href="https://www.instagram.com/atratecnologia/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-[6px] bg-[#E4405F]/15 text-[#E4405F] dark:bg-[#E4405F]/20 dark:text-[#FA7298] flex items-center justify-center transition-transform hover:scale-105"
                    aria-label="Instagram da ATRA"
                  >
                    <Icon icon="mdi:instagram" width={19} />
                  </a>
                  {/* YouTube (#FF0000) */}
                  <a 
                    href="https://www.youtube.com/@atratecnologia" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-9 h-9 rounded-[6px] bg-[#FF0000]/15 text-[#FF0000] dark:bg-[#FF0000]/20 dark:text-[#FF4E4E] flex items-center justify-center transition-transform hover:scale-105"
                    aria-label="YouTube da ATRA"
                  >
                    <Icon icon="mdi:youtube" width={19} />
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const { t } = useTranslation();
  const translatedSolutions = t('megaMenu.solutions', { returnObjects: true }) as any[];

  return (
    <footer className="bg-[#0e1015] text-white/70 pt-16 pb-10 rounded-t-lg relative overflow-hidden ">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="grid md:grid-cols-5 gap-10 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4">
              <img 
                src="/imagens/atra_horizontal_cor-2048x1134-ba220b.png" 
                alt="ATRA Logo" 
                loading="lazy"
                decoding="async"
                className="h-10 w-auto object-contain brightness-110"
              />
            </div>
            <p className="text-xs font-light leading-relaxed mb-4 text-white/60">
              {t('partner.aboutP2')}
            </p>
            <div className="flex gap-2.5">
              <a href="#" className="w-8 h-8 rounded-md bg-white/10 hover:bg-primary transition-all flex items-center justify-center text-white ">
                <Linkedin size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-md bg-white/10 hover:bg-primary transition-all flex items-center justify-center text-white ">
                <Instagram size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-md bg-white/10 hover:bg-primary transition-all flex items-center justify-center text-white ">
                <Youtube size={14} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-primary font-medium text-xs font-display tracking-wide mb-4">{t('nav.solutions')}</h4>
            <ul className="space-y-2 text-xs font-light">
              {translatedSolutions.map((sol, index) => (
                /* As 3 são categorias do menu, não soluções com página própria:
                   o destino de todas é o índice. Mesmo caso dos 3 links legais. */
                <li key={index}><Link to="/solucoes" className="hover:text-white transition-colors">{sol.title}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-primary font-medium text-xs font-display tracking-wide mb-4">{t('nav.about')}</h4>
            <ul className="space-y-2 text-xs font-light">
              {/* Sem destino aqui, como no menu: a página de segmentos nasce no site
                  novo. O item existe para o rodapé bater com o gabarito. */}
              <li><a href="#" className="hover:text-white transition-colors">{t('nav.segments')}</a></li>
              <li><Link to="/consultores" className="hover:text-white transition-colors">{t('nav.consultants')}</Link></li>
              <li><Link to="/cases-de-sucesso" className="hover:text-white transition-colors">{t('nav.insights')}</Link></li>
              <li><Link to="/parceiros/google-cloud" className="hover:text-white transition-colors">{t('nav.partners')}</Link></li>
              <li><Link to="/carreiras" className="hover:text-white transition-colors">{t('nav.careers')}</Link></li>
              <li><Link to="/sobre" className="hover:text-white transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/glossario" className="hover:text-white transition-colors">{t('nav.glossary')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-primary font-medium text-xs font-display tracking-wide mb-4">{t('nav.contact')}</h4>
            <ul className="space-y-3 text-xs font-light">
              <li className="flex gap-2.5">
                <Phone size={16} className="text-secondary opacity-80 shrink-0" />
                <a href="https://wa.me/5511963052391" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+55 11 96305-2391</a>
              </li>
              <li className="flex gap-2.5">
                <Mail size={16} className="text-secondary opacity-80 shrink-0" />
                <a href="mailto:negocios@atra.com.br" className="hover:text-white transition-colors">negocios@atra.com.br</a>
              </li>
              <li className="flex gap-2.5">
                <MapPin size={16} className="text-secondary opacity-80 shrink-0" />
                <span className="leading-relaxed text-white/60">Av. Queiroz Filho, 1700 – Torre D Sala 802 Vila Hamburguesa – SP</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-primary font-medium text-xs font-display tracking-wide mb-4">Legal</h4>
            <ul className="space-y-2 text-xs font-light">
              <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-6  flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] font-light text-white/40">
          <p>&copy; 2026 ATRA. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <Link to="/design-system" className="hover:text-primary transition-colors">Design System</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const Home = () => {
  return (
    <main className="relative overflow-hidden">
      <HomeParallaxDecorations />
      <AetherFlowHero>
        <Clients />
      </AetherFlowHero>
      <Stats />
      <Features />
      <Partners />
      <CustomerStories />
      <Testimonials />
      <BlogSection />
      <CTA />
    </main>
  );
};

const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      <span className="text-xs font-medium text-text-muted animate-pulse">Carregando...</span>
    </div>
  </div>
);

const AppRoutes = () => {
  const location = useLocation();
  const isChat = location.pathname === '/chat';
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // initialize from HTML class if possible, defaulting to dark
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('light') ? 'light' : 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={cn(
      "bg-surface-1 font-sans selection:bg-primary/30 flex flex-col transition-colors duration-500",
      isChat ? "h-[100dvh] overflow-hidden" : "min-h-screen"
    )}>
      <Navbar />
      {isChat ? (
        <div className="flex-1 flex flex-col min-h-0">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/chat" element={<Chat />} />
            </Routes>
          </Suspense>
        </div>
      ) : (
        <SmoothScroll>
          <div className="flex-1 flex flex-col min-h-0">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/consultores" element={<Consultants />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/glossario" element={<Glossary />} />
                <Route path="/parceiros/google-cloud" element={<PartnerGoogleCloud />} />
                <Route path="/solucoes" element={<SolutionAI />} />
                <Route path="/solucoes/inteligencia-artificial" element={<SolutionAI />} />
                <Route path="/design-system" element={<DesignSystem />} />
                <Route path="/carreiras" element={<Careers />} />
                <Route path="/sobre" element={<About />} />
                <Route path="/cases-de-sucesso" element={<SuccessStories />} />
                <Route path="/cases-de-sucesso/marketplace-governanca-dados" element={<MarketplaceGovernance />} />
                <Route path="/cases-de-sucesso/migracao-legado-gcp" element={<LegacyMigration />} />
                <Route path="/cases-de-sucesso/eficiencia-processos-risco" element={<RiskEfficiency />} />
                <Route path="/cases-de-sucesso/dashboards-estrategicos" element={<StrategicDashboards />} />
                <Route path="/relatorios" element={<Reports />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/webinars" element={<Webinars />} />
                <Route path="/ebooks" element={<Ebooks />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </SmoothScroll>
      )}
      
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed bottom-6 md:bottom-12 right-0 z-[100] bg-surface-2 dark:bg-surface-3 text-text-main p-3 pl-4 pr-2.5 rounded-l-lg shadow-[-6px_4px_20px_rgba(0,0,0,0.12)] dark:shadow-[-8px_4px_24px_rgba(0,0,0,0.4)] hover:pr-4 transition-all duration-300 group flex items-center justify-center cursor-pointer"
        aria-label="Toggle Theme"
      >
        <motion.div
           initial={false}
           animate={{ rotate: theme === 'dark' ? 180 : 0, scale: theme === 'dark' ? 0.85 : 1 }}
           transition={{ duration: 0.3 }}
           className="relative flex items-center justify-center"
        >
          {theme === 'dark' ? (
             <Sun size={22} className="text-amber-400 group-hover:text-amber-300 transition-colors" />
          ) : (
             <Moon size={22} className="text-slate-800 dark:text-sky-300 group-hover:text-primary transition-colors" />
          )}
        </motion.div>
      </button>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppRoutes />
    </Router>
  );
}
