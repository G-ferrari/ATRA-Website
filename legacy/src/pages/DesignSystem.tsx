import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BackgroundDecorations, RoundedDiamond } from '@/components/Decorations';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Menu, 
  CheckCircle2, 
  Sparkles, 
  SlidersHorizontal, 
  Layers, 
  Code, 
  Zap, 
  RefreshCw, 
  Sun, 
  Moon,
  Info,
  Send,
  Search,
  Bot,
  Database,
  Cloud,
  Shield,
  BarChart3,
  Phone,
  Check,
  ChevronRight,
  TrendingUp,
  Cpu,
  Share2
} from 'lucide-react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { GlowCard } from '@/components/ui/spotlight-card';
import { 
  TechHorizontalLine, 
  TechVerticalLine, 
  TechCornerBraces, 
  TechSectionBoundary 
} from '@/components/TechDetails';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { StatusBadge, MetricChip } from '@/components/ui/badge-status';
import { TabFilter } from '@/components/ui/tab-filter';
import LogoCloudSwap from '@/components/ui/logo-clouds';
import { ContactCard, ServiceCard, PartnerBadge, ChartCard } from '@/components/ChatGenerativeUI';

const DesignSystem = () => {
  const [demoGlowColor, setDemoGlowColor] = useState<'blue' | 'orange'>('blue');
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>('dark');
  const [activeTabDemo, setActiveTabDemo] = useState<string>('ai');
  const [counterTrigger, setCounterTrigger] = useState<number>(0);
  const [inputDemo, setInputDemo] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleTheme = () => {
    setLocalTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const sampleTabOptions = [
    { id: 'ai', label: 'IA & Agentes', icon: 'fluent:brain-circuit-24-regular', count: 12 },
    { id: 'cloud', label: 'Cloud & Lakehouse', icon: 'fluent:cloud-checkmark-24-regular', count: 8 },
    { id: 'finops', label: 'FinOps & Custos', icon: 'fluent:money-calculator-24-regular', count: 5 },
    { id: 'bi', label: 'Business Intelligence', icon: 'fluent:data-pie-24-regular', count: 14 },
  ];

  return (
    <main className={`min-h-screen transition-colors duration-500 pb-28 ${
      localTheme === 'dark' ? 'bg-[#0e1015] text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Hero Section */}
      <section className={`pt-32 pb-16 relative overflow-hidden border-b transition-colors duration-500 ${
        localTheme === 'dark' ? 'bg-[#181b22] border-white/5' : 'bg-white border-slate-200'
      }`}>
        <BackgroundDecorations />
        <div className="container mx-auto px-6 relative z-10 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <div className="flex items-center gap-2 mb-3">
                <StatusBadge 
                  label="ATRA Design System v2.5" 
                  variant="primary" 
                  size="sm"
                  pulse={true} 
                  icon={<Sparkles size={12} />} 
                />
                <span className={`px-2 py-0.5 rounded-[6px] text-[10px] font-bold uppercase tracking-wider ${
                  localTheme === 'dark' ? 'bg-surface-3 text-text-muted' : 'bg-slate-100 text-slate-600'
                }`}>
                  Single Source of Truth
                </span>
              </div>
              <h1 className={`text-4xl md:text-5xl font-extrabold tracking-tight mb-4 ${
                localTheme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                Design System & Componentes
              </h1>
              <p className={`text-base md:text-lg leading-relaxed ${
                localTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Guia unificado com todos os tokens visuais, tipografia, ícones, botões, inputs, cards e componentes interativos da ATRA para acelerar o desenvolvimento de páginas atuais e futuras.
              </p>
            </motion.div>

            {/* Quick Interactive Controls */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className={`p-4 rounded-[6px] flex items-center gap-4 border ${
                localTheme === 'dark' ? 'bg-[#222631] border-white/10' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Visualizar Tema:
              </div>
              <button
                onClick={toggleTheme}
                className={`p-2 px-3 rounded-[6px] cursor-pointer flex items-center gap-2 text-xs font-bold transition-all active:scale-95 ${
                  localTheme === 'dark' 
                    ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25 border border-amber-500/20' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {localTheme === 'dark' ? (
                  <>
                    <Sun size={14} /> Modo Claro
                  </>
                ) : (
                  <>
                    <Moon size={14} /> Modo Escuro (Default)
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 mt-16 max-w-7xl space-y-24">
        
        {/* SECTION 1: CORES E GRADIENTES */}
        <section id="cores" className="relative">
          <div className="mb-8">
            <h2 className={`text-2xl font-bold tracking-tight border-b pb-3 flex items-center gap-2 ${
              localTheme === 'dark' ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'
            }`}>
              <Sparkles className="text-primary" size={20} /> 1. Paleta de Cores, Superfícies & Gradientes
            </h2>
            <p className={`text-sm mt-2 ${localTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Cores de marca, temas de superfície escuro/claro e gradientes de destaque da ATRA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Brand Accent Colors */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Cores de Marca (Brand)</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-[6px] bg-primary flex flex-col justify-end h-24 shadow-md">
                  <span className="text-white font-mono text-xs font-bold">#3C98FA</span>
                  <span className="text-white/80 text-[10px] uppercase font-semibold">bg-primary / Brand Blue</span>
                </div>
                <div className="p-4 rounded-[6px] bg-primary-dark flex flex-col justify-end h-20 shadow-xs">
                  <span className="text-white font-mono text-xs font-bold">#2A75C5</span>
                  <span className="text-white/80 text-[10px] uppercase font-semibold">bg-primary-dark / Deep Blue</span>
                </div>
                <div className="p-4 rounded-[6px] bg-secondary flex flex-col justify-end h-24 shadow-md">
                  <span className="text-white font-mono text-xs font-bold">#FF8B08</span>
                  <span className="text-white/80 text-[10px] uppercase font-semibold">bg-secondary / ATRA Orange</span>
                </div>
              </div>
            </div>

            {/* Premium Dark Graphite Palette */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Paleta Graphite Escura</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-[6px] bg-[#0e1015] border border-white/10 flex flex-col justify-end h-24 shadow-md">
                  <span className="text-white font-mono text-xs font-bold">#0E1015</span>
                  <span className="text-white/80 text-[10px] uppercase font-semibold">bg-surface-1 / Deep Graphite Canvas</span>
                </div>
                <div className="p-4 rounded-[6px] bg-[#181b22] border border-white/10 flex flex-col justify-end h-20 shadow-xs">
                  <span className="text-white font-mono text-xs font-bold">#181B22</span>
                  <span className="text-white/80 text-[10px] uppercase font-semibold">bg-surface-2 / Card Surface</span>
                </div>
                <div className="p-4 rounded-[6px] bg-[#222631] border border-white/10 flex flex-col justify-end h-20 shadow-xs">
                  <span className="text-white font-mono text-xs font-bold">#222631</span>
                  <span className="text-white/80 text-[10px] uppercase font-semibold">bg-surface-3 / Elevated Surface</span>
                </div>
              </div>
            </div>

            {/* Gradients & Text Accents */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Gradientes da Marca</h3>
              <div className="space-y-3">
                <div className="p-4 rounded-[6px] bg-gradient-atra flex flex-col justify-end h-24 shadow-md">
                  <span className="text-white font-mono text-xs font-bold">bg-gradient-atra</span>
                  <span className="text-white/80 text-[10px] uppercase font-semibold">Linear from #3C98FA to #FF8B08</span>
                </div>
                <div className={`p-4 rounded-[6px] border flex flex-col justify-end h-20 shadow-xs ${
                  localTheme === 'dark' ? 'bg-[#181b22] border-white/10' : 'bg-white border-slate-200'
                }`}>
                  <span className="text-gradient font-bold text-base">text-gradient</span>
                  <span className="text-text-muted text-[10px] uppercase font-semibold">Gradiente Aplicado a Títulos</span>
                </div>
                <div className={`p-4 rounded-[6px] border flex flex-col justify-end h-20 shadow-xs ${
                  localTheme === 'dark' ? 'bg-[#181b22] border-white/10' : 'bg-white border-slate-200'
                }`}>
                  <div className="flex gap-2">
                    <span className="w-4 h-4 rounded-full bg-primary/20 border border-primary/40"></span>
                    <span className="w-4 h-4 rounded-full bg-secondary/20 border border-secondary/40"></span>
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40"></span>
                  </div>
                  <span className="text-text-muted text-[10px] uppercase font-semibold mt-1">Opacidades /10, /20 para Badges</span>
                </div>
              </div>
            </div>

          </div>

          {/* Border Radius Tokens Sub-section */}
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Padrão de Arredondamento (Roundness 6px Padrão)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-4 rounded-[6px] border flex items-center justify-between ${
                localTheme === 'dark' ? 'bg-[#181b22] border-white/10' : 'bg-white border-slate-200'
              }`}>
                <div>
                  <div className="text-xs font-bold">Sub-tags & Chips Internos</div>
                  <div className="text-[10px] text-text-muted font-mono">rounded-[6px] / 6px</div>
                </div>
                <div className="w-8 h-8 rounded-[6px] bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-bold text-primary">
                  6px
                </div>
              </div>

              <div className={`p-4 rounded-[6px] border flex items-center justify-between ${
                localTheme === 'dark' ? 'bg-[#181b22] border-white/10' : 'bg-white border-slate-200'
              }`}>
                <div>
                  <div className="text-xs font-bold">Botões, Cards & Inputs (Padrão)</div>
                  <div className="text-[10px] text-text-muted font-mono">rounded-[6px] / 6px</div>
                </div>
                <div className="w-8 h-8 rounded-[6px] bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] font-bold text-primary">
                  6px
                </div>
              </div>

              <div className={`p-4 rounded-[6px] border flex items-center justify-between ${
                localTheme === 'dark' ? 'bg-[#181b22] border-white/10' : 'bg-white border-slate-200'
              }`}>
                <div>
                  <div className="text-xs font-bold">Consistência Visual Global</div>
                  <div className="text-[10px] text-text-muted font-mono">rounded-[6px] em toda a aplicação</div>
                </div>
                <div className="w-8 h-8 rounded-[6px] bg-secondary/20 border border-secondary/40 flex items-center justify-center text-[10px] font-bold text-secondary">
                  6px
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* SECTION 2: TIPOGRAFIA & ESCALAS DENSAS */}
        <section id="tipografia">
          <div className="mb-8">
            <h2 className={`text-2xl font-bold tracking-tight border-b pb-3 flex items-center gap-2 ${
              localTheme === 'dark' ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'
            }`}>
              <Layers className="text-primary" size={20} /> 2. Tipografia & Escalas para UI Densa
            </h2>
            <p className={`text-sm mt-2 ${localTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Mona Sans com hierarquia proporcional para páginas institucionais e tamanhos otimizados para dashboards e chat.
            </p>
          </div>

          <div className={`p-8 rounded-[6px] border ${
            localTheme === 'dark' ? 'bg-[#181b22] border-white/5' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">Display & Headings</span>
                  <h3 className="text-3xl font-bold">Mona Sans Display</h3>
                  <p className="text-xs text-text-muted font-mono">font-display / letter-spacing: -0.02em</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-none mb-1">Display XL</h4>
                    <span className="text-xs text-text-muted font-mono">text-3xl md:text-4xl font-extrabold</span>
                  </div>
                  <div>
                    <h4 className="text-xl md:text-2xl font-bold tracking-tight mb-1">Heading Large</h4>
                    <span className="text-xs text-text-muted font-mono">text-xl md:text-2xl font-bold</span>
                  </div>
                  <div>
                    <h4 className="text-base md:text-lg font-semibold tracking-tight mb-1">Section Title</h4>
                    <span className="text-xs text-text-muted font-mono">text-base md:text-lg font-semibold</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">Body, Chat & Dense UI</span>
                  <h3 className="text-3xl font-normal">Mona Sans UI</h3>
                  <p className="text-xs text-text-muted font-mono">font-sans (Default Fallback)</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm md:text-base font-normal leading-relaxed text-text-muted mb-1">
                      Corpo de texto padrão para artigos, descrições e cases institucionais.
                    </p>
                    <span className="text-xs text-text-muted font-mono">text-sm md:text-base font-normal</span>
                  </div>
                  <div className="p-3 rounded-[6px] bg-surface-3 dark:bg-[#222631] border border-border-main">
                    <p className="text-[13px] font-medium text-text-main leading-relaxed mb-0.5">
                      "Escala compacta para o Chat e Dashboards técnicos."
                    </p>
                    <span className="text-[10px] text-text-muted font-mono">text-[13px] / text-[11px] / text-[10px]</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* SECTION 3: CATÁLOGO DE ÍCONES */}
        <section id="icones">
          <div className="mb-8">
            <h2 className={`text-2xl font-bold tracking-tight border-b pb-3 flex items-center gap-2 ${
              localTheme === 'dark' ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'
            }`}>
              <Cpu className="text-primary" size={20} /> 3. Catálogo de Ícones (Lucide & Iconify)
            </h2>
            <p className={`text-sm mt-2 ${localTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Todas as famílias de ícones padronizadas: Fluent para Soluções Técnicas, Logos para Parceiros e Lucide para Ações de UI.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Fluent Iconify */}
            <div className={`p-6 rounded-[6px] border ${
              localTheme === 'dark' ? 'bg-[#181b22] border-white/5' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
                <Sparkles size={14} className="text-primary" /> Iconify: Fluent (Soluções & Áreas)
              </h3>
              <p className="text-xs text-text-muted mb-4">
                Utilizados nos cards de soluções da Home, no Chat e nos destaques de serviços:
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-[6px] bg-surface-3 dark:bg-[#222631] border border-border-main flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center">
                    <Icon icon="fluent:brain-circuit-24-regular" width={18} />
                  </div>
                  <span className="text-[11px] font-bold">IA Generativa</span>
                </div>
                <div className="p-3 rounded-[6px] bg-surface-3 dark:bg-[#222631] border border-border-main flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center">
                    <Icon icon="fluent:cloud-checkmark-24-regular" width={18} />
                  </div>
                  <span className="text-[11px] font-bold">Cloud & Data</span>
                </div>
                <div className="p-3 rounded-[6px] bg-surface-3 dark:bg-[#222631] border border-border-main flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center">
                    <Icon icon="fluent:money-calculator-24-regular" width={18} />
                  </div>
                  <span className="text-[11px] font-bold">FinOps Cloud</span>
                </div>
                <div className="p-3 rounded-[6px] bg-surface-3 dark:bg-[#222631] border border-border-main flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center">
                    <Icon icon="fluent:data-pie-24-regular" width={18} />
                  </div>
                  <span className="text-[11px] font-bold">Lakehouse / BI</span>
                </div>
              </div>
            </div>

            {/* Logos Iconify */}
            <div className={`p-6 rounded-[6px] border ${
              localTheme === 'dark' ? 'bg-[#181b22] border-white/5' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-500" /> Iconify: Logos (Parceiros Oficiais)
              </h3>
              <p className="text-xs text-text-muted mb-4">
                Ícones vetorizados com fidelidade de marca para badges e credenciais:
              </p>
              <div className="flex flex-wrap gap-2">
                <PartnerBadge name="Google Cloud" />
                <PartnerBadge name="Microsoft Azure" />
                <PartnerBadge name="Databricks" />
                <PartnerBadge name="IBM" />
                <PartnerBadge name="BigID" />
                <PartnerBadge name="Denodo" />
              </div>
            </div>

            {/* Lucide Icons */}
            <div className={`p-6 rounded-[6px] border ${
              localTheme === 'dark' ? 'bg-[#181b22] border-white/5' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3 flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-secondary" /> Lucide (Ações & Navegação)
              </h3>
              <p className="text-xs text-text-muted mb-4">
                Ícones de sistema com traço de 1.75px para feedback de clique e botões:
              </p>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 rounded-[6px] bg-surface-3 dark:bg-[#222631] flex flex-col items-center justify-center gap-1">
                  <ArrowRight size={16} className="text-primary" />
                  <span className="text-[9px] text-text-muted">ArrowRight</span>
                </div>
                <div className="p-2 rounded-[6px] bg-surface-3 dark:bg-[#222631] flex flex-col items-center justify-center gap-1">
                  <ArrowUpRight size={16} className="text-secondary" />
                  <span className="text-[9px] text-text-muted">ArrowUpRight</span>
                </div>
                <div className="p-2 rounded-[6px] bg-surface-3 dark:bg-[#222631] flex flex-col items-center justify-center gap-1">
                  <Sparkles size={16} className="text-amber-400" />
                  <span className="text-[9px] text-text-muted">Sparkles</span>
                </div>
                <div className="p-2 rounded-[6px] bg-surface-3 dark:bg-[#222631] flex flex-col items-center justify-center gap-1">
                  <TrendingUp size={16} className="text-emerald-500" />
                  <span className="text-[9px] text-text-muted">TrendingUp</span>
                </div>
              </div>
            </div>

          </div>
        </section>


        {/* SECTION 4: BOTÕES, INPUTS & FORMULÁRIOS COM 6PX */}
        <section id="botoes-inputs">
          <div className="mb-8">
            <h2 className={`text-2xl font-bold tracking-tight border-b pb-3 flex items-center gap-2 ${
              localTheme === 'dark' ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'
            }`}>
              <Zap className="text-primary" size={20} /> 4. Botões, Inputs & Controles (6px Roundness)
            </h2>
            <p className={`text-sm mt-2 ${localTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Padrões unificados de entrada de dados e chamadas de ação com bordas de 6px.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Botões */}
            <div className={`p-8 rounded-[6px] border space-y-6 ${
              localTheme === 'dark' ? 'bg-[#181b22] border-white/5' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Família de Botões da ATRA</h3>
              
              <div className="flex flex-wrap items-center gap-3">
                <button className="pill-btn-primary cursor-pointer">
                  Entrar em Contato <ArrowRight size={14} />
                </button>
                <button className="pill-btn-secondary cursor-pointer">
                  Explorar Casos <ArrowUpRight size={14} />
                </button>
                <button className="pill-btn-outline cursor-pointer">
                  Documentação <SlidersHorizontal size={14} />
                </button>
              </div>

              <div className="pt-4 border-t border-border-main space-y-3">
                <h4 className="text-xs font-bold text-text-main">Botão de Envio de Mensagem / Chat:</h4>
                <div className="flex gap-2">
                  <button className="px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white font-bold text-[11px] uppercase tracking-wider rounded-[6px] flex items-center gap-2 hover:shadow-md hover:shadow-primary/25 cursor-pointer active:scale-95 transition-all">
                    <Send size={13} />
                    <span>Enviar Mensagem</span>
                  </button>
                  <button className="px-3 py-2.5 rounded-[6px] bg-surface-3 dark:bg-[#222631] border border-border-main text-text-muted hover:text-text-main text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                    <RefreshCw size={13} />
                    <span>Nova Conversa</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Inputs & Busca */}
            <div className={`p-8 rounded-[6px] border space-y-6 ${
              localTheme === 'dark' ? 'bg-[#181b22] border-white/5' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Inputs Padronizados (6px)</h3>
              
              {/* Search input with icon */}
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <input 
                  type="text" 
                  placeholder="Pesquisar artigos, cases ou termos do glossário..." 
                  className="w-full bg-surface-1 dark:bg-[#0e1015] border border-border-main text-text-main placeholder:text-text-muted pl-10 pr-4 py-2.5 rounded-[6px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-[13px] transition-all shadow-inner"
                />
              </div>

              {/* Chat Input Bar */}
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={inputDemo}
                  onChange={(e) => setInputDemo(e.target.value)}
                  placeholder="Pergunte sobre IA Generativa, FinOps ou Lakehouse..." 
                  className="flex-1 bg-surface-1 dark:bg-[#0e1015] border border-border-main text-text-main placeholder:text-text-muted px-4 py-2.5 rounded-[6px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-[13px] transition-all shadow-inner"
                />
                <button 
                  className="px-4 py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-[6px] flex items-center justify-center gap-1.5 hover:shadow-md cursor-pointer active:scale-95 transition-all shrink-0"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>

          </div>
        </section>


        {/* SECTION 5: BADGES, METRIC CHIPS & STATUS INDICATORS */}
        <section id="badges-status">
          <div className="mb-8">
            <h2 className={`text-2xl font-bold tracking-tight border-b pb-3 flex items-center gap-2 ${
              localTheme === 'dark' ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'
            }`}>
              <CheckCircle2 className="text-emerald-500" size={20} /> 5. Badges, Metric Chips & Indicadores de Status
            </h2>
            <p className={`text-sm mt-2 ${localTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Componentes para feedback de conexão, status operacional e métricas de impacto.
            </p>
          </div>

          <div className={`p-8 rounded-[6px] border ${
            localTheme === 'dark' ? 'bg-[#181b22] border-white/5' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Status Operacional</h4>
                <div className="flex flex-col gap-2">
                  <StatusBadge label="Especialistas Online" variant="online" pulse={true} />
                  <StatusBadge label="Chatbot IA v2.0 (Beta)" variant="beta" icon={<Sparkles size={13} />} />
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Tags de Categoria</h4>
                <div className="flex flex-col gap-2">
                  <StatusBadge label="Arquitetura Lakehouse" variant="primary" icon="fluent:cloud-checkmark-24-regular" />
                  <StatusBadge label="FinOps & Governança" variant="secondary" icon="fluent:money-calculator-24-regular" />
                </div>
              </div>

              <div className="space-y-3 lg:col-span-2">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Metric Chips de Alto Impacto</h4>
                <div className="flex flex-wrap gap-3">
                  <MetricChip value="+300%" label="Ganho em Performance" trend="ROI" />
                  <MetricChip value="-45%" label="Custo de Nuvem (FinOps)" trend="Otimizado" />
                  <MetricChip value="99.99%" label="SLA de Disponibilidade" />
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* SECTION 6: COMPONENTES INTERATIVOS (TABS, COUNTERS, LOGO CLOUDS) */}
        <section id="componentes-dinamicos">
          <div className="mb-8">
            <h2 className={`text-2xl font-bold tracking-tight border-b pb-3 flex items-center gap-2 ${
              localTheme === 'dark' ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'
            }`}>
              <RefreshCw className="text-primary" size={20} /> 6. Componentes Dinâmicos & Interativos
            </h2>
            <p className={`text-sm mt-2 ${localTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Elementos com animações de entrada, troca fluida de estado e contadores numéricos progressivos.
            </p>
          </div>

          <div className="space-y-8">
            
            {/* Tab Filter Component */}
            <div className={`p-8 rounded-[6px] border ${
              localTheme === 'dark' ? 'bg-[#181b22] border-white/5' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold">TabFilter (Filtro de Abas com Efeito Spring)</h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Utilizado para alternar pilares de soluções, categorias de blog e cases de sucesso.
                  </p>
                </div>
                <TabFilter 
                  options={sampleTabOptions} 
                  activeId={activeTabDemo} 
                  onChange={setActiveTabDemo} 
                />
              </div>

              <div className="p-4 rounded-[6px] bg-surface-1 dark:bg-[#0e1015] border border-border-main text-xs text-text-muted flex items-center justify-between">
                <span>Aba ativa no momento: <strong className="text-primary font-bold">{sampleTabOptions.find(t => t.id === activeTabDemo)?.label}</strong></span>
                <span className="font-mono text-[10px] bg-surface-3 dark:bg-[#222631] px-2 py-1 rounded-[6px]">activeId: "{activeTabDemo}"</span>
              </div>
            </div>

            {/* AnimatedCounter Demo */}
            <div className={`p-8 rounded-[6px] border ${
              localTheme === 'dark' ? 'bg-[#181b22] border-white/5' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold">AnimatedCounter (Contador Crescente de Métricas)</h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Animação numérica suave disparada ao entrar no campo de visão do usuário.
                  </p>
                </div>
                <button
                  onClick={() => setCounterTrigger(prev => prev + 1)}
                  className="px-3.5 py-1.5 rounded-[6px] bg-surface-3 dark:bg-[#222631] border border-border-main text-xs font-semibold flex items-center gap-1.5 hover:border-primary cursor-pointer active:scale-95 transition-all"
                >
                  <RefreshCw size={13} />
                  <span>Reanimar</span>
                </button>
              </div>

              <div key={counterTrigger} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-[6px] bg-surface-3 dark:bg-[#222631] border border-border-main text-center">
                  <div className="text-3xl font-extrabold text-primary font-mono mb-1">
                    <AnimatedCounter to={150} suffix="+" duration={1.5} />
                  </div>
                  <div className="text-xs text-text-muted font-medium">Projetos de Dados & IA Entregues</div>
                </div>

                <div className="p-5 rounded-[6px] bg-surface-3 dark:bg-[#222631] border border-border-main text-center">
                  <div className="text-3xl font-extrabold text-secondary font-mono mb-1">
                    <AnimatedCounter to={45} suffix="%" duration={1.8} />
                  </div>
                  <div className="text-xs text-text-muted font-medium">Redução Média de Gastos em Nuvem</div>
                </div>

                <div className="p-5 rounded-[6px] bg-surface-3 dark:bg-[#222631] border border-border-main text-center">
                  <div className="text-3xl font-extrabold text-emerald-500 font-mono mb-1">
                    <AnimatedCounter to={99.8} suffix="%" decimals={1} duration={2} />
                  </div>
                  <div className="text-xs text-text-muted font-medium">Índice de Satisfação dos Clientes</div>
                </div>
              </div>
            </div>

            {/* LogoCloudSwap Demo */}
            <div className={`p-8 rounded-[6px] border ${
              localTheme === 'dark' ? 'bg-[#181b22] border-white/5' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="mb-6">
                <h3 className="text-lg font-bold">LogoCloudSwap (Carrossel Interativo de Parceiros)</h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Componente de transição suave de logos com efeito de onda e hover interativo.
                </p>
              </div>
              <div className="rounded-[6px] border border-border-main overflow-hidden bg-surface-1 dark:bg-[#0e1015]">
                <LogoCloudSwap 
                  title="Parceiros Tecnológicos Estratégicos" 
                  subtitle="Trabalhamos lado a lado com os maiores líderes mundiais de tecnologia"
                  className="bg-transparent py-8"
                />
              </div>
            </div>

          </div>
        </section>


        {/* SECTION 7: UI GENERATIVA & GRÁFICOS INTERATIVOS */}
        <section id="ui-generativa">
          <div className="mb-8">
            <h2 className={`text-2xl font-bold tracking-tight border-b pb-3 flex items-center gap-2 ${
              localTheme === 'dark' ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'
            }`}>
              <BarChart3 className="text-primary" size={20} /> 7. UI Generativa & Gráficos Adaptáveis
            </h2>
            <p className={`text-sm mt-2 ${localTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Componentes renderizados dinamicamente pelo Assistente IA com bordas de 6px e gráficos Recharts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Contact Specialist Card */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Cartão de Contato Especialista</h3>
              <ContactCard />
            </div>

            {/* Service Highlight Card */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Card de Solução Especializada</h3>
              <ServiceCard 
                title="FinOps & Modernização Cloud"
                description="Governança ativa de recursos em nuvem, controle rigoroso de orçamentos e redução de custos operacionais."
                icon="fluent:money-calculator-24-regular"
              />
              <ServiceCard 
                title="Engenharia de Dados & Lakehouse"
                description="Pipelines de dados resilientes, arquitetura medalhão com Google Cloud BigQuery e Databricks."
                icon="fluent:cloud-checkmark-24-regular"
              />
            </div>

            {/* Interactive Chart Card */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Gráfico Recharts Dinâmico</h3>
              <ChartCard type="finops" />
            </div>

          </div>
        </section>


        {/* SECTION 8: CARDS & SPOTLIGHTS */}
        <section id="cards">
          <div className="mb-8">
            <h2 className={`text-2xl font-bold tracking-tight border-b pb-3 flex items-center gap-2 ${
              localTheme === 'dark' ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'
            }`}>
              <Code className="text-primary" size={20} /> 8. Cartões de Alta Fidelidade (Cards)
            </h2>
            <p className={`text-sm mt-2 ${localTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Estruturas interativas que reagem ao mouse e carregam as decorações tecnológicas que enriquecem o visual.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Glow Card Live Demonstration */}
            <div className={`p-8 rounded-[6px] border flex flex-col justify-between ${
              localTheme === 'dark' ? 'bg-[#181b22] border-white/5' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="mb-6">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Componente Avançado</span>
                  
                  {/* Color switcher for GlowCard Demo */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setDemoGlowColor('blue')}
                      className={`text-[9px] font-bold uppercase p-1.5 px-2.5 rounded-[6px] cursor-pointer transition-all ${
                        demoGlowColor === 'blue' ? 'bg-primary text-white' : 'bg-slate-500/10 text-text-muted'
                      }`}
                    >
                      Brilho Azul
                    </button>
                    <button 
                      onClick={() => setDemoGlowColor('orange')}
                      className={`text-[9px] font-bold uppercase p-1.5 px-2.5 rounded-[6px] cursor-pointer transition-all ${
                        demoGlowColor === 'orange' ? 'bg-secondary text-white' : 'bg-slate-500/10 text-text-muted'
                      }`}
                    >
                      Brilho Laranja
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">GlowCard (Spotlight Interativo)</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  O GlowCard detecta a posição absoluta do cursor na tela e projeta um gradiente sutil dinâmico no background e na borda do container, no exato ponto de foco. Totalmente adaptado para web/mobile.
                </p>
              </div>

              {/* Glowing Card preview */}
              <div className="flex justify-center py-6 bg-slate-900/10 dark:bg-slate-950/20 rounded-[6px] p-4 mb-4">
                <GlowCard 
                  glowColor={demoGlowColor}
                  customSize={true}
                  className="w-full max-w-sm p-6 bg-white dark:bg-[#181b22] border-0 rounded-[6px] shadow-md cursor-pointer"
                >
                  <TechCornerBraces color={demoGlowColor} />
                  <div className="space-y-4 pt-4">
                    <div className={`w-10 h-10 rounded-[6px] flex items-center justify-center ${
                      demoGlowColor === 'blue' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                    }`}>
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-text-main">
                        Ponto de Conexão Ativo
                      </h4>
                      <p className="text-xs text-text-muted leading-relaxed mt-1">
                        Passe o cursor sobre este card para visualizar a luz tecnológica acompanhando o mouse de forma ultra-precisa.
                      </p>
                    </div>
                    <div className="text-[10px] font-mono text-text-muted">
                      SYSTEM_STATUS // ONLINE_SECURE
                    </div>
                  </div>
                </GlowCard>
              </div>

              <div>
                <p className="text-[11px] text-text-muted leading-relaxed mb-2">Importação e Parâmetros:</p>
                <code className="block text-[10px] bg-slate-900 text-slate-300 p-3 rounded-[6px] font-mono overflow-x-auto">
                  {`import { GlowCard } from '@/components/ui/spotlight-card';\n\n<GlowCard glowColor="${demoGlowColor}">\n  {/* Conteúdo interno */}\n</GlowCard>`}
                </code>
              </div>
            </div>

            {/* General Card Wrappers: VortCard & GlassCard */}
            <div className={`p-8 rounded-[6px] border flex flex-col justify-between ${
              localTheme === 'dark' ? 'bg-[#181b22] border-white/5' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="mb-4">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">Grid / Utility Classes</span>
                <h3 className="text-xl font-bold tracking-tight mb-2">VortCard & GlassCard</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Estilos de cards estruturados via Tailwind utilitário no arquivo <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded-[6px] text-text-main">index.css</code>.
                </p>
              </div>

              <div className="space-y-4 my-4">
                {/* VortCard preview */}
                <div className={`${
                  localTheme === 'dark' ? 'vort-card-dark' : 'vort-card'
                } relative group rounded-[6px]`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center">
                      <Layers size={16} />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">VortCard (Estilo Técnico)</h4>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Visual sólido com sombra moderada e visual técnico sofisticado, adaptando-se instantaneamente ao tema atual.
                  </p>
                  <span className="absolute bottom-2 right-3 text-[9px] font-mono text-text-muted opacity-40 group-hover:opacity-100 transition-opacity">
                    vort-card
                  </span>
                </div>

                {/* GlassCard preview */}
                <div className={`${
                  localTheme === 'dark' ? 'glass-card-dark' : 'glass-card'
                } relative p-6 group rounded-[6px]`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-[6px] bg-secondary/10 text-secondary flex items-center justify-center">
                      <Sparkles size={16} />
                    </div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">GlassCard (Efeito de Vidro)</h4>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">
                    Efeito translúcido com forte desfoque de fundo (<code className="font-mono">backdrop-blur</code>) e sombra elegante, perfeito para sobreposições.
                  </p>
                  <span className="absolute bottom-2 right-3 text-[9px] font-mono text-text-muted opacity-40 group-hover:opacity-100 transition-opacity">
                    glass-card
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[11px] text-text-muted leading-relaxed mb-2">Classes Prontas em index.css:</p>
                <code className="block text-[10px] bg-slate-900 text-slate-300 p-3 rounded-[6px] font-mono overflow-x-auto">
                  {`<div className="vort-card rounded-[6px]">...</div>\n<div className="glass-card rounded-[6px]">...</div>`}
                </code>
              </div>
            </div>

          </div>
        </section>


        {/* SECTION 9: LINHAS & DETALHES TÉCNICOS */}
        <section id="linhas-tecnicas" className="relative">
          <div className="mb-8">
            <h2 className={`text-2xl font-bold tracking-tight border-b pb-3 flex items-center gap-2 ${
              localTheme === 'dark' ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'
            }`}>
              <SlidersHorizontal className="text-primary" size={20} /> 9. Linhas & Elementos Técnicos Reutilizáveis
            </h2>
            <p className={`text-sm mt-2 ${localTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Pequenos detalhes técnicos que dão um ar de engenharia e inteligência artificial ao site. Podem ser inseridos de forma absoluta em qualquer seção ou card.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Tech Lines Preview */}
            <div className={`p-8 rounded-[6px] border flex flex-col justify-between relative overflow-hidden ${
              localTheme === 'dark' ? 'bg-[#181b22] border-white/5' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-1">Tech Lines</span>
                <h3 className="text-xl font-bold tracking-tight mb-2">Linhas Tecnológicas de Varredura</h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  Adicionam linhas finas com dots brilhantes nas bordas superior e inferior, ou linhas verticais que possuem um pulso contínuo que se desloca em loop infinito.
                </p>
              </div>

              {/* Demo Sandbox Area for Tech Lines */}
              <div className="h-48 relative border border-dashed border-text-muted/25 rounded-[6px] flex items-center justify-center my-4 bg-slate-950/5">
                
                {/* Top Left Horizontal Tech Line */}
                <TechHorizontalLine color="blue" sectionName="MODULE_DEMO_01" align="left" side="top" delay={0.1} />
                
                {/* Bottom Right Horizontal Tech Line */}
                <TechHorizontalLine color="orange" sectionName="MODULE_DEMO_02" align="right" side="bottom" delay={0.3} />

                {/* Left side Vertical line */}
                <TechVerticalLine color="blue" sectionName="V_TRACK_01" align="left" alignY="top" delay={0.1} />

                {/* Right side Vertical line */}
                <TechVerticalLine color="orange" sectionName="V_TRACK_02" align="right" alignY="bottom" delay={0.2} />

                <div className="text-center p-4">
                  <p className="text-xs font-bold text-text-main">Área de Demonstração Interativa</p>
                  <p className="text-[10px] text-text-muted mt-1 max-w-[240px]">
                    Observe a varredura contínua nas linhas verticais e as linhas horizontais animadas ao rolar a página.
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[11px] text-text-muted leading-relaxed mb-2">Como Reutilizar nas Páginas Internas:</p>
                <code className="block text-[10px] bg-slate-900 text-slate-300 p-3 rounded-[6px] font-mono overflow-x-auto">
                  {`import { TechHorizontalLine, TechVerticalLine } from '@/components/TechDetails';\n\n// Na parte superior de qualquer container com position relative:\n<TechHorizontalLine color="blue" align="left" side="top" />\n<TechVerticalLine color="orange" align="right" alignY="top" />`}
                </code>
              </div>
            </div>

            {/* Corner Braces & Boundaries */}
            <div className={`p-8 rounded-[6px] border flex flex-col justify-between relative overflow-hidden ${
              localTheme === 'dark' ? 'bg-[#181b22] border-white/5' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-1">Structural Details</span>
                <h3 className="text-xl font-bold tracking-tight mb-2">Cantoneiras de Enquadramento & Divisores</h3>
                <p className="text-xs text-text-muted leading-relaxed mb-4">
                  Utilize as cantoneiras <code className="font-mono">TechCornerBraces</code> para "enquadrar" visualmente um card ou seção. O divisor <code className="font-mono">TechSectionBoundary</code> desenha uma elegante linha de transição gradiente horizontal entre blocos.
                </p>
              </div>

              {/* Showcase inside card */}
              <div className="relative border border-slate-200 dark:border-white/10 rounded-[6px] p-8 my-4 text-center overflow-hidden bg-slate-500/5">
                
                {/* 4 Corners brackets */}
                <TechCornerBraces color="blue" position="top-left" size={14} />
                <TechCornerBraces color="blue" position="top-right" size={14} />
                <TechCornerBraces color="orange" position="bottom-left" size={14} />
                <TechCornerBraces color="orange" position="bottom-right" size={14} />

                <div className="w-6 h-6 rounded-[6px] bg-gradient-atra text-white flex items-center justify-center text-xs font-bold mx-auto mb-3 shadow-sm">
                  +
                </div>
                <h4 className="text-xs font-bold uppercase tracking-wider">Container Enquadrado</h4>
                <p className="text-[10px] text-text-muted mt-1 leading-relaxed max-w-[280px] mx-auto">
                  As cantoneiras fornecem limites estruturais elegantes, ideais para destacar tecnologias ou estatísticas.
                </p>
              </div>

              <div>
                <p className="text-[11px] text-text-muted leading-relaxed mb-2">Como Reutilizar Cantoneiras (Braces):</p>
                <code className="block text-[10px] bg-slate-900 text-slate-300 p-3 rounded-[6px] font-mono overflow-x-auto">
                  {`import { TechCornerBraces } from '@/components/TechDetails';\n\n// Dentro do seu card relative:\n<TechCornerBraces color="blue" position="top-left" />\n<TechCornerBraces color="orange" position="bottom-right" />`}
                </code>
              </div>
            </div>

          </div>

          {/* Section Boundary Demonstration */}
          <div className="mt-8 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-3 text-center">
              Divisor Tecnológico de Seção (<code className="font-mono">TechSectionBoundary</code>)
            </p>
            <TechSectionBoundary color="mixed" title="DESIGN_SYSTEM_BOUNDARY" />
          </div>
        </section>


        {/* SECTION 10: DECORAÇÕES FLUTUANTES & DIAMONDS */}
        <section id="elementos-flutuantes">
          <div className="mb-8">
            <h2 className={`text-2xl font-bold tracking-tight border-b pb-3 flex items-center gap-2 ${
              localTheme === 'dark' ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'
            }`}>
              <Info className="text-primary" size={20} /> 10. Decorações e Camada de Parallax
            </h2>
            <p className={`text-sm mt-2 ${localTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Floating shapes e orbes desfocados suspensos em profundidades distintas que fluem verticalmente na página.
            </p>
          </div>

          <div className={`p-8 rounded-[6px] border ${
            localTheme === 'dark' ? 'bg-[#181b22] border-white/5' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-4">
                <h3 className="text-lg font-bold tracking-tight">RoundedDiamond (Diamantes Arredondados)</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Ao invés de círculos comuns, a ATRA utiliza o diamante arredondado (<code className="font-mono">RoundedDiamond</code>) com rotação de 45° e cantos ligeiramente arredondados. Ele carrega transições de entrada elegantes com Framer Motion.
                </p>
                
                <div className="flex gap-4 items-center pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <CheckCircle2 size={12} className="text-primary" />
                    <span>Transição Suave de Entrada</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <CheckCircle2 size={12} className="text-secondary" />
                    <span>Blur Otimizado por GPU</span>
                  </div>
                </div>

                <div className="bg-slate-900/5 dark:bg-slate-950/10 rounded-[6px] p-4 mt-4">
                  <p className="text-[11px] text-text-muted leading-relaxed mb-2">Importação:</p>
                  <code className="block text-[10px] bg-slate-900 text-slate-300 p-2 rounded-[6px] font-mono overflow-x-auto">
                    {`import { RoundedDiamond } from '@/components/Decorations';\n\n<RoundedDiamond color="bg-primary" size="w-24 h-24" />`}
                  </code>
                </div>
              </div>

              {/* Visual preview of RoundedDiamond */}
              <div className="h-64 relative border border-dashed border-text-muted/20 rounded-[6px] flex items-center justify-center overflow-hidden bg-slate-500/5">
                
                {/* Blur backdrop orbs */}
                <div className="absolute w-40 h-40 rounded-full bg-primary/10 blur-xl top-5 left-5" />
                <div className="absolute w-40 h-40 rounded-full bg-secondary/10 blur-xl bottom-5 right-5" />

                {/* Animated RoundedDiamonds */}
                <RoundedDiamond color="bg-primary" size="w-24 h-24" className="opacity-40" />
                <RoundedDiamond color="bg-secondary" size="w-16 h-16" className="top-10 right-16 opacity-30" delay={0.2} />
                <RoundedDiamond color="bg-primary" size="w-12 h-12" className="bottom-10 left-16 opacity-30" delay={0.4} />

                <div className="z-10 text-center pointer-events-none">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
                    Diamond Pattern
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 11: DIRETRIZES DE PERFORMANCE & CORE WEB VITALS */}
        <section id="performance">
          <div className="mb-8">
            <h2 className={`text-2xl font-bold tracking-tight border-b pb-3 flex items-center gap-2 ${
              localTheme === 'dark' ? 'text-white border-white/10' : 'text-slate-900 border-slate-200'
            }`}>
              <Zap className="text-amber-400" size={20} /> 11. Diretrizes de Alta Performance & Core Web Vitals
            </h2>
            <p className={`text-sm mt-2 ${localTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Padrões de engenharia para manter a navegação instantânea, zero Cumulative Layout Shift (CLS) e tempo de resposta ideal (INP).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* LCP & Image Optimization */}
            <div className={`p-6 rounded-[6px] border ${
              localTheme === 'dark' ? 'bg-[#181b22] border-white/10' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="w-8 h-8 rounded-[6px] bg-primary/20 text-primary flex items-center justify-center font-bold text-xs mb-3">
                LCP
              </div>
              <h3 className="text-sm font-bold mb-2">Imagens & Zero Layout Shift</h3>
              <ul className="text-xs text-text-muted space-y-2 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span>Sempre use <code className="font-mono text-[10px]">aspect-ratio</code> explícito nos contêineres de imagem para evitar pulos de tela (CLS = 0).</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span>Adicione <code className="font-mono text-[10px]">loading="lazy"</code> e <code className="font-mono text-[10px]">decoding="async"</code> em mídias fora do primeiro viewport.</span>
                </li>
              </ul>
            </div>

            {/* Framer Motion & GPU Acceleration */}
            <div className={`p-6 rounded-[6px] border ${
              localTheme === 'dark' ? 'bg-[#181b22] border-white/10' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="w-8 h-8 rounded-[6px] bg-secondary/20 text-secondary flex items-center justify-center font-bold text-xs mb-3">
                GPU
              </div>
              <h3 className="text-sm font-bold mb-2">Animações & Scroll Suave</h3>
              <ul className="text-xs text-text-muted space-y-2 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span>Restrinja animações a propriedades aceleradas por hardware: <code className="font-mono text-[10px]">transform</code> e <code className="font-mono text-[10px]">opacity</code>.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span>Use <code className="font-mono text-[10px]">viewport={`{{ once: true }}`}</code> em seções de conteúdo para pausar listeners após o primeiro scroll.</span>
                </li>
              </ul>
            </div>

            {/* useMemo & State Optimization */}
            <div className={`p-6 rounded-[6px] border ${
              localTheme === 'dark' ? 'bg-[#181b22] border-white/10' : 'bg-white border-slate-200 shadow-xs'
            }`}>
              <div className="w-8 h-8 rounded-[6px] bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs mb-3">
                INP
              </div>
              <h3 className="text-sm font-bold mb-2">Memoização & Filtros Fluidos</h3>
              <ul className="text-xs text-text-muted space-y-2 leading-relaxed">
                <li className="flex items-start gap-1.5">
                  <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span>Filtros dinâmicos e buscas (ex.: Consultores, Glossário, Insights) devem rodar com <code className="font-mono text-[10px]">useMemo</code>.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                  <span>Evite re-renderizações desnecessárias em listas grandes mantendo chaves de id imutáveis.</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
};

export default DesignSystem;
