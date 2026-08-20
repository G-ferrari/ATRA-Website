'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/* Casca do site — porte de `legacy/src/App.tsx:2597`.
 *
 * ⚠️ `/chat` é a **única** rota com casca diferente: o wrapper vira
 * `h-[100dvh] overflow-hidden` e o rodapé some (`App.tsx:2600` e `:2603`). Não é
 * detalhe estético — a página do chat é uma coluna que ocupa exatamente a altura
 * da janela, e com o rodapé embaixo ela passa da viewport, ganha barra de
 * rolagem e desloca 15px de tudo. No aceite visual isso valeu 40% dos pixels.
 *
 * Cliente só por causa do `usePathname()`. O cabeçalho, o rodapé e o conteúdo
 * chegam como slots já renderizados no servidor — nada disso vira cliente. */
export function Casca({
  cabecalho,
  rodape,
  alternadorDeTema,
  children,
}: {
  cabecalho: ReactNode
  rodape: ReactNode
  alternadorDeTema: ReactNode
  children: ReactNode
}) {
  const caminho = usePathname()
  const noChat = caminho === '/chat' || caminho?.endsWith('/chat')

  return (
    <div
      className={cn(
        'bg-surface-1 font-sans selection:bg-primary/30 flex flex-col transition-colors duration-500',
        noChat ? 'h-[100dvh] overflow-hidden' : 'min-h-screen',
      )}
    >
      {cabecalho}
      <div className="flex-1 flex flex-col min-h-0">{children}</div>
      {!noChat && rodape}
      {alternadorDeTema}
    </div>
  )
}
