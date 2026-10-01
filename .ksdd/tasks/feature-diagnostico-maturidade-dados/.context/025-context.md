# Contexto de implementação — Task 025

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/58
**Branch:** `feature/diagnostico-maturidade-dados/025-action` → PR para `feature/diagnostico-maturidade-dados/integracao`

## 1. Task em uma página

```yaml
id: 025
title: Server Action de captura — recalcula no servidor, grava, envia o resultado e avisa a ATRA
area: backend · priority: P0 · estimate: L · depends_on: [022, 023, 024]  # todas concluídas
```

**Objetivo.** Transformar o envio do questionário em lead gravado, resultado entregue e aviso ao comercial, sem confiar em nada que venha do navegador.

**Critérios de aceitação**
- [ ] Nota gravada = nota recalculada, mesmo com payload adulterado.
- [ ] Sem Resend: grava, `resultSentAt` vazio, `notified` falso, resposta de sucesso ao visitante.
- [ ] Nenhum IP ou user agent no documento gravado.
- [ ] E-mail do resultado com `reply_to` = caixa de Diagnóstico.
- [ ] Testes cobrindo os 7 cenários; `lint`, `typecheck` verdes.

## 2. Feature spec relevante

§4.1 (fluxo principal), passo 5: "Servidor: anti-spam → recalcula a pontuação a partir das respostas → grava (`form-submissions`, `data-maturity-diagnostic`, grupo do diagnóstico) → **e-mail do resultado ao lead** → aviso à caixa "Diagnóstico" → RD Station CRM (hook)."

Edge cases: e-mail pessoal recusado também no servidor; sem Resend o lead grava, `resultSentAt` fica vazio e o admin mostra; robô recebe sucesso falso sem gravar; setor inválido ignorado.

§7.1: `enviarDiagnosticoDeMaturidade(FormData)` — "grava o lead, recalcula, envia o resultado ao lead e o aviso à ATRA · Auth: não (anti-spam + limite por IP)".

## 3. Arquitetura (§4, §7)

- "**Server Actions** — contrato comum **anti-spam → grava (Postgres) → avisa (e-mail) → sincroniza (CRM)**; o aviso/CRM nunca derruba a gravação (lead perdido não volta)." Corte de campos no servidor (`MAX_CAMPO=200`, `MAX_MENSAGEM=5000`), honeypot + carimbo, limite por IP.
- "**LGPD:** `FormSubmissions` **sem IP/user-agent** … envio ao CRM exige consentimento." "**IP confiável** via `lib/ip` — lê `X-Real-Ip` do Caddy, **nunca** `x-forwarded-for` primeiro."

## 4. Plano de implementação

- `web/src/actions/diagnostico-maturidade.ts` → `enviarDiagnosticoDeMaturidade(estado, FormData)` no padrão de `actions/consultores.ts` (estado para `useActionState`, repreencher em recusa, log sem dado pessoal) e de `actions/diagnostico-rc18.ts` (revalidação no servidor, MIG-142):
  1. anti-spam (`lib/anti-spam`) e limite por IP (`lib/ip`), IP não gravado;
  2. perfil validado com `ehSetor/ehPorte/ehCargo`; contato: nome ≥ 3, e-mail válido **e** `ehEmailCorporativo`, telefone ≥ 10 dígitos, empresa; `consentimento` obrigatório;
  3. respostas chegam num campo (JSON `{ perguntaId: índice }`) → `validarRespostas(setor, …)` → `calcular` + `montarRoadmap` (motor da 022); sem nenhuma resposta válida → recusa;
  4. grava `form-submissions`: `kind: data-maturity-diagnostic`, `name/email/phone/company`, `message` com resumo curto, grupo `diagnostic` completo (formato de `topGaps` = `calculo.topGaps.join(' | ')`), `version: VERSAO`, `durationSeconds` (do carimbo de início do questionário, se vier e for plausível), UTM (padrão dos outros formulários), `source`;
  5. `montarEmailDoResultado` (024) com os textos do global (`lerDiagnosticoDeMaturidade`) → `enviarAviso({ para: email do lead, html, texto, responderPara: caixa de Diagnóstico })`; sucesso → `resultSentAt = now`;
  6. `montarAvisoParaAtra` → `enviarAviso({ para: caixa de Diagnóstico, responderPara: email do lead })`; sucesso → `notified = true`;
  7. o hook do CRM sincroniza sozinho (kind comercial, 023).
- **Caixa de Diagnóstico:** o campo por formulário (`destinoDoAviso`, PR #51) ainda não está nesta base. Até lá, `contato.email` do global Contato — isolar numa função `caixaDoDiagnostico(contato)` com comentário, para a troca ser uma linha quando o #51 entrar.
- Testes `web/src/actions/diagnostico-maturidade.test.ts` com mocks (padrão `consultores.test.ts`): envio válido (grava com kind e grupo, nota = recalculada, e-mail ao lead com html e reply_to, aviso à ATRA, `resultSentAt` e `notified`); respostas forjadas (id de outro setor, índice fora) descartadas e a nota não muda; e-mail pessoal recusado sem gravar; sem consentimento recusado; robô → sucesso falso sem gravar; Resend falha → grava, sem `resultSentAt`, sucesso ao visitante; console sem e-mail/nome/telefone; nenhum campo de IP/UA no `create`.

**Riscos:** a action não pode lançar para o cliente; banco fora do ar → erro legível.

## 5. Quality gates
- [ ] `pnpm test`, `pnpm lint`, `pnpm typecheck`
- [ ] Execução real no banco local com e-mail desligado (sem chave): grava e responde sucesso
- [ ] Security: PII (nenhum IP/UA; log sem dado pessoal), entrada não confiável (respostas, setor, links)
