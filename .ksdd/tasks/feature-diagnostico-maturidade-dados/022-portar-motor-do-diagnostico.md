---
id: 022
title: Portar o motor do diagnóstico do HTML v1.7 (base, pontuação, roadmap) com testes de paridade
status: em revisão
feature: diagnostico-maturidade-dados
area: backend
priority: P0
estimate: L
depends_on: []
feature_refs:
  - ".ksdd/features/FEATURE-diagnostico-maturidade-dados.md#21-o-que-entra-v1"
  - ".ksdd/features/FEATURE-diagnostico-maturidade-dados.md#10-criterios-de-aceite"
spec_refs:
  - ".ksdd/specs/SPEC.md#11-interacoes-e-comportamentos"
arch_refs:
  - ".ksdd/specs/architecture.md#9-estrategia-de-testes"
---

# 022 — Portar o motor do diagnóstico do HTML v1.7 (base, pontuação, roadmap) com testes de paridade

## Objetivo
Trazer para TypeScript, sem nenhuma dependência de DOM, tudo o que o HTML do Roger calcula: é a base de que a action, a tela e o e-mail dependem, e o único jeito de garantir que a nota do site é a nota do Roger.

## Escopo
- `web/src/lib/diagnostico-maturidade/` com módulos puros:
  - base de perguntas (`QUESTIONS`, 33 perguntas: id, pilar, área DAMA, setores, enunciado, alternativas com nota e tags);
  - setores (8 códigos e rótulos do `#aq-setor`), portes (5), cargos (6);
  - `TAG_LABELS`, `UNIVERSAL_TAGS`, `SECTOR_TAGS`, `INTERNAL_TAGS`, `PROFILE_UNIVERSAL` e a regra `tagRelevant`/impactos do setor;
  - `perguntasDoSetor(setor)` (filtro `all` + setor, na ordem da base);
  - `calcular(respostas)` = `computeScores`: média, nível (limiares 1,8 / 2,6 / 3,5 / 4,3), média por pilar e por área DAMA, gaps por tag relevante (5 − nota) e top 3;
  - `LEVELS`, `OFFERS`, `REG_ACTIONS`, `STAKES`, `band`, `buildRoadmap` (3 fases), leitura pelo porte (`bench`) e regulações com maior gap;
  - lista de domínios de e-mail pessoal bloqueados e `ehEmailCorporativo`;
  - constante de versão do questionário (`1.7`).
- Testes unitários de paridade: fixtures de respostas por setor com o resultado esperado **gerado executando as funções originais do HTML** (script de apoio que extrai o `<script>` e roda `computeScores`/`buildRoadmap` em Node), comparados campo a campo.
- Teste da contagem de perguntas por setor (15 a 18) e da ordem.

## Fora de escopo
- Qualquer UI, action ou e-mail (tasks 024–027).
- Editar perguntas no admin (v2).

## Critérios de aceitação
- [ ] Nenhum módulo importa `@/payload-types`, React ou APIs de navegador.
- [ ] Para os 8 setores, a contagem e a ordem das perguntas batem com o HTML v1.7.
- [ ] Para as fixtures, média, nível, pilares, áreas DAMA, gaps, top 3 e roadmap são idênticos aos do HTML (tolerância zero nas 2 casas).
- [ ] `ehEmailCorporativo` recusa os 13 domínios da lista do Roger e aceita `@banco.com.br`.
- [ ] `pnpm test` verde.

## Notas técnicas
- Fonte única: `docs/02-especificacao/diagnostico-maturidade/atra-diagnostico-maturidade-dados.html` (linhas ~354–1076). Portar os textos **caractere a caractere** — decisão de conteúdo é do marketing (D-22); a validação jurídica é pré-requisito de publicação, não desta task.
- As notas das alternativas são 1, 2, 3 e **5** (não 4) — não "corrigir".
- Modelo de estrutura: `web/src/lib/diagnostico-rc18.ts` (motor puro + teste), que esta feature substitui.
- Registrar no topo do módulo a versão e a data do material, para a próxima revisão do Roger saber de onde partir.

## Riscos / dependências externas
- Se o Roger mandar uma v1.8 durante a implementação, as fixtures precisam ser regeneradas pelo mesmo script.
