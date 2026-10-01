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
