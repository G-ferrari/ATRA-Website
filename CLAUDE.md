# ATRA — memória do projeto

Migração do site institucional da ATRA para **Next.js 16 + Payload CMS 3 +
PostgreSQL**, substituindo o WordPress em `atra.com.br`.

- `legacy/` — protótipo React + Vite, no ar em análise interna. É o **gabarito**.
- `web/` — o site novo.
- `docs/` — a especificação. Toda decisão vive em
  [`docs/00-contexto/decisoes.md`](docs/00-contexto/decisoes.md) como `D-xx`;
  toda pendência como `P-xx`.

Antes de escrever código de Next, ler `web/AGENTS.md` e
`web/node_modules/next/dist/docs/` — esta versão tem mudanças que contradizem o
que a maioria da documentação diz.

## Idioma

**Documentação, comentários e mensagens ao usuário em português.** Código,
identificadores, campos do Payload e mensagens de commit em inglês.

Comentário explica **por quê**, não o quê. O padrão do repositório é registrar a
armadilha que motivou a linha:

```ts
// ⚠️ Não adicionar `axes: ['wdth']`. O site não usa largura condensada, e pedir
// o eixo faz o Google servir outro corte: o itálico fica 3,2% mais largo.
```

## As regras que não se quebram

### 1. Porte fiel, inclusive dos defeitos (D-15)

O site novo tem que sair **igual** ao legado, pixel a pixel. Isso vale para
decoração e para bugs: o herói mostra `"Banco ABC • "` com marcador solto porque
o legado monta `${client} • ${date}` sem ter `date`. Foi portado assim, com
comentário, e registrado em `docs/01-descoberta/debito-tecnico.md`.

**Melhoria não entra junto com migração.** Se entrar, um aceite visual reprovado
não distingue erro de porte de escolha deliberada. Corolário (D-25): não
introduzir propriedade tipográfica que o legado não tem — ligar `antialiased`
movia a rasterização de todo glifo do site.

### 2. Decisão de conteúdo é do marketing (D-22)

Consolidar vocabulário, reescrever texto, escolher quais categorias aparecem:
nada disso é decisão de quem migra. O seed espelha o legado; a ferramenta para
mudar fica no CMS.

### 3. Componente não conhece o CMS

`web/src/types/content.ts` define tipos de **apresentação**; `lib/mappers/`
converte. Nenhum componente importa `@/payload-types`.

```ts
// mapper: o único lugar que sabe o formato do Payload
export function toCaseCard(doc: Case): CaseCard {
  return { slug: doc.slug, image: toImage(doc.heroImage, 'cases.heroImage'), … }
}
```

Trocar o nome de um campo quebra um mapper, não oito componentes.

Relacionamento não populado **derruba com a instrução do conserto** — imagem
quebrada em silêncio é pior. Mas campo vazio é outra coisa: o Payload não valida
obrigatórios em rascunho, então `ConteudoIncompleto` separa os dois casos, e o
preview mostra o que falta em vez de estourar.

### 4. Nenhuma página busca dado dentro de componente

Server Component resolve o dado e monta props. A parte interativa vira ilha
cliente que recebe tudo pronto — `cases-de-sucesso/lista-de-cases.tsx` é o
modelo.

### 5. Schema muda por migração versionada (D-21)

`push: false`. Toda mudança de campo:

```bash
pnpm payload generate:types
pnpm payload migrate:create <nome>
pnpm payload migrate
```

Esquecer isso produz `column ... does not exist` em runtime, com o servidor de
pé — já aconteceu. `pnpm dev` **não** sincroniza schema.

### 6. URL nunca é escrita à mão

`lib/routes.ts` é a fonte. PT na raiz, EN em `/en`, com **slugs traduzidos**
(D-07); `proxy.ts` faz a ponte. Use `hrefDe('cases', locale, slug)`.

### 7. Nenhum segredo com prefixo `NEXT_PUBLIC_`

O prefixo injeta a variável no bundle do cliente. O CI reprova se `NEXT_PUBLIC_`
aparecer junto de `KEY`, `SECRET`, `TOKEN` ou `PASSWORD`. O `define` em
`legacy/vite.config.ts:12` **nunca** é portado.

### 8. Pixel decide, não a API do browser

Quando inspeção de estilo e captura discordam, a captura ganha. Já houve
divergência relatada por `getComputedStyle` que a imagem desmentia.

## Comandos

```bash
docker compose up -d                     # postgres + minio + web (:3000)
cd legacy && docker compose up -d        # gabarito (:3001)
pnpm dev · pnpm lint · pnpm typecheck · pnpm test
pnpm typegen                             # PageProps/LayoutProps antes do tsc em árvore limpa
pnpm seed                                # idempotente
pnpm gate                                # build de produção + comparação visual
pnpm gate --baseline                     # regrava o gabarito a partir do legado
pnpm gate --sem-build                    # reaproveita o .next existente
pnpm gate --rota home --viewport desktop # 1 teste em vez de 207, para iterar
```

`pnpm gate` é o único caminho: build de produção em :3100, suíte dentro da imagem
oficial do Playwright — a mesma no macOS e no CI, para um gabarito só valer nos
dois. `pnpm test:e2e` é o executor cru, usado por dentro do container.

Regravar gabarito exige justificativa no PR: apaga a evidência de regressão.

## Regressão visual

**Rota com gabarito no legado entra em `ROTAS_COM_GABARITO` na mesma PR que a
porta.** Três rotas foram para "done" sem isso e saíram 30% a 57% mais curtas
que o gabarito, sem ninguém ver — o smoke confere que a página responde, não que
ela está inteira. Ver a nota da Fase 3 em `docs/03-plano/tasks.md`.



Limite de **0,1%** de pixels, em 3 viewports (375/768/1280), página inteira.

- Imagens entram **mascaradas**: o legado serve o JPEG original e o app novo
  serve variante reencodada pelo `next/image`. Divergem por projeto, não por
  regressão.
- `?e2e=1` congela carrossel e rotação nos dois apps (`lib/e2e.ts` de cada lado).
- `stabilize()` troca o `IntersectionObserver` por um que reporta visível na
  hora — **menos para âncoras**. Os cards animam a entrada com `whileInView`, e
  se o observer não disparar antes da captura o card fica 20px abaixo; era uma
  corrida que aparecia e sumia sem mudança de código. As âncoras ficam de fora
  porque o router do Next usa o mesmo observer para prefetch, e liberar todas
  trava o `networkidle`.
- A fonte do legado é servida de `legacy/public/fonts/` — os mesmos `.woff2` que
  o next/font baixou. Enquanto vinha do Google em tempo de execução, o legado
  renderizava 0,6% mais largo dentro do Linux.

## Armadilhas já pagas

| Sintoma | Causa |
|---|---|
| `Cannot find name 'PageProps'` | Tipos gerados pelo Next; rodar `pnpm typegen` |
| `Cannot find module '.../page.js'` após mover rota | `.next/types` velho → `rm -rf .next` |
| Admin sem estilo | Turbopack não processa SCSS de `node_modules` → `import '@payloadcms/next/css'` |
| Campo de rich text some | `importMap` desatualizado → `pnpm payload generate:importmap` |
| Servidor pendura minutos | `push: true` esperando resposta num prompt interativo |
| CSS de teste sem efeito | `<style>` anexado em `documentElement` some quando o parser monta `head` |
| `pnpm lint` acusa milhares de erros | Está lintando `playwright-report/` |
| Build do CI falha em `select from "cases"` | Postgres vazio: falta `pnpm payload migrate` |
| Seção sai alguns px mais alta e o `leading-*` "não pega" | `text-xl` define tamanho **e** entrelinha, então o `cn()` (tailwind-merge) descarta um `leading-tight` que venha **antes** dele. Pôr o tamanho primeiro. O legado sofre do mesmo mal ao contrário: em `SolutionAI.tsx:182` o `flex` anula o `hidden md:block`, e o menu fixo aparece no mobile |
| Texto localizado em branco depois de semear o 2º idioma | Layout reenviado sem os ids **de todos os níveis** — `items`, `metrics`, `bullets` também têm id. Usar `casarIds` (`scripts/seed/ids.ts`); já escondeu 800px em /sobre e 742px na página de solução |
| Consulta a uma collection com muitos blocos leva dezenas de segundos | O adapter Postgres faz um `LEFT JOIN LATERAL` por tipo de bloco, mesmo com `depth: 0`. Índice que só mostra cartão precisa de `select` |
| Gerador de migração trava sem imprimir nada | Remoção de coluna vira pergunta interativa do drizzle, que não roda sem TTY. Preferir migração aditiva; refundir as não commitadas quando não der |
| Campo novo aparece numa tabela de bloco que você não mexeu | Edição por `replace` de trecho: vários blocos têm campos com o mesmo rótulo (`Estilo`, `Título`), e o primeiro casamento não é o bloco que você quis. Confira o `ALTER TABLE` da migração **antes** de aplicar; se já aplicou, `pnpm payload migrate:down` desfaz só a última |
| Contador de números fica em `0` com `?e2e=1` | Só no servidor de dev: `congelado()` lê `window`, o HTML do servidor sai com `0` e a hidratação de desenvolvimento não reescreve o texto. Em produção — que é o que o `pnpm gate` compara — o número aparece certo. Não perseguir |
| Teste de `hover` fica repetindo e falhando dentro de um `toPass` | `hover()` só move o ponteiro: mover para onde ele **já está** não emite `mouseenter`, e o laço gasta o tempo todo repetindo um gesto que o browser ignora. Passar por outro elemento antes |
| Página estática não muda depois de mexer no seed | A home e as outras rotas de conteúdo são pré-renderizadas no build. Com `pnpm gate --sem-build` o servidor devolve o HTML antigo, e a comparação repete o **mesmo número de pixels** da corrida anterior. Depois de seed, gate inteiro |
| Conferir uma rota custa 9 minutos e a máquina | `pnpm gate --rota home --viewport desktop` roda 1 teste em vez de 207. O container do Playwright entra com `--cpus=4`. O gate completo fica para fechar a task |
| Faixa do carrossel divergindo inteira no aceite | `overflow-x-auto` guarda `scrollLeft` depois da rolagem vertical. `settle()` zera a rolagem horizontal de todo trilho — antes disso o gabarito saía deslocado 24px, sozinho respondendo por 92% dos pixels diferentes da home |
| Elemento com imagem some ou muda de altura só no aceite | `stabilize()` troca imagem por um PNG 1×1. Onde a caixa **não** é fixa a altura vira o quadrado esticado: um `<img>` no fluxo com `w-full h-full` dentro de `h-auto min-h-[400px]` foi a 452px no legado e ficou em 400 no porte com `next/image fill`. Copiar o markup do gabarito, não só as classes |
| Canvas do herói nunca repete entre duas capturas | A captura de página inteira **redimensiona a janela**; o `resize` recria as partículas e o gerador determinístico continua de onde parou, então cada recriação sorteia outro campo. `reiniciarAleatorio()` antes de repovoar, nos dois apps |
| Imagem do legado sai maior que a do app novo no gabarito | `stabilize()` troca mídia remota por um PNG 1×1, e a mídia **local** do legado (`/src/assets/images/`) precisa entrar na mesma lista. Só para requisição de imagem: o Vite serve o *import de módulo* pelo mesmo caminho, e stubar aquilo esvazia a página |

## Estado

Fases 1, 2, 3 e 4a concluídas: fundação, fatia vertical de cases, casca do site,
Live Preview, as 20 rotas do protótipo (15 sob o gate visual) e o conteúdo do
protótipo dentro do CMS.

Desde a 4a **nada do site vem do repositório nem do WordPress**: clientes,
depoimentos, contato, rodapé e o logo saíram de arrays e módulos escritos à mão
e viraram collection, global e mídia. Se aparecer uma lista de conteúdo dentro
de `lib/` ou de um bloco, é resíduo — o lugar dela é o CMS.

A seguir vem a 4b (importar os 207 posts do WordPress), que depende de repactuar
**P-27**: MIG-084 mapeia categorias e o WP não tem taxonomia para mapear.

Roadmap em `docs/03-plano/`; backlog em `tasks.md`, uma task por PR.
