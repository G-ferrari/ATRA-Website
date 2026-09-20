import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FeaturedHero } from '@/components/FeaturedHero';

// Mock data for Reports
const reports = [
  {
    id: 1,
    title: "Relatório Anual de Dados 2025: Tendências e Projeções",
    description: "Um mergulho profundo nas tecnologias que moldarão as empresas brasileiras nos próximos 12 meses.",
    date: "10 de janeiro de 2026",
    tags: ["Market", "Trends", "2026"],
    image: "/imagens/unsplash-1504868584819-f8e8b4b6d7e3-w1000-effa6f.jpg",
  },
  {
    id: 2,
    title: "O Impacto da IA Generativa na Produtividade Corporativa",
    description: "Pesquisa exclusiva com 200 CEOs sobre como a IA está mudando a forma como trabalhamos.",
    date: "15 de novembro de 2025",
    tags: ["IA", "Business", "ROI"],
    image: "/imagens/unsplash-1460925895917-afdab827c52f-w600-4ac9c8.jpg"
  },
  {
    id: 3,
    title: "Benchmarks de Cloud Computing na América Latina",
    description: "Comparativo de custos, adoção e maturidade digital entre os principais mercados da região.",
    date: "5 de outubro de 2025",
    tags: ["Cloud", "LATAM", "Infrastructure"],
    image: "/imagens/capa-indisponivel.png"
  }
];

const Reports = () => {
  const { t } = useTranslation();

  const featuredReports = reports;

  return (
    <main className="min-h-screen bg-surface-1 dark:bg-[#0e1015] text-text-main dark:text-[#f3f4f6]">
      <FeaturedHero items={featuredReports} type="report" />

      {/* Reports Grid */}
      <section className="py-20 md:py-24 bg-surface-1 dark:bg-[#0e1015]">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 md:mb-16 gap-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main dark:text-white">
              Arquivo de <span className="text-primary font-normal">Relatórios</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {reports.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group flex flex-col bg-surface-2 dark:bg-[#181b22] border border-slate-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/60 rounded-[6px] overflow-hidden shadow-sm hover:shadow-xl dark:shadow-black/60 hover:bg-surface-3 dark:hover:bg-[#1e222b] transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden relative border-b border-slate-200 dark:border-white/10">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-slate-950/20 dark:bg-black/40 group-hover:bg-transparent transition-all"></div>
                  <div className="absolute top-4 left-4">
                     <span className="px-3 py-1 rounded-[4px] bg-primary text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm shadow-sm">
                       Relatório
                     </span>
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="text-[11px] text-text-muted dark:text-gray-400 font-semibold uppercase tracking-wider mb-2">
                    {item.date}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold font-display text-text-main dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-text-muted dark:text-gray-300 text-xs sm:text-sm font-light leading-relaxed line-clamp-3 mb-6 flex-1">
                    {item.description}
                  </p>
                  <button className="inline-flex items-center gap-2 text-primary dark:text-[#3C98FA] hover:text-primary-dark dark:hover:text-white font-bold text-xs sm:text-sm hover:gap-3 transition-all cursor-pointer">
                    <span>Solicitar acesso</span>
                    <Download size={15} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Reports;
