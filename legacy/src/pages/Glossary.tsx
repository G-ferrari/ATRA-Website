import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Search, BookOpen, Sparkles, Tag, ArrowUpRight } from 'lucide-react';
import { GlowCard } from '@/components/ui/spotlight-card';
import { TechCornerBraces } from '@/components/TechDetails';
import { StatusBadge, MetricChip } from '@/components/ui/badge-status';
import { cn } from '@/lib/utils';

const glossaryTerms = [
  { term: "Advanced Analytics", definition: "Uso de técnicas complexas, como machine learning e modelagem preditiva, para analisar dados e prever tendências futuras.", category: "Analytics" },
  { term: "Big Data", definition: "Conjuntos de dados extremamente grandes e complexos que requerem ferramentas avançadas para captura, armazenamento, gerenciamento e análise.", category: "Infraestrutura" },
  { term: "Business Intelligence (BI)", definition: "Processo de coleta, análise e apresentação de dados de negócios para apoiar a tomada de decisões estratégicas.", category: "Analytics" },
  { term: "Cloud Computing", definition: "Entrega de serviços de computação (servidores, armazenamento, bancos de dados, redes, software) pela internet sob demanda.", category: "Cloud" },
  { term: "Data Governance", definition: "Gestão da disponibilidade, usabilidade, integridade, conformidade e segurança dos dados utilizados em uma corporação.", category: "Governança" },
  { term: "Data Lake", definition: "Repositório centralizado que permite armazenar todos os dados estruturados e não estruturados em qualquer escala e formato.", category: "Engenharia de Dados" },
  { term: "Data Literacy", definition: "A capacidade de ler, entender, criar, criticar e comunicar dados como informação acionável em todos os níveis organizacionais.", category: "Cultura" },
  { term: "Data Quality", definition: "Medida da condição e confiabilidade dos dados com base em fatores como precisão, integridade, consistência e conformidade temporal.", category: "Governança" },
  { term: "Data Warehouse", definition: "Sistema analítico estruturado usado para relatórios e análise de dados históricos, sendo pilar do BI corporativo.", category: "Engenharia de Dados" },
  { term: "Deep Learning", definition: "Subcampo do machine learning baseado em redes neurais artificiais profundas com múltiplas camadas de neurônios.", category: "Inteligência Artificial" },
  { term: "FinOps", definition: "Prática e cultura de gestão financeira para nuvem, unindo engenharia, finanças e negócios para otimizar custos contínuos.", category: "FinOps & Cloud" },
  { term: "Inteligência Artificial (IA)", definition: "Simulação de processos cognitivos e tomadas de decisão humanas por meio de algoritmos e sistemas computacionais.", category: "Inteligência Artificial" },
  { term: "IA Generativa", definition: "Modelos de aprendizado profundo (como LLMs e modelos de difusão) capazes de gerar textos, códigos, imagens ou sínteses a partir de instruções.", category: "Inteligência Artificial" },
  { term: "Lakehouse", definition: "Arquitetura moderna que combina a escalabilidade e baixo custo dos data lakes com a governança e transações ACID dos data warehouses.", category: "Engenharia de Dados" },
  { term: "Machine Learning", definition: "Subárea da inteligência artificial focada na construção de algoritmos que aprendem padrões a partir de dados históricos.", category: "Inteligência Artificial" },
  { term: "Modelos Preditivos", definition: "Uso de estatísticas, variáveis explicativas e IA para prever comportamentos ou riscos futuros.", category: "Analytics" },
  { term: "Processamento de Linguagem Natural (NLP)", definition: "Ramo da IA voltado à compreensão, interpretação e geração de linguagem natural falada ou escrita.", category: "Inteligência Artificial" },
];

export default function Glossary() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Performance: Memoize filtered terms
  const filteredTerms = useMemo(() => {
    return glossaryTerms.filter(item => {
      const matchesSearch = search.trim() === '' || 
        item.term.toLowerCase().includes(search.toLowerCase()) ||
        item.definition.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());
      
      const matchesLetter = !selectedLetter || item.term.charAt(0).toUpperCase() === selectedLetter;
      return matchesSearch && matchesLetter;
    });
  }, [search, selectedLetter]);

  // Grouping
  const groupedTerms = useMemo(() => {
    return filteredTerms.reduce((acc, current) => {
      const letter = current.term.charAt(0).toUpperCase();
      if (!acc[letter]) {
        acc[letter] = [];
      }
      acc[letter].push(current);
      return acc;
    }, {} as Record<string, typeof glossaryTerms>);
  }, [filteredTerms]);

  const letters = useMemo(() => Object.keys(groupedTerms).sort(), [groupedTerms]);
  const allLetters = useMemo(() => {
    const set = new Set(glossaryTerms.map(item => item.term.charAt(0).toUpperCase()));
    return Array.from(set).sort();
  }, []);

  return (
    <div className="pt-24 md:pt-36 pb-20 min-h-screen bg-surface-1 text-text-main">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="mb-10">
          <div className="rounded-[6px] bg-linear-to-br from-[#12151c] via-[#1a2130] to-[#0e1015] border border-white/5 text-white p-6 sm:p-10 md:p-12 shadow-2xl relative overflow-hidden vort-dot-grid text-center">
            <TechCornerBraces color="blue" position="top-left" size={14} />
            <TechCornerBraces color="orange" position="bottom-right" size={14} />

            <div className="max-w-2xl mx-auto relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <StatusBadge 
                  label="Dicionário Técnico" 
                  variant="primary" 
                  size="sm" 
                  pulse={true} 
                  icon={<Sparkles size={12} />} 
                />
                <MetricChip label="Conceitos Fundamentais" variant="neutral" size="sm" />
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display mb-4 tracking-tight leading-tight">
                Glossário de <span className="text-primary font-normal">Dados & IA</span>
              </h1>
              
              <p className="text-xs sm:text-sm text-white/70 font-light max-w-xl mx-auto mb-6">
                Desmistifique termos técnicos de engenharia de dados, cloud computing, governança e inteligência artificial aplicados aos negócios.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-lg mx-auto">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Buscar termo técnico ou definição..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/10 border border-white/15 rounded-[6px] text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Alphabet Filter */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mb-10">
          <button
            onClick={() => setSelectedLetter(null)}
            className={cn(
              "px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-all cursor-pointer",
              selectedLetter === null
                ? "bg-primary text-white shadow-xs"
                : "bg-surface-2 text-text-muted hover:text-text-main border border-slate-200 dark:border-white/5"
            )}
          >
            Todos
          </button>
          {allLetters.map((l) => (
            <button
              key={l}
              onClick={() => setSelectedLetter(selectedLetter === l ? null : l)}
              className={cn(
                "w-8 h-8 rounded-[6px] text-xs font-semibold transition-all cursor-pointer flex items-center justify-center",
                selectedLetter === l
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface-2 text-text-muted hover:text-text-main border border-slate-200 dark:border-white/5 hover:bg-surface-3"
              )}
            >
              {l}
            </button>
          ))}
        </div>

        {/* Index Summary Card */}
        <section className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-6 mb-12 shadow-sm">
          <h2 className="text-sm font-bold text-text-main mb-6 flex items-center gap-2">
            <BookOpen size={16} className="text-primary" />
            <span>Índice Alfabético Rápido</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {letters.map(letter => (
              <div key={letter} className="flex flex-col">
                <div className="text-xs font-bold text-primary mb-2 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-[4px] bg-primary/10 flex items-center justify-center text-[10px]">{letter}</span>
                  <span>({groupedTerms[letter].length})</span>
                </div>
                <ul className="space-y-1">
                  {groupedTerms[letter].sort((a, b) => a.term.localeCompare(b.term)).map((item, idx) => (
                    <li key={idx}>
                      <a 
                        href={`#term-${item.term.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-text-muted hover:text-primary transition-colors text-xs font-light block truncate"
                      >
                        • {item.term}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Terms Definition Sections */}
        {letters.length === 0 ? (
          <div className="text-center py-16 bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-8">
            <BookOpen size={36} className="mx-auto text-text-muted mb-3" />
            <h3 className="text-base font-bold text-text-main mb-1">Nenhum termo encontrado</h3>
            <p className="text-xs text-text-muted font-light mb-4">Tente buscar por outra palavra-chave.</p>
            <button
              onClick={() => { setSearch(''); setSelectedLetter(null); }}
              className="px-4 py-2 rounded-[6px] bg-primary text-white text-xs font-semibold cursor-pointer"
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {letters.map((letter, index) => (
              <motion.div 
                key={letter}
                id={`letter-${letter}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="scroll-mt-32"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-[6px] bg-primary/10 text-primary font-bold text-sm flex items-center justify-center">
                    {letter}
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-white/10"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupedTerms[letter].sort((a, b) => a.term.localeCompare(b.term)).map((item, idx) => (
                    <div 
                      key={idx} 
                      id={`term-${item.term.toLowerCase().replace(/\s+/g, '-')}`}
                      className="p-5 rounded-[6px] bg-surface-2 border border-slate-200 dark:border-white/5 hover:border-primary/40 transition-all scroll-mt-32 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h3 className="text-sm font-bold text-text-main group-hover:text-primary transition-colors">
                            {item.term}
                          </h3>
                          <span className="px-2 py-0.5 rounded-[4px] bg-surface-1 text-text-muted text-[10px] font-medium border border-slate-200 dark:border-white/5">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted font-light leading-relaxed">
                          {item.definition}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
