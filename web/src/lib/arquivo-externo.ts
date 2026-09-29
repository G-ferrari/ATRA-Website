/* Cabeçalhos que o Payload repassa ao baixar o original de uma imagem já
 * salva — o `externalFileHeaderFilter` da collection `media` (P-31).
 *
 * ⚠️ O editor de imagem do admin (cortar, redimensionar, ponto focal) não tem o
 * arquivo em disco: o storage é S3. Para editar, o servidor baixa o original
 * pelo endereço público do próprio site (`getExternalFile`), e por padrão manda
 * **só os cookies**. Na homologação o Caddy pede senha (Basic) em tudo, a senha
 * não ia junto, e o download voltava 401 — no admin, "Something went wrong".
 * Produção não tem senha e nunca sofreu disso.
 *
 * O conserto repassa o `Authorization: Basic` que o navegador do editor já
 * mandou na própria requisição de edição — sem abrir nada da senha no Caddy,
 * que era a proposta anterior. Os dois cuidados:
 * - Só o **Basic**. Um `Authorization` de outro tipo seria a credencial da API
 *   do Payload, e não sai do servidor.
 * - Cookies do Payload (`payload-token`) ficam, como no padrão do Payload para
 *   endereço externo: `/api/media/file/*` é leitura pública e não precisa
 *   deles, e esta função não sabe para onde o download vai. */
const PREFIXO_DO_PAYLOAD = 'payload'

export function cabecalhosDoArquivoExterno(cabecalhos: Record<string, string>): Record<string, string> {
  const saida: Record<string, string> = {}

  const cookies = (cabecalhos.cookie ?? '')
    .split(';')
    .map((c) => c.trim())
    .filter((c) => c && !c.startsWith(PREFIXO_DO_PAYLOAD))
  if (cookies.length) saida.cookie = cookies.join('; ')

  const autorizacao = cabecalhos.authorization
  if (autorizacao && /^basic\s/i.test(autorizacao)) saida.authorization = autorizacao

  return saida
}
