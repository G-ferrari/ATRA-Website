# Contexto de implementação — Task 027

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/62
**Branch:** `feature/diagnostico-maturidade-dados/027-contato` → PR para `feature/diagnostico-maturidade-dados/integracao`

## 1. Task em uma página

```yaml
id: 027
title: Contato, conclusão e envio — liga a ilha à action, WhatsApp/Agendar e evento com consentimento
area: frontend · priority: P0 · estimate: M · depends_on: [025, 026]  # concluídas
```

**Objetivo.** Fechar o fluxo: capturar o contato, enviar para a action e confirmar que o resultado foi para o e-mail — sem mostrar o resultado na tela (decisão de 26/09).

**Critérios de aceitação**
- [ ] `@gmail.com` é recusado no campo antes de enviar, e também no servidor.
- [ ] Sem o consentimento marcado, não envia.
- [ ] Envio válido leva à conclusão com o e-mail informado; nenhum número do resultado aparece no DOM.
- [ ] Sem `agendaUrl`, não há botão de agenda.
- [ ] Evento só sai com consentimento de estatística ou marketing (teste unitário do disparo).
- [ ] `lint`, `typecheck` verdes.

## 2. Feature spec relevante

§4.1, passos 4–6: "**Contato:** nome, e-mail corporativo, telefone, empresa, consentimento → "Enviar". … **Conclusão:** "Enviamos o seu resultado para ana@banco.com.br", com WhatsApp e, se configurado, "Agendar conversa"." Evento `quiz_maturidade_lead` com consentimento.

Edge cases: e-mail pessoal recusado no campo antes de enviar, com a mensagem de que é preciso e-mail corporativo; o servidor recusa também. Sem Resend, a conclusão diz que o resultado chega por e-mail e oferece o WhatsApp.

§10: "A tela de conclusão **não** mostra o resultado; mostra o e-mail de destino, WhatsApp e — só com link no global — Agendar." · "`quiz_maturidade_lead` só vai para o `dataLayer` com consentimento de estatística/marketing."

## 3. SPEC (§9, §11) e arquitetura (§7)

- **Formulários funcionam sem JS** (Server Actions); anti-spam por honeypot + carimbo; robô recebe sucesso falso.
- **LGPD:** envio ao CRM exige consentimento; política publicada é pré-requisito dos formulários (P-14).

## 4. Contrato da action (task 025, já na base)

`enviarDiagnosticoDeMaturidade(_anterior, dados)` — assinatura de `useActionState`.
- Campos: `setor`, `porte`, `cargo`; `respostas` (JSON `{ perguntaId: índice }`); `name`, `email`, `phone`, `company` (opcional), `consentimento` (checkbox); anti-spam `carimbo` + isca `website`; `inicio` (ms do início do questionário); `source` e `utm_*`.
- Retorno: `{ ok: true, email }` ou `{ ok: false, codigo: 'contato'|'perfil'|'respostas'|'falha', erro, campos, valores }` — `campos` por campo (`name|email|phone|consentimento`), textos do HTML; `valores` para repreencher.

## 5. Plano de implementação

- Substituir o marcador `TelaDoContato` (026) pelo formulário real dentro da ilha: campos com rótulos do HTML, validação no cliente com as mesmas regras (`ehEmailCorporativo`, telefone ≥ 10 dígitos, nome ≥ 3, consentimento), erros por campo; `useActionState` com a action; campos ocultos para perfil, respostas (JSON), `inicio`, `source`, UTM (ver como `formularios.ts`/consultores montam UTM e anti-spam no cliente: isca e carimbo) — **escondidos antes dos campos reais** (armadilha do `space-y` no CLAUDE.md).
- Consentimento: texto do HTML do Roger (checkbox do `#aq-consent`) com link para a política (`hrefDe('politicas', …)`); P-14 segue pendente para produção.
- Conclusão (`TelaDeConclusao`): título do HTML, "Enviamos o seu resultado para {email}", `doneMessage` do global, orientação de spam, WhatsApp e — só com `agendaUrl` — botão de agenda com o texto do HTML ("Agendar leitura do diagnóstico"). Barra em 100%. **Nenhum número do resultado.**
- Evento: `rastrear('quiz_maturidade_lead', { quiz_setor, quiz_nivel? })` — o cliente não conhece o nível (o servidor recalcula); mandar só o setor, ou o nível devolvido pela action se for incluído no retorno (decidir; o mínimo é setor). `rastrear` já é no-op sem consentimento/GTM — testar o disparo com mock.
- Sem JS: o formulário de contato precisa funcionar como POST para a action (o questionário exige JS, mas o envio em si segue o padrão do site).

## 6. Quality gates
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`
- [ ] Fluxo completo no navegador local até a conclusão, com lead gravado no banco local (sem Resend: `resultSentAt` vazio) e depois apagado
- [ ] Nenhum número do resultado no DOM da conclusão
