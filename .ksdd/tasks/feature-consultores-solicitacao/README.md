# Tasks — Feature: Solicitação de consultores em /consultores

**Feature:** .ksdd/features/FEATURE-consultores-solicitacao.md
**Total:** 12 tasks
**Prioridade:** P0: 6 · P1: 6 · P2: 0
**Estimativa total:** ~20 dias

| ID | Título | Área | Prioridade | Estimativa | Status | Depende de |
|----|--------|------|------------|------------|--------|------------|
| 009 | Filtro multi-seleção com alternador OU\|E e ordenação por cobertura | frontend | P0 | L | concluída | — |
| 010 | Lista cumulativa "Minha solicitação" com quantidade por perfil | frontend | P0 | L | concluída | 009 |
| 011 | kind consultant-request — enum, migração e classificação comercial no CRM | data-model | P0 | S | concluída | — |
| 012 | Server Action solicitarConsultores com revalidação no servidor e aviso por e-mail | backend | P0 | M | concluída | 011 |
| 013 | Seção de solicitação deixa de ser estática e envia com os perfis escolhidos | frontend | P0 | M | concluída | 010, 012 |
| 014 | CTA "Não encontrou um consultor nesta lista?" | frontend | P1 | S | concluída | 013 |
| 017 | Chamada "Não encontrou um consultor?" junto dos diferenciais, em destaque | frontend | P1 | S | concluída | 014 |
| 018 | Aba de pedido — carrinho que abre, minimiza e envia | frontend | P1 | L | concluída | 017 |
| 019 | Tags recolhíveis no filtro de especialidades e nos cards | frontend | P1 | S | concluída | 018 |
| 020 | Pedido enxuto — sem quantidade, menos campos, confirmação na aba | frontend | P1 | M | concluída | 018 |
| 015 | Acabamento de UI da página guiado pelo Impeccable | design | P1 | M | em revisão | 013, 014, 017, 018, 019, 020 |
| 016 | e2e do filtro, do acúmulo e do envio + regravação do gabarito | qa | P0 | M | para implementar | 015 |

## Ordem sugerida

**009 e 011 não dependem de nada** e podem correr em paralelo — uma é frontend, a
outra é schema. Daí o caminho crítico é `009 → 010 → 013 → 014 → 017 → 018 → 019 → 020 → 015 → 016`, com
`011 → 012` entrando antes de 013.

**017 e 018 entraram em 21/09, e a 019 e a 020 em 22/09**, a pedido de G-ferrari, depois do plano original —
por isso a numeração fora da ordem. Vêm antes do acabamento (015) porque mudam
a estrutura da página, e a 015 lapida o que elas deixarem. No mesmo dia saiu,
fora da numeração, a remoção das promessas de 48h (cards, modal e herói — PR #26).

⚠️ **O gate visual fica vermelho de 009 até 016.** É esperado: a regravação do
gabarito é a última task, depois de a UI estar fechada (015), porque regravar
antes apagaria a evidência de regressão de tudo que veio no meio. Para iterar no
caminho: `pnpm gate --rota consultores --viewport desktop`.

## Integração (decisão de 21/09)

As tasks **010, 012 e 013** só formam um fluxo coerente juntas: a 010 tira o "Solicitar" do caminho para `/contato`, e sem a 012 (Server Action) e a 013 (formulário vivo) o novo caminho termina num formulário desabilitado. Por isso elas **não** vão direto para `migracao`:

- base dos PRs: **`feature/consultores-solicitacao/integracao`** (criada de `migracao` em `6f4ad71`);
- push nessa branch **não roda CI nem deploya**; PRs para ela rodam lint, typecheck e build;
- `concluída`, para estas três, significa **mergeada na integração**;
- quando a 013 entrar, **um único PR** leva a integração para `migracao` — um deploy, feature inteira.

⚠️ **Nunca deletar a branch de integração com PRs abertos apontando para ela.** Deletar a base de um PR o **fecha**, e PR fechado não aceita troca de base nem reabertura — foi o que aconteceu com o #16, substituído pelo #17.

⚠️ Se `migracao` receber commits enquanto a integração estiver aberta, trazer `migracao` para a integração antes do PR final.

---
**Próximo passo:** `/ksdd:build:feature consultores-solicitacao` para implementar task por task.
