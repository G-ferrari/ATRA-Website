import React from 'react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FeaturedHero } from '@/components/FeaturedHero';

const webinars = [
  {
    id: 1,
    title: "Tendências Tecnológicas do Novo Mundo com Marcelo Madureira",
    description: "Uma conversa fascinante sobre como a computação quântica e a IA estão redefinindo limites.",
    date: "Amanhã, 15:00",
    tags: ["Futurismo", "Tech", "Marcelo Madureira"],
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200",
  },
  {
    id: 2,
    title: "Os impactos da Inteligência Artificial na Sociedade com Thiago Rolemberg",
    description: "Ética, trabalho e o novo contrato social na era da IA.",
    date: "10 de maio de 2026",
    tags: ["Ética", "Sociedade", "IA"],
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200"
  },
  {
    id: 3,
    title: "Data Show: Como escalar seu Data Lakehouse",
    description: "Dicas práticas de arquitetura para grandes volumes de dados.",
    date: "20 de maio de 2026",
    tags: ["Data", "Engineering", "Scale"],
    image: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&q=80&w=1200"
  }
];

const Webinars = () => {
  const { t } = useTranslation();

  const featuredWebinars = webinars;

  return (
    <main className="min-h-screen bg-surface-1 dark:bg-[#0e1015] text-text-main dark:text-[#f3f4f6]">
      <FeaturedHero items={featuredWebinars} type="webinar" />

      {/* Video Content Grid */}
      <section className="py-20 md:py-24 bg-surface-1 dark:bg-[#0e1015]">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">
          <div className="mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-display text-text-main dark:text-white">
              Webinars <span className="text-primary font-normal">Gravados</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {webinars.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group flex flex-col gap-5 bg-surface-2 dark:bg-[#181b22] border border-slate-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/60 rounded-[6px] p-4 sm:p-5 transition-all duration-300 shadow-sm hover:shadow-xl dark:shadow-black/60 hover:bg-surface-3 dark:hover:bg-[#1e222b]"
              >
                <div className="aspect-video rounded-[6px] overflow-hidden relative shadow-md group cursor-pointer border border-slate-200 dark:border-white/10">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-primary/30 group-hover:bg-primary/15 transition-all flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-primary transition-all shadow-lg">
                      <Play className="text-white fill-white ml-1" size={20} />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <span className="px-2.5 py-1 rounded-[4px] bg-black/70 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                      45:00
                    </span>
                    <span className="px-2.5 py-1 rounded-[4px] bg-primary/80 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                      HD
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-primary mb-1.5 font-bold uppercase tracking-wider">{item.date}</div>
                  <h3 className="text-lg sm:text-xl font-bold font-display text-text-main dark:text-white group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Webinars;
