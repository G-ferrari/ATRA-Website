import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ComponentProps } from 'react'

/* Renderização dos .md de `docs/` para a página interna /roadmap.
 *
 * Server Component de propósito: markdown parseado na pré-renderização, zero
 * JavaScript no cliente. O site não tem o plugin de tipografia do Tailwind
 * (ver a nota em `chat/ui-generativa.tsx`), então o estilo entra elemento a
 * elemento pelo `components` — e fica contido nesta rota, sem tocar o CSS
 * global que o gate visual compara.
 *
 * `remark-gfm` é obrigatório aqui: a especificação inteira é escrita em
 * tabelas, e sem o plugin elas viram parágrafo corrido. */

/** Link relativo aponta para outro .md do repositório — fora do site, viraria
 * 404. Vira texto; só http(s) segue clicável. */
function Link({ href, children }: ComponentProps<'a'>) {
  if (href?.startsWith('http')) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="text-primary font-semibold hover:underline">
        {children}
      </a>
    )
  }
  return <span className="font-semibold text-text-subtle">{children}</span>
}

export function Documento({ md }: { md: string }) {
  /* O frontmatter é metadado do repositório, não conteúdo. */
  const corpo = md.replace(/^---\n[\s\S]*?\n---\n/, '')

  return (
    <div className="text-sm leading-relaxed text-text-subtle font-light">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (p) => <h3 className="text-xl font-display font-medium text-text-main mt-6 mb-3" {...p} />,
          h2: (p) => <h4 className="text-lg font-display font-medium text-text-main mt-6 mb-2" {...p} />,
          h3: (p) => <h5 className="text-base font-semibold text-text-main mt-5 mb-2" {...p} />,
          h4: (p) => <h6 className="text-sm font-semibold text-text-main mt-4 mb-1.5" {...p} />,
          p: (p) => <p className="my-2" {...p} />,
          ul: (p) => <ul className="my-2 pl-5 list-disc space-y-1" {...p} />,
          ol: (p) => <ol className="my-2 pl-5 list-decimal space-y-1" {...p} />,
          blockquote: (p) => (
            <blockquote className="my-3 border-l-2 border-primary/40 pl-4 text-text-muted" {...p} />
          ),
          table: (p) => (
            <div className="my-4 overflow-x-auto rounded-[6px] ">
              <table className="w-full text-xs" {...p} />
            </div>
          ),
          thead: (p) => <thead className="bg-surface-3 text-text-main" {...p} />,
          th: (p) => <th className="px-3 py-2 text-left font-semibold whitespace-nowrap" {...p} />,
          td: (p) => <td className="px-3 py-2 border-t border-border-main align-top" {...p} />,
          code: (p) => (
            <code className="text-primary bg-surface-1 dark:bg-[#0e1015] px-1.5 py-0.5 rounded-[6px] text-[0.85em]" {...p} />
          ),
          pre: (p) => (
            <pre
              className="my-3 overflow-x-auto rounded-[6px] bg-surface-1 dark:bg-[#0e1015] p-4 text-xs [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-text-subtle"
              {...p}
            />
          ),
          strong: (p) => <strong className="font-semibold text-text-main" {...p} />,
          hr: () => <hr className="my-5 border-border-main" />,
          a: Link,
        }}
      >
        {corpo}
      </ReactMarkdown>
    </div>
  )
}
