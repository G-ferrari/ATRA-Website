---
status: rascunho
atualizado_em: 2026-08-17
depende_de: [inventario-conteudo.md]
---

# Inventário de assets

> **Correção de premissa.** O briefing da migração afirma que "as imagens são
> hotlinked do WordPress legado". Isso vale para **33 referências** (logos de
> parceiro e selo GPTW), mas a maior parte da imagem do site são **arquivos locais
> commitados no repositório** — e 30 deles estão corrompidos. O script de seed
> previsto para a Fase 4 ("download das imagens hoje hotlinked do WordPress") só
> resolveria uma fração; o resto precisa da recuperação descrita abaixo.

## Panorama

| Origem | Qtd | Destino proposto |
|---|---|---|
| Hotlink `atra.com.br/wp-content/uploads/` | 33 refs / 11 arquivos distintos | **Payload Media** (baixar antes do cutover — o WP sai do ar) |
| ↳ distribuídos em | `App.tsx` (19), `ui/logo-clouds.tsx` (8), `About.tsx` (4), `Careers.tsx` (2) | |
| Local em `legacy/public/` | 37 arquivos | **Payload Media** (logos, fotos) e `public/` (SVGs de marca) |
| Local em `legacy/imgs/` (raiz) | 24 arquivos | descartar após recuperar os íntegros — é cópia de `public/imgs/` |
| Local em `legacy/src/assets/images/` | 7 arquivos | **Payload Media** (imagens de case) |
| Unsplash (hotlink) | 39 refs | **substituir** — imagem genérica de banco |
| `picsum.photos` (placeholder) | 5 refs | **remover** — placeholder explícito |
| Iconify (runtime, CDN) | ~60 ícones | manter (pacote npm) |
| Lucide (bundle) | ~50 ícones | manter |

## 1. Hotlinks do WordPress — migram para o Payload

Todos em `atra.com.br/wp-content/uploads/`. Como o site novo **substitui** o
WordPress, estas URLs morrem no cutover. Baixar e recadastrar é bloqueante.

| Arquivo | Usado em | Vira |
|---|---|---|
| `2025/08/atra_horizontal_cor-2048x1134.png` | `App.tsx:332` (navbar), `App.tsx:2457` (footer) | `public/` — é a marca, não conteúdo editável |
| `2025/08/GPTW-Selos-site.jpg` | `App.tsx:1247` | Media, ligado a `siteSettings` |
| `2021/03/Google_Cloud_Platform-Logo.wine_-2048x1365.png` | `App.tsx:108`, `:1397`, `About.tsx:386`, `logo-clouds.tsx:30` | Media → `partners.logo` |
| `2023/11/denodo-tranparent-logo.png` | `App.tsx:109`, `:1398`, `logo-clouds.tsx:41` | idem |
| `2025/02/Horizontal_BigID_Logo-2048x1072.jpg` | `App.tsx:110`, `:1399`, `logo-clouds.tsx:52` | idem |
| `2023/08/image-removebg-preview-4.png` | `App.tsx:111`, `:1400`, `logo-clouds.tsx:63` | idem — ⚠️ parceiro sem nome ("Partner") |
| `2021/03/Microsoft_Azure-Logo.wine_-1536x1024.png` | `App.tsx:112`, `:1401`, `About.tsx:385`, `logo-clouds.tsx:74` | idem |
| `2025/02/Atlan-logo-full.svg_.png` | `App.tsx:113`, `:1402`, `About.tsx:388`, `logo-clouds.tsx:85` | idem |
| `2025/06/logo-ibm.png` | `App.tsx:114`, `:1403`, `logo-clouds.tsx:96` | idem |
| `2025/05/Databricks_Logo2-1536x813.png` | `App.tsx:116`, `:1405`, `About.tsx:387`, `logo-clouds.tsx:118` | idem |
| `2024/08/GPTW-Selos-site-1-768x768.png` | `Careers.tsx:349` | Media |
| `2025/08/GPTW-Selos-site.jpg` (2ª ocorrência) | `Careers.tsx:315` | Media |

## 2. Arquivos locais — estado de integridade

**30 de 48 arquivos raster estão corrompidos** (mangling UTF-8: o byte `0x89` da
assinatura PNG virou `EF BF BD`). Os SVGs estão todos íntegros — ASCII não sofre
mangling.

| Diretório | Arquivos | Íntegros | Corrompidos |
|---|---|---|---|
| `legacy/public/logos/` | 7 | **7** | 0 |
| `legacy/public/fotos/` | 5 | **5** | 0 |
| `legacy/public/imgs/` | 25 | 10 (todos SVG) | **15** |
| `legacy/imgs/` | 24 | 11 (9 SVG + 2 PNG) | **13** |
| `legacy/src/assets/images/` | 7 | 4 (imagens de case) | **3** |

### A boa notícia: tudo é recuperável dentro do próprio repositório

Cada arquivo corrompido tem um gêmeo íntegro em outro diretório — o projeto
guardou o mesmo asset em dois ou três lugares, e a corrupção não pegou todas as
cópias.

| Arquivo corrompido | Cópia íntegra |
|---|---|
| `public/imgs/{afya,anbima,bcarrefour,icatu,oncoclinicas,porto,rdsaude}.jpg` | `public/logos/` (mesmo nome) |
| `imgs/{os mesmos 7}.jpg` | `public/logos/` |
| `public/imgs/{5 fotos de evento}` | `public/fotos/` (mesmo nome) |
| `imgs/{as mesmas 5}` | `public/fotos/` |
| `public/imgs/LIPT 2026.png`, `src/assets/images/LIPT 2026.png`, `+ lipt-2026.png` (3 cópias) | **`imgs/LIPT 2026.png`** — íntegro, 336.857 B, PNG 3706×5054 |
| `public/imgs/salesforceinformatica.png`, `src/assets/images/…` | **`imgs/salesforceinformatica.png`** — íntegro, 83.666 B, PNG 1277×283 |

Verificação:

```bash
find legacy/public legacy/imgs legacy/src/assets -type f \
  \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) -print0 \
  | while IFS= read -r -d '' f; do
      file -b "$f" | grep -qiE 'image|bitmap' || echo "CORROMPIDA: $f"
    done
```

⚠️ Exceção: `public/fotos/2025_ATRA Summit.JPG` (3.674.403 B, íntegro) é **maior**
que a versão corrompida (3.612.488 B). Como a corrupção só infla, são arquivos de
origem diferente — a cópia íntegra é provavelmente uma versão em resolução maior
da mesma foto, não o original exato. Confirmar visualmente antes do seed.

### Onde a corrupção não afeta o site

O código referencia `/logos/` (`App.tsx:1889`) e `/fotos/` (`About.tsx:66-70`),
que estão **íntegros**. Os corrompidos que o site realmente tenta usar são:

- `src/assets/images/lipt-2026.png` — `App.tsx:41` → selo LIPT da home (quebrado)
- `/imgs/salesforceinformatica.png` — `App.tsx:115`, `:1404`, `logo-clouds.tsx:107`
- `/imgs/lipt-2026.png` — fallback do `onError` (`App.tsx:1270`, `Careers.tsx:335`)

Ou seja: **2 imagens visivelmente quebradas em qualquer build feito a partir do
repositório**; as outras 28 são cópias não referenciadas ou com gêmeo íntegro
sendo servido.

⚠️ **Não vale para o site publicado.** Em https://atra-website.ai.studio as 52
imagens da home carregam, incluindo essas duas — o build do AI Studio usa os
binários íntegros. Consequência: **o loop infinito do `onError` também não
acontece lá**, porque a imagem nunca falha e o guard quebrado nunca é exercitado.
O guard continua errado e a correção vale (é uma bomba armada para qualquer imagem
que falhe no futuro), mas o sintoma é do repositório, não do ar.

### Fonte limpa para a recuperação

O build publicado é a origem mais confiável dos assets — melhor que os gêmeos
internos, cuja proveniência é inferida. Verificado por hash:

```
sha256 9dd01651cbc297e9…  atra-website.ai.studio/assets/lipt-2026-y0TumdP7.png
sha256 9dd01651cbc297e9…  legacy/imgs/LIPT 2026.png        ← idêntico
```

Isso valida os gêmeos como originais e resolve a dúvida da foto do ATRA Summit
(exceção acima): baixar do site publicado dispensa o julgamento visual.

**Recomendação para MIG-070:** recuperar do build publicado, usando os gêmeos
internos só como conferência.

## 3. Unsplash — 21 referências a substituir

| Uso | `arquivo:linha` |
|---|---|
| 4 imagens de fundo de `Features` | `App.tsx:1447`, `:1454`, `:1461`, `:1468` |
| 4 avatares de depoimento | `App.tsx:1927`, `:1933`, `:1939`, `:1945` |
| Foto da equipe no CTA | `App.tsx:2349` |
| Foto "ATRA Team" | `About.tsx:328` |
| 6 capas de post | `Blog.tsx:18,26,34,42,50,58` |
| 3 capas de relatório | `Reports.tsx:17,25,33` |
| 3 capas de ebook | `Ebooks.tsx:16,24,32` |
| 3 capas de webinar | `Webinars.tsx:16,24,32` |
| Destaque de webinar | `Blog.tsx:328` |
| Capas do hub | `Insights.tsx:99,113,…` (7 refs) |
| Outros | `Consultants.tsx` (1), `Careers.tsx` (1), `SolutionAI.tsx` (2), `PartnerGoogleCloud.tsx` (1) |

Distribuição por arquivo: `App.tsx` 9 · `Blog.tsx` 7 · `Insights.tsx` 7 ·
`Ebooks.tsx` 3 · `Webinars.tsx` 3 · `Reports.tsx` 3 · `SolutionAI.tsx` 2 ·
`About.tsx` 1 · `Consultants.tsx` 1 · `Careers.tsx` 1 · `PartnerGoogleCloud.tsx` 1.

Depender de `images.unsplash.com` em produção é risco de disponibilidade,
de licença e de LCP. Toda capa vira upload no Payload.

✅ **Resolvido em duas etapas.** `legacy/scripts/baixar-imagens.mjs` tirou o
protótipo do hotlink — as 53 imagens estão em `legacy/public/imagens/`, com
`PROVENIENCIA.md` ao lado. E o site novo nunca as recebeu como conteúdo: cada
ponto mostra o marcador `capa-pendente`, e a foto do protótipo só entra com
`SEED_FIXTURES=1`, para revisão interna (D-27,
`web/scripts/seed/imagens-do-prototipo.ts`).

## 4. `picsum.photos` — 5 referências, remover

`App.tsx:2201`, `:2210`, `:2224`, `:2233`, `:2243` — placeholders explícitos na
`BlogSection` da home, com títulos genéricos. Não sobrevivem ao porte.

✅ **Fora do conteúdo, como previsto.** Os 5 cartões saem com `capa-pendente`. As
cópias baixadas existem só para a revisão interna, atrás de `SEED_FIXTURES=1`
(D-27) — o endereço devolve foto sem autoria registrada, e não há original a que
voltar.

## 5. SVGs de marca — 10 arquivos íntegros

`logo_atra.svg`, `logo_aws.svg`, `logo_atlan.svg`, `logo_azure.svg`,
`logo_bigid.svg`, `logo_databricks.svg`, `logo_denodo.svg`,
`logo_google_cloud.svg`, `logo_ibm.svg`, `logo_informatica.svg`
— em `public/imgs/` e duplicados em `imgs/`.

⚠️ Nenhum é referenciado pelo código: as versões usadas dos mesmos logos são os
PNGs hotlinkados do WordPress. Há SVG local de melhor qualidade sem uso.

**Recomendação:** usar os SVGs no site novo em vez de baixar os PNGs do WP.
Destino: `public/logos/` (marca de parceiro é institucional, não conteúdo editável)
ou `partners.logo` no Media, se o marketing precisar trocar.

## Fontes

`src/index.css:19-20` declara `--font-sans` e `--font-display` como **"Mona Sans"**,
e a **linha 1** do mesmo arquivo importa a fonte do Google Fonts.

> ⚠️ **Correção (17/08/2026).** A versão anterior desta seção afirmava que a fonte
> nunca carregava e que o site rodava no fallback do sistema. **Estava errado.** O
> `@import` da linha 1 funciona: verificado no browser,
> `document.fonts.check('16px "Mona Sans"')` retorna `true`, com as faces roman e
> itálica carregadas. O erro veio de procurar `<link>` em `index.html` e
> `@font-face` no CSS — o `@import` não casa com nenhum dos dois padrões.

✅ **Resolvido — D-16:** Mona Sans é a tipografia oficial da ATRA (SIL OFL 1.1),
servida no app novo por **`next/font/google`**, que baixa em build e serve do
nosso domínio.

⚠️ **Não trocar por self-hosting da build do GitHub.** As duas builds não são
metricamente idênticas — medido no browser, a do GitHub (v2.0.27) é de 1,4% a
**2,3% mais estreita** que a servida pelo Google Fonts (v4), o que estouraria o
limite de 0,1% da regressão visual em toda captura com texto. Ver
[decisoes D-16](../00-contexto/decisoes.md#d-16--mona-sans-via-nextfontgoogle-para-bater-com-o-legado).

## Vídeos

Nenhum. Os webinars mostram thumbnail + ícone de play sem player
(`Webinars.tsx:64-84`); "45:00" e "HD" são texto fixo.

✅ **Resolvido — D-11:** embed de YouTube/Vimeo na página de detalhe, com campo de
URL e duração real por item. Hosting fica com a plataforma externa — sem custo de
storage nem banda. `"45:00"` e `"HD"`, hoje texto fixo, viram campo (ou somem).

## Destino consolidado

| Tipo | Destino | Por quê |
|---|---|---|
| Logo ATRA | `public/` | Marca; não muda sem redesign |
| SVGs de parceiro | `public/logos/` | Idem — e já existem íntegros |
| Selos GPTW/LIPT | Payload Media → `siteSettings` | Trocam a cada ano |
| Logos de cliente | Payload Media → `clients.logo` | Marketing adiciona cliente novo |
| Fotos de evento | Payload Media → `about` global | Marketing atualiza após cada evento |
| Imagens de case | Payload Media → `cases.heroImage` | Uma por case |
| Capas de post/report/ebook/webinar | Payload Media | Uma por item |
| Ícones (Iconify/Lucide) | pacote npm | Não são asset de conteúdo |
