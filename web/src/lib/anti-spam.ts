/* MIG-101 — as três barreiras contra envio automático.
 *
 * Nenhuma delas é CAPTCHA, de propósito: CAPTCHA cobra do visitante honesto o
 * preço de um problema que não é dele, e o formulário de contato da ATRA recebe
 * dezenas de envios por mês, não milhares. As três abaixo custam zero para
 * quem preenche à mão.
 */

/** Quanto tempo um humano leva, no mínimo, para preencher e enviar. */
export const SEGUNDOS_MINIMOS = 3

/** Depois disto o formulário é velho demais — provavelmente uma aba esquecida. */
const MINUTOS_MAXIMOS = 120

export type Veredito = { ok: true } | { ok: false; motivo: 'honeypot' | 'rapido-demais' | 'expirado' }

/**
 * Campo isca: invisível para gente, irresistível para robô que preenche tudo.
 *
 * ⚠️ Escondido por CSS, **não** por `type="hidden"`. Robô que lê o HTML pula
 * campo oculto declarado; o que preenche às cegas cai neste. E leitor de tela
 * precisa do `aria-hidden` e do `tabIndex={-1}` para não oferecê-lo a quem
 * navega por teclado.
 */
export const CAMPO_ISCA = 'website'

/**
 * Armadilha de tempo: quanto o visitante levou entre a página carregar e enviar.
 *
 * ⚠️ O carimbo vai no formulário e volta com ele, então é **do cliente** e pode
 * ser forjado. Isso é aceitável: quem forja o carimbo já é um robô específico
 * para este site, e o alvo aqui é o genérico. Guardar o carimbo no servidor
 * exigiria sessão para um formulário anônimo.
 */
export function conferir(dados: { isca?: string | null; carimbo?: string | null; agora?: number }): Veredito {
  if (dados.isca?.trim()) return { ok: false, motivo: 'honeypot' }

  const agora = dados.agora ?? Date.now()
  const carimbo = Number(dados.carimbo)
  /* Carimbo ausente ou ilegível não reprova: pode ser JavaScript bloqueado, e
   * recusar um envio honesto é pior do que aceitar um automático. As outras
   * duas barreiras continuam valendo. */
  if (!Number.isFinite(carimbo) || carimbo <= 0) return { ok: true }

  const segundos = (agora - carimbo) / 1000
  if (segundos < SEGUNDOS_MINIMOS) return { ok: false, motivo: 'rapido-demais' }
  if (segundos > MINUTOS_MAXIMOS * 60) return { ok: false, motivo: 'expirado' }
  return { ok: true }
}

/* Limite por IP, em memória do processo — a mesma escolha e a mesma ressalva do
 * limite da ATRA AI: serve a um servidor só (P-05) e some no reinício. Aqui o
 * custo de errar é menor, porque o formulário não gasta cota de API. */
const JANELA_MS = 60 * 60 * 1000
const envios = new Map<string, number[]>()

export function excedeuPorIp(ip: string, teto = 5, agora = Date.now()): boolean {
  const recentes = (envios.get(ip) ?? []).filter((t) => agora - t < JANELA_MS)
  if (recentes.length >= teto) {
    envios.set(ip, recentes)
    return true
  }
  recentes.push(agora)
  envios.set(ip, recentes)

  if (envios.size > 5000) {
    for (const [chave, marcas] of envios) {
      const vivos = marcas.filter((t) => agora - t < JANELA_MS)
      if (vivos.length === 0) envios.delete(chave)
      else envios.set(chave, vivos)
    }
  }
  return false
}

/** Só para teste: zera o contador entre casos. */
export function limparContagem(): void {
  envios.clear()
}
