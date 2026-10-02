/* Seed da página de solução RC18 (feature rc18, task 003; revisto para espelhar a
 * landing oficial; a partir da task 029, aponta para o diagnóstico de maturidade).
 *
 * Fonte de conteúdo:
 * - **Landing oficial `rc18-25` (RD Station), em www-atrainformatica-com-br.rds.land** —
 *   é o gabarito de conteúdo atual do marketing. Textos das seções, ordem e CTAs
 *   foram alinhados a ela em 14/09/2026. As 12 dimensões usam as descrições curtas
 *   da landing (decisão do dono via G-ferrari), no lugar do texto longo da norma.
 * - Resolução Conjunta nº 18, de 28/11/2025 (BCB + CMN) — referência das 12
 *   dimensões (Art. 2º) e do prazo de adequação 31/12/2026 (Art. 12).
 *
 * Diferenças em relação à landing (decididas com o dono):
 * - **Sem formulário na página.** A landing tem o formulário RD; aqui ele não
 *   entra. Até a task 029 havia o nosso `ctaContact` no fim, e ele saiu pela ata
 *   de 24/09 ("substituir dentro dessa página da RC18"): quem chega à RC18 vai
 *   para o **diagnóstico de maturidade** (D-35), não para um formulário genérico.
 *   Com ele saiu o item "Contato" (`#contato`) do submenu, que se monta das
 *   âncoras dos blocos.
 * - **Sem os blocos "Capacidades" e "Experiência"** da versão anterior: a landing
 *   não os tem, e o dono pediu para igualar a ela.
 * - Mantida a **linha do tempo do prazo** (`processSteps`), que enriquece a seção
 *   do prazo sem sair do conteúdo da landing.
 *
 * CTAs:
 * - Herói: "Falar com especialista" → WhatsApp do diretor e "Verificar
 *   diagnóstico" → diagnóstico de maturidade já no setor financeiro
 *   (`/diagnostico-maturidade?setor=financeiro`).
 * - Faixa final (`ctaBanner`): "Falar com especialista" → WhatsApp do diretor.
 *
 * ⚠️ Desde 28/09 o conteúdo mora em `rc18-conteudo.ts`, que a migração
 * `20260928_120000_pagina_rc18` também usa para criar a página onde o seed nunca
 * rodou (a homologação estava sem ela).
 *
 * ⚠️ Este seed é para ambientes novos. Banco que já tinha a página na versão
 * anterior (com o `ctaContact` e o link para `/diagnostico-rc18`) é atualizado
 * pela migração `20260926_220000_rc18_aponta_para_o_diagnostico`, que roda no
 * deploy e só age se a página ainda estiver como este seed a deixava.
 *
 * Este seed **cria** o documento e depois grava o layout. Idempotente pelo
 * slug. (As soluções do menu não têm mais seed: entram por migração, D-52.) A categoria `rc18` (4ª aba do mega-menu) veio na migração da task 002.
 *
 * ⚠️ EN é um **stub em português** (decisão PT-only da v1): a RC 18/2025 é norma
 * do BCB para instituições brasileiras, público 100% nacional. O layout de blocos
 * é compartilhado entre locales (só os campos de texto são localizados), então o
 * EN reusa o conteúdo PT — o suficiente para a rota `/en/solutions/rc18` resolver
 * sem texto em branco.
 *
 * ⚠️ Conteúdo é rascunho: a consolidação de texto é do marketing no CMS (D-22).
 * Limitações do porte para os blocos existentes: o `pageHero` não embute
 * formulário; e o `iconCardGrid` não tem parágrafo de abertura, então os "textos
 * de abertura" das seções de cards da landing não foram portados (ficam
 * eyebrow+título).
 */

import { getPayload } from 'payload'

import config from '../../src/payload.config'
import { casarIds } from './ids'
import { COMUNS_RC18, EN_RC18, PT_RC18, SLUG_RC18, layoutRc18 } from './rc18-conteudo'

const payload = await getPayload({ config })

const SLUG = SLUG_RC18
const PT = PT_RC18
const EN = EN_RC18
const layout = layoutRc18
const comuns = COMUNS_RC18

console.log('→ página de solução: RC18')

const { docs } = await payload.find({
  collection: 'solutions',
  where: { slug: { equals: SLUG } },
  limit: 1,
  locale: 'pt',
  depth: 0,
})

const dataPt = { ...comuns, ...PT.base, slug: SLUG, layout: layout(PT) }
const doc = docs[0]
  ? await payload.update({ collection: 'solutions', id: docs[0].id, data: dataPt, locale: 'pt' })
  : await payload.create({ collection: 'solutions', data: dataPt, locale: 'pt' })

/* Relê o gravado e casa os ids em todos os níveis antes de gravar o EN, senão o
 * texto localizado dentro dos cards some (ver ids.ts). */
const gravado = await payload.findByID({ collection: 'solutions', id: doc.id, locale: 'pt', depth: 0 })
await payload.update({
  collection: 'solutions',
  id: doc.id,
  data: { ...comuns, ...EN.base, slug: SLUG, layout: casarIds(layout(EN), gravado.layout) },
  locale: 'en',
})

console.log('  1 página, 9 blocos (8 seções + submenu), 2 idiomas (EN stub)')
process.exit(0)
