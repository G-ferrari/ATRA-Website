# Contexto de implementação — Task 022

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/52
**Branch:** `feature/diagnostico-maturidade-dados/022-motor` → PR para `feature/diagnostico-maturidade-dados/integracao`

## 1. Task em uma página

```yaml
id: 022
title: Portar o motor do diagnóstico do HTML v1.7 (base, pontuação, roadmap) com testes de paridade
feature: diagnostico-maturidade-dados
area: backend · priority: P0 · estimate: L · depends_on: []
```

**Objetivo.** Trazer para TypeScript, sem nenhuma dependência de DOM, tudo o que o HTML do Roger calcula: é a base de que a action, a tela e o e-mail dependem, e o único jeito de garantir que a nota do site é a nota do Roger.

**Critérios de aceitação**
- [ ] Nenhum módulo importa `@/payload-types`, React ou APIs de navegador.
- [ ] Para os 8 setores, a contagem e a ordem das perguntas batem com o HTML v1.7.
- [ ] Para as fixtures, média, nível, pilares, áreas DAMA, gaps, top 3 e roadmap são idênticos aos do HTML (tolerância zero nas 2 casas).
- [ ] `ehEmailCorporativo` recusa os 13 domínios da lista do Roger e aceita `@banco.com.br`.
- [ ] `pnpm test` verde.

## 2. Feature spec relevante (FEATURE-diagnostico-maturidade-dados.md)

§2.1 — "**Base de perguntas, pontuação e textos do resultado portados do HTML v1.7** (`QUESTIONS`, `TAG_LABELS`, `SECTOR_TAGS`, `LEVELS`, `OFFERS`, `REG_ACTIONS`, `STAKES`, roadmap), em código versionado, com a mesma regra de cálculo (`computeScores`, `buildRoadmap`)."

§10 — "Para cada um dos 8 setores, o número de perguntas bate com o HTML v1.7 (15 a 18) e a ordem é a da base." · "Para um conjunto fixo de respostas por setor, média, nível, notas por pilar, gaps e roadmap são **idênticos** aos do `computeScores`/`buildRoadmap` do HTML (testes unitários)." · "E-mail de domínio pessoal da lista do Roger é recusado no cliente e no servidor."

## 3. SPEC relevante (§11)

"**Formulários funcionam sem JS** (Server Actions); anti-spam por honeypot + carimbo; robô recebe sucesso falso" — o motor precisa rodar igual no servidor (recalcular) e no cliente (validar e-mail): por isso puro, sem DOM.

## 4. Arquitetura relevante (§9)

"**Unit (Vitest):** mappers, anti-spam, ip, chat, seo/sitemap/jsonld, redirects, utm, video." — o motor entra aqui, com testes em `*.test.ts` ao lado do módulo.

## 5. Plano de implementação

**Decisão central: não transcrever à mão.** A base tem 33 perguntas × 4 alternativas × tags, mais ~40 textos de resultado. Transcrever é onde entra erro silencioso. Em vez disso:

1. **Extrator** `web/scripts/diagnostico-maturidade/extrair-do-html.mjs`: lê o HTML v1.7, isola as declarações de dados (`QUESTIONS`, `TAG_LABELS`, `UNIVERSAL_TAGS`, `SECTOR_TAGS`, `INTERNAL_TAGS`, `PROFILE_UNIVERSAL`, `LEVELS`, `OFFERS`, `REG_ACTIONS`, `STAKES`, `blockedEmailDomains`, as `<option>` de setor/porte/cargo), avalia em `node:vm` e grava `web/src/lib/diagnostico-maturidade/dados.ts` — gerado, com cabeçalho dizendo de onde veio e como regenerar.
2. **Lógica portada à mão, em TS tipado** (`web/src/lib/diagnostico-maturidade/`): `perguntasDoSetor`, `tagRelevante`/impactos do setor, `calcular` (= `computeScores`), `faixa` (= `band`), `montarRoadmap` (= `buildRoadmap`), leitura pelo porte (`bench`), `ehEmailCorporativo`, `VERSAO`.
3. **Teste de paridade que roda o original**: o teste lê o HTML, extrai as funções originais (`tagRelevant`, `computeScores`, `band`, `buildRoadmap` e o trecho de `renderResult` que calcula `bench`) com o mesmo isolador do extrator, avalia em `vm` com um `state` falso e compara com o port para conjuntos determinísticos de respostas em **cada setor** (todas as notas mínimas, todas máximas, mistas por semente). Tolerância zero.
4. Teste de contagem e ordem de perguntas por setor contra o original.

**Arquivos**
- novo `web/scripts/diagnostico-maturidade/extrair-do-html.mjs`
- novo `web/src/lib/diagnostico-maturidade/dados.ts` (gerado)
- novo `web/src/lib/diagnostico-maturidade/motor.ts` (+ `index.ts` exportando a API pública)
- novo `web/src/lib/diagnostico-maturidade/original.ts` (só para teste: isola e avalia o JS do HTML)
- novo `web/src/lib/diagnostico-maturidade/motor.test.ts`

**Sem migração** (área backend, só lib).

**Riscos específicos**
- O isolamento das funções do HTML por casamento de chaves quebra se um texto tiver `{`/`}` desbalanceado — o teste precisa falhar alto se o isolamento não achar a função.
- `renderResult`/`buildRoadmap` leem `state.sector` e o porte do DOM: passar pelo `state` falso e por parâmetro.
- O caminho do HTML a partir de `web/` é `../docs/02-especificacao/diagnostico-maturidade/`; o teste roda no container (`/app` = `web/`), onde `docs/` está montado em `/docs` — resolver os dois caminhos, como já é feito para o `redirects.csv` (CLAUDE.md, armadilha do `docs/` em container).

## 6. Quality gates

- [ ] Testes unitários (`pnpm test` no container)
- [ ] Lint + typecheck (`pnpm lint`, `pnpm typecheck`)
- [ ] Build — não se aplica isoladamente (lib sem rota); coberto pelo `typecheck` e pelo CI do PR
- [ ] E2E — não se aplica (sem UI)
- [ ] Code review (agente)
- [ ] Security audit — não se aplica (sem PII, auth ou entrada externa nesta task)
