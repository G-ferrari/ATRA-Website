---
id: 044
title: Mandar tags, LinkedIn e dados de candidato na conversão; Trabalhe Conosco no RD
status: em revisão
feature: rd-station-formularios
area: backend
priority: P0
estimate: M
depends_on: [043]
feature_refs:
  - ".ksdd/features/FEATURE-rd-station-formularios.md#21-o-que-entra-v1"
  - ".ksdd/features/FEATURE-rd-station-formularios.md#44-trabalhe-conosco-banco-de-talentos"
  - ".ksdd/features/FEATURE-rd-station-formularios.md#92-riscos"
  - ".ksdd/features/FEATURE-rd-station-formularios.md#10-critérios-de-aceite"
spec_refs:
  - ".ksdd/specs/SPEC.md#23-paula--candidata-a-vaga-visitante-secundária"
  - ".ksdd/specs/SPEC.md#132-visitante-converte-por-formulário"
arch_refs:
  - ".ksdd/specs/architecture.md#5-integrações-externas"
  - ".ksdd/specs/architecture.md#7-segurança"
---

# 044 — Conversão com tags e candidatos

## Objetivo
Fazer cada conversão chegar ao RD com as tags configuradas, e passar a mandar o banco de talentos (Trabalhe Conosco), sem currículo — para que segmentação e automações do marketing funcionem como no site atual.

## Escopo
- `lib/rd-marketing.ts`:
  - `talent-pool` passa a ir ao RD (`KINDS_COMERCIAIS` e o comentário da D-29 revistos); `job-application` continua fora.
  - `identificadorDe` com o identificador do Trabalhe Conosco (043).
  - `montarPayload`: `tags` do formulário (sem repetição, sem vazias); `linkedin` (campo padrão do RD) no banco de talentos; área e senioridade como `cf_*` atrás do liga/desliga de campos personalizados que já existe.
- `form-submissions`: o banco de talentos hoje junta LinkedIn, área e senioridade num texto (`extrasDeTalento` em `actions/formularios.ts`). Gravar também em campos estruturados para o gancho ler — com migração (e a antecipada, se a armadilha do banco novo valer para `form-submissions`).
- Decisão nova em `docs/00-contexto/decisoes.md` revendo a D-29: Trabalhe Conosco vai ao RD, só com dados de contato e perfil, nunca o currículo — pedido da ATRA (Taci, 14/10), decidido por G-ferrari em 15/10. Atualizar o parágrafo do RD no `CLAUDE.md`.

## Fora de escopo
- O aviso do time (045).
- O identificador por e-book (046).
- Base legal (`legal_bases`) para formulários além da newsletter — espera P-14 (ver Riscos da FEATURE).

## Critérios de aceitação
- [ ] Teste do corpo da conversão: contato com as tags do contato; newsletter confirmada com `newsletter`; banco de talentos com identificador e tag próprios, `linkedin`, e área/senioridade só com os campos personalizados ligados.
- [ ] Teste garante que nenhum corpo de `talent-pool` contém currículo, nome de arquivo ou link de `private-files`.
- [ ] `job-application` continua sem ir ao RD (teste).
- [ ] O envio ao ATRAIR do banco de talentos segue igual (testes de `atrair` verdes).
- [ ] Integração desligada ou chave ausente: nada vai ao RD e o motivo fica em `rd.error` (comportamento atual).

## Notas técnicas
- Corpo da API de conversões (`POST https://api.rd.services/platform/conversions`, `event_family: CDP`): `tags` é lista de texto; `linkedin` é campo padrão; personalizados são `cf_<identificador>`. Campo `cf_` que a conta não tem faz o RD recusar a conversão inteira (comentário atual em `rd-marketing.ts`) — por isso fica atrás do liga/desliga.
- Os nomes `cf_` de área e senioridade só se conhecem na 047; até lá, constante em `CAMPOS_PERSONALIZADOS`, fácil de trocar.

## Riscos / dependências externas
- Nomes dos campos personalizados de candidato na conta do RD (Taci; plano B Léo).
