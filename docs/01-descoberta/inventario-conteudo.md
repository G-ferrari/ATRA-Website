---
status: rascunho
atualizado_em: 2026-08-17
depende_de: [inventario-rotas.md]
---

# Inventário de conteúdo

Todo o conteúdo do site está hardcoded no código-fonte. Não há uma única chamada
a API de conteúdo — o único `fetch` do projeto é o do chat
(`legacy/src/services/geminiService.ts:6`).

Existe um segundo repositório de conteúdo já pronto: **`legacy/CONTEUDO_DO_SITE.md`**
(440 linhas), auto-descrito como export "*para facilitar o transporte e rebuild em
qualquer outra plataforma ou CMS*". Cobre as 10 seções do site, incluindo o
mapeamento EN. **Deve ser cruzado com o código** — não assumir que está atualizado;
onde divergir, o código é a fonte de verdade do que está no ar.

## Legenda

- 🟢 **CMS** — o marketing edita
- 🔵 **UI** — microcopy de interface, fica no código (ou em arquivo de tradução)
- 🟠 **Decidir** — natureza ambígua, ver decisões pendentes

## 1. Cases 🟢

| Onde | `arquivo:linha` | Qtd | Campos presentes |
|---|---|---|---|
| Listagem | `src/pages/SuccessStories.tsx:16-61` | 4 | `slug`, `title`, `client`, `description`, `tags[]`, `icon`, `image`, `impact` |
| Detalhe | `src/pages/cases/*.tsx` | 4 | `client`, `title`, `heroImage`, `description`, `challenges[]`, `solution`, `results[]`, `partners`, `technologies[]`, `testimony{text,author,role}`, `aboutClient` |
| Carrossel da home | `src/App.tsx:1609-1670` | **5** | `company`, `logo`, `title`, `description`, `slug`, `icon`, `bgColor`, `image`, `tags[]` |
| Hub Insights | `src/pages/Insights.tsx:77-90,121-133,191-204` | 3 | `title`, `description`, `category`, `date`, `tags[]`, `authorOrClient` |

⚠️ O carrossel da home tem **5 cards para 4 cases**: "RD Saúde — Plataforma de
Inteligência de Saúde" (`App.tsx:1658-1669`) aponta para o slug
`marketplace-governanca-dados`, que é do Banco ABC. É um case fantasma.

⚠️ Os textos divergem entre as três fontes para o mesmo case. Ex.: o case 1 é
"Gerando valor através de Marketplace e Governança de dados" em `SuccessStories.tsx:20`
e "Marketplace & Governança de Dados" em `App.tsx:1614`.

## 2. Posts de blog 🟢

`src/pages/Blog.tsx:11-60` — 6 posts com `title`, `description`, `date` (string
em PT: "23 de março de 2026"), `tags[]`, `image` (Unsplash).
Sem `slug`, sem corpo, sem autor. Os cards não levam a lugar nenhum (`:229` → `"#"`).

`src/pages/Insights.tsx:107-118,163-176` — mais 2 posts, com texto diferente.

`src/App.tsx:2197-2235` — mais 4 cards de blog (`BlogCard`) com títulos genéricos
("Inovação em ação", "Liderando em meio a mudanças") e imagens `picsum.photos`.
São claramente placeholder.

## 3. Relatórios 🟢

`src/pages/Reports.tsx:10-35` — 3 itens: `title`, `description`, `date`, `tags[]`, `image`.
`src/pages/Insights.tsx:92-104,177-190` — mais 2, com títulos diferentes.

## 4. Ebooks 🟢

`src/pages/Ebooks.tsx:9-34` — 3 itens: `title`, `description`, `pages` (número),
`tags[]`, `image`. Botão "Baixar agora" (`:71`) sem arquivo associado.
`src/pages/Insights.tsx:135-148,205-218` — mais 2.

## 5. Webinars 🟢

`src/pages/Webinars.tsx:9-34` — 3 itens: `title`, `description`, `date` (livre:
"Amanhã, 15:00"), `tags[]`, `image`. Duração "45:00" e selo "HD" fixos no
markup (`:78`, `:81`), não são dado.
`src/pages/Insights.tsx:149-162` — mais 1.

## 6. Glossário 🟢

`src/pages/Glossary.tsx:11-29` — 17 termos: `term`, `definition`, `category`.
Categorias em uso: Analytics, Infraestrutura, Cloud, Governança, Engenharia de
Dados, Cultura, Inteligência Artificial, FinOps & Cloud.
É o conjunto mais limpo do projeto: schema plano, sem imagem, sem duplicata.

## 7. Consultores / perfis 🟢

`src/pages/Consultants.tsx:61-271` — `SPECIALIST_ROLES`, perfis de cargo (não
pessoas): especialidade, senioridade, skills, descrição.
`:50` `SPECIALTIES` · `:59` `SENIORITIES` (`["Todos","Senior","Pleno","Lead / Principal"]`)
· `:272` `DIFFERENTIALS`.

## 8. Vagas 🟠

`src/pages/Careers.tsx` — a seção "Trabalhe Conosco" (`:410`) tem formulário
(`:487`) mas **não há lista de vagas estruturada** no código. O mega-menu promete
"Ver Vagas Disponíveis" (`App.tsx:742`) e "Vagas Abertas →" (`App.tsx:1074`).

> [!DECISÃO PENDENTE] **P-02** — existe hoje uma fonte de vagas (Gupy, Solides,
> planilha)? Se sim, `jobs` é integração, não conteúdo digitado. A confirmar com o
> RH da ATRA. Ver [decisoes](../00-contexto/decisoes.md#decisões-pendentes).

## 9. Parceiros 🟢

`src/App.tsx:107-117` — 9 parceiros: `name`, `url` (logo), `desc`, `link`.
`src/App.tsx:1396-1406` — os mesmos 9, só `name` + `url`.
`src/pages/About.tsx:385-388` — 4 logos repetidos direto no markup.
`src/App.tsx:1182-1212` — 3 cards de nível de parceria (Google Cloud "Premier
Partner", Azure "Cloud Solutions", AWS "Advanced Net") — texto no markup.

⚠️ Um dos parceiros se chama literalmente `"Partner"` (`App.tsx:111`), com
descrição genérica. Nome real desconhecido.

## 10. Clientes / logos 🟢

`src/App.tsx:1860-1868` — 7 clientes: `name`, `file`, `boost` (bool que só ajusta
escala visual). RD Saúde, ANBIMA, Afya, Oncoclínicas, Carrefour Banco, Icatu, Porto.

## 11. Depoimentos 🟢

`src/App.tsx:1922-1947` — 4 depoimentos: `client`, `role`, `text`, `avatar`
(Unsplash — **fotos de banco de imagem representando clientes reais**).
Mais 3 dentro dos cases (`cases/*.tsx`, prop `testimony`), esses **com nome real**
(Rafael Kataoka, Paulo Ruza).

✅ **Resolvido — D-14:** o campo de foto vira **opcional**, com fallback para
iniciais em monograma. As 4 URLs do Unsplash são descartadas no seed.

## 12. Soluções 🟢

`src/App.tsx:45-97` — 3 categorias × 2 soluções = 6, com `title`, `icon`
(fluent), `link`, `desc`. **5 das 6 têm `link: "#"`** — só IA tem página.
`src/pages/About.tsx` (via i18n `about.solutions.items`) — outra lista, com 12
soluções, formato só-texto.

## 13. Métricas institucionais 🟠

| Métrica | Home (`App.tsx`) | Sobre (`About.tsx:134-140`) |
|---|---|---|
| Anos de mercado | `15+` (`:1314`) | `15+` |
| Profissionais | `150+` (`:1336`) | **`140+`** |
| Certificações | `40+` (`:1358`) | — |
| Clientes | `20+` (`:1380`) | **`30+`** |
| Parceiros | — | `9` |
| GPTW | **`5x`** (`:1277`) | **`4x`** |

Quatro divergências entre as duas páginas. Fortíssimo argumento para um global
`siteSettings` com as métricas em um lugar só.

## 14. Textos institucionais 🟢

Endereço, telefone, e-mail e redes aparecem em 4 lugares:
`App.tsx:2366-2372` (CTA), `App.tsx:2504-2515` (footer),
`Consultants.tsx:830+` (cópia do CTA), `CaseDetailBase.tsx:199-208` (rodapé do case).
Telefone diverge: `+55 11 96305-2391` no site vs. `+55 11 96306-0267` registrado
como contato oficial da ATRA fora do repositório.

## 15. Microcopy de interface 🔵 — **não vai para o CMS**

- Labels de navegação: `src/locales/pt.json` → `nav.*` (8 chaves)
- Placeholders de busca: `SuccessStories.tsx:119`, `Blog.tsx:122`, `Glossary.tsx:102`
- Estados vazios: `SuccessStories.tsx:157`, `Blog.tsx:160`, `Glossary.tsx:174`
- Botões: "Ver estudo de caso completo", "Continuar lendo", "Baixar agora", "Resetar Filtros"
- Disclaimer da IA: `App.tsx:2119`
- `aria-label`s: `App.tsx:1841`, `:1849`, `:1989`, `:2029`, `:2107`
- `PageLoader`: `App.tsx:2562`

## Situação da tradução (PT/EN)

`src/i18n.ts` inicializa i18next com PT como padrão e EN como alternativa.
Seletor de idioma em `App.tsx:1046` (PT) e `:1057` (EN) — **só no menu mobile**.

- `src/locales/pt.json`: **172 chaves** · `src/locales/en.json`: **169 chaves**
- Faltam em EN: `hero.title_span1`, `hero.title_rest1`, `hero.title_start1`
- 14 dos 40 arquivos de `src/` usam `useTranslation` (38 ocorrências)

**O ponto crítico:** as traduções cobrem navegação, hero, títulos de seção e as
páginas Sobre/Soluções/Parceiro/Carreiras. **Nenhum item de conteúdo listado
acima (cases, posts, glossário, relatórios, ebooks, webinars, consultores,
depoimentos) está traduzido** — tudo é string PT hardcoded. Ou seja: hoje, ao
trocar para EN, o site fica bilíngue pela metade.

Com a decisão de manter **PT e EN**, toda collection precisa nascer com
`localized: true` nos campos de texto, e a Etapa 2 tem que decidir a estratégia de
URL. Isso está registrado como decisão em [debito-tecnico](debito-tecnico.md).

✅ **Resolvido — D-07:** PT na raiz, EN sob `/en/...`, com **slugs traduzidos**
(`/sobre` → `/en/about`). Toda collection nasce com `localized: true` nos campos de
texto e slug por idioma.

> [!DECISÃO PENDENTE] **P-08** — o conteúdo EN existente (169 chaves) é tradução
> aprovada pelo marketing ou saída de máquina do protótipo? Se for a segunda, entra
> revisão humana antes do cutover.

⚠️ **Consequência de D-07 sobre o acervo:** as 172 chaves cobrem só navegação e
páginas institucionais. Os ~50 itens de conteúdo (cases, posts, glossário,
relatórios, ebooks, webinars, consultores, depoimentos) **não têm versão em
inglês** — o modelo prevê o campo, mas o valor não existe. Dimensionar o esforço
de tradução é parte de P-07.

## Duplicação entre hub e listagens

`Insights.tsx:76-218` mantém 10 itens que **reescrevem** conteúdo já presente em
Blog, Reports, Ebooks, Webinars e SuccessStories — com títulos, descrições e datas
diferentes para os mesmos materiais. Os contadores do hub (`Insights.tsx:57-61`:
case 4, blog 6, report 3, webinar 4, ebook 4) também não batem com as listas reais
(webinars tem 3, ebooks tem 3).

No site novo, `/insights` deve ser uma **consulta** sobre as collections, com um
campo `featured` para curadoria — nunca uma lista própria.
