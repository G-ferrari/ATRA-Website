import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Download, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FeaturedHero } from '@/components/FeaturedHero';

const ebooks = [
  {
    id: 1,
    title: "O Guia Definitivo do Data Lakehouse para Executivos",
    description: "Saiba como unificar seus dados e IA em uma única arquitetura resiliente e de baixo custo.",
    pages: 45,
    tags: ["Data", "Architecture", "Strategy"],
    image: "/imagens/unsplash-1544716278-ca5e3f4abd8c-w600-64c640.jpg",
  },
  {
    id: 2,
    title: "Governança de Dados na Era da IA Generativa",
    description: "Políticas essenciais para garantir segurança e qualidade nos seus modelos de linguagem.",
    pages: 32,
    tags: ["Governance", "Security", "IA"],
    image: "/imagens/unsplash-1516979187457-637abb4f9353-w600-d699f1.jpg"
  },
  {
    id: 3,
    title: "Modernizando sua Infraestrutura para Cloud Native",
    description: "Passo a passo para uma migração segura e eficiente para a nuvem.",
    pages: 38,
    tags: ["Cloud", "Migration", "DevOps"],
    image: "/imagens/unsplash-1507842217343-583bb7270b66-w600-b23e43.jpg"
  }
];

const Ebooks = () => {
  const { t } = useTranslation();

  const featuredEbooks = ebooks;

  return (
    <main className="min-h-screen bg-surface-1 text-text-main">
      <FeaturedHero items={featuredEbooks} type="ebook" />

      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {ebooks.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-surface-2 border border-slate-200 dark:border-white/5 hover:border-primary/40 rounded-[6px] p-6 sm:p-8 shadow-sm hover:shadow-xl hover:bg-surface-3 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[3/4] rounded-[6px] overflow-hidden mb-6 shadow-inner relative border border-slate-200 dark:border-white/5">
                     <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                     <div className="absolute top-4 left-4">
                       <span className="px-3 py-1 rounded-[4px] bg-primary text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm shadow-sm">
                         E-book
                       </span>
                     </div>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold font-display text-text-main mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <div className="text-xs text-text-muted mb-6 font-light">{item.pages} páginas de conteúdo exclusivo</div>
                </div>
                <button className="w-full py-3 rounded-[6px] border border-primary/40 text-primary font-bold text-xs sm:text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98">
                   <Download size={16} /> <span>Baixar agora</span>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Ebooks;
