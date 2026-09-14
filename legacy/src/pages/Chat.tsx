import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Bot, User, ArrowLeft, Send, Sparkles, RotateCcw, Zap, Cloud, Database, BarChart3, ArrowUpRight } from 'lucide-react';
import { Icon } from '@iconify/react';
import { sendChatMessage } from '@/services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { ContactCard, ServiceCard, PartnerBadge, ChartCard } from '@/components/ChatGenerativeUI';
import { useTranslation } from 'react-i18next';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const parseGenerativeUI = (text: string) => {
  const parts = text.split(/(\[UI_[A-Z]+(?:[^\]]*)?\])/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('[UI_CONTACT]')) {
      return <ContactCard key={index} />;
    }
    
    if (part.startsWith('[UI_SERVICE:')) {
      const match = part.match(/\[UI_SERVICE:([^:]+):([^:]+)(?:(?:[:])([^\]]+))?\]/);
      if (match) {
        return <ServiceCard key={index} title={match[1]} description={match[2]} icon={match[3] || ''} />;
      }
    }
    
    if (part.startsWith('[UI_PARTNER:')) {
      const match = part.match(/\[UI_PARTNER:([^\]]+)\]/);
      if (match) {
        return <PartnerBadge key={index} name={match[1]} />;
      }
    }

    if (part.startsWith('[UI_CHART:')) {
      const match = part.match(/\[UI_CHART:([^\]]+)\]/);
      if (match) {
        return <ChartCard key={index} type={match[1]} />;
      }
    }
    
    // Ignore malformed tags just in case
    if (part.startsWith('[UI_')) {
       return null;
    }

    return (
      <div key={index} className="markdown-body prose prose-xs dark:prose-invert max-w-none text-text-main text-[13px] leading-relaxed prose-p:leading-relaxed prose-headings:text-text-main prose-headings:font-bold prose-a:text-primary prose-a:font-semibold hover:prose-a:underline prose-strong:text-text-main prose-code:text-primary prose-code:bg-surface-1 dark:prose-code:bg-[#0e1015] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-[6px] prose-ul:my-1.5 prose-li:my-0.5">
        <ReactMarkdown>{part}</ReactMarkdown>
      </div>
    );
  });
};

const SUGGESTED_PROMPTS = [
  {
    icon: "fluent:brain-circuit-24-regular",
    title: "IA Generativa & Agentes",
    desc: "Como a IA Generativa pode otimizar processos na minha empresa?",
    prompt: "Como a ATRA ajuda empresas a implementar IA Generativa, agentes inteligentes e modelos de linguagem com governança?"
  },
  {
    icon: "logos:google-cloud",
    title: "Parceria Google Cloud",
    desc: "Qual a experiência da ATRA em modernização na nuvem?",
    prompt: "Gostaria de entender a parceria da ATRA com o Google Cloud e quais serviços de migração e Lakehouse vocês oferecem."
  },
  {
    icon: "fluent:money-calculator-24-regular",
    title: "FinOps & Custos em Nuvem",
    desc: "Estratégias de otimização de gastos em nuvem e governança.",
    prompt: "Como funciona o serviço de FinOps e Governança da ATRA para reduzir custos na nuvem e melhorar a previsibilidade orçamentária?"
  },
  {
    icon: "fluent:data-pie-24-regular",
    title: "BI & Advanced Analytics",
    desc: "Modernização de dashboards executivos e autosserviço.",
    prompt: "Preciso modernizar nossos relatórios e dashboards corporativos. Como a ATRA estrutura soluções de Business Intelligence e Lakehouse?"
  }
];

export default function Chat() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ref to the bottom of the chat view
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessage = location.state?.initialMessage as string | undefined;
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Send the initial message exactly once if it exists
    if (initialMessage && !hasInitialized.current) {
      hasInitialized.current = true;
      handleSendMessage(initialMessage);
      
      // Remove from history state so F5 doesn't re-trigger it
      window.history.replaceState({}, document.title);
    }
  }, [initialMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Artificial timeout to prevent infinite hanging
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('TIMEOUT_ERROR')), 25000);
      });
      
      const response = await Promise.race([
        sendChatMessage(updatedMessages),
        timeoutPromise
      ]) as { text: string };
      
      setMessages(prev => [
        ...prev, 
        { role: 'model', content: response.text }
      ]);
    } catch (err: any) {
      console.error("Chat error:", err);
      if (err.message === 'TIMEOUT_ERROR') {
         setError(t('chat.timeout'));
      } else {
         setError(t('chat.errorGeneral'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setError(null);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col pt-24 md:pt-28 pb-4 md:pb-6 px-3 sm:px-6 md:px-8 max-w-6xl w-full mx-auto min-h-0 relative select-none">
      
      {/* Subtle Background Glows matching ATRA Palette */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Glass/Theme Container with 6px roundness */}
      <div className="flex-1 flex flex-col min-h-0 bg-surface-2 dark:bg-[#181b22] border border-border-main rounded-[6px] shadow-xl dark:shadow-2xl overflow-hidden relative">
        
        {/* Chat Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-border-main flex items-center justify-between bg-surface-2/90 dark:bg-[#181b22]/90 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              aria-label="Voltar para a página inicial"
              className="w-8 h-8 flex items-center justify-center rounded-[6px] bg-surface-3 dark:bg-[#222631] border border-border-main text-text-muted hover:text-text-main hover:border-primary/50 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-[6px] bg-linear-to-tr from-primary to-secondary p-[1px] shadow-xs">
                  <div className="w-full h-full bg-surface-2 dark:bg-[#181b22] rounded-[5px] flex items-center justify-center text-primary">
                    <Sparkles size={16} className="text-primary animate-pulse" />
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-surface-2 dark:border-[#181b22]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs sm:text-sm font-bold text-text-main tracking-tight">
                    {t('chat.header')}
                  </h2>
                  <span className="bg-primary/10 border border-primary/20 text-primary text-[9.5px] uppercase font-bold px-2 py-0.5 rounded-[6px] tracking-wider">
                    {t('chat.beta')}
                  </span>
                </div>
                <p className="text-[10.5px] text-text-muted">
                  {t('chat.subtext')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={handleResetChat}
                title="Reiniciar conversa"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-surface-3 dark:bg-[#222631] border border-border-main text-text-muted hover:text-text-main hover:border-primary/50 text-[11px] font-semibold transition-all active:scale-95 cursor-pointer"
              >
                <RotateCcw size={12} />
                <span className="hidden sm:inline">Nova conversa</span>
              </button>
            )}
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 relative min-h-0 select-text">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 p-3.5 rounded-[6px] text-xs font-medium shadow-xs flex items-center justify-between gap-3"
            >
              <span>{error}</span>
              <button 
                onClick={() => setError(null)}
                className="text-red-500 hover:text-red-700 dark:hover:text-red-300 text-xs underline cursor-pointer"
              >
                Dispensar
              </button>
            </motion.div>
          )}

          {/* Welcome Screen & Quick Suggestion Prompts */}
          {messages.length === 0 && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto py-6 sm:py-10 px-2"
            >
              <div className="w-14 h-14 rounded-[6px] bg-linear-to-br from-primary/20 via-primary/5 to-secondary/20 border border-primary/20 flex items-center justify-center mb-4 shadow-md shadow-primary/10">
                <Sparkles size={26} className="text-primary" />
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-text-main mb-2 tracking-tight">
                Como podemos impulsionar sua empresa hoje?
              </h3>
              
              <p className="text-xs sm:text-[13px] text-text-muted mb-6 max-w-lg leading-relaxed">
                Descubra nossas soluções em <strong className="text-text-main font-semibold">Inteligência Artificial</strong>, arquitetura de <strong className="text-text-main font-semibold">Lakehouse</strong>, <strong className="text-text-main font-semibold">FinOps</strong> e conheça a nossa parceria oficial com o <strong className="text-text-main font-semibold">Google Cloud</strong>.
              </p>

              {/* Suggestions Grid with 6px rounded cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
                {SUGGESTED_PROMPTS.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.prompt)}
                    className="p-3.5 rounded-[6px] bg-surface-3/70 dark:bg-[#222631]/70 border border-border-main hover:border-primary/60 hover:bg-surface-3 dark:hover:bg-[#222631] transition-all duration-200 group flex items-start gap-3 shadow-xs cursor-pointer text-left"
                  >
                    <div className="w-8 h-8 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors duration-200">
                      <Icon icon={item.icon} width={18} height={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11.5px] font-bold text-text-main mb-0.5 flex items-center justify-between group-hover:text-primary transition-colors">
                        <span>{item.title}</span>
                        <ArrowUpRight size={12} className="text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>
                      <p className="text-[10.5px] text-text-muted leading-relaxed line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Messages Stream */}
          {messages.map((msg, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex gap-2.5 sm:gap-3.5",
                msg.role === 'user' ? "ml-auto justify-end max-w-[85%] sm:max-w-[75%]" : "max-w-[95%] sm:max-w-[85%]"
              )}
            >
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-[6px] bg-linear-to-tr from-primary to-secondary p-[1px] shrink-0 mt-0.5 shadow-sm shadow-primary/10">
                  <div className="w-full h-full bg-surface-2 dark:bg-[#181b22] rounded-[5px] flex items-center justify-center text-primary">
                    <Sparkles size={14} className="text-primary" />
                  </div>
                </div>
              )}
              
              <div className={cn(
                "p-3.5 sm:p-4 text-[13px] leading-relaxed overflow-hidden",
                msg.role === 'user' 
                  ? "bg-primary text-white font-medium rounded-[6px] rounded-tr-[2px] shadow-md shadow-primary/20" 
                  : "bg-surface-3 dark:bg-[#222631] text-text-main rounded-[6px] rounded-tl-[2px] border border-border-main/70 shadow-xs"
              )}>
                {msg.role === 'user' ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div>
                    {parseGenerativeUI(msg.content)}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-[6px] bg-surface-3 dark:bg-[#222631] border border-border-main text-text-main flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  <User size={14} />
                </div>
              )}
            </motion.div>
          ))}

          {/* Loading State */}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2.5 sm:gap-3.5 max-w-[85%]"
            >
              <div className="w-8 h-8 rounded-[6px] bg-linear-to-tr from-primary to-secondary p-[1px] shrink-0 mt-0.5 shadow-sm shadow-primary/10">
                <div className="w-full h-full bg-surface-2 dark:bg-[#181b22] rounded-[5px] flex items-center justify-center text-primary">
                  <Sparkles size={14} className="text-primary animate-pulse" />
                </div>
              </div>
              <div className="px-4 py-3 rounded-[6px] rounded-tl-[2px] bg-surface-3 dark:bg-[#222631] border border-border-main/70 flex items-center gap-2 shadow-xs">
                <span className="text-[11px] text-text-muted mr-1 font-medium">Consultando especialistas ATRA</span>
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-3.5 bg-surface-2/95 dark:bg-[#181b22]/95 border-t border-border-main">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(input);
            }} 
            className="flex gap-2 sm:gap-2.5 max-w-4xl mx-auto"
          >
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="flex-1 bg-surface-1 dark:bg-[#0e1015] border border-border-main text-text-main placeholder:text-text-muted px-4 py-2.5 sm:py-3 rounded-[6px] focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-xs sm:text-[13px] shadow-inner"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Enviar mensagem"
              className="px-4 sm:px-5 py-2.5 sm:py-3 bg-linear-to-r from-primary to-primary-dark text-white font-bold text-[11px] uppercase tracking-wider rounded-[6px] flex items-center justify-center gap-1.5 hover:shadow-md hover:shadow-primary/25 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all cursor-pointer shrink-0"
            >
              <Send size={14} className={cn(isLoading && "opacity-0")} />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
          <div className="text-center mt-2">
             <p className="text-[10px] text-text-muted font-medium flex justify-center items-center gap-1.5">
                <Sparkles size={10} className="text-primary" /> {t('chat.poweredBy')} • Inteligência para Negócios & Nuvem
             </p>
          </div>
        </div>

      </div>
    </div>
  );
}

