import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, ChevronLeft, Users, Cpu, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CaseDetailProps {
  title: string;
  client: string;
  heroImage: string;
  description: string;
  challenges: string[];
  solution: string;
  results: string[];
  partners?: string;
  technologies: string[];
  testimony?: {
    text: string;
    author: string;
    role: string;
  };
  aboutClient: string;
}

const CaseDetailBase: React.FC<CaseDetailProps> = ({
  title,
  client,
  heroImage,
  description,
  challenges,
  solution,
  results,
  partners,
  technologies,
  testimony,
  aboutClient,
}) => {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[50vh] md:min-h-[60vh] bg-primary overflow-hidden flex items-center pt-32 md:pt-48 pb-16">
        <div className="absolute inset-0">
          <img src={heroImage} alt={title} className="w-full h-full object-cover opacity-40 mix-blend-overlay" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-linear-to-t from-primary via-primary/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link to="/cases-de-sucesso" className="inline-flex items-center gap-2 text-white font-bold mb-8 hover:gap-3 hover:text-secondary transition-all">
            <ChevronLeft size={20} /> Voltar para cases
          </Link>
          <div className="max-w-4xl">
            <div className="text-secondary font-black uppercase tracking-[0.2em] text-xs md:text-sm mb-4">Case de Sucesso — {client}</div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Main Content */}
            <div className="lg:w-2/3">
              <div className="prose prose-lg prose-slate max-w-none">
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Desafios</h2>
                <ul className="space-y-4 mb-12">
                  {challenges.map((challenge, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <div className="w-6 h-6 rounded-full bg-secondary/10 flex-shrink-0 flex items-center justify-center mt-1">
                        <div className="w-2 h-2 rounded-full bg-secondary"></div>
                      </div>
                      <span className="text-slate-700">{challenge}</span>
                    </li>
                  ))}
                </ul>

                <h2 className="text-3xl font-bold text-slate-900 mb-8">Solução</h2>
                <p className="text-slate-700 text-lg mb-12 leading-relaxed">
                  {solution}
                </p>

                <h2 className="text-3xl font-bold text-slate-900 mb-8">Resultados</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {results.map((result, i) => (
                    <div key={i} className="bg-slate-50 p-6 rounded-[6px] ">
                      <CheckCircle2 className="text-secondary mb-4" size={24} />
                      <p className="text-slate-900 font-medium">{result}</p>
                    </div>
                  ))}
                </div>

                {testimony && (
                  <div className="my-16 bg-primary rounded-[6px] p-12 text-white relative overflow-hidden shadow-xl shadow-primary/20">
                    <div className="absolute top-0 right-0 p-8 text-white/10">
                      <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H13.017V21H14.017ZM6.017 21L6.017 18C6.017 16.8954 6.91243 16 8.017 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H8.017C7.46472 8 7.017 8.44772 7.017 9V12C7.017 12.5523 6.56929 13 6.017 13H5.017V21H6.017Z" /></svg>
                    </div>
                    <blockquote className="relative z-10">
                      <p className="text-2xl font-medium mb-8 leading-relaxed">
                        "{testimony.text}"
                      </p>
                      <footer>
                        <div className="font-bold text-white">{testimony.author}</div>
                        <div className="text-white/70 text-sm">{testimony.role}</div>
                      </footer>
                    </blockquote>
                  </div>
                )}

                <h2 className="text-3xl font-bold text-slate-900 mb-8">Sobre o {client}</h2>
                <p className="text-slate-600 leading-relaxed mb-12">
                  {aboutClient}
                </p>
              </div>
            </div>

            {/* Sidebar info */}
            <div className="lg:w-1/3">
              <div className="sticky top-32 space-y-6">
                <div className="bg-slate-50 rounded-[6px]  overflow-hidden">
                  <div className="bg-primary p-6 text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[6px] bg-white/20 flex items-center justify-center">
                      <Layers size={18} className="text-white" />
                    </div>
                    <h4 className="font-bold uppercase tracking-wider text-xs">Informações do Projeto</h4>
                  </div>
                  
                  <div className="p-8 space-y-8">
                    {partners && (
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-[6px] bg-white  flex-shrink-0 flex items-center justify-center shadow-sm">
                          <Users size={20} className="text-primary" />
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-black mb-1">Parceiros</div>
                          <div className="text-slate-900 font-bold text-sm">{partners}</div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-[6px] bg-white  flex-shrink-0 flex items-center justify-center shadow-sm">
                        <Cpu size={20} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-black mb-3">Tecnologias</div>
                        <div className="flex flex-wrap gap-2">
                          {technologies.map((tech, i) => (
                            <span key={i} className="px-2.5 py-1 bg-white  rounded-[6px] text-[10px] font-bold text-slate-600">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-[6px] bg-white  flex-shrink-0 flex items-center justify-center shadow-sm">
                        <Layers size={20} className="text-primary" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-black mb-3">Áreas de atuação</div>
                        <ul className="space-y-2">
                          {['Cloud Data Analytics', 'Governança de Dados', 'Data Integration', 'Data Security', 'Data Management'].map(area => (
                            <li key={area} className="text-[11px] font-bold text-slate-700 flex items-center gap-2">
                              <div className="w-1 h-1 rounded-full bg-secondary"></div>
                              {area}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success CTA - Requested Footer */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-primary rounded-[6px] p-8 md:p-16 text-white text-center relative overflow-hidden shadow-xl shadow-primary/20">
             <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
             
             <div className="relative z-10 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-8">
                   O próximo case de sucesso <span className="text-secondary">pode ser o seu!</span>
                </h2>
                <p className="text-lg text-white/80 mb-12">
                   Pronto para transformar seus dados em resultados? Entregamos soluções sob medida para cada negócio, garantindo resultados concretos e de alto impacto. Fale com a gente para começar sua história de sucesso.
                </p>
                
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-12 p-8 bg-white/5 rounded-[6px]  backdrop-blur-sm">
                   <div>
                      <div className="text-secondary text-xs font-black uppercase mb-2">Telefone</div>
                      <div className="text-xl font-bold">+55 11 96305-2391</div>
                   </div>
                   <div className="hidden md:block w-px h-12 bg-white/10"></div>
                   <div>
                      <div className="text-secondary text-xs font-black uppercase mb-2">E-mail</div>
                      <div className="text-xl font-bold">negocios@atra.com.br</div>
                   </div>
                </div>

                <Link to="/contato" className="inline-flex items-center gap-3 bg-secondary hover:bg-orange-600 text-white px-10 py-5 rounded-[6px] font-bold text-lg transition-all hover:-translate-y-1 shadow-lg">
                   Fale com um especialista <ArrowRight size={20} />
                </Link>
             </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CaseDetailBase;
