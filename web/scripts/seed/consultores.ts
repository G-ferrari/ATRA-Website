/* Seed dos 8 perfis de consultores (MIG-052).
 *
 * De `legacy/src/pages/Consultants.tsx:61`. Idempotente pelo cargo. O inglês
 * repete o português por ora (P-08).
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'

type Perfil = {
  role: string; code: string; level: 'Senior' | 'Pleno' | 'Lead / Principal'
  icon: 'database' | 'brain' | 'cloud' | 'chart' | 'shield' | 'workflow' | 'lock' | 'target' | 'sparkles'
  description: string; tags: string[]
  allocatedProjects: number; allocatedPartners: number; totalTeamSize: number
  certifications: string[]; order: number
  gradient:
    | 'blue-cyan' | 'cyan-teal' | 'indigo-blue' | 'sky-indigo'
    | 'purple-indigo' | 'emerald-teal' | 'amber-orange' | 'blue-teal'
}

const PERFIS: Perfil[] = [
  {
    role: 'Data Engineer', code: 'DE', level: 'Senior',
    icon: 'database',
    description: 'Especialista em arquiteturas Lakehouse, engenharia de dados em larga escala, pipelines ETL/ELT resilientes e governança de dados.',
    tags: ['Databricks', 'PySpark', 'Delta Lake', 'Airflow', 'AWS', 'BigQuery', 'dbt', 'SQL'],
    allocatedProjects: 18, allocatedPartners: 12, totalTeamSize: 30,
    certifications: ['Databricks Certified Data Engineer Professional', 'Google Cloud Professional Data Engineer', 'AWS Certified Data Analytics'],
    order: 0,
    gradient: 'blue-cyan',
  },
  {
    role: 'ML Engineer', code: 'MLE', level: 'Senior',
    icon: 'brain',
    description: 'Desenvolve e implementa modelos de Machine Learning e IA Generativa em produção com MLOps end-to-end e monitoramento de performance.',
    tags: ['Python', 'Vertex AI', 'MLflow', 'TensorFlow', 'OpenAI', 'LLM', 'LangChain', 'RAG'],
    allocatedProjects: 14, allocatedPartners: 9, totalTeamSize: 23,
    certifications: ['Google Cloud Professional Machine Learning Engineer', 'AWS Certified Machine Learning - Specialty'],
    order: 1,
    gradient: 'cyan-teal',
  },
  {
    role: 'Cloud Architect', code: 'CA', level: 'Lead / Principal',
    icon: 'cloud',
    description: 'Desenho de arquiteturas multi-cloud, modernização de sistemas legados, infraestrutura como código e práticas estratégicas de FinOps.',
    tags: ['GCP', 'AWS', 'Terraform', 'Kubernetes', 'FinOps', 'Azure IoT', 'Edge Computing'],
    allocatedProjects: 12, allocatedPartners: 11, totalTeamSize: 23,
    certifications: ['Google Cloud Professional Cloud Architect', 'AWS Certified Solutions Architect - Professional'],
    order: 2,
    gradient: 'indigo-blue',
  },
  {
    role: 'Analytics Engineer', code: 'AE', level: 'Senior',
    icon: 'sparkles',
    description: 'Ponte perfeita entre engenharia e negócios, transformando dados brutos em modelos semânticos otimizados para BI e self-service analytics.',
    tags: ['dbt', 'Snowflake', 'BigQuery', 'Looker', 'Power BI', 'DAX', 'SQL'],
    allocatedProjects: 15, allocatedPartners: 8, totalTeamSize: 23,
    certifications: ['dbt Analytics Engineering Certification', 'Snowflake SnowPro Core', 'Microsoft Certified: Power BI Data Analyst'],
    order: 3,
    gradient: 'sky-indigo',
  },
  {
    role: 'Data Governance Specialist', code: 'DGS', level: 'Lead / Principal',
    icon: 'shield',
    description: 'Implementa frameworks completos de governança de dados, qualidade, catalogação, conformidade com LGPD/ISO 27001 e linhagem de dados.',
    tags: ['Collibra', 'Data Catalog', 'LGPD', 'ISO 27001', 'Privacy', 'SQL'],
    allocatedProjects: 11, allocatedPartners: 7, totalTeamSize: 18,
    certifications: ['DAMA CDMP (Certified Data Management Professional)', 'OneTrust Certified Privacy Professional'],
    order: 4,
    gradient: 'purple-indigo',
  },
  {
    role: 'Data Scientist', code: 'DS', level: 'Senior',
    icon: 'brain',
    description: 'Especialista em modelagem estatística avançada, análise preditiva, otimização de negócios e storytelling orientado a tomadas de decisão.',
    tags: ['Python', 'PySpark', 'SQL', 'Storytelling', 'Tableau', 'TensorFlow', 'LLM'],
    allocatedProjects: 10, allocatedPartners: 6, totalTeamSize: 16,
    certifications: ['TensorFlow Developer Certificate', 'Google Professional Data Scientist'],
    order: 5,
    gradient: 'emerald-teal',
  },
  {
    role: 'FinOps & Cloud Cost Specialist', code: 'FC', level: 'Senior',
    icon: 'sparkles',
    description: 'Otimização contínua de custos em ambientes Cloud (GCP/AWS/Azure), redução de desperdício em consultas e governança orçamentária.',
    tags: ['FinOps', 'GCP', 'AWS', 'BigQuery', 'Looker', 'Kubernetes'],
    allocatedProjects: 8, allocatedPartners: 6, totalTeamSize: 14,
    certifications: ['FinOps Certified Practitioner (FCP)', 'AWS Certified Cloud Practitioner'],
    order: 6,
    gradient: 'amber-orange',
  },
  {
    role: 'IoT & Edge Computing Specialist', code: 'IoT', level: 'Senior',
    icon: 'cloud',
    description: 'Arquitetura e ingestão de dados em tempo real para dispositivos conectados, computação de borda e protocolos de comunicação industrial.',
    tags: ['Azure IoT', 'IoT', 'MQTT', 'Edge Computing', 'Python', 'Airflow'],
    allocatedProjects: 6, allocatedPartners: 4, totalTeamSize: 10,
    certifications: ['Microsoft Certified: Azure IoT Developer Specialist'],
    order: 7,
    gradient: 'blue-teal',
  },
]

const payload = await getPayload({ config })

console.log('→ perfis de consultores')
for (const p of PERFIS) {
  const { docs } = await payload.find({ collection: 'specialist-roles', where: { role: { equals: p.role } }, limit: 1, locale: 'pt', depth: 0 })
  const data = {
    role: p.role, code: p.code, level: p.level, icon: p.icon, gradient: p.gradient,
    description: p.description,
    tags: p.tags.map((name) => ({ name })),
    allocatedProjects: p.allocatedProjects, allocatedPartners: p.allocatedPartners, totalTeamSize: p.totalTeamSize,
    certifications: p.certifications.map((name) => ({ name })),
    order: p.order,
  }
  const doc = docs[0]
    ? await payload.update({ collection: 'specialist-roles', id: docs[0].id, data, locale: 'pt' })
    : await payload.create({ collection: 'specialist-roles', data, locale: 'pt' })
  await payload.update({ collection: 'specialist-roles', id: doc.id, data: { role: p.role, description: p.description }, locale: 'en' })
}
console.log(`  ${PERFIS.length} perfis`)
process.exit(0)
