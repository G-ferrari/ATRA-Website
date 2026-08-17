---
status: rascunho
atualizado_em: 2026-08-17
depende_de: [roadmap.md, ../00-contexto/decisoes.md]
---

# Estratégia de testes

O projeto porta ~12.000 linhas de UI escritas por IA para outra stack, com código
gerado por IA. A pergunta que o teste precisa responder não é "esta função está
correta?", e sim **"esta página continua igual à que está no ar?"**.

Isso inverte a pirâmide de testes usual — e é deliberado.

## Prioridades

### 1. Regressão visual (Playwright) — prioridade máxima

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
| Fontes | Aguardar `document.fonts.ready` — e **carregar Mona Sans no legado antes** (D-16) |
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
| Conversor **HTML → Lexical** | 207 posts dependem dele. Teste com fixtures reais do WP |
| Geração e parsing do `redirects.csv` | Erro aqui = SEO perdido silenciosamente |
| Parser de UI generativa do chat (`Chat.tsx:17-57`) | Regex sobre saída de LLM; frágil por natureza |
| Rate limit e budget guard | Segurança e custo |
| Resolução de locale e slug | Base do roteamento bilíngue |

## Pipeline de CI

```yaml
# Em toda PR
lint          → eslint + prettier
typecheck     → tsc --noEmit + payload generate:types (falha se desatualizado)
unit          → vitest run
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

1. **Precisamos alterá-lo.** D-16 exige carregar Mona Sans no legado antes de
   congelar qualquer captura; não temos como fazer isso no build do AI Studio.
2. **Ele muda sem aviso.** O protótipo está em análise interna: qualquer edição no
   AI Studio republica o site e quebraria todos os snapshots sem que ninguém tenha
   tocado no nosso código.

Em compensação, o legado local precisa das **imagens recuperadas antes do
baseline** (MIG-070) — senão congelamos capturas com duas imagens quebradas que
não existem no site real. A ordem correta é: MIG-070 → MIG-008 (fonte) →
MIG-011 (baseline).

O legado precisa continuar rodando durante toda a Fase 3 — é o gabarito. Só sai do
repositório na Fase 8, depois do cutover.
