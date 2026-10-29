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
  /* Lista vira um `<script>` por nó, e não um array num só (D-80): os dois são
   * válidos para o Google, mas quem lê a página procurando um `@type` — o
   * smoke, e qualquer leitor que espere um objeto por bloco — não acha o nó
   * dentro de um array. */
  const nos = Array.isArray(dados) ? dados : [dados]

  return (
    <>
      {nos.map((no, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(no).replace(/</g, '\\u003c') }}
        />
      ))}
    </>
  )
}
