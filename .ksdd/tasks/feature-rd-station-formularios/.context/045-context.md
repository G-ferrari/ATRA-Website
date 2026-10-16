# Contexto de implementação — 045

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/136
**Branch:** `feature/rd-station-formularios/045-aviso-so-quando-o-rd-falha`, empilhada sobre a 044 (#135)
**Task:** `.ksdd/tasks/feature-rd-station-formularios/045-aviso-so-quando-o-rd-falha.md`

## Task em uma página

- **Objetivo:** um aviso por lead. RD aceitou → o RD avisa o time (automação); RD não aceitou (desligado, sem chave, sem identificador, recusou, rede) → o site manda o aviso dele, como hoje.
- **Escopo:** contato e banco de talentos (`actions/formularios.ts`). Consultores, diagnóstico e chat mantêm o aviso do site; download e newsletter não avisam o time.
- **Decisão do G-ferrari (15/10):** "RD avisa; site só se o RD falhar".

## Estado atual (lido em 16/10)

- O gancho `afterChange` (`hooks/sincronizar-rd.ts`) roda dentro do `create` e, desde a 044, grava `rd.syncedAt` com `db.updateOne` na mesma transação. Quando o `create` volta, o resultado está no banco — mas o documento devolvido pelo `create` é o de antes do gancho gravar.
- A action grava `notified` procurando "o último envio daquele e-mail" (`find` por e-mail, `-createdAt`): pode marcar um envio antigo da mesma pessoa. O `create` já devolve o id.

## Plano

1. `lib/rd-marketing.ts`: `rdAceitou(doc)` — pura, `rd.syncedAt` preenchido.
2. `actions/formularios.ts`: guardar o id do `create`; para contato e banco de talentos, reler o cadastro (`findByID`, `select: { rd: true }`) e só chamar `enviarAviso` quando `rdAceitou` for falso; `notified` gravado pelo id.
3. Testes: `actions/formularios.test.ts` (padrão de `consultores.test.ts`): RD aceitou → sem aviso; não aceitou → um aviso e `notified` pelo id; falha do aviso e da releitura não derrubam a gravação; newsletter segue mandando a confirmação.
4. Guia do editor: onde chega o aviso em cada caso.

## Quality gates

- [ ] typecheck · lint · test
- [ ] revisão de código (agente)
