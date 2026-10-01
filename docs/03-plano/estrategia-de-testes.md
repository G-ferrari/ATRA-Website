---
status: rascunho
atualizado_em: 2026-09-27
depende_de: [roadmap.md, ../00-contexto/decisoes.md]
---

# Estratégia de testes

O projeto porta ~12.000 linhas de UI escritas por IA para outra stack, com código
gerado por IA. A pergunta que o teste precisa responder não é "esta função está
correta?", e sim **"esta página continua igual à que está no ar?"**.

Isso inverte a pirâmide de testes usual — e é deliberado.

## Prioridades

### 1. Regressão visual (Playwright) — prioridade máxima

> ⚠️ **Fora do CI desde 27/09/2026 (D-39).** Esta prioridade valia enquanto o
> critério de aceite era o porte fiel. Com a D-31 o site passou a mudar de
> propósito, e o gabarito de 21/08 reprovava a decisão de design, não a
> regressão (P-30). A paridade continua no repositório, ligada por
> `PARIDADE_COM_PROTOTIPO=1`; o que roda no CI é o smoke, o comportamento, o
> contraste, os redirects e o axe. O texto abaixo descreve a paridade como foi
> montada.

Compara cada rota do site novo com a mesma rota do legado.

**Por que é o teste mais valioso aqui:** o critério de aceite de cada rota portada
é paridade visual (princípio 2 do plano). Um teste que verifica exatamente o
critério de aceite é o teste certo. Nenhum teste unitário detectaria um `gap-4`
virando `gap-6`, e é justamente esse tipo de deriva que 20 portes seguidos
produzem.

```ts
test('cases-de-sucesso mantém paridade com o legado', async ({ page }) => {
  await page.goto(`${LEGACY_URL}/cases-de-sucesso`)
  const before = await stableScreenshot(page)
  await page.goto(`${NEXT_URL}/cases-de-sucesso`)
  const after = await stableScreenshot(page)
  expect(after).toMatchSnapshot(before, { maxDiffPixelRatio: 0.001 })
})
```

**Estabilização — sem isto o teste vira ruído e é ignorado em duas semanas:**

| Fonte de instabilidade | Tratamento |
|---|---|
| Animações de entrada (`motion`, 24 arquivos) | `prefers-reduced-motion: reduce` no contexto do browser + `animations: 'disabled'` na captura |
| Carrosséis com auto-rotação (`App.tsx:1473`, `:1674`, `:1952`) | Congelar em `index 0` por flag de teste (`?e2e=1`) |
| Contadores animados (`App.tsx:1095`) | Mesma flag: renderiza o valor final direto |
| Imagens remotas (39 do Unsplash) | Interceptar e servir um PNG fixo |
| Fontes | Aguardar `document.fonts.ready`. Legado e app novo usam a **mesma build** da Mona Sans (D-16) — builds diferentes divergem até 2,3% em largura |
| Data/hora visível | Congelar relógio com `page.clock` |

Viewports: 375 (mobile), 768 (tablet), 1280 (desktop). Temas: claro e escuro — o
site tem toggle (`App.tsx:2639`), e metade dos bugs de tema só aparecem em um deles.

**Limite honesto:** a paridade só é comparável nas **17 rotas com equivalente no
legado**. As rotas novas (detalhes, `/contato`, `/segmentos`, `/solucoes/[slug]`)
não têm baseline — para elas o critério é funcional.

### 2. Smoke test de status — barato e pega o pior

Toda rota, nos dois locales, deve responder 200; toda rota inválida, 404.

```ts
for (const path of ALL_ROUTES) {
  for (const locale of ['', '/en']) {
    test(`${locale}${path} responde 200`, async ({ request }) => {
      expect((await request.get(`${locale}${path}`)).status()).toBe(200)
    })
  }
}
```

Roda em cada PR e depois do deploy. É o teste que pega "rota quebrou porque
alguém renomeou um slug" — o modo de falha mais provável numa fábrica de 20 rotas.

Inclui a validação do `redirects.csv`: cada `from` responde 301 e cada `to`
responde 200. Com 207 posts redirecionados, isso é o que impede perder SEO em
silêncio.

### 3. E2E dos formulários — onde o dinheiro está

Os formulários são a única coisa no site que gera receita, e hoje **nenhum
funciona** (débito 🔴). Cobrir:

- Contato: preenche → envia → grava em `form-submissions` → dispara e-mail
- Validação: e-mail inválido e consentimento não marcado bloqueiam
- Anti-spam: honeypot preenchido é descartado silenciosamente
- Candidatura: upload de PDF chega ao storage privado
- Download gated: formulário libera URL assinada

Contra um Resend em modo de teste, verificando a chamada — não o inbox.

### 4. Teste unitário — prioridade baixa, com exceções

**Por que baixa para componente de marketing:** um card de case é markup com
props. Um teste que renderiza e verifica se o título aparece testa o React, não a
lógica do produto — e quebra a cada ajuste de layout, gerando manutenção sem
detectar defeito. O que realmente protege esse tipo de componente é a regressão
visual.

**Onde unitário é obrigatório**, porque há lógica de verdade e o custo de errar é
alto:

| Alvo | Por quê |
|---|---|
| `lib/mappers/*` | Transformam dado do CMS; relationship não populado é o bug mais provável |
| Conversor **HTML → Lexical** | 207 posts dependem dele. Fixture **escrita à mão** que reproduz as formas do corpus, e não posts baixados: `.sample/` e `.cache/` estão fora do git, e teste que depende de rede falha por motivo errado. O corpus de verdade é medido por `check-convert.ts`, que é outra coisa |
| Escolha do texto alternativo e do nome de arquivo na importação de mídia | 17 dos 287 arquivos do WP têm nome-base repetido, e 4 se chamam `banner-site-blog-1`. Procurar por nome importa uma imagem no lugar de outra, calado |
| `robotsDeCorpo` (D-08) | Era provada no e2e pelas fixtures sem corpo, que a Fase 4b levou embora — sem banco, a regra continua testável |
| Geração e parsing do `redirects.csv` | Erro aqui = SEO perdido silenciosamente |
| Parser de UI generativa do chat (`Chat.tsx:17-57`) | Regex sobre saída de LLM; frágil por natureza |
| Rate limit e budget guard | Segurança e custo |
| Resolução de locale e slug | Base do roteamento bilíngue |

## Pipeline de CI

```yaml
# Em toda PR
lint          → eslint + prettier
typecheck     → tsc --noEmit + payload generate:types (falha se desatualizado)
unit          → vitest run   # src/**/*.test.ts e scripts/**/*.test.ts
build         → next build
e2e-smoke     → status 200/404 em todas as rotas
visual        → só as rotas tocadas na PR (por path filter)
a11y          → axe, reportando, sem reprovar (D-13)

# Em merge para main
visual-full   → todas as rotas, 3 viewports × 2 temas
redirects     → valida o CSV inteiro contra staging
lighthouse    → 5 rotas principais, orçamento de performance
```

Regressão visual completa só no merge: 20 rotas × 3 viewports × 2 temas = 120
capturas, lento demais para rodar a cada push.

**Atualizar snapshot exige justificativa no PR.** Sem essa regra, `--update-snapshots`
vira reflexo e o teste deixa de significar qualquer coisa.

## O que não vamos testar

| Item | Por quê |
|---|---|
| Admin do Payload | Software de terceiro, testado pelo fornecedor |
| Componentes decorativos (`Tech*`, `Decorations`) | Puro enfeite; regressão visual já cobre |
| Conteúdo do CMS | Dado, não código. Editor errado é problema editorial |
| Cobertura mínima percentual | Métrica que incentiva teste inútil. O critério é a lista acima estar coberta |

## Ambientes

| Suíte | Contra o quê |
|---|---|
| unit | — |
| smoke, e2e | build local no CI, com Postgres efêmero e seed determinístico |
| visual | build local **+ legado servido em paralelo** (`cd legacy && docker compose up`) |
| redirects, lighthouse | staging com dado de produção |

### Por que o baseline é o legado local, e não `atra-website.ai.studio`

O build publicado é tentador como gabarito — está no ar e tem as imagens íntegras.
Mesmo assim o baseline é o **legado local**, por dois motivos:

1. **Podemos precisar alterá-lo** para estabilizar capturas (congelar carrossel e
   contador por flag de teste); no build do AI Studio não temos esse acesso.
2. **Ele muda sem aviso.** O protótipo está em análise interna: qualquer edição no
   AI Studio republica o site e quebraria todos os snapshots sem que ninguém tenha
   tocado no nosso código.

Em compensação, o legado local precisa das **imagens recuperadas antes do
baseline** (MIG-070, concluída) — senão congelamos capturas com duas imagens
quebradas que não existem no site real.

O legado precisa continuar rodando durante toda a Fase 3 — é o gabarito. Só sai do
repositório na Fase 8, depois do cutover.

## O que a montagem do harness revelou (MIG-011)

Medido, não suposto:

| Achado | Consequência |
|---|---|
| **O hero é a única fonte de instabilidade da home legada.** Ele gira a palavra do título por `setInterval` (`aether-flow-hero.tsx:13`) e desenha partículas animadas — duas capturas seguidas saíam com texto diferente | Com o hero mascarado, duas capturas ficam **byte-idênticas**. Os três carrosséis, os contadores e o resto da página já estabilizam com o que `stabilize()` faz |
| **`clock.install()` + `pauseAt()` não serve.** Congelar os timers da página trava o React: efeitos que dependem de `setTimeout` nunca resolvem e a suíte estoura em 30s | Usar `clock.setFixedTime()`, que falsifica só `Date`. Congelar rotação e carrossel tem que ser no app, por flag |
| **Ordem importa em `settle()`.** Imagem com `loading="lazy"` fora do viewport nunca completa, e `decode()` nela fica pendente para sempre | Rolar a página **antes** de decodificar, e com teto de tempo |
| **`reducedMotion` não é opção de topo do `use`** nesta versão do Playwright — vai em `contextOptions` | O typecheck pegou; os testes passavam silenciosamente sem reduzir animação nenhuma. É argumento a favor de manter typecheck no CI |

### Decisão pendente para MIG-030

Máscara ou flag no app? A máscara funciona hoje e não toca no legado, mas **cega
justamente a primeira dobra** — a parte mais vista de todas. Congelar o hero em
`?e2e=1` nos dois apps compara a página inteira, ao custo de uma alteração de
teste no código legado.

Recomendação: **flag**. A primeira dobra é onde uma regressão dói mais, e o
`estabilizar por flag` já estava previsto nesta estratégia para carrosséis.

## Ferramenta de verificação: use o Playwright, não o console do browser

Durante MIG-024/025, a comparação de estilo computado feita pelo console do
browser reportou divergência entre o app novo e o legado — enquanto a captura de
tela mostrava os dois **idênticos**. O mesmo elemento aparecia escuro no pixel e
branco no `getComputedStyle`; um elemento recém-criado com as mesmas classes, no
mesmo pai, computava certo. Outros sinais de contexto obsoleto apareceram junto
(`window.scrollTo` sem efeito, `scrollY` preso em 0).

Refeita com Playwright, a comparação passou: os estilos batem exatamente.

**Regra:** medição que decide aceite de paridade roda no Playwright. O console do
browser serve para explorar, não para concluir. Quando pixel e API discordarem,
**o pixel manda** — e a dúvida se resolve na ferramenta que roda o teste de
verdade.

`e2e/paridade-ds.spec.ts` guarda essa comparação e cresce a cada componente
portado.

## O gabarito na prática (MIG-030)

Fluxo em dois passos, e o motivo de serem dois:

```bash
pnpm baseline      # captura o LEGADO e grava em e2e/gabarito/
pnpm test:e2e      # compara o app NOVO contra o gabarito
```

O gabarito só é regravado por `pnpm baseline` — uma execução comum nunca o
sobrescreve. Sem essa separação, `--update-snapshots` transformaria qualquer
regressão em "novo normal" silenciosamente.

### Congelamento no legado, por flag

`legacy/src/lib/e2e.ts` expõe `congelado()` e `aleatorio()`. Com `?e2e=1` na URL:

| O quê | Onde | Tratamento |
|---|---|---|
| Rotação da palavra do hero | `aether-flow-hero.tsx:111` | não inicia |
| Carrossel de features, cases e depoimentos | `App.tsx:1475`, `:1677`, `:1956` | ficam no índice 0 |
| Carrossel do `FeaturedHero` | `FeaturedHero.tsx:30` | fica no primeiro destaque |
| Carrossel de logos | `logo-clouds.tsx:216` | fica no primeiro |
| Partículas do canvas | `aether-flow-hero.tsx` | posição por gerador determinístico, velocidade zero |
| Contadores animados | `App.tsx:1105` | já respeitam `prefers-reduced-motion`, que o Playwright ativa |

Sem a flag, nada muda para o visitante — é alteração de teste, não de produto.

⚠️ **Pendência para a home (MIG-059):** mesmo com posição determinística e
velocidade zero, o canvas do hero ainda difere entre navegações — o `<canvas>`
aparece repintado em uma captura e vazio em outra, conforme o momento em que o
`IntersectionObserver` e o resize disparam. Não bloqueia as rotas de case (não
têm hero), mas precisa ser resolvido antes de comparar a home. Alternativa se
persistir: mascarar só o canvas, mantendo o resto da primeira dobra comparável.

### Tolerância: ratio, não bytes

A primeira versão do teste de determinismo exigia capturas **byte-idênticas** e
reprovava com 0,08% de diferença — variação de compressão PNG, invisível. O
critério certo é `maxDiffPixelRatio`, e a estabilização embutida do
`toHaveScreenshot` (repete até dois quadros saírem iguais) resolve o resto.

## O que MIG-030 mudou na regressão visual

Três ajustes vieram de fechar a primeira comparação de verdade. Todos reduzem
o escopo do teste — e cada um existe porque o escopo maior media a coisa errada.

### 1. ~~Comparação recortada no `<main>`~~ — resolvido em MIG-034

Enquanto o app novo não tinha cabeçalho e rodapé, a comparação era recortada no
`<main>`: a página inteira media a ausência da moldura, não a fidelidade da rota
— eram 394px de diferença no desktop, iguais nas duas rotas.

**MIG-034 portou a casca e a comparação voltou para `fullPage: true`**, com o
gabarito regravado. O menu do legado é `position: fixed` e era pintado por cima
do `<main>`, entrando na captura recortada mesmo estando fora dele; com a página
inteira isso deixou de importar e a regra que o escondia saiu.

### 2. Imagens entram mascaradas

O legado serve o JPEG original; o app novo serve variante responsiva reencodada
pelo `next/image` (WebP, qualidade 75, largura por viewport). Os bytes divergem
por decisão de projeto, não por regressão — era ~1% dos pixels, todo dentro das
imagens.

`mask` do Playwright pinta a área com cor sólida nos dois lados: posição, caixa
e dimensão da imagem continuam comparadas, o conteúdo não. O que sai de cobertura
— imagem certa no lugar certo — fica com `smoke.spec.ts`, que confere `src` e
`alt`.

### 3. ~~Timeout, workers e aquecimento~~ — resolvido em MIG-035

O gate agora roda contra um **build de produção** em `:3100`, dentro da imagem
oficial do Playwright, por um comando só: `pnpm gate`. Antes ele rodava contra o
servidor de dev, que compila sob demanda — e a suíte alternava entre 27 verdes e
4 vermelhos **sem nenhuma mudança de código**.

Números da virada, mesma suíte e mesmo gabarito: **14,8 min com 11 falhas e 5
instáveis → 21 segundos, 36 verdes**, três execuções seguidas.

## Duas armadilhas que passaram despercebidas

**O CSS de estabilização nunca era aplicado.** O `<style>` era anexado em
`document.documentElement`; um `<style>` filho direto de `<html>` some quando o
parser monta `head`/`body`. O documento ficava com uma folha só — a do Vite — e
nenhuma regra do teste valia. Foi por isso que o menu fixo aparecia no gabarito
mesmo com a regra escrita. Agora anexa em `document.head`, com guarda de
idempotência.

**Ligar `antialiased` no app novo movia a rasterização de todo glifo.** O legado
não define `-webkit-font-smoothing`. Depois de layout e fonte já baterem — as 60
caixas de texto da listagem coincidem ao décimo de pixel — ainda sobravam ~3.400
pixels divergentes, todos em borda de letra. A regra geral: **não introduzir
propriedade tipográfica que o legado não tem**, por melhor que pareça.

## O que MIG-035 encontrou

Três causas, e nenhuma delas era o código do site.

### A fonte do legado dependia da rede

O legado buscava Mona Sans no Google Fonts em tempo de execução (`@import` em
`index.css:1`); o app novo serve a mesma build do próprio domínio via next/font
(D-16). Dentro da imagem do Playwright o legado renderizava texto **0,6% mais
largo** — no rodapé isso virava uma linha a mais e 20px de altura de página.

Os `.woff2` que o next/font baixou foram copiados para `legacy/public/fonts/` e
o `@import` remoto virou local. **Mesmos arquivos, mesmos bytes, mesma métrica.**
Depois disso a divergência foi a 0,00%.

Para regerar, se a fonte mudar:

```bash
docker compose exec web sh -c 'cd /app/.next && tar cf - $(find . -name "*.woff2")' | tar xf - -C /tmp/
find /tmp/dev -name '*.woff2' -exec cp {} legacy/public/fonts/ \;
# e reescrever legacy/public/fonts/mona-sans.css com as regras servidas pelo app novo
```

### A animação de entrada era uma corrida

Os dois apps animam a entrada dos cards com `whileInView`: 20px de deslocamento,
disparados por `IntersectionObserver`. Se o observer não disparasse antes da
captura, o card ficava no estado **inicial** — e cada lado corria sozinho. Era a
origem do "20px em toda a grade" que aparecia e sumia sem mudança de código.

Esperar mais não resolve: o disparo depende de hidratação, que varia com a carga
da máquina. `stabilize()` agora substitui o `IntersectionObserver` por um que
reporta visível na hora, e o framer pula para o estado final nos dois lados.

⚠️ **Âncoras ficam de fora do patch.** O router do Next usa o mesmo observer
para pré-carregar `<Link>`: reportar todas como visíveis dispara o prefetch de
todas as rotas de uma vez e o `networkidle` nunca chega — na primeira tentativa
a suíte inteira estourou em timeout. O framer observa a `div` do card, o Next
observa o `<a>`.

### O servidor de dev não é o que vai ao ar

Compila sob demanda, injeta o indicador de dev e hidrata devagar. `pnpm gate`
usa `next build` + `next start`, que é o que o visitante recebe.

## Rotas sem gabarito

Nem toda rota da Fase 3 existe no protótipo. `/blog/[slug]` é a primeira: os
cards do blog apontam para `#` (`legacy/src/pages/Blog.tsx:229`) e a página de
detalhe foi **decidida** em D-08, não portada. O mesmo vale para
`/relatorios/[slug]`, `/ebooks/[slug]`, `/webinars/[slug]`, `/contato`,
`/carreiras/[slug]` e as páginas de segmento.

Para essas, **a regressão visual não diz nada** — não há com o que comparar. O
que as verifica:

- `smoke.spec.ts`: responde 200 nos dois idiomas, slug inexistente dá 404,
  rascunho não vaza para visitante.
- Asserções específicas do risco de cada uma. Em `/blog/[slug]`: artigo sem
  corpo sai com `noindex`, que é a preocupação de D-08 aplicada em código em vez
  de por disciplina.

⚠️ **Não invente gabarito para elas.** Capturar a própria saída e chamar de
referência transforma o teste num espelho: ele passa a provar que o código não
mudou, não que está certo.

**Uma terceira categoria apareceu em 24/09 (D-34): a rota que diverge de
propósito.** `/consultores` tinha gabarito e o perdeu — não porque o conteúdo
mudou, como `/blog`, mas porque o **desenho** mudou por decisão do dono, e o
protótipo continua mostrando o anterior. A escolha foi tirar a rota do gate, e
não capturar o app novo: a regra acima valeu, mesmo com a rota já verificada.
O que a cobre é `e2e/consultores.spec.ts`, que testa o comportamento que a
captura nunca testou — filtro nos dois modos, carrinho, aba e envio.

O layout dessas rotas é **composto do que já foi portado** — a abertura da
página de case, o `RichText`, o `ContactCta` — e não desenhado do zero. Assim a
rota nova herda a linguagem visual já aprovada pelo gate nas outras.
