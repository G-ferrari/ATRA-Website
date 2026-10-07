/* O conteúdo inicial do painel de conversão do menu de Soluções (D-51) — o que
 * a migração `20261002_203000_painel_de_conversao` grava no global
 * `conversion-panel` quando ele ainda está vazio.
 *
 * Os textos em português são os da especificação (nota do G-ferrari, 02/10) e
 * os do print de referência de 30/09: título, abertura e a descrição de cada
 * caminho estão lá, literais. O inglês é tradução, à espera da revisão (P-08).
 *
 * ⚠️ Daqui para a frente quem manda é o admin (Sistema → Painel do menu de
 * Soluções): mexer neste arquivo não muda ambiente que já foi preenchido. */

/** Os três caminhos levam à tela do diagnóstico. */
export const DIAGNOSTICO = '/diagnostico-maturidade'

export const PAINEL = {
  pt: {
    title: 'Por onde começar?',
    intro: 'Escolha o caminho que mais se conecta com o seu desafio atual e fale com nossos especialistas.',
    paths: [
      { icon: 'chart', title: 'Decidir mais rápido com dados', description: 'Transforme dados em decisões mais ágeis e seguras.', href: DIAGNOSTICO },
      { icon: 'sparkles', title: 'Colocar IA no negócio', description: 'Acelere a inovação e gere valor real com IA.', href: DIAGNOSTICO },
      { icon: 'cloud', title: 'Cortar custo e risco em nuvem', description: 'Mais eficiência, segurança e escala para o seu negócio.', href: DIAGNOSTICO },
    ],
    ctaLabel: 'Falar com um especialista',
    ctaHref: '/contato',
    /* ⚠️ O print de 30/09 traz "4x GPTW" e não tem LIPT; vale a nota de 02/10.
     * "Configurações do site" ainda diz 4x GPTW, marcado como número em disputa
     * (P-01) — quem fechar a P-01 acerta os dois lugares. */
    proof: [
      { value: '140+', label: 'especialistas' },
      { value: '15+', label: 'anos' },
      { value: 'Parceira', label: 'Google Cloud' },
      { value: '5x', label: 'GPTW' },
      { value: '4x', label: 'LIPT' },
    ],
  },
  /* Na mesma ordem do português: a migração casa as linhas pela posição. */
  en: {
    title: 'Where to start?',
    intro: 'Choose the path that best matches your current challenge and talk to our specialists.',
    paths: [
      { title: 'Decide faster with data', description: 'Turn data into faster, safer decisions.' },
      { title: 'Put AI into the business', description: 'Speed up innovation and create real value with AI.' },
      { title: 'Cut cloud cost and risk', description: 'More efficiency, security and scale for your business.' },
    ],
    ctaLabel: 'Talk to a specialist',
    proof: [
      { value: '140+', label: 'specialists' },
      { value: '15+', label: 'years' },
      { value: 'Google Cloud', label: 'Partner' },
      { value: '5x', label: 'GPTW' },
      { value: '4x', label: 'LIPT' },
    ],
  },
} as const

/* Qual case aparece em qual aba, para o painel não nascer igual nas três.
 *
 * ⚠️ É ponto de partida, e a escolha é do marketing (D-22): os quatro cases
 * publicados são de dados e governança, e nenhum é de IA — a aba de Inovação &
 * IA fica sem escolha e mostra os mais recentes, que é o que o painel faz com
 * aba vazia. Slug que não existir no banco é ignorado. */
export const CASES_INICIAIS = {
  innovationAi: [],
  dataBi: ['dashboards-estrategicos', 'migracao-legado-gcp', 'eficiencia-processos-risco'],
  governanceCulture: ['marketplace-governanca-dados'],
} as const satisfies Record<string, readonly string[]>

/* 06/10 — pedido da Karen na revisão: o terceiro caminho vira um botão fino,
 * ao lado de "Falar com um especialista". Os outros dois caminhos ficam com o
 * marketing, que vai reescrevê-los (D-22). */
export const SEGUNDO_BOTAO = {
  pt: { secondaryCtaLabel: 'Faça seu diagnóstico agora' },
  en: { secondaryCtaLabel: 'Take the assessment now' },
  secondaryCtaHref: DIAGNOSTICO,
} as const

/** O caminho que vira botão — pelo título que a migração de 02/10 gravou. */
export const CAMINHO_QUE_VIRA_BOTAO = PAINEL.pt.paths[2].title

/**
 * Os caminhos sem o terceiro. Só sai se ainda tiver o título original: caminho
 * que o marketing já reescreveu é dele, e fica (`null` = não mexer).
 */
export function semOCaminhoQueViraBotao<T extends { title?: string | null }>(caminhos: T[]): T[] | null {
  const restantes = caminhos.filter((c) => c.title !== CAMINHO_QUE_VIRA_BOTAO)
  return restantes.length === caminhos.length ? null : restantes
}
