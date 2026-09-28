# ATRA — memória do projeto

Migração do site institucional da ATRA para **Next.js 16 + Payload CMS 3 +
PostgreSQL**, substituindo o WordPress em `atra.com.br`.

- `legacy/` — protótipo React + Vite, no ar em análise interna. Foi o
  **gabarito** do porte; desde D-39 a suíte padrão não compara mais com ele.
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

> ⚠️ **Relaxada em 02/09/2026 (D-31), por decisão do dono da ATRA via
> G-ferrari:** melhoria de UI guiada pelo Impeccable é permitida. O que
> permanece: D-22 segue valendo — melhorar UI não autoriza mexer em conteúdo
> nem preencher pendência `P-xx`. Regravar o gabarito a cada mudança de UI
> também era limite da D-31, e **caiu com a D-39** (27/09): sem gabarito no
> aceite, não há o que regravar.

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

⚠️ **Toda consulta a collection com rascunho escreve o filtro de status.** A
Local API roda com `overrideAccess: true`, então o `access.read` que esconde
rascunho do público não vale ali:

```ts
where: { _status: { equals: 'published' } }   // e `draft: rascunho` no preview
```

Seis consultas ficaram sem isso por meses sem sintoma nenhum, porque não havia
rascunho no banco. No dia em que apareceu o primeiro, `/solucoes` passou a
listar 18 ofertas e o mega-menu junto.

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
cd legacy && docker compose up -d        # gabarito (:3001) — só para a paridade (D-39)
pnpm dev · pnpm lint · pnpm typecheck · pnpm test
pnpm typegen                             # PageProps/LayoutProps antes do tsc em árvore limpa
pnpm seed                                # idempotente (fixtures do e2e só com SEED_FIXTURES=1)
pnpm exec tsx --env-file-if-exists=.env.local scripts/wp-import/import-posts.ts   # 207 artigos
pnpm exec tsx --env-file-if-exists=.env.local scripts/wp-import/import-jobs.ts    # 7 vagas
pnpm gate                                # build de produção + suíte e2e, sem o protótipo (D-39)
pnpm gate --baseline                     # regrava o gabarito a partir do legado (liga a paridade)
pnpm gate --sem-build                    # reaproveita o .next existente
pnpm gate --rota home --viewport desktop # paridade de 1 rota em 1 viewport, para iterar
PARIDADE_COM_PROTOTIPO=1 pnpm gate       # a suíte padrão mais a paridade inteira
# miniaturas do seletor "Adicionar Seção" (public/miniaturas-de-blocos/), dentro de web/, contra o dev
# em :3000 num banco SEM SEED_FIXTURES (foto de banco reprova). `--network host` e não host.docker.internal:
# o dev do Next recusa recurso pedido por outra origem e a página não hidrata — no Docker Desktop, ligar
# "Enable host networking" em Settings → Resources → Network.
docker run --rm --network host -e NEXT_URL=http://localhost:3000 -e GERAR_MINIATURAS=1 -v "$PWD":/work -w /work mcr.microsoft.com/playwright:v1.62.1-noble npx playwright test e2e/miniaturas.spec.ts --project=desktop
pnpm exec tsx --env-file-if-exists=.env.local scripts/wp-import/gerar-redirects.ts  # 261 linhas
git push origin migracao                 # deploy: CI valida e a VPS troca sozinha, com rollback
ssh root@2.25.131.197 /opt/atra/infra/backup/testar-restore.sh   # prova o backup em base limpa
```

`pnpm gate` é o único caminho: build de produção em :3100, suíte dentro da imagem
oficial do Playwright — a mesma no macOS e no CI, para uma falha valer nos dois.
`pnpm test:e2e` é o executor cru, usado por dentro do container.

Regravar gabarito exige justificativa no PR: apaga a evidência de regressão.

⚠️ `--baseline` **não reescreve o que passou dentro da tolerância.** Uma linha a
mais no rodapé muda ~2.000px numa página de 768×10906 — menos que os 0,1% — e o
arquivo de tablet fica como estava, enquanto desktop e mobile são regravados.
Ver um subconjunto dos gabaritos mudar é o esperado, não sinal de captura velha.

## Regressão visual

⚠️ **A paridade com o protótipo saiu do CI em 27/09 (D-39).** O gabarito é de
21/08, e o site mudou de propósito desde então (D-31, passada de 13/09): ele
reprovava as 11 rotas por decisão de design, não por regressão (P-30). O que o
CI roda agora é o `pnpm gate` padrão — smoke, comportamento
(`consultores`, `diagnostico-maturidade`, `chat-lead`, `cookies`), contraste nos
dois temas, o CSV inteiro de redirects e o axe —, e o deploy espera por ele.
`visual.spec.ts`, `baseline.spec.ts`, `paridade-ds.spec.ts` e o teste do legado
no smoke **ficam no repositório**, fora pelo `testIgnore` do
`playwright.config.ts`; `PARIDADE_COM_PROTOTIPO=1` os religa, e `--baseline` e
`--rota` ligam sozinhos. ⚠️ O preço: mudança visual não intencional não é mais
pega por pixel em rota nenhuma. O resto desta seção descreve a paridade para
quem a ligar.

⚠️ **O gabarito é capturado só no tema escuro.** O legado inicia em `dark`
(`App.tsx:2575`), o porte também, e a captura nunca clica no alternador. O tema
claro existe, tem botão fixo na tela — e ficou **sem nenhum teste até a Fase 5**:
o título do herói da home era branco sobre fundo branco, invisível, e o
protótipo tem o mesmo defeito. `e2e/contraste.spec.ts` é a rede que faltava. Ele
mede os **dois** temas e reprova só o que funciona no escuro e quebra no claro —
contraste baixo igual nos dois é escolha de design (D-15), não regressão.

**Rota com gabarito no legado entra em `ROTAS_COM_GABARITO` na mesma PR que a
porta.** Três rotas foram para "done" sem isso e saíram 30% a 57% mais curtas
que o gabarito, sem ninguém ver — o smoke confere que a página responde, não que
ela está inteira. Ver a nota da Fase 3 em `docs/03-plano/tasks.md`.



Limite de **0,1%** de pixels, em 3 viewports (375/768/1280), página inteira.

**Rota que lista conteúdo real sai do gate.** `/blog` e `/carreiras` saíram na
Fase 4b: o gabarito é uma captura do protótipo com 6 artigos e 6 vagas
fictícios, e a página nova mostra os 207 e as 7 de verdade. Nenhuma captura do
protótipo volta a bater, e regravar apagaria a evidência de regressão do resto
da página.

**Rota que diverge de propósito também sai (D-34).** `/consultores` saiu em
24/09: seis mudanças pedidas pelo dono entre 21 e 23/09 não existem no
protótipo, e um gabarito que mostra o desenho antigo reprova a decisão, não a
regressão. Capturar o próprio app e chamar de gabarito foi recusado — é o
espelho que `estrategia-de-testes.md` descreve. Quem cobre a rota agora é
`e2e/consultores.spec.ts` e o smoke. ⚠️ O preço: mudança visual não intencional
nessa rota não é mais pega por ninguém.

**Rota fora do ar também sai (D-36).** `/glossario` responde 404 desde 26/09,
com a página e os termos intactos no CMS; o smoke confere o 404.

São **11 rotas** em `ROTAS_COM_GABARITO`. Com a paridade ligada, são elas que
comparam; na suíte padrão, a mesma lista alimenta o contraste e o axe.

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
| Tabela do WordPress vira parágrafo solto, com 100% do texto preservado | `editorConfigFactory.default({ config })` devolve o editor **padrão** do Lexical, não o do projeto — a `EXPERIMENTAL_TableFeature` fica de fora. Tirar a config do próprio campo (`editorConfigFactory.fromField`) |
| Build morre em "took more than 60 seconds" com muitas páginas | Não é página quebrada, é fila: o Next usa `cpus - 1` workers, e nove instâncias do Payload disputam a máquina com o Postgres. `experimental.cpus` e `staticPageGenerationTimeout` em `next.config.ts` |
| Campo `unique` recusa um valor que não está duplicado | `%` no valor é **curinga** na checagem de unicidade. Um post do WP tem `%c2%b2` no slug, e só ele falhava, só ao gravar o 2º idioma — o 1º passa porque ainda não há linha com que colidir. Normalizar antes de gravar |
| Texto do CMS sai no idioma errado e não há erro nenhum | Campo **sem** `localized: true` num global que o seed grava duas vezes (`pt` e depois `en`): a segunda escrita sobrescreve a primeira, na mesma coluna. Aconteceu com `atra-ai` desde MIG-061 |
| Redirect de uma URL para ela mesma trava a página | Com `trailingSlash: false` (padrão) o Next normaliza a barra final **antes** do `redirects()`, então `/sobre/` → `/sobre` vira `/sobre` → `/sobre` e o navegador desiste com ERR_TOO_MANY_REDIRECTS. `redirectsDoNext` descarta `source === destination` |
| `redirects()` do Next não sabe responder 410 | Ele só emite 307/308. URL que sai de propósito é servida pelo `proxy.ts`. 410 e não 404: 404 é "não achei agora" e o robô volta, 410 é "não existe mais" e ele tira do índice |
| Página inicial do WordPress vira redirect na raiz | O WP devolve `/` como `link` da página marcada como front page. Virou a linha `/,,410` — o site inteiro fora do ar. O gerador agora recusa `from === '/'` |
| Arquivo de `docs/` não encontrado em container | **Três** lugares leem `redirects.csv` e cada container monta só o que precisa: o de dev (`/app`), o do gate (`/work`) e o build nativo. `docs/` entra como `/docs:ro` nos dois composes, e quem lê procura nos dois caminhos. Montar num só e esquecer os outros pôs o serviço `web` em laço de reinício — `next.config.ts` lê o arquivo ao carregar, e ENOENT ali mata o processo |
| Gate roda inteiro e mede o build errado | Servidor de uma corrida anterior segurando :3100. O `next start` novo sai com `EADDRINUSE` e a suíte testa o build velho, sem aviso — 240 testes com falhas plausíveis. `scripts/gate.mjs` agora aborta se a porta estiver ocupada |
| Página cresce 24px ao envolver um formulário | O Tailwind 4 trocou `space-y-*` de `margin-top` em `> * + *` para **`margin-bottom` em `> :not(:last-child)`**. Campo escondido no fim do `<form>` tira do último campo real a condição de último filho, e ele ganha um espaço que não existia. Escondidos vêm **antes**. E nada de `<fieldset>` em volta: com `display: contents` ele vira o único filho e o `space-y` some inteiro |
| Texto some ao trocar para o tema claro | Cor escrita sem par: `text-white` sem `dark:` sobre fundo que clareia, ou `text-text-main` sobre painel que fica escuro. O par é `text-slate-900 dark:text-white` — o valor **escuro depois**, porque é ele que o gabarito compara |
| Bloco de fundo grafite fica branco no tema claro (letra branca em fundo branco) | O Tailwind 4 **renomeou** `bg-gradient-to-*` para `bg-linear-to-*`; o nome antigo não gera `background-image` nenhum. O herói `bg-gradient-to-br from-[#12151c]…to-[#0e1015]` ficava **transparente**, e o `text-white` caía sobre a página. Some só no claro: no escuro a página atrás já é grafite, e **o gate só captura o escuro**. Portado em massa (`from-`/`via-`/`to-` seguem iguais; só a direção mudou). Idem `.text-gradient`: `bg-clip-text` clipava gradiente inexistente e o texto sumia |
| Auditoria de contraste acusa centenas de problemas | Dois motivos, os dois já pagos: o Tailwind 4 emite `oklab(...)` para cor com opacidade e regex de números lê errado (use canvas para normalizar); e `transition-colors duration-500` faz `getComputedStyle` devolver a cor **em movimento** — espere a transição antes de medir |
| Rascunho aparece no site | A Local API roda com **`overrideAccess: true`**: o `access.read` da collection, que filtra `_status` para o público, **não se aplica** a consulta de página. Toda listagem precisa do `where: { _status: { equals: 'published' } }` escrito. Ficou invisível até existir o primeiro rascunho |
| `unique` recusa e o erro aponta para um bloco que está preenchido | Atualizar documento **publicado** revalida os obrigatórios **do idioma gravado**. Mandar só nome e slug para `en` faz o Payload recusar por "Título inválido" nos blocos, que estão vazios naquele idioma. Reenviar o layout com `casarIds` |
| Rota `/en/<coleção>/<slug>` dá 404 com `fallback: true` ligado | O fallback resolve a **leitura**, não a **consulta**: `where: { slug: { equals } }` bate na coluna do locale, que está nula. Gravar o slug nos dois idiomas |
| Post importado é criado e apagado na mesma corrida | O hook de `slugField` normaliza o slug, e um post do WP tem `%c2%b2` no dele. Comparar por slug para achar o que remover perde exatamente esse; comparar pelos **ids que a importação tocou** |
| Overlay acusa `key` faltando numa "lista" que não existe | Elemento criado num Server Component e passado como **prop** para componente de cliente (a `Casca` recebe cabeçalho, rodapé e alternador assim). Ele atravessa o RSC com `_store.validated` em 0, o `jsxs` não consegue marcá-lo, e o reconciliador trata como lista dinâmica. Chave constante resolve. React avisa **uma vez por pai**: keyar só o primeiro muda o aviso de alvo |
| Deploy publica HTML velho com o log dizendo "563 páginas geradas" | O BuildKit reaproveita a camada de `COPY --from=build` do runner mesmo com o estágio build refeito — `--no-cache-filter build` não invalida quem copia dele. Invalidar **os dois**: `--no-cache-filter build,runner` |
| Caddy entra em laço de reinício com "illegal base64 data" após um script rodar | `source .env.prod` num script bash: o hash bcrypt guarda `$$` (escape do compose) e o bash expande para o **PID**; o compose dá precedência ao ambiente do shell sobre o `--env-file`. Nunca fazer source do arquivo — extrair variável por texto |
| Teste de restore passa com banco vazio | `pg_restore --jobs` por stdin **aborta sem restaurar nada** (paralelismo exige arquivo posicionável) e o veredito morria mudo: `docker compose exec -T` dentro de `while read` come o stdin do laço, e `[ -z ] && continue` devolve 1 sob `set -e`. Três armadilhas no mesmo script |
| Seed sobe as mesmas imagens de novo a cada corrida | A collection `Media` converte todo upload para **WebP** (`formatOptions`), então o `.jpg` que subiu vira `.webp` no `filename` e um `where: { filename: { equals: nome } }` nunca casa. Deduplicar pelo nome **sem extensão**, com `contains` |
| CI morre em "pull access denied for minio/minio" antes de rodar um teste | O MinIO tirou as imagens públicas do Docker Hub e do quay.io (set/2026). Dev e CI usam o fork `pgsty/minio`, preso por digest, que já traz o `mc`. Produção ainda depende do cache da VPS — P-32 |
| Migração de dados roda verde e a página continua como antes | Em **banco novo** o `migrate` roda antes de existir o conteúdo, a trava da migração não acha a página e pula — e a migração fica marcada como feita. `import-solutions.ts` chama as duas montagens (Alocação e as 11) no fim por isso, e `import-segments.ts` a dos 8 segmentos. E os importadores só reescrevem página ainda no formato deles (ou no do seed de teste, só o herói): rodado de novo num banco local em 27/09, ele tinha apagado a Alocação remontada |
| Seed ou build do CI quebra em `relation "..." does not exist` com o passo de migração verde | O CLI do Payload carrega o `tsx` num worker e dispara com `void start()`: quando o carregamento empaca, o Node sai com **0 e sem imprimir nada**. Aconteceu duas vezes em 28/09. `pnpm migrate` (`web/scripts/migrar.mjs`) só aceita sucesso se o Payload disser "Done." ou "No migrations to run.", e tenta até 3 vezes; CI, imagem `migrator` e compose de produção usam ele. `pnpm payload migrate` direto continua valendo no dev, mas não prova nada |
| Página funciona no dev e dá 404 na homologação | O conteúdo dela nasce de **seed**, e o deploy roda migração, não seed. Foi o caso do carrossel da home e da página do RC18 (28/09): o banner e o botão de Bancos levavam a 404. Conteúdo novo que precisa chegar a um ambiente que já existe vem por **migração de dados com trava** (cria só se não existir, não toca no que foi editado no admin), com o texto num módulo que o seed também importa — ver `scripts/seed/rc18-conteudo.ts` |
| Imagem do legado sai maior que a do app novo no gabarito | `stabilize()` troca mídia remota por um PNG 1×1, e a mídia **local** do legado (`/src/assets/images/`) precisa entrar na mesma lista. Só para requisição de imagem: o Vite serve o *import de módulo* pelo mesmo caminho, e stubar aquilo esvazia a página |

## Estado

Fases 1, 2, 3 e 4a concluídas: fundação, fatia vertical de cases, casca do site,
Live Preview, as 20 rotas do protótipo (12 sob o gate visual ao fechar a Fase
3) e o conteúdo do protótipo dentro do CMS.

Desde a 4a **nada do site vem do repositório nem do WordPress**: clientes,
depoimentos, contato, rodapé e o logo saíram de arrays e módulos escritos à mão
e viraram collection, global e mídia. Se aparecer uma lista de conteúdo dentro
de `lib/` ou de um bloco, é resíduo — o lugar dela é o CMS.

A 4b importou o WordPress: **207 artigos** com corpo, imagem e links internos
reescritos, **287 imagens** e as **7 vagas** (não 6 — uma abriu depois do
levantamento). A 4c trouxe as **8 verticais** para `/segmentos` (remontadas em
27/09 no padrão das soluções por `20260927_235930_segmentos_do_wordpress`, com
o texto literal em `src/migrations/arquivos/segmentos-wp/`) e a página legal
para `/politicas-e-termos`, e o `redirects.csv` fechou em **261 linhas**, com a
geração reprovando se alguma URL do WordPress ficar sem destino.

**MIG-084** (P-27) segue em pendência — o WP tem 1 categoria e 0 tags, não há
taxonomia para mapear, e classificar não é migrar. **MIG-093** foi destravada:
P-16 foi respondida em 21/08 com **publicar**, as 12 soluções do WP entraram
publicadas e o site tem **18 ofertas** no menu e em `/solucoes`. ⚠️ Num banco
local elas só ganham conteúdo real com
`scripts/wp-import/import-solutions.ts`: a fixture do seed escreve "Texto de
exemplo" nelas, e foi isso — não rascunho vazando — que a crítica do Impeccable
de 10/09 viu no mega-menu. Desde 27/09 as 12 do WordPress saem do importador
**remontadas** no padrão das soluções desenhadas (cartões, imagem no herói,
parceiros, formulário): a Alocação pela migração de 26/09 e as outras 11 por
`20260927_235900_solucoes_do_wordpress`, com o texto literal em
`src/migrations/arquivos/solucoes-wp/`.

⚠️ **Conteúdo de verdade não vem do `pnpm seed`.** Os artigos e as vagas entram
por `scripts/wp-import/`; o seed só cria fixtures de teste, e agora **exige
`SEED_FIXTURES=1`** — que só o CI liga. Sem isso, doze itens inventados iriam ao
ar assinados pela ATRA no cutover.

A mesma chave guarda as **imagens do protótipo** (D-27). O legado ilustra 35
pontos com foto do Unsplash e do `picsum.photos`; o site novo põe marcador em
todos — `capa-pendente` nas capas, monograma nos 4 retratos de depoimento. Com
`SEED_FIXTURES=1` a foto do gabarito entra no lugar — é o que torna a revisão
interna legível sem pôr foto de banco no ar. Os arquivos ficam em
`legacy/public/imagens/`, com `PROVENIENCIA.md` ao lado; o mapa ponto→arquivo é
`scripts/seed/imagens-do-prototipo.ts`, e a URL de origem vai para o campo
`credit` da mídia.

Desde 24/08 o site roda **em homologação numa VPS** (`srv1927832.hstgr.cloud`,
Hostinger KVM2, atrás de senha e `noindex`), com o conteúdo real completo.
**`git push` na `migracao` é o deploy**: CI valida (lint, types, gate) e a VPS
rebuilda, migra e troca com healthcheck e rollback — `infra/deploy/deploy.sh` e
o job `deploy` do `ci.yml`. Backup diário com restore **verificado por
contagem** (`infra/backup/`). E **publicar no CMS atualiza o site sem deploy**
(MIG-143, `hooks/revalidar.ts`): o hook chama `revalidatePath` em processo —
a nota antiga de "estático não muda depois do seed" segue valendo só para o
`gate --sem-build`.

O **e2e do CI foi religado em 27/09 (D-39)**, depois de desligado desde 26/08
por decisão do Leonardo, para iterar em homologação. Voltou **sem** a paridade
com o protótipo, e o deploy voltou a esperar por ele (`needs: [verify, e2e]`).
A primeira execução verde na `migracao` é o que fecha o pré-requisito do
runbook de cutover.

**D-29 (03/09, MIG-148–150)** ligou os leads ao **RD Station CRM**: hook
`afterChange` em `form-submissions` (`hooks/sincronizar-crm.ts` + `lib/crm.ts`)
sincroniza contato+negociação para os kinds comerciais — RH fica fora; sem
`RDSTATION_CRM_TOKEN` é inerte e `crm.syncedAt` vazio denuncia no admin;
qualquer edição do doc não sincronizado tenta de novo. E o chat ganhou convite
de lead inline (kind `chat-lead`, `actions/chat-lead.ts`, cartão em
`chat/convite-lead.tsx`): aparece após N mensagens **do visitante**, grava
`chatContext` só com o que ele digitou (P-20 parcial), e são **três chaves**
para ligar — `ENABLE_CHAT_LEAD` (env), toggle no global `atra-ai`, e
`consentNotice` preenchido (nasce vazio até P-14; produção espera P-14). O
estado vazio de `/chat` não muda: o gabarito do gate segue válido.

**D-30 (03/09, MIG-151–156)** é o consentimento de cookies: 3 categorias
(essencial isenta; **estatística** = GA4/GTM com Consent Mode v2, dupla chave
id do container + aceite; **marketing** = a captura de UTM, reclassificada
para opt-in — a UTM da chegada espera em memória e só persiste com aceite —,
e a Lusha desde a D-40). **D-40 (27/09)** tirou os ids do ambiente: GTM e
Lusha moram no global `tracking` (Sistema → Rastreamento), só admin edita,
formato fechado, e o consentimento subiu para a versão 2.
Cookie `atra-consent` versionado guarda a escolha; ilhas conversam por
CustomEvent (`atra:consentimento`). Vídeo de webinar é click-to-load, fora do
banner. Mesmo gate de código de D-29: `bannerMessage` (global `cookie-consent`)
nasce vazio até P-14, e sem ele nada renderiza — gabarito do gate intacto.

A revisão crítica de 25/08 (MIG-140–147) fechou: IP confiável nos limites
(`lib/ip.ts` — nunca ler `x-forwarded-for` primeiro), tetos do chat
(`lib/chat.ts`), campos do formulário cortados, mídia sem SVG, cabeçalhos de
segurança, e o upsert de mídia dos seeds unificado em `scripts/seed/midia.ts`
(com a opção `regravar` que preserva a semântica de MIG-071).

Roadmap em `docs/03-plano/`; backlog em `tasks.md`, uma task por PR.
