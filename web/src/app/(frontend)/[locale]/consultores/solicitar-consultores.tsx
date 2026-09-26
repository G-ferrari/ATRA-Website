import { PainelDeContatos } from '@/components/blocks/painel-de-contatos'
import { TechCornerBraces } from '@/components/ui'
import type { Locale } from '@/lib/locales'
import type { Contato } from '@/types/content'

import { AbrirPedido } from './abrir-pedido'

/* Seção "solicitar consultores" — porte de `legacy/src/pages/Consultants.tsx:685`.
 *
 * ⚠️ Não usa o bloco `ctaContact`. O legado diz copiar a seção da home, mas as
 * duas divergiram: aqui há subtítulo, um `select` de modelo de alocação e um
 * cartão à direita **com foto de fundo**, enquanto o `ctaContact` que portamos
 * em MIG-053 tem três campos e um cartão de gradiente escuro. Reusar o bloco
 * deixaria a seção ~200px mais curta que o gabarito.
 *
 * O formulário **envia** desde a task 013 (feature consultores-solicitacao) e,
 * desde a 018, mora na **aba de pedido** (`aba-de-pedido.tsx`), junto do
 * carrinho. Aqui ficou um botão que abre a aba: dois formulários para o mesmo
 * pedido deixariam o visitante sem saber qual preencher.
 *
 * A foto é a do acervo da ATRA, não o hotlink do Unsplash do legado
 * (`Consultants.tsx:834`) — ver inventario-assets.md. */

const TEXTOS = {
  pt: {
    titulo: 'Vamos acelerar sua equipe com consultores ATRA?',
    subtitulo: 'Solicite perfis ou squads para o seu projeto!',
    abrir: 'Solicitar consultores',
    fotoAlt: 'Equipe da ATRA reunida em evento',
  },
  en: {
    titulo: 'Shall we accelerate your team with ATRA consultants?',
    subtitulo: 'Request profiles or squads for your project.',
    abrir: 'Request consultants',
    fotoAlt: 'ATRA team together at an event',
  },
} as const

export function SolicitarConsultores({
  locale,
  contato,
}: {
  locale: Locale
  contato: Contato
}) {
  const t = TEXTOS[locale]

  return (
    <section
      id="solicitar-consultores"
      className="py-12 bg-surface-2 dark:bg-[#12151c] relative overflow-hidden px-3 sm:px-6 transition-colors duration-500 border-t border-border-main/50"
    >
      <TechCornerBraces color="orange" position="bottom-left" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch relative z-10">
          {/* Centralizada ao lado da foto: sem o formulário (task 018) a coluna ficou
              curta, e colada no topo deixava um vazio embaixo do botão. */}
          <div className="flex flex-col lg:justify-center text-left py-6 md:py-10 pr-0 lg:pr-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light font-display text-text-main dark:text-white mb-4 leading-tight">
              {t.titulo}
            </h2>

            <h3 className="text-lg md:text-xl font-light font-display text-text-main dark:text-white mb-6">
              {t.subtitulo}
            </h3>

            <AbrirPedido rotulo={t.abrir} />
          </div>

          {/* Painel de contatos compartilhado (fonte única) — antes era uma cópia
              divergente com o e-mail partido. Ver painel-de-contatos.tsx. */}
          <PainelDeContatos
            contato={contato}
            locale={locale}
            foto={{ url: '/fotos/equipe-atra.jpg', alt: t.fotoAlt }}
          />
        </div>
      </div>
    </section>
  )
}
