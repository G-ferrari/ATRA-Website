import type { JsonLd } from '@/lib/jsonld'

/* Injeta schema.org na página (MIG-107).
 *
 * ⚠️ `dangerouslySetInnerHTML` é o caminho certo aqui, e não um filho de texto:
 * o React escaparia `<`, `>` e `&`, e o Google leria JSON quebrado. O conteúdo
 * é montado por nós a partir de `JSON.stringify`, não vem do editor.
 *
 * A barra do fechamento vai escapada (`<\/`) porque uma sequência `</script>`
 * dentro do JSON — vinda de um título com HTML colado, por exemplo — fecharia a
 * tag no meio e o resto do JSON viraria markup na página.
 */
export function DadosEstruturados({ dados }: { dados: JsonLd | JsonLd[] }) {
  const json = JSON.stringify(dados).replace(/</g, '\\u003c')

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}
