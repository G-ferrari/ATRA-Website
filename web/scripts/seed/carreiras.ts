/* Seed de /carreiras e das 6 vagas (MIG-050/050a).
 *
 * Vagas de `legacy/src/pages/Careers.tsx:423`; a página reproduz a ordem e o
 * conteúdo das sete seções do legado. Conteúdo em português; o inglês repete
 * por ora (P-08).
 *
 * ⚠️ MIG-050 fechou esta página com quatro das sete seções — 10.111px contra os
 * 14.539px do gabarito — e sem gabarito registrado, então ninguém viu. MIG-050a
 * reconstruiu: o herói centralizado com a barra de métricas, os cartões altos do
 * "Jeito ATRA de Ser", "Vantagens de ser ATRA", o trainee, e o banco de talentos
 * de volta para **dentro** da seção de vagas. A rota entrou em
 * `ROTAS_COM_GABARITO` no mesmo PR.
 *
 * ⚠️ As vagas entram **publicadas mas sem corpo** — o legado só tem os títulos,
 * e a página de detalhe (MIG-051) trata a ausência de descrição com aviso, como
 * o blog. A candidatura é MIG-102 (P-17).
 */
import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { casarIds } from './ids'

const VAGAS = [
  'Engenheiro(a) de Dados SR',
  'Engenheiro(a) de Dados SR - Azure / Databricks',
  'Trainee Engenheiro de Data Analytics & AI',
  'Engenheiro(a) de Dados SR (DBT Core e GCP)',
  'Engenheiro Analytics Sr',
  'Engenheiro(a) de Dados - Looker Platform / LookML',
]

const paraSlug = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const payload = await getPayload({ config })

console.log('→ vagas')
let n = 0
for (let i = 0; i < VAGAS.length; i++) {
  const title = VAGAS[i]
  const slug = paraSlug(title)
  const { docs } = await payload.find({ collection: 'jobs', where: { slug: { equals: slug } }, limit: 1, locale: 'pt', depth: 0 })
  const data = {
    title, slug, area: 'Engenharia de Dados', locationType: 'remote' as const,
    location: 'Brasil',
    summary: 'Faça parte do nosso time de elite em dados, IA e cloud.',
    publishedAt: new Date(2026, 0, 20 - i).toISOString(),
    _status: 'published' as const,
  }
  const doc = docs[0]
    ? await payload.update({ collection: 'jobs', id: docs[0].id, data, locale: 'pt' })
    : await payload.create({ collection: 'jobs', data, locale: 'pt' })
  await payload.update({ collection: 'jobs', id: doc.id, data: { title, slug, area: 'Data Engineering', summary: data.summary }, locale: 'en' })
  n++
}
console.log(`  ${n} vagas`)

/* A foto do trainee sai do acervo da ATRA, não do hotlink do Unsplash de
 * `Careers.tsx:606` — mesma decisão de /sobre, e o arquivo já entrou no acervo
 * pelo seed daquela página, que roda antes desta. */
const { docs: fotos } = await payload.find({
  collection: 'media',
  where: { filename: { contains: 'Dinamica' } },
  limit: 1,
  depth: 0,
})
const fotoTrainee = fotos[0]?.id ?? null
if (!fotoTrainee) console.warn('  ⚠️ foto do trainee não encontrada no acervo; a seção sai sem imagem')

/* Os três valores da ATRA. São os mesmos de /sobre — lá no cartão curto
 * (`About.tsx:353`), aqui no alto, com checklist (`Careers.tsx:222`). */
const jeitoAtra = [
  {
    icon: 'users' as const,
    glowColor: 'blue' as const,
    title: 'Pessoas',
    description: 'Proatividade, Liderança, Diversidade, Equidade, Ética, Respeito e Confiança.',
    bullets: [
      { text: 'Proporcionamos um ambiente de aprendizado e crescimento contínuo.' },
      { text: 'Atuamos em equipe, priorizando o relacionamento humano e a empatia.' },
    ],
  },
  {
    icon: 'award' as const,
    glowColor: 'blue' as const,
    title: 'Qualidade',
    description: 'Responsabilidade, Transparência, Consciência, Excelência e Flexibilidade.',
    bullets: [
      { text: 'Segurança e qualidade nas entregas com clareza arquitetural e rigor técnico.' },
      { text: 'Comprometimento com a evolução constante de processos e metodologias.' },
    ],
  },
  {
    icon: 'zap' as const,
    glowColor: 'orange' as const,
    title: 'Inovação',
    description: 'Solução, Tecnologia, Transformação Digital e Aprendizado Contínuo.',
    bullets: [
      { text: 'Inovação contínua como alicerce do nosso modelo de engenharia de software.' },
      { text: 'Buscamos superar expectativas dos clientes com soluções criativas e escaláveis.' },
    ],
  },
]

const processo = [
  { title: 'Candidate-se à vaga', description: 'Envie sua inscrição na vaga que melhor combina com seu perfil ou cadastre seu currículo no nosso banco de talentos.' },
  { title: 'Etapa RH & Cultura', description: 'Bate-papo online para alinhamento de expectativas, trajetória e identificação com o Jeito ATRA de ser.' },
  { title: 'Etapa Técnica', description: 'Entrevista prática com especialistas para avaliar hard skills, arquitetura e discutir soluções reais de dados.' },
  { title: 'Etapa Final & Proposta', description: 'Apresentação ao gestor da squad e envio da proposta formal de contratação com todos os benefícios.' },
]

const vantagens = [
  { icon: 'graduation-cap' as const, title: 'Desenvolvimento Contínuo', description: 'Acesso a treinamentos, certificações e workshops para seu crescimento profissional.' },
  { icon: 'heart' as const, title: 'Ambiente Acolhedor', description: 'Cultura focada nas pessoas, promovendo diversidade, equidade e respeito mútuo.' },
  { icon: 'zap' as const, title: 'Inovação Diária', description: 'Trabalhe com grandes marcas e desafios complexos usando as tecnologias líderes do mercado.' },
  { icon: 'coffee' as const, title: 'Flexibilidade & Bem-estar', description: 'Pacote de benefícios completo e suporte à flexibilidade de rotina.' },
]

const layout = [
  {
    blockType: 'pageHero' as const,
    badge: 'Vagas Abertas & Banco de Talentos',
    chip: 'GPTW Certificado',
    /* ⚠️ O `h1` é "Construa sua história na ATRA" (`Careers.tsx:124`). MIG-050
       promoveu a **linha de apoio** a título e a página perdeu as duas. */
    title: 'Construa sua história na ATRA',
    highlight: ['ATRA'],
    subtitle: 'Venha fazer parte de um time focado em soluções de dados',
    /* ⚠️ A frase termina em "profissional" — é `careers.desc` de
       `legacy/src/locales/pt.json`, inteira. MIG-050 emendou ", ao lado de
       especialistas e numa das melhores empresas para se trabalhar no Brasil",
       que não existe no legado e fazia a linha quebrar em duas. */
    description: 'Aqui você pode alcançar todo o seu potencial profissional',
    align: 'center' as const,
    /* Sem CTAs: o herói do legado fecha na barra de métricas. */
    ctas: [],
    metrics: [
      { value: 94, suffix: '%', label: 'Satisfação GPTW', color: 'primary' as const },
      { value: 100, suffix: '%', label: 'Trabalho Remoto/Flex', color: 'secondary' as const },
      { value: 120, suffix: '+', label: 'Especialistas', color: 'emerald' as const },
    ],
    mediaMode: 'none' as const,
  },
  {
    blockType: 'stickyPageNav' as const,
    /* Sem `mb-8 sm:mb-10`: aqui o menu cola no "Jeito ATRA de Ser". */
    bottomGap: 'none' as const,
  },
  {
    blockType: 'valueCards' as const,
    anchor: 'jeito-atra',
    navLabel: 'Jeito ATRA de ser',
    spacing: 'roomy' as const,
    variant: 'expanded' as const,
    eyebrow: 'Nossa Essência',
    /* "de Ser" com S maiúsculo, e "Jeito ATRA" em azul (`Careers.tsx:212`). */
    title: 'O Jeito ATRA de Ser',
    highlight: 'Jeito ATRA',
    description: 'Nossos valores guiam cada ação e decisão. É assim que construímos relações duradouras, promovemos o desenvolvimento contínuo e entregamos excelência aos nossos clientes e colaboradores.',
    items: jeitoAtra,
  },
  {
    blockType: 'sealsBanner' as const,
    anchor: 'premiacoes',
    navLabel: 'Selos e Premiações',
    theme: 'surface-2' as const,
    borda: 'ambas' as const,
    /* Única seção da página com o respiro curto (`Careers.tsx:306`). */
    spacing: 'normal' as const,
    title: 'Uma das melhores empresas para trabalhar no Brasil',
  },
  {
    blockType: 'processSteps' as const,
    anchor: 'processo-seletivo',
    navLabel: 'Processo Seletivo',
    spacing: 'roomy' as const,
    /* "Transparência" (`Careers.tsx:365`), não "Processo Seletivo" — esse é o
       rótulo do menu da página, e o legado usa os dois textos diferentes. */
    eyebrow: 'Transparência',
    title: 'Como funciona nosso processo seletivo',
    description: 'Um processo estruturado e transparente, focado em conhecer o seu potencial e apresentar nossa cultura.',
    steps: processo,
  },
  {
    blockType: 'jobsList' as const,
    anchor: 'trabalhe-conosco',
    navLabel: 'Trabalhe Conosco',
    theme: 'surface-2' as const,
    borda: 'topo' as const,
    spacing: 'roomy' as const,
    eyebrow: 'Oportunidades',
    title: 'Vagas Abertas',
    description: 'Venha desenvolver sua carreira e fazer parte do nosso time de elite.',
    emptyText: 'Nenhuma vaga aberta no momento. Deixe seu currículo no banco de talentos.',
    talentBank: {
      eyebrow: 'Banco de Talentos',
      title: 'Não encontrou a vaga ideal?',
      highlight: 'vaga ideal?',
      description: 'Deixe seu currículo conosco. Estamos sempre em busca de profissionais incríveis para fazer parte do nosso time.',
      note: 'Nossa equipe de recrutamento avaliará seu perfil com atenção.',
    },
  },
  {
    blockType: 'iconCardGrid' as const,
    anchor: 'vantagens',
    navLabel: 'Vantagens',
    spacing: 'roomy' as const,
    eyebrow: 'Benefícios',
    title: 'Vantagens de ser ATRA',
    columns: '4' as const,
    variant: 'card-centered' as const,
    items: vantagens,
  },
  {
    blockType: 'richTextSection' as const,
    anchor: 'trainee',
    navLabel: 'Trainee',
    theme: 'surface-2' as const,
    borda: 'topo' as const,
    spacing: 'roomy' as const,
    headerLayout: 'centered' as const,
    eyebrow: 'Futuro dos Dados',
    title: 'Programa de Trainee ATRA',
    description: 'Venha começar sua carreira em Engenharia de Data Analytics & AI com acompanhamento próximo de arquitetos mentores.',
    subtitle: 'Mentoria e imersão prática do primeiro ao último dia.',
    body: paragrafo(
      'Nosso programa oferece trilhas técnicas em Python, SQL, Databricks, Google Cloud e boas práticas de engenharia de software voltadas a dados.',
    ),
    callout: {
      label: 'Status do Ciclo Atual:',
      text: 'Inscrições para a próxima turma abrirão em breve. Cadastre seu currículo no banco de talentos para ser notificado com prioridade.',
    },
    image: fotoTrainee,
    imagePosition: 'right' as const,
  },
]

/** Um parágrafo solto no formato do Lexical, que é o que o campo `body` espera. */
function paragrafo(texto: string) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'paragraph',
          format: '' as const,
          indent: 0,
          version: 1,
          direction: 'ltr' as const,
          textFormat: 0,
          children: [
            { type: 'text', text: texto, format: 0, style: '', mode: 'normal', detail: 0, version: 1 },
          ],
        },
      ],
    },
  }
}

console.log('→ /carreiras')
const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: 'carreiras' } }, limit: 1, locale: 'pt', depth: 0 })
const dados = { title: 'Trabalhe Conosco', slug: 'carreiras', layout, _status: 'published' as const }
const doc = docs[0]
  ? await payload.update({ collection: 'pages', id: docs[0].id, data: dados, locale: 'pt' })
  : await payload.create({ collection: 'pages', data: dados, locale: 'pt' })

/* Mesma armadilha de /sobre: o inglês precisa do layout com os ids gravados, ou
 * os campos localizados dos blocos ficam órfãos. */
const gravado = await payload.findByID({ collection: 'pages', id: doc.id, locale: 'pt', depth: 0 })
await payload.update({ collection: 'pages', id: doc.id, data: { title: 'Careers', slug: 'careers', layout: casarIds(layout, gravado.layout) }, locale: 'en' })
console.log(`  carreiras (${layout.length} blocos)`)
process.exit(0)
