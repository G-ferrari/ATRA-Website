---
id: 047
title: Ligar na homologação e provar os quatro formulários no RD com a Taci
status: para implementar
feature: rd-station-formularios
area: qa
priority: P0
estimate: S
depends_on: [043, 044, 045, 046]
feature_refs:
  - ".ksdd/features/FEATURE-rd-station-formularios.md#91-dependências"
  - ".ksdd/features/FEATURE-rd-station-formularios.md#92-riscos"
  - ".ksdd/features/FEATURE-rd-station-formularios.md#10-critérios-de-aceite"
  - ".ksdd/features/FEATURE-rd-station-formularios.md#11-fases-de-implementação"
spec_refs:
  - ".ksdd/specs/SPEC.md#14-fases-de-entrega"
arch_refs:
  - ".ksdd/specs/architecture.md#24-infraestrutura"
  - ".ksdd/specs/architecture.md#5-integrações-externas"
---

# 047 — Homologação ponta a ponta

## Objetivo
Provar, na homologação e no RD de verdade, que os quatro formulários chegam com o identificador e a tag certos e que o RD dispara o agradecimento e o aviso ao time — o que libera desligar o WordPress.

## Escopo
- **Lista do RD** (Taci; plano B Léo): identificador de conversão, tags e campos personalizados que o site atual usa em contato, newsletter, cada e-book e Trabalhe Conosco, e as automações ligadas a cada um. Registrar em `docs/` (sem dado pessoal).
- **Chave** `RDSTATION_MARKETING_API_KEY` (e `RESEND_API_KEY`, para o aviso de reserva) no servidor de produção — Léo. Conferir no admin: "Chave do RD: configurada".
- **Configurar o admin da homologação** com a lista (Taci, ou junto com ela).
- **Um lead de teste por formulário**, só com autorização do G-ferrari a cada rodada, com e-mails de teste combinados com a Taci. Conferir no RD: lead criado ou atualizado, identificador, tag, origem; e-mail de agradecimento recebido; aviso ao time recebido, **um só**. Conferir no admin: `rd.syncedAt` preenchido e `notified: false`.
- **Conversão duplicada**: com o aceite de marketing dado, ver se o script de monitoramento do RD também captura o formulário (duas conversões por envio). Se capturar, desligar a captura na conta do RD ou fazer o script ignorar os formulários do site.
- **Base legal**: se o RD não mandar o agradecimento por falta de base legal, abrir a decisão com o jurídico (ver Riscos da FEATURE) antes da virada.
- A Taci apaga os leads de teste no RD.
- Atualizar `pendencias.md`, a decisão da feature e o checklist do site: WordPress liberado para desligar quanto aos formulários.

## Fora de escopo
- O desligamento do WordPress e a virada de DNS (Fase 3 da SPEC).
- Enviar formulário no site atual (WordPress) — leads reais.

## Critérios de aceitação
- [ ] Lista do RD registrada e configurada no admin da homologação.
- [ ] Quatro leads de teste (contato, newsletter confirmada, e-book, Trabalhe Conosco) conferidos no RD com identificador e tag certos.
- [ ] Agradecimento e aviso ao time recebidos para os quatro, um aviso por lead.
- [ ] Nenhuma conversão duplicada pelo script de monitoramento.
- [ ] Leads de teste apagados no RD.

## Notas técnicas
- Envio de formulário na homologação cria lead de verdade: nunca sem autorização expressa, e nunca com dado de pessoa real.
- O e-book só tem formulário com PDF enviado (P-07): sem PDF, testar com um material de teste na homologação, despublicado depois.

## Riscos / dependências externas
- Acesso à conta do RD e à VPS não são do time técnico do site: dependem da Taci e do Léo.
- Bloqueio de e-mail por base legal (ver FEATURE 9.2).
