/* Depoimento em destaque dentro do corpo de um artigo ou case.
 * Porte de `legacy/src/components/CaseDetailBase.tsx:96`. */

export type QuoteBlockProps = {
  quote: string
  author: string
  role: string
}

export function QuoteBlock({ quote, author, role }: QuoteBlockProps) {
  return (
    <div className="my-16 bg-primary rounded-[6px] p-12 text-white relative overflow-hidden shadow-xl shadow-primary/20">
      <div className="absolute top-0 right-0 p-8 text-white/10">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H13.017V21H14.017ZM6.017 21L6.017 18C6.017 16.8954 6.91243 16 8.017 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H8.017C7.46472 8 7.017 8.44772 7.017 9V12C7.017 12.5523 6.56929 13 6.017 13H5.017V21H6.017Z" />
        </svg>
      </div>
      <blockquote className="relative z-10">
        <p className="text-2xl font-medium mb-8 leading-relaxed">&ldquo;{quote}&rdquo;</p>
        <footer>
          <div className="font-bold text-white">{author}</div>
          <div className="text-white/70 text-sm">{role}</div>
        </footer>
      </blockquote>
    </div>
  )
}
