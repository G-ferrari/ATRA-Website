import React from 'react';
import { motion } from 'motion/react';
import { Icon } from '@iconify/react';
import { ArrowRight, Phone, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export const ContactCard = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="bg-surface-2 dark:bg-[#181b22] border border-border-main rounded-[6px] shadow-lg p-4 my-3 max-w-sm"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-[6px] bg-surface-3 flex items-center justify-center overflow-hidden border border-border-main shadow-inner">
             <img 
               src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80" 
               alt="Especialista ATRA" 
               className="w-full h-full object-cover" 
             />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-surface-2 dark:border-[#181b22]"></div>
        </div>
        <div>
          <h4 className="font-bold text-text-main text-xs flex items-center gap-1.5">
            Falar com Especialista
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </h4>
          <p className="text-[11px] text-text-muted">Time de Soluções & Arquitetura ATRA</p>
        </div>
      </div>
      <p className="text-[11px] text-text-muted mb-3.5 leading-relaxed">
        Pronto para acelerar seu projeto de Dados e IA? Desenhe o escopo técnico diretamente com nossos arquitetos.
      </p>
      <a 
        href="https://wa.me/5511963052391" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-[6px] py-2 px-3.5 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-wider transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98]"
      >
        <Phone size={13} />
        Conectar no WhatsApp
      </a>
    </motion.div>
  );
};

export const ServiceCard = ({ title, description, icon }: { title: string, description: string, icon: string }) => {
  let resolvedIcon = icon || "fluent:cube-24-regular";
  
  if (title.toLowerCase().includes('engenharia de dados')) {
    resolvedIcon = "fluent:database-24-regular";
  } else if (title.toLowerCase().includes('inteligência') || title.toLowerCase().includes('ia')) {
    resolvedIcon = "fluent:brain-circuit-24-regular";
  } else if (title.toLowerCase().includes('governança') || title.toLowerCase().includes('finops')) {
    resolvedIcon = "fluent:shield-lock-24-regular";
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-surface-2 dark:bg-[#181b22] border border-border-main hover:border-primary/50 rounded-[6px] shadow-sm p-3.5 my-2.5 flex flex-col gap-2.5 group transition-all cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-300">
          <Icon icon={resolvedIcon} width={18} height={18} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-text-main text-xs mb-0.5 group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-[11px] text-text-muted leading-relaxed line-clamp-3">{description}</p>
        </div>
      </div>
      <div className="pt-2 border-t border-border-main/50 flex items-center justify-between">
        <span className="text-[10px] text-text-muted flex items-center gap-1">
          <Sparkles size={11} className="text-secondary" /> Solução Especializada
        </span>
        <span className="text-[11px] font-semibold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          Conhecer solução <ArrowRight size={12} />
        </span>
      </div>
    </motion.div>
  );
};

export const PartnerBadge = ({ name }: { name: string }) => {
  const getIcon = (partner: string) => {
    const p = partner.toLowerCase();
    if (p.includes('google')) return 'logos:google-cloud';
    if (p.includes('azure')) return 'logos:microsoft-azure';
    if (p.includes('databricks')) return 'logos:databricks';
    if (p.includes('snowflake')) return 'logos:snowflake-icon';
    if (p.includes('ibm')) return 'logos:ibm';
    if (p.includes('denodo')) return 'fluent:layer-diagonal-24-filled';
    if (p.includes('atlan')) return 'fluent:globe-search-24-filled';
    return 'fluent:star-24-filled';
  };

  return (
    <span className="inline-flex items-center gap-1.5 bg-surface-2 dark:bg-[#181b22] border border-border-main rounded-[6px] px-2.5 py-1 text-[11px] font-semibold text-text-main shadow-xs mx-1 my-0.5 align-middle hover:border-primary/40 transition-colors">
      <Icon icon={getIcon(name)} width={13} height={13} className={name.toLowerCase().includes('google') || name.toLowerCase().includes('azure') || name.toLowerCase().includes('databricks') ? "" : "text-primary"} />
      {name}
      <CheckCircle2 size={11} className="text-emerald-500 ml-0.5" />
    </span>
  );
};

export const ChartCard = ({ type }: { type: string }) => {
  const dataBI = [
    { name: 'Jan', vendas: 4000, meta: 2400 },
    { name: 'Fev', vendas: 3000, meta: 1398 },
    { name: 'Mar', vendas: 2000, meta: 9800 },
    { name: 'Abr', vendas: 2780, meta: 3908 },
    { name: 'Mai', vendas: 1890, meta: 4800 },
    { name: 'Jun', vendas: 2390, meta: 3800 },
  ];

  const dataFinOps = [
    { name: 'S1', custo: 4000 },
    { name: 'S2', custo: 3000 },
    { name: 'S3', custo: 2000 },
    { name: 'S4', custo: 2780 },
    { name: 'S5', custo: 1890 },
    { name: 'S6', custo: 1200 },
  ];

  const isFinOps = type.toLowerCase().includes('finops');

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface-2 dark:bg-[#181b22] border border-border-main rounded-[6px] shadow-lg p-3.5 my-3"
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-7 h-7 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center">
           {isFinOps ? <Icon icon="fluent:money-calculator-24-regular" width={16} /> : <Icon icon="fluent:data-pie-24-regular" width={16} />}
        </div>
        <div>
          <h4 className="font-bold text-text-main text-[11.5px]">{isFinOps ? 'Simulação FinOps (Economia Cloud)' : 'Dashboard BI (Analytics Executivo)'}</h4>
          <p className="text-[10px] text-text-muted">{isFinOps ? 'Otimização contínua de custos em nuvem' : 'Acompanhamento estratégico de metas'}</p>
        </div>
      </div>
      
      <div className="h-36 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {isFinOps ? (
            <AreaChart data={dataFinOps}>
              <defs>
                <linearGradient id="colorCustoAtra" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3C98FA" stopOpacity={0.7}/>
                  <stop offset="95%" stopColor="#3C98FA" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" fontSize={9.5} tickLine={false} axisLine={false} stroke="currentColor" className="text-text-muted opacity-70" />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  fontSize: '10.5px', 
                  borderRadius: '6px', 
                  backgroundColor: 'var(--color-surface-2, #ffffff)', 
                  borderColor: 'var(--color-border-main, #e2e8f0)',
                  color: 'var(--color-text-main, #0f172a)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)' 
                }} 
              />
              <Area type="monotone" dataKey="custo" stroke="#3C98FA" strokeWidth={2} fillOpacity={1} fill="url(#colorCustoAtra)" />
            </AreaChart>
          ) : (
            <BarChart data={dataBI}>
              <XAxis dataKey="name" fontSize={9.5} tickLine={false} axisLine={false} stroke="currentColor" className="text-text-muted opacity-70" />
              <Tooltip 
                cursor={{ fill: 'rgba(60, 152, 250, 0.08)' }} 
                contentStyle={{ 
                  fontSize: '10.5px', 
                  borderRadius: '6px', 
                  backgroundColor: 'var(--color-surface-2, #ffffff)', 
                  borderColor: 'var(--color-border-main, #e2e8f0)',
                  color: 'var(--color-text-main, #0f172a)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)' 
                }} 
              />
              <Bar dataKey="vendas" fill="#3C98FA" radius={[3, 3, 0, 0]} />
              <Bar dataKey="meta" fill="#FF8B08" fillOpacity={0.4} radius={[3, 3, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
