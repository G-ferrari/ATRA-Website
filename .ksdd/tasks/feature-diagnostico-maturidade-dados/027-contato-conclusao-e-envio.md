---
id: 027
title: Contato, conclusão e envio — liga a ilha à action, WhatsApp/Agendar e evento com consentimento
status: concluída
feature: diagnostico-maturidade-dados
area: frontend
priority: P0
estimate: M
depends_on: [025, 026]
feature_refs:
  - ".ksdd/features/FEATURE-diagnostico-maturidade-dados.md#41-da-pagina-de-normativa-ao-resultado-no-e-mail-principal"
  - ".ksdd/features/FEATURE-diagnostico-maturidade-dados.md#10-criterios-de-aceite"
spec_refs:
  - ".ksdd/specs/SPEC.md#9-touchpoints-criticos"
arch_refs:
  - ".ksdd/specs/architecture.md#7-seguranca"
---

# 027 — Contato, conclusão e envio — liga a ilha à action, WhatsApp/Agendar e evento com consentimento

## Objetivo
Fechar o fluxo: capturar o contato, enviar para a action e confirmar que o resultado foi para o e-mail — sem mostrar o resultado na tela (decisão de 26/09).

## Escopo
- **Contato:** nome, e-mail corporativo (validação no cliente com a mesma função da task 022 e mensagem clara), telefone, empresa, consentimento com o texto do P-14; isca e carimbo de tempo do anti-spam como os outros formulários; erro por campo vindo da action.
- **Envio** via `useActionState`; botão com estado de carregamento; repreenche em caso de recusa.
- **Conclusão:** "Enviamos o seu resultado para {email}", orientação para caixa de spam, WhatsApp e — só com `agendaUrl` no global — "Agendar conversa". **Sem** nível nem nota na tela.
- `rastrear('quiz_maturidade_lead', { setor, nivel })` só com consentimento (`lib/rastreio.ts`, D-30).
- Funciona sem JavaScript no envio (padrão dos formulários do site), mesmo que o questionário exija JS.

## Fora de escopo
- Mostrar o resultado (fora da v1). Reenvio (v2).

## Critérios de aceitação
- [ ] `@gmail.com` é recusado no campo antes de enviar, e também no servidor.
- [ ] Sem o consentimento marcado, não envia.
- [ ] Envio válido leva à conclusão com o e-mail informado; nenhum número do resultado aparece no DOM.
- [ ] Sem `agendaUrl`, não há botão de agenda.
- [ ] Evento só sai com consentimento de estatística ou marketing (teste unitário do disparo).
- [ ] `lint`, `typecheck` verdes.

## Notas técnicas
- Texto do consentimento: depende do P-14; até lá, placeholder claramente provisório **só em homologação**, como `seed/cookie-consent.ts` faz — nunca em produção.

## Riscos / dependências externas
- P-14 (texto de consentimento) para produção.
