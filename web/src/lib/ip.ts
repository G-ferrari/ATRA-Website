/* O IP de quem chega, para os limites por IP do chat (D-12) e do formulário
 * (MIG-101). Um lugar só: a versão duplicada nos dois consumidores divergiria
 * na primeira correção — e a primeira correção é exatamente esta.
 *
 * ⚠️ A ordem dos cabeçalhos é segurança, não preferência. `X-Real-IP` vem
 * primeiro porque é o **Caddy** quem o escreve, da conexão real (`header_up`
 * no Caddyfile). `X-Forwarded-For` é escrito pelo cliente, e o proxy apenas
 * **anexa** o IP verdadeiro ao fim — o primeiro item da lista é o que o
 * visitante quis dizer, não quem ele é. Lê-lo primeiro tornava os dois limites
 * decorativos: `X-Forwarded-For: <qualquer coisa>` a cada requisição e nenhum
 * "IP" se repetia.
 *
 * O XFF continua como fallback para onde não há proxy — dev local e o gate —,
 * onde forjar o próprio limite não protege nada de valor.
 */
export function ipDe(cabecalhos: Headers): string {
  const real = cabecalhos.get('x-real-ip')?.trim()
  if (real) return real
  const encaminhado = cabecalhos.get('x-forwarded-for')
  return encaminhado?.split(',')[0]?.trim() || 'desconhecido'
}
