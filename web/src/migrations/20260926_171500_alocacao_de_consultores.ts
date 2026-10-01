import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

/* Migração de **dados**, não de schema: monta `/solucoes/alocacao-de-consultores`
 * no padrão das páginas de solução desenhadas (RC18, IA), com o texto da página
 * do WordPress na íntegra e o botão para `/consultores`.
 *
 * Por que migração, e não admin nem script: foi a escolha do G-ferrari em
 * 26/09. Ninguém do lado do conteúdo tem acesso à VPS para rodar um script, e
 * montar seis blocos à mão no admin é refazer o que já está pronto e conferido
 * no ambiente local. A migração roda sozinha no deploy — na homologação e,
 * depois, na produção.
 *
 * ⚠️ Só age se a página ainda for a da importação do WordPress (MIG-093,
 * `import-solutions.ts`): exatamente herói + texto corrido + chamada. Qualquer
 * outro layout quer dizer que alguém já editou a página no admin, e aí ela não
 * toca em nada — só avisa no log. Conteúdo é do marketing (D-22); a migração
 * não sobrescreve decisão de ninguém.
 *
 * ⚠️ Grava só o português. Os blocos são compartilhados entre os idiomas, os
 * textos não, e com `fallback: true` o inglês lê o português enquanto não
 * houver tradução. Gravar o inglês aqui exigiria casar os ids de todos os
 * níveis (`casarIds`), e errar isso deixa texto em branco — ver o CLAUDE.md.
 *
 * Sem snapshot `.json`: o schema não muda, e um snapshot aqui viraria a base do
 * próximo `migrate:create`. */

const SLUG = 'alocacao-de-consultores'
const LAYOUT_DA_IMPORTACAO = 'pageHero,richTextSection,ctaBanner'

/* Texto de atra.com.br/alocacao-de-consultores (modificada em 08/07/2025). O
 * primeiro cartão usa a versão mais completa da lista de especialidades — a
 * página repete o parágrafo duas vezes, e a segunda omite Data Governance e
 * Google Cloud. */
const layout = (parceiros: number[]) => [
  {
    blockType: 'pageHero' as const,
    badge: 'Alocação de Consultores',
    title: 'Alocação de Consultores',
    highlight: ['Consultores'],
    description:
      'De forma a tornar a operação mais eficiente e econômica, alocamos consultores das mais diversas especialidades nas dependências da sua empresa.',
    descriptionWidth: 'wide' as const,
    align: 'left' as const,
    mediaMode: 'none' as const,
    ctaVariant: 'secondary' as const,
    ctas: [
      { label: 'Conheça nossos consultores', href: '/consultores' },
      { label: 'Quero saber mais', href: '#contato' },
    ],
    metrics: [],
  },
  { blockType: 'stickyPageNav' as const, variant: 'solution' as const },
  {
    blockType: 'iconCardGrid' as const,
    anchor: 'beneficios',
    navLabel: 'Benefícios',
    eyebrow: 'Equipe Multidisciplinar',
    title: 'Com o serviço de Alocação de Consultores, sua empresa só tem a ganhar',
    columns: '4' as const,
    variant: 'card' as const,
    items: [
      {
        icon: 'users' as const,
        title: 'Equipe Multidisciplinar',
        description:
          'Consultores especialistas em várias áreas tais como Data Governance, Google Cloud, Power Center, Data Quality, MDM, Funcional, Gestão de Projetos, Big Data e Negócios.',
      },
      { icon: 'building' as const, title: 'Consultores Alocados', description: 'O consultor trabalha alocado nas dependências da Empresa.' },
      { icon: 'zap' as const, title: 'Agilidade na disponibilização', description: 'Rápida disponibilização do consultor contratado.' },
      {
        icon: 'briefcase' as const,
        title: 'Flexibilidade de Contratação',
        description: 'Modalidades de contratação por hora trabalhada ou por preço fixo, de acordo com a conveniência do cliente.',
      },
    ],
  },
  {
    blockType: 'partnerShowcase' as const,
    anchor: 'parceiros',
    navLabel: 'Parceiros',
    title: 'Somos parceiros das maiores empresas de tecnologia',
    partners: parceiros,
    grayscale: true,
  },
  {
    blockType: 'ctaBanner' as const,
    variant: 'dark' as const,
    title: 'Entre em contato com nossa equipe de especialistas',
    cta: { label: 'Conheça nossos consultores', href: '/consultores' },
    secondaryCta: { label: 'Quero saber mais', href: '#contato' },
  },
  {
    blockType: 'ctaContact' as const,
    anchor: 'contato',
    navLabel: 'Contato',
    variant: 'panel' as const,
    title: 'Quero saber mais',
    showContactCard: true,
  },
]

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const { docs } = await payload.find({
    collection: 'solutions',
    where: { slug: { equals: SLUG } },
    locale: 'pt',
    depth: 0,
    limit: 1,
    req,
  })
  const solucao = docs[0]
  if (!solucao) {
    payload.logger.warn(`[alocacao] "${SLUG}" não existe neste banco — nada a fazer`)
    return
  }

  const atual = (solucao.layout ?? []).map((b) => b.blockType).join(',')
  if (atual !== LAYOUT_DA_IMPORTACAO) {
    payload.logger.warn(`[alocacao] layout já editado no admin (${atual || 'vazio'}) — mantido como está`)
    return
  }

  const { docs: parceiros } = await payload.find({ collection: 'partners', sort: 'order', depth: 0, limit: 50, req })
  await payload.update({
    collection: 'solutions',
    id: solucao.id,
    locale: 'pt',
    data: { layout: layout(parceiros.map((p) => p.id)) },
    req,
  })
  payload.logger.info('[alocacao] página montada: herói, benefícios, parceiros, chamada e formulário')
}

/* Sem volta automática: a versão anterior fica no histórico de versões da
 * solução, e restaurar por lá é o caminho — uma migração que reescreve conteúdo
 * de volta apagaria o que tivesse sido editado depois. */
export async function down({ payload }: MigrateDownArgs): Promise<void> {
  payload.logger.warn('[alocacao] sem desfazer automático: restaurar pelo histórico de versões da solução, no admin')
}
