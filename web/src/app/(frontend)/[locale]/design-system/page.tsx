import { readFileSync } from 'node:fs'
import path from 'node:path'

import type { Metadata } from 'next'
import { locale as getLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

import { GlowCard, MetricChip, QuoteBlock, StatusBadge } from '@/components/ui'
import { LOCALES, isLocale } from '@/lib/locales'

import { Bancada } from './bancada'

/* MIG-125 — a bancada do design system, reconstruída dos tokens reais.
 *
 * O legado tinha uma vitrine que **repetia à mão** os valores de
 * `index.css` — dois lugares para o mesmo token, e o segundo sempre atrasado
 * (debito-tecnico.md). Aqui a lista de cores é **parseada do próprio
 * `globals.css`** na pré-renderização: token novo aparece sozinho, token
 * removido some sozinho, e não existe segunda fonte para envelhecer.
 *
 * A rota saiu do porte na Fase 3 ("a bancada saiu", MIG-059) mas o rodapé de
 * todas as páginas continuou apontando para cá — era um 404 linkado em 100% do
 * site. Esta página não tem gabarito de propósito: MIG-125 pede reconstrução,
 * não porte (a exceção deliberada a D-15, registrada no backlog).
 */

/* ⚠️ Leitura de arquivo **na pré-renderização**, nunca em requisição. A página
 * é estática (sem consulta, sem API dinâmica), então o `readFileSync` roda no
 * build — onde `src/` existe. No standalone de produção `src/` não é copiado, e
 * uma leitura em runtime quebraria; o guarda abaixo degrada para lista vazia em
 * vez de derrubar a rota, e o smoke pega a página sem cores. */
function tokensDoTema(): { nome: string; valor: string }[] {
  try {
    const css = readFileSync(
      path.resolve(process.cwd(), 'src/app/(frontend)/globals.css'),
      'utf8',
    )
    const tema = css.match(/@theme\s*\{([\s\S]*?)\n\}/)?.[1] ?? ''
    return [...tema.matchAll(/--color-([\w-]+):\s*([^;]+);/g)].map((m) => ({
      nome: m[1],
      valor: m[2].trim(),
    }))
  } catch {
    return []
  }
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Design System',
    /* noIndex é requisito da task: página interna de trabalho, não conteúdo.
     * Indexada, competiria nos resultados com as páginas de verdade. */
    robots: { index: false, follow: false },
  }
}

/* Grupos de exibição: a ordem conta a história do tema (superfícies → texto →
 * marca → escuro), que é como um dev novo procura um token. */
const GRUPOS: { titulo: string; prefixo: RegExp }[] = [
  { titulo: 'Superfícies', prefixo: /^surface/ },
  { titulo: 'Texto', prefixo: /^text/ },
  { titulo: 'Bordas', prefixo: /^border/ },
  { titulo: 'Marca', prefixo: /^(primary|secondary)/ },
  { titulo: 'Tema escuro', prefixo: /^dark/ },
]

export default async function Pagina() {
  const locale = await getLocale()
  if (!isLocale(locale)) notFound()

  const tokens = tokensDoTema()

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-20">
      <header className="mb-14">
        <StatusBadge label="Interno · noindex" variant="secondary" size="sm" />
        <h1 className="text-3xl md:text-4xl font-display font-light text-text-main mt-4 mb-3">
          Design System
        </h1>
        <p className="text-text-muted font-light max-w-2xl">
          A bancada dos componentes e tokens do site. As cores abaixo são lidas
          do próprio <code className="text-sm">globals.css</code> a cada build —
          não há segunda cópia para desatualizar.
        </p>
      </header>

      {/* ── tokens de cor ─────────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-xl font-display text-text-main mb-6">Cores</h2>
        {tokens.length === 0 && (
          <p className="text-text-muted text-sm">
            ⚠ Tokens indisponíveis nesta renderização — ver o comentário em
            <code> tokensDoTema()</code>.
          </p>
        )}
        <div className="space-y-8">
          {GRUPOS.map((g) => {
            const doGrupo = tokens.filter((t) => g.prefixo.test(t.nome))
            if (doGrupo.length === 0) return null
            return (
              <div key={g.titulo}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
                  {g.titulo}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {doGrupo.map((t) => (
                    <div
                      key={t.nome}
                      className="rounded-[6px] border border-border-main dark:border-white/10 overflow-hidden bg-surface-2 dark:bg-dark-surface"
                    >
                      <div
                        className="h-14"
                        style={{ backgroundColor: t.valor }}
                        aria-hidden
                      />
                      <div className="px-3 py-2">
                        <p className="text-xs font-mono text-text-main truncate">--color-{t.nome}</p>
                        <p className="text-[11px] font-mono text-text-muted">{t.valor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── tipografia ────────────────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-xl font-display text-text-main mb-6">Tipografia</h2>
        <p className="text-xs text-text-muted mb-4 font-mono">
          Mona Sans, servida por next/font/google (D-16) — a mesma build que o
          legado consome.
        </p>
        <div className="space-y-3">
          {([
            ['font-light text-4xl', 'Herói · light 36px'],
            ['font-light text-2xl', 'Título de seção · light 24px'],
            ['font-semibold text-base', 'Destaque · semibold 16px'],
            ['font-light text-sm text-text-muted', 'Corpo secundário · light 14px'],
            ['font-bold text-xs uppercase tracking-wider', 'Rótulo · bold 12px caps'],
          ] as const).map(([classe, rotulo]) => (
            <p key={rotulo} className={`${classe} text-text-main`}>
              {rotulo} — Dados que movem negócios
            </p>
          ))}
        </div>
      </section>

      {/* ── componentes estáticos ─────────────────────────────────────── */}
      <section className="mb-16">
        <h2 className="text-xl font-display text-text-main mb-6">Selos e métricas</h2>
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <StatusBadge label="Primário" variant="primary" />
          <StatusBadge label="Secundário" variant="secondary" />
          <StatusBadge label="Com pulso" variant="primary" pulse />
          <MetricChip value="51x" label="mais rápido" variant="primary" />
          <MetricChip value="20+" label="anos de mercado" variant="secondary" />
          <MetricChip label="só rótulo" variant="neutral" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <GlowCard glowColor="blue" customSize className="p-8">
            <h3 className="font-semibold text-text-main mb-2">GlowCard</h3>
            <p className="text-sm text-text-muted font-light">
              O cartão com brilho que os cases e as soluções usam. O brilho segue
              o ponteiro; em toque, fica no canto.
            </p>
          </GlowCard>
          <div className="vort-card">
            <h3 className="font-semibold text-text-main mb-2">.vort-card</h3>
            <p className="text-sm text-text-muted font-light">
              A utilidade de cartão padrão, definida em globals.css — raio de
              6px, sombra média, sem borda.
            </p>
          </div>
        </div>

        <QuoteBlock
          quote="O QuoteBlock dos detalhes de case, com o depoimento em destaque sobre o azul da marca."
          author="Design System"
          role="Exemplo estático"
        />
      </section>

      {/* ── componentes interativos (ilha cliente) ────────────────────── */}
      <section>
        <h2 className="text-xl font-display text-text-main mb-6">Filtros e busca</h2>
        <Bancada />
      </section>
    </main>
  )
}
