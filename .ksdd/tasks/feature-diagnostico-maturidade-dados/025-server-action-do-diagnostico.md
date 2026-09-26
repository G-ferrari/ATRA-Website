---
id: 025
title: Server Action de captura — recalcula no servidor, grava, envia o resultado e avisa a ATRA
status: em revisão
feature: diagnostico-maturidade-dados
area: backend
priority: P0
estimate: L
depends_on: [022, 023, 024]
feature_refs:
  - ".ksdd/features/FEATURE-diagnostico-maturidade-dados.md#41-da-pagina-de-normativa-ao-resultado-no-e-mail-principal"
  - ".ksdd/features/FEATURE-diagnostico-maturidade-dados.md#71-novas-server-actions"
spec_refs:
  - ".ksdd/specs/SPEC.md#13-fluxos-criticos-user-journeys"
arch_refs:
  - ".ksdd/specs/architecture.md#4-apis-e-endpoints"
  - ".ksdd/specs/architecture.md#7-seguranca"
---

# 025 — Server Action de captura — recalcula no servidor, grava, envia o resultado e avisa a ATRA

## Objetivo
Transformar o envio do questionário em lead gravado, resultado entregue e aviso ao comercial, sem confiar em nada que venha do navegador.

## Escopo
- `web/src/actions/diagnostico-maturidade.ts` → `enviarDiagnosticoDeMaturidade(FormData)`:
  1. anti-spam (isca + carimbo de tempo) e limite por IP, como os outros formulários (IP confiável de `lib/ip.ts`, **não gravado**);
  2. valida perfil (setor/porte/cargo contra as listas), contato (nome ≥ 3, e-mail corporativo, telefone ≥ 10 dígitos, empresa) e **consentimento obrigatório**;
  3. recebe só `{ perguntaId: índiceDaAlternativa }`, descarta perguntas que não são do setor e índices inexistentes, **recalcula** com a task 022;
  4. grava `form-submissions` (`data-maturity-diagnostic`, grupo `diagnostic`, UTM, `source`), cortando campos no teto do servidor;
  5. envia o resultado ao lead (task 024) e preenche `resultSentAt` só se o envio der certo;
  6. avisa a caixa `destinoDoAviso(contato, 'diagnostico')` com o resultado e as respostas; marca `notified`;
  7. o hook do CRM sincroniza sozinho (kind comercial).
- Devolve `{ ok: true, email }` ou erro legível por campo, repreenchendo o formulário (padrão de `actions/consultores.ts`).
- Testes unitários com mocks (padrão `consultores.test.ts`): envio válido, forja de respostas, e-mail pessoal, sem consentimento, robô, falha de e-mail (grava mesmo assim), nada de dado pessoal no log.

## Fora de escopo
- UI (tasks 026–027). Reenviar resultado (v2).

## Critérios de aceitação
- [ ] Nota gravada = nota recalculada, mesmo com payload adulterado.
- [ ] Sem Resend: grava, `resultSentAt` vazio, `notified` falso, resposta de sucesso ao visitante.
- [ ] Nenhum IP ou user agent no documento gravado.
- [ ] E-mail do resultado com `reply_to` = caixa de Diagnóstico.
- [ ] Testes cobrindo os 7 cenários acima; `lint`, `typecheck` verdes.

## Notas técnicas
- `overrideAccess` na Local API, como as demais actions de formulário (regra 4 não se aplica: é action, não componente).
- Precedentes: `actions/diagnostico-rc18.ts` (revalidação no servidor, MIG-142), `actions/consultores.ts` (repreencher, log sem dado pessoal).

## Riscos / dependências externas
- PR #51 (campo de destino) mergeado antes; senão usar o e-mail geral.
