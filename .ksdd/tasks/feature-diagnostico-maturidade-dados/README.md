# Tasks — Feature: Diagnóstico de maturidade de dados

**Feature:** .ksdd/features/FEATURE-diagnostico-maturidade-dados.md
**Total:** 9 tasks
**Prioridade:** P0: 7 · P1: 2 · P2: 0
**Estimativa total:** ~15–17 dias

| ID | Título | Área | Prioridade | Estimativa | Status | Depende de |
|----|--------|------|------------|------------|--------|------------|
| 022 | Portar o motor do diagnóstico do HTML v1.7 (base, pontuação, roadmap) com testes de paridade | backend | P0 | L | concluída | — |
| 023 | Modelo de dados — kind `data-maturity-diagnostic`, grupo do diagnóstico e global de textos | data-model | P0 | M | concluída | — |
| 024 | E-mail HTML do resultado ao lead e aviso à ATRA | backend | P0 | M | em revisão | 022 |
| 025 | Server Action de captura — recalcula no servidor, grava, envia o resultado e avisa a ATRA | backend | P0 | L | para implementar | 022, 023, 024 |
| 026 | Rota `/diagnostico-maturidade` — perfil com setor pela URL e perguntas (ilha) | frontend | P0 | L | para implementar | 022, 023 |
| 027 | Contato, conclusão e envio — liga a ilha à action, WhatsApp/Agendar e evento com consentimento | frontend | P0 | M | para implementar | 025, 026 |
| 028 | Aposentar o diagnóstico RC18 — redirect para a rota nova e remoção do motor antigo | frontend | P0 | M | para implementar | 027 |
| 029 | Página RC18 aponta para o diagnóstico e perde o formulário de contato | frontend | P1 | S | para implementar | 028 |
| 030 | SEO, smoke e e2e de comportamento do diagnóstico | qa | P1 | M | para implementar | 027, 028 |

## Ordem sugerida (por dependência)

**Trilha A — o motor e a entrega:** 022 → 024 → 025
**Trilha B — dados e tela (paralela à A):** 023 → 026
**Encontro:** 027 (depende de 025 e 026)
**Troca do RC18:** 028 → 029
**Fecho:** 030

⚠️ **O RC18 continua no ar até a 027 terminar.** A 028 só entra quando o diagnóstico novo estiver completo — os dois nunca ficam fora do ar ao mesmo tempo, e nunca há dois no ar.

**Pré-requisitos de publicação (não travam o código):** `RESEND_API_KEY` em produção (o resultado só vai por e-mail), texto de consentimento (P-14), validação jurídica das normas.

---
**Próximo passo:** `/ksdd:build:feature diagnostico-maturidade-dados` para implementar task por task.
