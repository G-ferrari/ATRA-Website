import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Filter, 
  Cpu, 
  Award, 
  ArrowRight,
  UserCheck,
  ChevronRight,
  Check,
  HelpCircle,
  X,
  Zap,
  ShieldCheck,
  GraduationCap,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Icon } from '@iconify/react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { BackgroundDecorations } from '@/components/Decorations';
import { GlowCard } from '@/components/ui/spotlight-card';
import { TechCornerBraces, TechHorizontalLine, TechVerticalLine } from '@/components/TechDetails';
import { StatusBadge, MetricChip } from '@/components/ui/badge-status';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface SpecialistRole {
  id: string;
  role: string;
  level: string;
  code: string;
  iconBg: string;
  icon: string;
  description: string;
  tags: string[];
  allocatedProjects: number;
  allocatedPartners: number;
  totalTeamSize: number;
  certifications: string[];
  keyDeliverables: string[];
  responsibilities: string[];
}

const SPECIALTIES = [
  "Todas", "AWS", "Airflow", "Azure IoT", "BigQuery", "Collibra", "DAX", 
  "Data Catalog", "Databricks", "Delta Lake", "Edge Computing", "FinOps", 
  "GCP", "ISO 27001", "IoT", "Kubernetes", "LGPD", "LLM", "LangChain", 
  "Looker", "MLflow", "MQTT", "OpenAI", "Power BI", "Privacy", "PySpark", 
  "Python", "RAG", "SQL", "Snowflake", "Storytelling", "Tableau", 
  "TensorFlow", "Terraform", "Vertex AI", "dbt"
];

const SENIORITIES = ["Todos", "Senior", "Pleno", "Lead / Principal"];

const SPECIALIST_ROLES: SpecialistRole[] = [
  {
    id: "data-engineer-sr",
    role: "Data Engineer",
    level: "Senior",
    code: "DE",
    iconBg: "from-blue-600 to-cyan-500",
    icon: "database",
    description: "Especialista em arquiteturas Lakehouse, engenharia de dados em larga escala, pipelines ETL/ELT resilientes e governança de dados.",
    tags: ["Databricks", "PySpark", "Delta Lake", "Airflow", "AWS", "BigQuery", "dbt", "SQL"],
    allocatedProjects: 18,
    allocatedPartners: 12,
    totalTeamSize: 30,
    certifications: ["Databricks Certified Data Engineer Professional", "Google Cloud Professional Data Engineer", "AWS Certified Data Analytics"],
    keyDeliverables: [
      "Pipelines de Ingestão e Carga em Tempo Real / Batch",
      "Modelagem Lakehouse (Medallion Architecture: Bronze, Silver, Gold)",
      "Automação de CI/CD para Pipelines de Dados",
      "Otimização de Performance de Queries em Spark/SQL"
    ],
    responsibilities: [
      "Desenvolver e sustentar pipelines de dados escaláveis e resilientes.",
      "Garantir a qualidade, integridade e linhagem das tabelas do Data Lakehouse.",
      "Integrar diferentes fontes de dados corporativas (ERP, CRM, APIs e bancos relacionais/NoSQL).",
      "Implementar boas práticas de DataOps e versionamento de código."
    ]
  },
  {
    id: "ml-engineer-pl",
    role: "ML Engineer",
    level: "Senior",
    code: "MLE",
    iconBg: "from-cyan-500 to-teal-400",
    icon: "cpu",
    description: "Desenvolve e implementa modelos de Machine Learning e IA Generativa em produção com MLOps end-to-end e monitoramento de performance.",
    tags: ["Python", "Vertex AI", "MLflow", "TensorFlow", "OpenAI", "LLM", "LangChain", "RAG"],
    allocatedProjects: 14,
    allocatedPartners: 9,
    totalTeamSize: 23,
    certifications: ["Google Cloud Professional Machine Learning Engineer", "AWS Certified Machine Learning - Specialty"],
    keyDeliverables: [
      "Arquiteturas de RAG (Retrieval-Augmented Generation) Corporativo",
      "Pipelines de MLOps para Treinamento e Deploy Automatizado",
      "Feature Stores e Repositórios Centralizados de Modelos",
      "Monitoramento de Data Drift e Model Drift em Produção"
    ],
    responsibilities: [
      "Operacionalizar modelos de IA/ML do protótipo ao ambiente de produção de missão crítica.",
      "Integrar LLMs e APIs de IA Generativa a fluxos de trabalho e sistemas de negócios.",
      "Garantir baixa latência, alta disponibilidade e segurança nas chamadas de inference.",
      "Estabelecer testes de regressão e pipelines CI/CD/CT para modelos."
    ]
  },
  {
    id: "cloud-architect-pr",
    role: "Cloud Architect",
    level: "Lead / Principal",
    code: "CA",
    iconBg: "from-indigo-600 to-blue-500",
    icon: "cloud",
    description: "Desenho de arquiteturas multi-cloud, modernização de sistemas legados, infraestrutura como código e práticas estratégicas de FinOps.",
    tags: ["GCP", "AWS", "Terraform", "Kubernetes", "FinOps", "Azure IoT", "Edge Computing"],
    allocatedProjects: 12,
    allocatedPartners: 11,
    totalTeamSize: 23,
    certifications: ["Google Cloud Professional Cloud Architect", "AWS Certified Solutions Architect - Professional"],
    keyDeliverables: [
      "Desenho de Arquitetura de Nuvem Multi-Cloud Resiliente",
      "Estratégias de Migração de Legados (Lift-and-Shift vs. Refactoring)",
      "Automação de Infraestrutura via IaC (Terraform)",
      "Políticas de FinOps para Otimização de Custos em Cloud"
    ],
    responsibilities: [
      "Liderar o desenho arquitetural e a evolução da infraestrutura em nuvem.",
      "Garantir alinhamento com os pilares de Well-Architected Framework (Segurança, Confiabilidade, Custo).",
      "Apoiar times de engenharia na adoção de microsserviços e contêineres.",
      "Definir padrões corporativos de governança de nuvem."
    ]
  },
  {
    id: "analytics-engineer-sr",
    role: "Analytics Engineer",
    level: "Senior",
    code: "AE",
    iconBg: "from-sky-500 to-indigo-500",
    icon: "barchart",
    description: "Ponte perfeita entre engenharia e negócios, transformando dados brutos em modelos semânticos otimizados para BI e self-service analytics.",
    tags: ["dbt", "Snowflake", "BigQuery", "Looker", "Power BI", "DAX", "SQL"],
    allocatedProjects: 15,
    allocatedPartners: 8,
    totalTeamSize: 23,
    certifications: ["dbt Analytics Engineering Certification", "Snowflake SnowPro Core", "Microsoft Certified: Power BI Data Analyst"],
    keyDeliverables: [
      "Camada Semântica Centralizada (dbt models / Star Schemas)",
      "Testes Automatizados de Qualidade e Documentação de Dados",
      "Bases Otimizadas para Self-Service BI Corporativo",
      "Catálogo de Métricas de Negócio Único"
    ],
    responsibilities: [
      "Construir transformações de dados limpas, testáveis e documentadas.",
      "Colaborar com analistas e tomadores de decisão para definir métricas padrão.",
      "Garantir a governança na camada de consumo semântico.",
      "Promover a cultura de dados e autonomia dos times de negócios."
    ]
  },
  {
    id: "data-governance-lead",
    role: "Data Governance Specialist",
    level: "Lead / Principal",
    code: "DGS",
    iconBg: "from-purple-600 to-indigo-500",
    icon: "shield",
    description: "Implementa frameworks completos de governança de dados, qualidade, catalogação, conformidade com LGPD/ISO 27001 e linhagem de dados.",
    tags: ["Collibra", "Data Catalog", "LGPD", "ISO 27001", "Privacy", "SQL"],
    allocatedProjects: 11,
    allocatedPartners: 7,
    totalTeamSize: 18,
    certifications: ["DAMA CDMP (Certified Data Management Professional)", "OneTrust Certified Privacy Professional"],
    keyDeliverables: [
      "Implantação de Catálogo e Dicionário de Dados Corporativo",
      "Políticas de Controle de Acesso (RBAC/ABAC) e Mascaramento de Dados",
      "Matriz de Mapeamento LGPD e Dados Sensíveis (PII)",
      "Framework de Governança e Qualidade Contínua de Dados"
    ],
    responsibilities: [
      "Estabelecer e disseminar as políticas corporativas de governança de dados.",
      "Garantir conformidade com regulamentações (LGPD, BACEN, IFRS).",
      "Mapear a linhagem de dados (data lineage) de ponta a ponta.",
      "Promover comitês de dados e treinamento de Data Custodians."
    ]
  },
  {
    id: "data-scientist-sr",
    role: "Data Scientist",
    level: "Senior",
    code: "DS",
    iconBg: "from-emerald-500 to-teal-600",
    icon: "cpu",
    description: "Especialista em modelagem estatística avançada, análise preditiva, otimização de negócios e storytelling orientado a tomadas de decisão.",
    tags: ["Python", "PySpark", "SQL", "Storytelling", "Tableau", "TensorFlow", "LLM"],
    allocatedProjects: 10,
    allocatedPartners: 6,
    totalTeamSize: 16,
    certifications: ["TensorFlow Developer Certificate", "Google Professional Data Scientist"],
    keyDeliverables: [
      "Modelos Preditivos (Churn, Propensão de Compra, Risco de Crédito)",
      "Algoritmos de Otimização e Previsão de Demandas (Time Series)",
      "Análises Estatísticas Avançadas e Testes A/B",
      "Relatórios Executivos e Storytelling com Impacto de Negócio"
    ],
    responsibilities: [
      "Identificar oportunidades de otimização de negócios através de dados.",
      "Desenvolver e validar hipóteses estatísticas e modelos algorítmicos.",
      "Traduzir análises complexas em recomendações claras para diretores.",
      "Trabalhar em conjunto com ML Engineers para levar modelos à produção."
    ]
  },
  {
    id: "finops-specialist",
    role: "FinOps & Cloud Cost Specialist",
    level: "Senior",
    code: "FC",
    iconBg: "from-amber-500 to-orange-600",
    icon: "barchart",
    description: "Otimização contínua de custos em ambientes Cloud (GCP/AWS/Azure), redução de desperdício em consultas e governança orçamentária.",
    tags: ["FinOps", "GCP", "AWS", "BigQuery", "Looker", "Kubernetes"],
    allocatedProjects: 8,
    allocatedPartners: 6,
    totalTeamSize: 14,
    certifications: ["FinOps Certified Practitioner (FCP)", "AWS Certified Cloud Practitioner"],
    keyDeliverables: [
      "Diagnóstico e Auditoria do Custo Atual de Nuvem",
      "Implementação de Orçamentos, Alertas e Showback/spotting",
      "Otimização de Queries BigQuery/Snowflake e Dimensionamento de Instâncias",
      "Estratégias de Commitments e Instâncias Reservadas"
    ],
    responsibilities: [
      "Analisar e reestruturar gastos com infraestrutura em nuvem.",
      "Disseminar cultura FinOps entre os times de desenvolvimento e arquitetura.",
      "Criar dashboards executivos de acompanhamento orçamentário.",
      "Garantir redução média entre 20% e 45% nos custos de nuvem sem perda de desempenho."
    ]
  },
  {
    id: "iot-edge-engineer",
    role: "IoT & Edge Computing Specialist",
    level: "Senior",
    code: "IoT",
    iconBg: "from-blue-500 to-teal-500",
    icon: "cloud",
    description: "Arquitetura e ingestão de dados em tempo real para dispositivos conectados, computação de borda e protocolos de comunicação industrial.",
    tags: ["Azure IoT", "IoT", "MQTT", "Edge Computing", "Python", "Airflow"],
    allocatedProjects: 6,
    allocatedPartners: 4,
    totalTeamSize: 10,
    certifications: ["Microsoft Certified: Azure IoT Developer Specialist"],
    keyDeliverables: [
      "Arquitetura de Ingestão IoT em Tempo Real (MQTT, Kafka)",
      "Processamento de Dados na Borda (Edge Computing)",
      "Integração com Sensores Industriais e Dispositivos Móveis",
      "Telemetria, Monitoramento e Diagnóstico Remoto de Dispositivos"
    ],
    responsibilities: [
      "Conectar equipamentos e sensores a plataformas de nuvem de forma segura.",
      "Desenvolver algoritmos de filtragem e pré-processamento local.",
      "Garantir baixa latência na transmissão de telemetria.",
      "Sustentar pipelines de streaming de dados em grande escala."
    ]
  }
];

const DIFFERENTIALS = [
  {
    title: "Curadoria & Retenção de Elite",
    icon: Award,
    desc: "Taxa de turnover inferior a 5%. Nossos profissionais passam por rigorosos processos de seleção e capacitação contínua."
  },
  {
    title: "Supervisão Técnica Sem Custos",
    icon: Cpu,
    desc: "Mesmo na alocação individual, um Principal Architect da ATRA acompanha periodicamente as entregas e a qualidade."
  },
  {
    title: "Substituição Rápida & Garantida",
    icon: Zap,
    desc: "Se houver qualquer necessidade de ajuste de perfil, realizamos a substituição em até 5 dias úteis com handover conduzido pela ATRA."
  },
  {
    title: "Conformidade, LGPD & Segurança",
    icon: ShieldCheck,
    desc: "Todos os consultores trabalham sob estritos acordos de confidencialidade (NDA), treinados nas normas LGPD e ISO 27001."
  }
];

export default function Consultants() {
  const { t } = useTranslation();
  const [selectedSpecialty, setSelectedSpecialty] = useState("Todas");
  const [selectedSeniority, setSelectedSeniority] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [activeModalRole, setActiveModalRole] = useState<SpecialistRole | null>(null);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roleNeeded: '',
    allocationType: 'Full-time',
    message: ''
  });

  const formRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelectRoleToForm = (roleTitle: string) => {
    setFormData(prev => ({ ...prev, roleNeeded: roleTitle }));
    if (activeModalRole) {
      setActiveModalRole(null);
    }
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 400);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  // Performance: Memoized roles filtering
  const filteredRoles = useMemo(() => {
    return SPECIALIST_ROLES.filter(item => {
      const matchesSpecialty = selectedSpecialty === "Todas" || item.tags.includes(selectedSpecialty);
      const matchesSeniority = selectedSeniority === "Todos" || item.level.includes(selectedSeniority);
      const matchesSearch = searchQuery.trim() === "" || 
        item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesSpecialty && matchesSeniority && matchesSearch;
    });
  }, [selectedSpecialty, selectedSeniority, searchQuery]);

  // Aggregated metrics
  const totalAllocatedInProjects = useMemo(() => SPECIALIST_ROLES.reduce((acc, curr) => acc + curr.allocatedProjects, 0), []);
  const totalConsultants = useMemo(() => SPECIALIST_ROLES.reduce((acc, curr) => acc + curr.totalTeamSize, 0), []);

  return (
    <main className="pt-24 md:pt-36 pb-20 bg-surface-1 min-h-screen text-text-main relative overflow-hidden">
      <BackgroundDecorations />

      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-left"
        >
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <StatusBadge 
              label="Especialistas em Dados, Cloud & IA" 
              variant="primary" 
              size="sm" 
              pulse={true} 
              icon={<Sparkles size={12} />} 
            />
            <MetricChip label="Alocação Rápida" variant="neutral" size="sm" />
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-text-main mb-4 leading-tight">
            Acelere seus projetos de Dados e IA com <span className="text-primary font-normal">consultores de elite</span>.
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-text-muted max-w-2xl font-light leading-relaxed mb-6">
            Engenheiros de dados, cientistas, arquitetos cloud, analytics engineers e especialistas em governança prontos para integrar sua equipe em até 48 horas.
          </p>

          {/* Quick Metrics Bar - Horizontal & Sleek */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 max-w-4xl pt-1">
            <div className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] px-4 py-3 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-text-muted font-normal">No Time</div>
                <div className="text-lg md:text-xl font-bold text-primary">
                  <AnimatedCounter end={totalConsultants} suffix="+" />
                </div>
              </div>
              <Users size={20} className="text-primary/40 shrink-0" />
            </div>

            <div className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] px-4 py-3 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-text-muted font-normal">Projetos Ativos</div>
                <div className="text-lg md:text-xl font-bold text-secondary">
                  <AnimatedCounter end={totalAllocatedInProjects} suffix="+" />
                </div>
              </div>
              <Zap size={20} className="text-secondary/40 shrink-0" />
            </div>

            <div className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] px-4 py-3 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-text-muted font-normal">Tempo Médio</div>
                <div className="text-lg md:text-xl font-bold text-emerald-400">&lt; 48h</div>
              </div>
              <CheckCircle2 size={20} className="text-emerald-500/40 shrink-0" />
            </div>

            <div className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] px-4 py-3 shadow-xs flex items-center justify-between">
              <div>
                <div className="text-xs text-text-muted font-normal">Satisfação</div>
                <div className="text-lg md:text-xl font-bold text-amber-400">
                  <AnimatedCounter end={99} suffix=".4%" />
                </div>
              </div>
              <Award size={20} className="text-amber-400/40 shrink-0" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Specialty & Seniority Filters Section */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-10">
        <div className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-primary" />
              <h2 className="text-xs sm:text-sm font-bold text-text-main">
                Filtre por Especialidade & Tecnologia
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Buscar cargo, tag ou tecnologia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-surface-1 border border-slate-200 dark:border-white/10 rounded-[6px] text-xs font-normal text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Seniority Selector Filter Bar */}
          <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[10px] font-bold text-text-muted uppercase mr-1 shrink-0">Senioridade:</span>
            {SENIORITIES.map((sen) => (
              <button
                key={sen}
                onClick={() => setSelectedSeniority(sen)}
                className={cn(
                  "px-2.5 py-0.5 rounded-[4px] text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer",
                  selectedSeniority === sen
                    ? "bg-primary text-white font-semibold shadow-xs"
                    : "bg-surface-1 text-text-muted hover:text-text-main hover:bg-surface-3 border border-slate-200 dark:border-white/5"
                )}
              >
                {sen}
              </button>
            ))}
          </div>

          {/* Tag Pills */}
          <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1 custom-scrollbar">
            {SPECIALTIES.map((spec) => {
              const isSelected = selectedSpecialty === spec;
              return (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={cn(
                    "px-2 py-0.5 rounded-[4px] text-[10.5px] transition-all duration-200 cursor-pointer whitespace-nowrap",
                    isSelected
                      ? "bg-primary text-white font-semibold shadow-xs"
                      : "bg-surface-1 text-text-muted hover:text-text-main border border-slate-200 dark:border-white/5 hover:bg-surface-3"
                  )}
                >
                  {spec}
                </button>
              );
            })}
          </div>

          {(selectedSpecialty !== "Todas" || selectedSeniority !== "Todos" || searchQuery !== "") && (
            <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-text-muted">
              <span>
                Filtros ativos: {selectedSpecialty !== "Todas" && <strong className="text-primary font-semibold mr-2">{selectedSpecialty}</strong>}
                {selectedSeniority !== "Todos" && <strong className="text-secondary font-semibold mr-2">[{selectedSeniority}]</strong>}
                {searchQuery && <span className="text-amber-400 font-semibold">"{searchQuery}"</span>}
              </span>
              <button 
                onClick={() => { setSelectedSpecialty("Todas"); setSelectedSeniority("Todos"); setSearchQuery(""); }} 
                className="text-primary hover:underline font-medium cursor-pointer text-xs"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Available Cargo / Specialist Profiles Grid - Horizontal, Spacious Cards with minimal vertical bloat */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base md:text-lg font-bold font-display text-text-main">
              Perfis Especializados Disponíveis
            </h2>
            <p className="text-xs text-text-muted font-light mt-0.5">
              Exibindo {filteredRoles.length} {filteredRoles.length === 1 ? 'perfil especializado' : 'perfis especializados'}
            </p>
          </div>
        </div>

        {filteredRoles.length === 0 ? (
          <div className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-8 text-center max-w-md mx-auto">
            <UserCheck size={32} className="mx-auto text-text-muted mb-2" />
            <h3 className="text-sm font-bold text-text-main mb-1">Nenhum perfil encontrado</h3>
            <p className="text-xs text-text-muted font-light mb-4">Não encontramos perfis com os filtros aplicados. Tente alterar os critérios de busca.</p>
            <button
              onClick={() => { setSelectedSpecialty("Todas"); setSelectedSeniority("Todos"); setSearchQuery(""); }}
              className="px-3.5 py-1.5 rounded-[6px] bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all cursor-pointer"
            >
              Resetar Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <AnimatePresence>
              {filteredRoles.map((role) => (
                <motion.div
                  key={role.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <GlowCard 
                    glowColor="blue" 
                    customSize={true}
                    radius={6}
                    className="p-5 sm:p-6 md:p-7 bg-surface-2 text-text-main shadow-sm flex flex-col justify-between h-full rounded-[6px] border border-slate-200 dark:border-white/5 hover:border-primary/40 transition-all duration-300 group"
                  >
                    <div>
                      {/* Top Horizontal Header */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className={cn(
                            "w-10 h-10 sm:w-11 sm:h-11 rounded-[6px] bg-gradient-to-br flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0",
                            role.iconBg
                          )}>
                            {role.code}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h3 className="text-base sm:text-lg font-bold text-text-main leading-snug group-hover:text-primary transition-colors truncate">
                                {role.role}
                              </h3>
                              <span className="text-[10.5px] font-semibold px-2.5 py-0.5 rounded-[4px] bg-primary/10 text-primary border border-primary/20 shrink-0">
                                {role.level}
                              </span>
                            </div>
                            <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1.5 mt-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              Pronto em &lt; 48h
                            </span>
                          </div>
                        </div>

                        {/* Top-right specialists badge */}
                        <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted bg-surface-1 px-3 py-1 rounded-[4px] border border-slate-200 dark:border-white/5 font-semibold shrink-0">
                          <Users size={12} className="text-primary" />
                          <span>{role.allocatedProjects + role.allocatedPartners} no ecossistema</span>
                        </div>
                      </div>

                      {/* Short Description */}
                      <p className="text-xs sm:text-sm text-text-muted font-light leading-relaxed mb-4 line-clamp-2">
                        {role.description}
                      </p>

                      {/* Skill Tags */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {role.tags.slice(0, 7).map((tag) => (
                          <span 
                            key={tag} 
                            className={cn(
                              "text-[11px] px-2.5 py-1 rounded-[4px] transition-colors font-medium",
                              tag === selectedSpecialty 
                                ? "bg-primary text-white font-semibold shadow-xs" 
                                : "bg-surface-1 text-text-muted border border-slate-200 dark:border-white/5 hover:text-text-main"
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                        {role.tags.length > 7 && (
                          <span className="text-[11px] px-2 py-1 rounded-[4px] bg-surface-1 text-text-muted border border-slate-200 dark:border-white/5">
                            +{role.tags.length - 7}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions & Metrics Footer */}
                    <div className="pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between gap-3">
                      <span className="sm:hidden text-xs text-text-muted flex items-center gap-1.5">
                        <Users size={12} className="text-primary" /> {role.allocatedProjects + role.allocatedPartners} no time
                      </span>

                      <div className="flex items-center gap-3 ml-auto">
                        <button
                          onClick={() => setActiveModalRole(role)}
                          className="py-2 px-3.5 rounded-[6px] bg-surface-1 hover:bg-surface-3 text-text-main border border-slate-200 dark:border-white/10 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                        >
                          <HelpCircle size={14} className="text-primary" />
                          <span>Detalhes</span>
                        </button>

                        <button
                          onClick={() => handleSelectRoleToForm(`${role.role} (${role.level})`)}
                          className="py-2 px-4 rounded-[6px] bg-primary hover:bg-primary-dark text-white text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-xs shadow-primary/20"
                        >
                          <span>Solicitar</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Differentials - Horizontal cards */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-16">
        <div className="bg-surface-2 border border-slate-200 dark:border-white/5 rounded-[6px] p-5 sm:p-7 shadow-xs">
          <div className="max-w-2xl mb-6">
            <h2 className="text-base md:text-lg font-bold font-display text-text-main mb-1">
              Por que os maiores players do mercado confiam nos consultores ATRA?
            </h2>
            <p className="text-xs text-text-muted font-light">
              Garantimos alto padrão técnico, governança de processos e alinhamento total com as metas do seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DIFFERENTIALS.map((diff, idx) => (
              <div key={idx} className="bg-surface-1 border border-slate-200 dark:border-white/5 rounded-[6px] p-4 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-[6px] bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                  <diff.icon size={16} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-text-main mb-1">{diff.title}</h3>
                  <p className="text-xs text-text-muted font-light leading-relaxed">{diff.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Request Consultant / Form Section - Using the EXACT components & layout from the Home page */}
      <section 
        ref={formRef} 
        id="solicitar-consultores" 
        className="py-12 bg-surface-2 dark:bg-[#12151c] relative overflow-hidden px-3 sm:px-6 transition-colors duration-500 border-t border-border-main/50"
      >
        {/* Technological detail lines */}
        <TechHorizontalLine color="mixed" sectionName="CONSULTANT_DISPATCH" align="right" side="top" delay={0.2} />
        <TechVerticalLine color="blue" sectionName="SQUAD_ENGINE" align="right" alignY="top" delay={0.3} />
        <TechCornerBraces color="orange" position="bottom-left" delay={0.4} />

        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-stretch relative z-10">
            
            {/* Left Side: Contact Form with Home-style Underline Inputs */}
            <div className="flex flex-col text-left py-6 md:py-10 pr-0 lg:pr-12">
              
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-display text-text-main dark:text-white mb-4 leading-tight">
                Vamos acelerar sua equipe com consultores ATRA?
              </h2>

              <h3 className="text-lg md:text-xl font-light font-display text-text-main dark:text-white mb-6">
                Solicite perfis ou squads para o seu projeto!
              </h3>

              {formData.roleNeeded && !formSubmitted && (
                <div className="mb-4 p-2.5 px-3 rounded-[6px] bg-primary/10 border border-primary/20 flex items-center justify-between gap-3 text-xs text-text-main">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-primary shrink-0" />
                    <span>Perfil selecionado: <strong className="text-primary">{formData.roleNeeded}</strong></span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setFormData(prev => ({ ...prev, roleNeeded: '' }))}
                    className="text-text-muted hover:text-text-main text-[11px] cursor-pointer"
                  >
                    Limpar
                  </button>
                </div>
              )}

              {formSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 rounded-[6px] p-6 text-center max-w-md my-4"
                >
                  <div className="w-11 h-11 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-3">
                    <Check size={22} />
                  </div>
                  <h4 className="text-base font-bold text-text-main mb-1.5">Solicitação enviada com sucesso!</h4>
                  <p className="text-xs text-text-muted font-light mb-5">
                    Recebemos seu pedido para <strong className="text-emerald-500 font-semibold">{formData.roleNeeded || "Consultoria de Dados/Cloud"}</strong>. Nosso time de alocação entrará em contato em até 24 horas.
                  </p>
                  <button
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', roleNeeded: '', allocationType: 'Full-time', message: '' });
                    }}
                    className="px-5 py-2 bg-surface-1 border border-slate-200 dark:border-white/10 rounded-[6px] text-xs font-semibold text-text-main hover:bg-surface-3 transition-colors cursor-pointer"
                  >
                    Enviar nova solicitação
                  </button>
                </motion.div>
              ) : (
                <form className="flex flex-col space-y-6" onSubmit={handleFormSubmit}>
                  <div>
                    <input 
                      ref={nameInputRef}
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full bg-transparent border-b border-border-main dark:border-white/20 focus:border-primary dark:focus:border-white outline-none py-2 text-sm text-text-main dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 font-light transition-colors" 
                      placeholder="Nome completo *" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full bg-transparent border-b border-border-main dark:border-white/20 focus:border-primary dark:focus:border-white outline-none py-2 text-sm text-text-main dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 font-light transition-colors" 
                      placeholder="E-mail corporativo *" 
                    />
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      className="w-full bg-transparent border-b border-border-main dark:border-white/20 focus:border-primary dark:focus:border-white outline-none py-2 text-sm text-text-main dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 font-light transition-colors" 
                      placeholder="Telefone / WhatsApp" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <input 
                      type="text" 
                      name="roleNeeded"
                      value={formData.roleNeeded}
                      onChange={handleFormChange}
                      className="w-full bg-transparent border-b border-border-main dark:border-white/20 focus:border-primary dark:focus:border-white outline-none py-2 text-sm text-text-main dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 font-light transition-colors" 
                      placeholder="Cargo ou tecnologia desejada" 
                    />
                    <select
                      name="allocationType"
                      value={formData.allocationType}
                      onChange={handleFormChange}
                      className="w-full bg-transparent border-b border-border-main dark:border-white/20 focus:border-primary dark:focus:border-white outline-none py-2 text-sm text-text-main dark:text-white font-light transition-colors cursor-pointer"
                    >
                      <option value="Full-time" className="bg-surface-2 text-text-main">Modelo: Full-time (Dedicado)</option>
                      <option value="Part-time" className="bg-surface-2 text-text-main">Modelo: Part-time (Parcial)</option>
                      <option value="Squad Dedicada" className="bg-surface-2 text-text-main">Modelo: Squad Gerenciada ATRA</option>
                      <option value="Staff Augmentation" className="bg-surface-2 text-text-main">Modelo: Staff Augmentation</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <input 
                      type="text" 
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      className="w-full bg-transparent border-b border-border-main dark:border-white/20 focus:border-primary dark:focus:border-white outline-none py-2 pb-12 text-sm text-text-main dark:text-white placeholder:text-text-muted dark:placeholder:text-white/40 font-light transition-colors" 
                      placeholder="Descreva brevemente o projeto, horizonte de tempo ou requisitos..." 
                    />
                  </div>

                  <div className="flex justify-end pt-3">
                    <button 
                      type="submit"
                      className="bg-primary hover:bg-primary-dark text-white dark:bg-white dark:text-[#12151c] dark:hover:bg-white/90 py-3 px-6 rounded-[6px] text-sm font-medium transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95"
                    >
                      <span>Verificar Disponibilidade</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Side: Human Team Image Card & Direct Contacts (Exact match with Home) */}
            <div className="relative rounded-[6px] overflow-hidden flex flex-col justify-between p-8 sm:p-10 min-h-[480px] shadow-xl dark:shadow-2xl bg-surface-1 dark:bg-[#12151c]">
              {/* Background image (team collaborating) */}
              <img 
                src="/imagens/unsplash-1556761175-5973dc0f32e7-w1600-fee708.jpg" 
                alt="Equipe ATRA de Consultores" 
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
                    {/* Instagram (#E4405F) */}
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

      {/* Role Details Modal Drawer */}
      <AnimatePresence>
        {activeModalRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalRole(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-2 border border-slate-200 dark:border-white/10 rounded-[6px] p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveModalRole(null)}
                className="absolute top-6 right-6 p-2 rounded-[6px] bg-surface-1 hover:bg-surface-3 text-text-muted hover:text-text-main transition-colors cursor-pointer border border-slate-200 dark:border-white/5"
              >
                <X size={18} />
              </button>

              <div className="flex items-start gap-4 mb-6 pr-10">
                <div className={cn(
                  "w-12 h-12 rounded-[6px] bg-gradient-to-br flex items-center justify-center text-white font-bold text-base shadow-md shrink-0",
                  activeModalRole.iconBg
                )}>
                  {activeModalRole.code}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-text-main leading-tight">
                    {activeModalRole.role}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-[6px] bg-primary/10 text-primary border border-primary/20">
                      Nível {activeModalRole.level}
                    </span>
                    <span className="text-xs text-emerald-500 font-semibold">
                      Disponível em &lt; 48 horas
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-text-muted font-light leading-relaxed mb-6 bg-surface-1 p-4 rounded-[6px] border border-slate-200 dark:border-white/5">
                {activeModalRole.description}
              </p>

              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  <GraduationCap size={16} className="text-primary" />
                  <span>Certificações do time ATRA neste Perfil</span>
                </div>
                <div className="space-y-1.5">
                  {activeModalRole.certifications.map((cert, idx) => (
                    <div key={idx} className="text-xs text-text-main font-medium flex items-center gap-2 bg-surface-1 p-2 rounded-[6px] border border-slate-200 dark:border-white/5">
                      <Award size={14} className="text-amber-400 shrink-0" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Principais Entregáveis Esperados</span>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModalRole.keyDeliverables.map((deliv, idx) => (
                    <li key={idx} className="text-xs text-text-muted font-light bg-surface-1 p-2.5 rounded-[6px] border border-slate-200 dark:border-white/5 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></span>
                      <span>{deliv}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                  <Cpu size={16} className="text-primary" />
                  <span>Escopo de Responsabilidade</span>
                </div>
                <ul className="space-y-1.5">
                  {activeModalRole.responsibilities.map((resp, idx) => (
                    <li key={idx} className="text-xs text-text-muted font-light flex items-start gap-2">
                      <ChevronRight size={14} className="text-primary shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-8">
                <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Tecnologias de Domínio</div>
                <div className="flex flex-wrap gap-1.5">
                  {activeModalRole.tags.map(t => (
                    <span key={t} className="text-xs px-2.5 py-1 rounded-[6px] bg-surface-1 border border-slate-200 dark:border-white/5 text-text-muted font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/5">
                <button
                  onClick={() => setActiveModalRole(null)}
                  className="px-5 py-2.5 rounded-[6px] text-xs font-semibold text-text-muted hover:text-text-main transition-colors cursor-pointer"
                >
                  Fechar
                </button>
                <button
                  onClick={() => handleSelectRoleToForm(`${activeModalRole.role} (${activeModalRole.level})`)}
                  className="px-6 py-2.5 rounded-[6px] bg-primary hover:bg-primary-dark text-white text-xs font-bold shadow-lg shadow-primary/25 transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Solicitar este Profissional</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
