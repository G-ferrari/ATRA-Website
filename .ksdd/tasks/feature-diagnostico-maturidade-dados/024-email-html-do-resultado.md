---
id: 024
title: E-mail HTML do resultado ao lead e aviso à ATRA
status: em revisão
feature: diagnostico-maturidade-dados
area: backend
priority: P0
estimate: M
depends_on: [022]
feature_refs:
  - ".ksdd/features/FEATURE-diagnostico-maturidade-dados.md#52-telas-novas"
  - ".ksdd/features/FEATURE-diagnostico-maturidade-dados.md#72-modificados"
spec_refs:
  - ".ksdd/specs/SPEC.md#9-touchpoints-criticos"
arch_refs:
  - ".ksdd/specs/architecture.md#5-integracoes-externas"
---

# 024 — E-mail HTML do resultado ao lead e aviso à ATRA

## Objetivo
Entregar por e-mail o que o HTML do Roger mostrava na tela — é o **único** canal do resultado (decisão de 26/09) — e dar ao comercial o resultado completo com as respostas.

## Escopo
- `lib/email.ts`: `enviarAviso` aceita `html` opcional além de `texto` (Resend `html` + `text`), sem mudar o comportamento dos avisos atuais.
- Template do **resultado ao lead** (HTML com estilos em linha + versão texto): nota e nível com a leitura pelo porte, impactos do setor, barras por pilar (crítico < 2,6, atenção < 3,5), o que está em jogo, regulações com maior gap, roadmap em 3 fases, ações por regulação, nota metodológica, botões WhatsApp e Agendar (este só com `agendaUrl`). Assunto e abertura vindos do global (task 023).
- Template do **aviso à ATRA** (texto): contato, perfil, resultado resumido, top 3 de gaps e todas as respostas (pergunta → alternativa), para quem abordar o lead.
- Funções puras de montagem (recebem o resultado da task 022 + textos), testáveis sem rede.

## Fora de escopo
- Enviar (task 025) e decidir o destinatário (`lib/destino-do-aviso.ts`, PR #51).
- PDF anexo (v2).

## Critérios de aceitação
- [ ] Avisos existentes continuam saindo só com texto (testes atuais verdes).
- [ ] O HTML do resultado renderiza legível em cliente de e-mail sem CSS externo (estilos em linha, largura ≤ 600 px, sem JS, sem imagens obrigatórias).
- [ ] Sem `agendaUrl`, o e-mail não tem o botão de agenda.
- [ ] Testes de snapshot do texto e das seções presentes para 2 perfis (nível baixo e alto).

## Notas técnicas
- Texto do resultado = tabelas `LEVELS`, `OFFERS`, `REG_ACTIONS`, `STAKES` portadas na task 022; o README do Roger já prevê usá-las "como base para o template do e-mail" (§10).
- Remetente atual: `RESEND_FROM` (`nao-responda@atra.com.br`); `reply_to` do e-mail ao lead = a caixa de "Diagnóstico".

## Riscos / dependências externas
- `RESEND_API_KEY` e domínio verificado em produção — sem eles nenhum lead recebe resultado (risco alto da FEATURE §9.2).
