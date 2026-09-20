/* Seed do glossário (MIG-040).
 *
 * Os 17 termos de `legacy/src/pages/Glossary.tsx:11`. Idempotente por slug.
 *
 * O inglês ainda não existe no protótipo — o legado traduz navegação, não
 * conteúdo (P-08). Por ora o EN repete o PT e entra na fila de tradução.
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'

type Termo = { term: string; category: string; definition: string }

const TERMOS: Termo[] = [
  { term: 'Advanced Analytics', category: 'Analytics', definition:
    'Uso de técnicas complexas, como machine learning e modelagem preditiva, para analisar dados e prever tendências futuras.' },
  { term: 'Big Data', category: 'Infraestrutura', definition:
    'Conjuntos de dados extremamente grandes e complexos que requerem ferramentas avançadas para captura, armazenamento, gerenciamento e análise.' },
  { term: 'Business Intelligence (BI)', category: 'Analytics', definition:
    'Processo de coleta, análise e apresentação de dados de negócios para apoiar a tomada de decisões estratégicas.' },
  { term: 'Cloud Computing', category: 'Cloud', definition:
    'Entrega de serviços de computação (servidores, armazenamento, bancos de dados, redes, software) pela internet sob demanda.' },
  { term: 'Data Governance', category: 'Governança', definition:
    'Gestão da disponibilidade, usabilidade, integridade, conformidade e segurança dos dados utilizados em uma corporação.' },
  { term: 'Data Lake', category: 'Engenharia de Dados', definition:
    'Repositório centralizado que permite armazenar todos os dados estruturados e não estruturados em qualquer escala e formato.' },
  { term: 'Data Literacy', category: 'Cultura', definition:
    'A capacidade de ler, entender, criar, criticar e comunicar dados como informação acionável em todos os níveis organizacionais.' },
  { term: 'Data Quality', category: 'Governança', definition:
    'Medida da condição e confiabilidade dos dados com base em fatores como precisão, integridade, consistência e conformidade temporal.' },
  { term: 'Data Warehouse', category: 'Engenharia de Dados', definition:
    'Sistema analítico estruturado usado para relatórios e análise de dados históricos, sendo pilar do BI corporativo.' },
  { term: 'Deep Learning', category: 'Inteligência Artificial', definition:
    'Subcampo do machine learning baseado em redes neurais artificiais profundas com múltiplas camadas de neurônios.' },
  { term: 'FinOps', category: 'FinOps & Cloud', definition:
    'Prática e cultura de gestão financeira para nuvem, unindo engenharia, finanças e negócios para otimizar custos contínuos.' },
  { term: 'Inteligência Artificial (IA)', category: 'Inteligência Artificial', definition:
    'Simulação de processos cognitivos e tomadas de decisão humanas por meio de algoritmos e sistemas computacionais.' },
  { term: 'IA Generativa', category: 'Inteligência Artificial', definition:
    'Modelos de aprendizado profundo (como LLMs e modelos de difusão) capazes de gerar textos, códigos, imagens ou sínteses a partir de instruções.' },
  { term: 'Lakehouse', category: 'Engenharia de Dados', definition:
    'Arquitetura moderna que combina a escalabilidade e baixo custo dos data lakes com a governança e transações ACID dos data warehouses.' },
  { term: 'Machine Learning', category: 'Inteligência Artificial', definition:
    'Subárea da inteligência artificial focada na construção de algoritmos que aprendem padrões a partir de dados históricos.' },
  { term: 'Modelos Preditivos', category: 'Analytics', definition:
    'Uso de estatísticas, variáveis explicativas e IA para prever comportamentos ou riscos futuros.' },
  { term: 'Processamento de Linguagem Natural (NLP)', category: 'Inteligência Artificial', definition:
    'Ramo da IA voltado à compreensão, interpretação e geração de linguagem natural falada ou escrita.' },
]

/** Mesmo algoritmo do campo `slug` — mantém a URL previsível. */
const paraSlug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const payload = await getPayload({ config })

console.log('→ glossário')
let criados = 0
for (const t of TERMOS) {
  const slug = paraSlug(t.term)
  const { docs } = await payload.find({
    collection: 'glossary-terms',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: 'pt',
    depth: 0,
  })
  const data = { term: t.term, slug, definition: t.definition, category: t.category }
  const doc = docs[0]
    ? await payload.update({ collection: 'glossary-terms', id: docs[0].id, data, locale: 'pt' })
    : await payload.create({ collection: 'glossary-terms', data, locale: 'pt' })

  await payload.update({ collection: 'glossary-terms', id: doc.id, data, locale: 'en' })
  criados++
}
console.log(`  ${criados} termos`)
process.exit(0)
