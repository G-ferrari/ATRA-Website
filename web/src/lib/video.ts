/* URL de vídeo → endereço de embed (D-11).
 *
 * Aceita as formas que uma pessoa realmente cola no admin: link da barra de
 * endereços, link de compartilhamento, link com timestamp. Devolver `null` em
 * vez de montar um iframe quebrado é de propósito — a página trata os dois
 * estados, e um embed inválido falha em silêncio dentro do iframe. */

export type Embed = { src: string; titulo: string }

/** `youtube-nocookie` não grava cookie antes do play — evita rastrear quem só
 *  abriu a página, o que exigiria banner de consentimento (LGPD). */
const YOUTUBE = 'https://www.youtube-nocookie.com/embed/'
const VIMEO = 'https://player.vimeo.com/video/'

export function paraEmbed(url: string | null | undefined): Embed | null {
  if (!url) return null

  let u: URL
  try {
    u = new URL(url.trim())
  } catch {
    return null
  }

  const host = u.hostname.replace(/^www\./, '')

  if (host === 'youtu.be') {
    const id = u.pathname.slice(1)
    return id ? { src: `${YOUTUBE}${id}`, titulo: 'YouTube' } : null
  }

  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const id = u.searchParams.get('v') ?? u.pathname.match(/\/(?:embed|shorts|live)\/([^/]+)/)?.[1]
    return id ? { src: `${YOUTUBE}${id}`, titulo: 'YouTube' } : null
  }

  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = u.pathname.match(/(\d+)/)?.[1]
    return id ? { src: `${VIMEO}${id}`, titulo: 'Vimeo' } : null
  }

  return null
}
