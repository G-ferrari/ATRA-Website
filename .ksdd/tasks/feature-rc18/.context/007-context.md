# Context — Task 007: captura de lead do diagnóstico

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/9
**Branch:** feature/rc18 · **Depende de:** 006 ✅

## Entregue
- `web/src/collections/FormSubmissions.ts` — `kind` ganhou `rc18-diagnostic`. Migração
  aditiva `20260913_211713_add_rc18_diagnostic_kind` (ADD VALUE) — aplicada.
- `web/src/lib/crm.ts` — `rc18-diagnostic` entrou em `KINDS_COMERCIAIS` e no `ROTULO`
  ("Diagnóstico RC 18/2025"), então o hook `afterChange` sincroniza como lead comercial (D-29).
- `web/src/actions/diagnostico-rc18.ts` — Server Action `enviarDiagnosticoRc18` no contrato
  anti-spam → grava → avisa. Recalcula o índice **no servidor** a partir de `respostas` cruas
  (`validarRespostas` + `calcularIndice`) e grava o resumo em `message` (teto 5000). Sem flag
  de env (é lead core, como o contato).
- `web/src/app/(frontend)/[locale]/diagnostico-rc18/diagnostico.tsx` — formulário de captura
  no resultado (nome/e-mail/telefone/instituição + escondidos carimbo/UTM/isca + `respostas`
  em hidden JSON), `useActionState`, estado de sucesso. Link secundário para o contato.

## Verificação (end-to-end no navegador)
- Respondi as 12 → resultado → preenchi e-mail → enviei → "Recebemos seu diagnóstico...".
- No banco: 1 `form-submissions` kind `rc18-diagnostic`, status `new`, `notified: false`
  (sem Resend — grava mesmo assim), `crm.syncedAt` vazio (sem token — pendente, D-29), e
  `message` com o resumo recalculado no servidor (índice 100%, respostas por dimensão).
- Depois removi o lead de teste do banco de dev.
- `typecheck` + `lint` verdes; `pnpm test crm diagnostico-rc18` = 22 verdes.
