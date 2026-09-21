# Tasks — Feature: Solicitação de consultores em /consultores

**Feature:** .ksdd/features/FEATURE-consultores-solicitacao.md
**Total:** 8 tasks
**Prioridade:** P0: 6 · P1: 2 · P2: 0
**Estimativa total:** ~13 dias

| ID | Título | Área | Prioridade | Estimativa | Status | Depende de |
|----|--------|------|------------|------------|--------|------------|
| 009 | Filtro multi-seleção com alternador OU\|E e ordenação por cobertura | frontend | P0 | L | concluída | — |
| 010 | Lista cumulativa "Minha solicitação" com quantidade por perfil | frontend | P0 | L | em revisão | 009 |
| 011 | kind consultant-request — enum, migração e classificação comercial no CRM | data-model | P0 | S | concluída | — |
| 012 | Server Action solicitarConsultores com revalidação no servidor e aviso por e-mail | backend | P0 | M | para implementar | 011 |
| 013 | Seção de solicitação deixa de ser estática e envia com os perfis escolhidos | frontend | P0 | M | para implementar | 010, 012 |
| 014 | CTA "Não encontrou um consultor nesta lista?" | frontend | P1 | S | para implementar | 013 |
| 015 | Acabamento de UI da página guiado pelo Impeccable | design | P1 | M | para implementar | 013, 014 |
| 016 | e2e do filtro, do acúmulo e do envio + regravação do gabarito | qa | P0 | M | para implementar | 015 |

## Ordem sugerida

**009 e 011 não dependem de nada** e podem correr em paralelo — uma é frontend, a
outra é schema. Daí o caminho crítico é `009 → 010 → 013 → 014 → 015 → 016`, com
`011 → 012` entrando antes de 013.

⚠️ **O gate visual fica vermelho de 009 até 016.** É esperado: a regravação do
gabarito é a última task, depois de a UI estar fechada (015), porque regravar
antes apagaria a evidência de regressão de tudo que veio no meio. Para iterar no
caminho: `pnpm gate --rota consultores --viewport desktop`.

---
**Próximo passo:** `/ksdd:build:feature consultores-solicitacao` para implementar task por task.
