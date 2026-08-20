/* Seed dos globals `contact` e `footer`, e do logo (MIG-072 / MIG-073).
 *
 * Os três dados saíram de módulos escritos à mão no repositório —
 * `lib/contato.ts` e `lib/navegacao.ts` — e do hotlink do WordPress. Depois
 * desta seed, mudar telefone, rodapé ou logo é trabalho de admin, não de PR.
 *
 * ⚠️ Os textos são os do legado, caractere a caractere, inclusive o telefone
 * escrito de dois jeitos e os links que apontam para `#` (D-15). Consolidar é
 * decisão do marketing (D-22), e a ferramenta para isso é o próprio admin.
 *
 * ⚠️ Idempotente: global é linha única, `updateGlobal` sobrescreve. A mídia do
 * logo é procurada pelo nome **sem extensão** — o Payload reencoda no upload e
 * `logo_atra_horizontal.png` fica gravado como `.webp`, então buscar pelo nome
 * inteiro criaria uma cópia por execução.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

import { getPayload } from 'payload'

import config from '../../src/payload.config'

const payload = await getPayload({ config })

const LOGO = 'scripts/seed/assets/logo_atra_horizontal.png'

const CONTATO = {
  phone: '+55 11 96305-2391',
  /* O legado escreve o número com parênteses no cartão da home
   * (`App.tsx:2395`) e sem eles no rodapé (`App.tsx:2510`). */
  phoneWithArea: '+55 (11) 96305-2391',
  whatsapp: 'https://wa.me/5511963052391',
  email: 'negocios@atra.com.br',
  address: 'Av. Queiroz Filho, 1700 – Torre D Sala 802 Vila Hamburguesa – SP',
  /* P-26: no rodapé do protótipo as redes apontam para `#`; as URLs reais
   * estavam no CTA de contato (`App.tsx:2412`). São elas que valem. */
  social: {
    linkedin: 'https://www.linkedin.com/company/atra-tecnologia/',
    instagram: 'https://www.instagram.com/atratecnologia/',
    youtube: 'https://www.youtube.com/@atratecnologia',
  },
}

const RODAPE = {
  pt: {
    about:
      'Com mais de 20 anos de experiência, ajudamos organizações a migrar, modernizar e inovar na nuvem, unindo nossa expertise à tecnologia do Google.',
    copyright: '© 2026 ATRA. Todos os direitos reservados.',
    columns: [
      {
        title: 'Soluções',
        kind: 'links' as const,
        /* Os 3 apontam para `#` no legado (`App.tsx:2489`). */
        links: [
          { label: 'Inovação & IA', href: '' },
          { label: 'Dados, BI & Advanced Analytics', href: '' },
          { label: 'Governança & Cultura', href: '' },
        ],
      },
      {
        title: 'Sobre',
        kind: 'links' as const,
        links: [
          { label: 'Consultores', href: '/consultores' },
          /* ⚠️ O rótulo diz "Insights" e o destino é /cases-de-sucesso. É assim
           * no legado; portado com o defeito (D-15). */
          { label: 'Insights', href: '/cases-de-sucesso' },
          { label: 'Parceiros', href: '/parceiros/google-cloud' },
          { label: 'Carreiras', href: '/carreiras' },
          { label: 'Sobre', href: '/sobre' },
          { label: 'Glossário', href: '/glossario' },
        ],
      },
      { title: 'Fale Conosco', kind: 'contact' as const, links: [] },
      {
        title: 'Legal',
        kind: 'links' as const,
        /* `/politicas-e-termos` existe no WordPress e entra em MIG-094. */
        links: [
          { label: 'Privacidade', href: '' },
          { label: 'Termos de Uso', href: '' },
          { label: 'Cookies', href: '' },
        ],
      },
    ],
  },
  en: {
    about:
      "With over 20 years of experience, we help organizations migrate, modernize, and innovate in the cloud, uniting our expertise with Google's technology.",
    copyright: '© 2026 ATRA. All rights reserved.',
    colunas: ['Solutions', 'About', 'Contact Us', 'Legal'],
    rotulos: [
      ['Innovation & AI', 'Data, BI & Advanced Analytics', 'Governance & Culture'],
      ['Consultants', 'Insights', 'Partners', 'Careers', 'About', 'Glossary'],
      [],
      ['Privacy', 'Terms of Use', 'Cookies'],
    ],
  },
}

console.log('→ logo da ATRA')
const nome = path.basename(LOGO)
const chave = nome.replace(/\.[^.]+$/, '')
const { docs: midias } = await payload.find({
  collection: 'media',
  where: { filename: { contains: chave } },
  limit: 1,
  depth: 0,
})
const logo =
  midias[0] ??
  (await payload.create({
    collection: 'media',
    data: { alt: 'ATRA' },
    file: { data: readFileSync(LOGO), mimetype: 'image/png', name: nome, size: 0 },
    locale: 'pt',
  }))
console.log(`  media #${logo.id}`)

await payload.updateGlobal({ slug: 'site-settings', locale: 'pt', data: { logo: logo.id } })

console.log('→ contato')
await payload.updateGlobal({ slug: 'contact', data: CONTATO })

console.log('→ rodapé')
const pt = await payload.updateGlobal({ slug: 'footer', locale: 'pt', data: RODAPE.pt })

/* ⚠️ O inglês reenvia os **ids de todos os níveis** — `columns` e `links`. Sem
 * eles o Payload trata cada linha como nova, o português fica órfão e o rodapé
 * sai em branco no locale que não foi semeado por último. Já custou 800px em
 * /sobre e 742px numa página de solução. */
await payload.updateGlobal({
  slug: 'footer',
  locale: 'en',
  data: {
    about: RODAPE.en.about,
    copyright: RODAPE.en.copyright,
    columns: (pt.columns ?? []).map((c, i) => ({
      id: c.id,
      title: RODAPE.en.colunas[i],
      kind: c.kind,
      links: (c.links ?? []).map((l, j) => ({ id: l.id, label: RODAPE.en.rotulos[i][j], href: l.href })),
    })),
  },
})

console.log(`  ${(pt.columns ?? []).length} colunas, 2 idiomas`)
process.exit(0)
