/* Casamento de ids entre idiomas, para os seeds que gravam layout de blocos.
 *
 * O Payload guarda **um valor por idioma na mesma linha**, identificada por id.
 * Reenviar o layout sem os ids faz ele tratar cada bloco como novo: recria as
 * linhas, e os valores do primeiro idioma ficam órfãos.
 *
 * ⚠️ O sintoma é silencioso e engana: a página renderiza, com a estrutura certa
 * e **todo texto localizado em branco**. Já escondeu ~800px de conteúdo em
 * /sobre (MIG-049a) e repetiu na página de solução (MIG-056) — lá foram 742px,
 * e o que denunciou foi a regressão visual, não o olho.
 *
 * Vale em **todos os níveis**: `items`, `ctas`, `metrics`, `bullets` e `tags`
 * têm id próprio. Preservar só o do bloco não basta.
 */
export function casarIds<T>(novo: T, gravado: unknown): T {
  if (Array.isArray(novo)) {
    const antigo = Array.isArray(gravado) ? gravado : []
    return novo.map((item, i) => casarIds(item, antigo[i])) as T
  }
  if (novo && typeof novo === 'object') {
    const antigo = (gravado ?? {}) as Record<string, unknown>
    const saida: Record<string, unknown> = { ...(novo as Record<string, unknown>) }
    if (antigo.id !== undefined) saida.id = antigo.id
    for (const [chave, valor] of Object.entries(saida)) {
      if (chave !== 'id' && valor && typeof valor === 'object') {
        saida[chave] = casarIds(valor, antigo[chave])
      }
    }
    return saida as T
  }
  return novo
}
