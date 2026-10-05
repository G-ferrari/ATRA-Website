import { Award, Sparkles, Users, Zap } from 'lucide-react'

import { AbaDePedido } from '@/app/(frontend)/[locale]/consultores/aba-de-pedido'
import { Diferenciais } from '@/app/(frontend)/[locale]/consultores/diferenciais'
import { ListaDeConsultores } from '@/app/(frontend)/[locale]/consultores/lista-de-consultores'
import { ProvedorDaSolicitacao } from '@/app/(frontend)/[locale]/consultores/solicitacao-contexto'
import { SolicitarConsultores } from '@/app/(frontend)/[locale]/consultores/solicitar-consultores'
import { ContadorAnimado } from '@/components/blocks/contador-animado'
import { MetricChip, StatusBadge } from '@/components/ui'
import type { Locale } from '@/lib/locales'
import { hrefDe } from '@/lib/routes'
import type { CabecalhoDaSecao, ConsultantRole, Contato } from '@/types/content'

import { TEXTOS_DAS_SECOES } from './textos'
import { TituloComDestaque } from './titulo'

/* Ícone, cor e valor de cada número, na ordem do legado (`Consultants.tsx:395`).
 *
 * O legado tinha um quarto, "Tempo Médio: < 48h". Saiu em 21/09/2026 junto com
 * o "em até 48 horas" da abertura: a página deixou de prometer prazo (D-22).
 *
 * ⚠️ `valor` pelo nome, e não pelo índice: eram três listas paralelas, e tirar
 * o número do meio obrigava a renumerar as três.
 *
 * ⚠️ Âmbar carrega par claro/escuro; azul e laranja não precisam. Sem o par,
 * "99.4%" saía âmbar-claro sobre superfície clara. */
const METRICAS = [
  { Icone: Users, cor: 'text-primary', marca: 'text-primary/40', valor: 'noTime' },
  { Icone: Zap, cor: 'text-secondary', marca: 'text-secondary/40', valor: 'emProjetos' },
  { Icone: Award, cor: 'text-amber-600 dark:text-amber-400', marca: 'text-amber-400/40', valor: 'satisfacao' },
] as const

/**
 * /consultores dentro da página-mestra — porte de
 * `legacy/src/pages/Consultants.tsx`. O topo (selo, etiqueta, título, texto) é
 * o que a editora escreve; os números, a lista de perfis, o carrinho e o
 * formulário de pedido seguem no código (decisão de 05/10).
 */
export function SecaoDeConsultores({
  cabecalho,
  perfis,
  contato,
  locale,
  abertura,
  anchor,
}: {
  cabecalho: CabecalhoDaSecao
  perfis: ConsultantRole[]
  contato: Contato
  locale: Locale
  abertura: boolean
  anchor: string | null
}) {
  const t = TEXTOS_DAS_SECOES[locale].consultores
  const Titulo = abertura ? 'h1' : 'h2'

  /* Somados dos perfis, como no legado (`Consultants.tsx:360`) — não são
   * números institucionais, então não vêm do global `site-settings`. */
  const noTime = perfis.reduce((s, p) => s + p.totalTeamSize, 0)
  const emProjetos = perfis.reduce((s, p) => s + p.allocatedProjects, 0)

  return (
    <>
      <section id={anchor ?? undefined} className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-12 scroll-mt-32">
        <div className="text-left">
          {(cabecalho.eyebrow || cabecalho.chip) && (
            <div className="flex items-center gap-2 mb-4">
              {cabecalho.eyebrow && (
                <StatusBadge label={cabecalho.eyebrow} variant="primary" size="sm" pulse icon={<Sparkles size={12} />} />
              )}
              {cabecalho.chip && <MetricChip label={cabecalho.chip} variant="neutral" size="sm" />}
            </div>
          )}

          {(cabecalho.title || cabecalho.highlight) && (
            <Titulo className="text-2xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-text-main mb-4 leading-tight">
              <TituloComDestaque cabecalho={cabecalho} />
            </Titulo>
          )}

          {cabecalho.paragrafos.length > 0 && (
            <div className="max-w-2xl mb-6 space-y-3">
              {cabecalho.paragrafos.map((p) => (
                <p key={p} className="text-xs sm:text-sm md:text-base text-text-muted font-light leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          )}

          {/* Três números: 3 colunas a partir do tablet; no celular, 2 colunas e o
              último ocupando a linha inteira, em vez de deixar um buraco ao lado. */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 max-w-4xl pt-1">
            {METRICAS.map(({ Icone, cor, marca, valor }, i) => (
              <div
                key={t.metricas[i]}
                className="bg-surface-2  rounded-[6px] px-4 py-3 shadow-xs flex items-center justify-between last:col-span-2 sm:last:col-span-1"
              >
                <div>
                  <div className="text-xs text-text-muted font-normal">{t.metricas[i]}</div>
                  <div className={`text-lg md:text-xl font-bold ${cor}`}>
                    {valor === 'noTime' && <ContadorAnimado ate={noTime} sufixo="+" />}
                    {valor === 'emProjetos' && <ContadorAnimado ate={emProjetos} sufixo="+" />}
                    {valor === 'satisfacao' && <ContadorAnimado ate={99} sufixo=".4%" />}
                  </div>
                </div>
                <Icone size={20} className={`${marca} shrink-0`} aria-hidden />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O provedor envolve as seções porque a lista (onde se escolhe), a
          chamada "Não encontrou…" e a seção final abrem a mesma aba de pedido
          (onde se envia) e leem o mesmo carrinho — e há seções do servidor no
          meio. Ver `solicitacao-contexto.tsx`. */}
      <ProvedorDaSolicitacao>
        <ListaDeConsultores perfis={perfis} locale={locale} />

        <Diferenciais locale={locale} />

        <SolicitarConsultores locale={locale} contato={contato} />

        {/* Fechada, a aba não ocupa lugar nenhum (`<dialog>` sem `open` é
            `display: none`). */}
        <AbaDePedido perfis={perfis} locale={locale} privacidadeHref={hrefDe('politicas', locale)} />
      </ProvedorDaSolicitacao>
    </>
  )
}
