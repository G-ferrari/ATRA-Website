'use client'

import { Play } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { rastrear } from '@/lib/rastreio'
import type { Embed } from '@/lib/video'
import type { Image as Imagem } from '@/types/content'

/* MIG-155 (D-30) — vídeo de terceiro (YouTube/Vimeo) sob clique. Nasceu na
 * página do webinar; desde 09/10 serve também a abertura de página, e por isso
 * mora aqui e aceita ficar sem capa.
 *
 * ⚠️ Antes, o iframe montava com a página e a requisição ao YouTube/Vimeo saía
 * assim que ele entrava no viewport (`loading="lazy"` adia, não elimina) — IP
 * e User-Agent do visitante chegavam ao Google sem gesto nenhum. E o Vimeo
 * **põe cookie**, sem variante nocookie: qualquer webinar cadastrado com link
 * do Vimeo furava a LGPD em silêncio.
 *
 * Click-to-load fecha os dois: nenhuma requisição a terceiro antes do clique
 * no play. Fora do banner de propósito — o clique É o gesto explícito de quem
 * quer assistir, e gatear vídeo por categoria de cookie impediria de assistir
 * exatamente quem recusou tudo (D-30).
 *
 * A capa é a imagem que a página entrega (no webinar, a do herói), com o play
 * no gradiente padrão do site. ⚠️ Sem capa fica o fundo escuro, e **não** a
 * miniatura do YouTube: buscá-la seria a requisição a terceiro que o clique
 * existe para evitar. `autoplay=1` no src: quem clicou no play
 * não deve precisar de um segundo clique dentro do iframe. */
export function VideoSobClique({
  embed,
  imagem,
  titulo,
  rotuloAssistir,
  sizes = '(max-width: 896px) 100vw, 896px',
}: {
  embed: Embed
  imagem: Imagem | null
  titulo: string
  rotuloAssistir: string
  /** A largura que a capa ocupa — a do webinar, se ninguém disser outra. */
  sizes?: string
}) {
  const [tocando, setTocando] = useState(false)

  if (tocando) {
    return (
      <div className="aspect-video rounded-[6px] overflow-hidden  bg-slate-950 shadow-xl">
        <iframe
          src={`${embed.src}${embed.src.includes('?') ? '&' : '?'}autoplay=1`}
          title={`${titulo} — ${embed.titulo}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        setTocando(true)
        rastrear('video_play', { video_title: titulo, video_provider: embed.titulo })
      }}
      aria-label={`${rotuloAssistir}: ${titulo}`}
      className="relative block w-full aspect-video rounded-[6px] overflow-hidden  bg-slate-950 shadow-xl group cursor-pointer"
    >
      {imagem && (
        <Image src={imagem.url} alt="" fill sizes={sizes} className="object-cover opacity-60 group-hover:opacity-70 transition-opacity" />
      )}
      <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

      <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span className="w-16 h-16 rounded-full bg-linear-to-r from-primary to-primary-dark text-white flex items-center justify-center shadow-md shadow-primary/25 group-hover:scale-105 active:scale-[0.98] transition-transform">
          <Play size={24} className="ml-1" aria-hidden />
        </span>
        <span className="text-white font-bold text-[11px] uppercase tracking-wider">{rotuloAssistir}</span>
        <span className="text-slate-300 text-[10.5px]">{embed.titulo}</span>
      </span>
    </button>
  )
}
