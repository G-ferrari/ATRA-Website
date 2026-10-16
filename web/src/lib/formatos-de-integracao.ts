/* O formato do endpoint de integração do global `integrations` (D-41).
 *
 * ⚠️ Não é capricho de validação, pela mesma razão de
 * `formatos-de-rastreamento.ts` e por uma pior: o site manda a
 * `ATRAIR_API_KEY` no cabeçalho `x-api-key` **para o endereço que estiver
 * neste campo**. Endereço errado não é lista de vagas vazia — é a chave de
 * servidor entregue a quem atender. Por isso o formato é fechado aqui, e o
 * mesmo teste vale duas vezes: no admin, para o editor ver o erro ao salvar, e
 * na leitura, para um valor que entrou por outro caminho (banco editado à mão,
 * variável de ambiente) não chegar ao `fetch`.
 *
 * ⚠️ **Só `https`, menos em desenvolvimento.** `http` para host externo põe a
 * chave em texto claro na rede. A exceção é o ATRAIR local, que roda nativo na
 * 3300 sem TLS — e `host.docker.internal` porque, de dentro do contêiner,
 * `localhost` é o próprio contêiner (ver docker-compose.yml).
 */

const HOSTS_DE_DESENVOLVIMENTO = new Set(['localhost', '127.0.0.1', '[::1]', 'host.docker.internal'])

/**
 * O endereço-base do ATRAIR: origem absoluta `https`, sem query e sem fragmento.
 *
 * Aceita caminho-base (`https://atrair.exemplo/interno`) porque quem chama
 * concatena a rota (`/api/public/vagas`) — o que o campo guarda é a base, não a
 * rota final.
 */
export function ehEndpointDeIntegracao(valor: string): boolean {
  let url: URL
  try {
    url = new URL(valor)
  } catch {
    return false
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return false
  /* `http` só para o ATRAIR de desenvolvimento — ver ⚠️ acima. */
  if (url.protocol === 'http:' && !HOSTS_DE_DESENVOLVIMENTO.has(url.hostname)) return false
  /* Query e fragmento seriam perdidos na concatenação da rota: `?x=1` viraria
   * `https://host?x=1/api/public/vagas`. Melhor recusar do que montar isso. */
  if (url.search || url.hash) return false
  /* Credencial embutida no endereço (`https://user:senha@host`) vaza no log de
   * erro do `fetch`, que imprime a URL. */
  if (url.username || url.password) return false
  return true
}

/**
 * A URL com que o campo do CMS **nasce preenchido**.
 *
 * Vem do ambiente porque é por ele que cada ambiente já conhece o endereço do
 * ATRAIR (`docker-compose.yml` no dev, gerenciador do host em produção — ver
 * `docs/04-infra/ambientes.md`). Depois de gravado uma vez, quem manda é o
 * CMS: trocar o endereço deixa de exigir deploy, que é o ponto da D-41.
 *
 * ⚠️ O fallback é o endereço de **desenvolvimento**, onde o ATRAIR roda nativo
 * na 3300. Em produção, defina `ATRAIR_API_URL` (ou edite o campo no admin) —
 * sem isso o campo nasce apontando para um host que não existe lá, e a
 * validação acima recusaria o valor na primeira edição.
 */
export const ENDPOINT_PADRAO_ATRAIR = process.env.ATRAIR_API_URL?.trim() || 'http://localhost:3300'

/* ---------------------------------------------------------------------------
 * RD Station Marketing (D-54)
 * ------------------------------------------------------------------------- */

/* Marca de código colado por engano: o valor vai em JSON para fora, e um
 * pedaço de HTML ou de script no campo nunca é um nome de verdade. */
const CARACTERES_DE_CODIGO = /[<>{}`"\\]/
/* Controle (quebra de linha, tabulação...) não existe num nome digitado — nem
 * os invisíveis (`\p{C}` inteiro: espaço de largura zero, inversão de direção
 * U+202E) e os separadores de linha e parágrafo. Colado de outro lugar, um
 * deles deixa o nome **parecendo** igual ao do RD sem casar, e a automação
 * deixa de disparar sem erro nenhum. */
const CARACTERE_DE_CONTROLE = /[\p{C}\p{Zl}\p{Zp}]/u
const TEM_LETRA_OU_DIGITO = /[\p{L}\p{N}]/u

const ehNomeLivre = (valor: string, max: number): boolean =>
  valor.length > 0 &&
  valor.length <= max &&
  valor === valor.trim() &&
  TEM_LETRA_OU_DIGITO.test(valor) &&
  !CARACTERE_DE_CONTROLE.test(valor) &&
  !CARACTERES_DE_CODIGO.test(valor)

/**
 * O nome como deve ser gravado e comparado: aparado, em NFC e com o espaço sem
 * quebra (U+00A0) trocado pelo comum.
 *
 * ⚠️ Colado do macOS, "Formulário" pode vir com o acento **decomposto** (NFD:
 * `a` + acento combinante) — idêntico na tela, diferente byte a byte do nome
 * no RD. Normalizar aqui faz o valor colado casar com o digitado.
 */
export function normalizarNome(valor: string): string {
  return valor.normalize('NFC').replace(/ /g, ' ').trim()
}

/**
 * O identificador de conversão que o RD mostra nos relatórios e usa nas
 * automações.
 *
 * ⚠️ Aceita espaço e acento (15/10). O site novo precisa mandar **o mesmo
 * nome** que o site atual manda, porque é por ele que as automações do RD
 * disparam — e o formulário de contato do WordPress se chama "Formulário
 * Home". O formato fechado anterior (`site-contato`) recusava esse nome, e o
 * marketing teria de refazer as automações. O RD aceita qualquer texto; o que
 * fica recusado aqui é só o que nunca é nome: vazio, quebra de linha e código
 * colado por engano.
 */
export function ehIdentificadorDeConversao(valor: string): boolean {
  return ehNomeLivre(valor, 100)
}

/** Uma tag do RD (ex.: `newsletter`), pela mesma regra, mais curta. */
export function ehTagDoRd(valor: string): boolean {
  return ehNomeLivre(valor, 50)
}

/**
 * Os identificadores com que os campos do admin **nascem preenchidos**, um por
 * formulário. São os sugeridos à ATRA em 02/10; o marketing renomeia no admin
 * sem deploy — o nome é deles (D-22), e é o que aparece nas automações.
 *
 * ⚠️ Também é o que o mapper usa quando o global ainda não foi gravado: um
 * global sem linha no banco devolve `undefined`, não o `defaultValue`.
 */
export const CONVERSOES_PADRAO = {
  contact: 'site-contato',
  chatLead: 'site-chat',
  newsletter: 'site-newsletter',
  materialDownload: 'site-download-material',
  consultantRequest: 'site-solicitacao-consultores',
  dataMaturityDiagnostic: 'site-diagnostico-maturidade',
  /* 15/10: o Trabalhe Conosco passa a ir ao RD (sem currículo), pedido da
   * ATRA que revê a D-29. */
  talentPool: 'site-trabalhe-conosco',
} as const

/**
 * As tags com que cada formulário nasce. Só a newsletter tem: é pela tag
 * `newsletter` que o marketing segmenta os envios no RD (Taci, 14/10). As
 * outras o marketing põe no admin, com os nomes que já usa.
 */
export const TAGS_PADRAO: Record<keyof typeof CONVERSOES_PADRAO, readonly string[]> = {
  contact: [],
  chatLead: [],
  newsletter: ['newsletter'],
  materialDownload: [],
  consultantRequest: [],
  dataMaturityDiagnostic: [],
  talentPool: [],
}
