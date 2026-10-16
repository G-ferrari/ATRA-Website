# Contexto de implementação — 043

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/132
**Branch:** `feature/rd-station-formularios/043-rd-no-admin` (a partir da `migracao`)
**Task:** `.ksdd/tasks/feature-rd-station-formularios/043-rd-no-admin.md`

## Task em uma página

- **Objetivo:** em Sistema → Integrações, o marketing configura o que o site manda ao RD com os nomes de hoje — identificador de cada formulário (inclusive Trabalhe Conosco) e tags — e vê se a chave está no servidor, sem a chave aparecer.
- **Critérios:** identificador aceita "Formulário Home"; tags por formulário, newsletter com `newsletter` (também num banco que já existe); indicador "configurada/ausente" sem vazar a chave (tela, HTML, `GET /api/globals/integrations`, banco); acesso só admin; migrações em banco zerado e `migrate:create` sem diferença; testes da validação e do mapper.
- **Fora de escopo:** mandar tags/Trabalhe Conosco ao RD (044); identificador por e-book (046); chave no admin.

## Feature spec relevante (FEATURE-rd-station-formularios.md)

> **Identificadores e tags no admin.** Em Sistema → Integrações (global `integrations`), cada formulário tem o identificador de conversão e as tags. O identificador passa a aceitar o nome que o RD já usa, com espaço e acento. Hoje ele recusa.
>
> **Situação da chave no admin.** A Chave de API do RD fica no servidor (`RDSTATION_MARKETING_API_KEY`), como a do ATRAIR (D-41): é credencial, e no banco iria junto nos backups e ficaria à vista de qualquer administrador. O admin mostra só "Chave do RD: configurada" ou "ausente", sem nunca exibir a chave. Decidido em 15/10.
>
> `integrations` (global): identificador do Trabalhe Conosco; tags por formulário; validação do identificador aceita espaço e acento — migração aditiva.

## SPEC relevante

- 4.4 Globals — `integrations` é global de sistema (D-41), só admin edita.
- 6 Perfis — editor não mexe em integrações; admin sim.

## Arquitetura relevante

- ADR-002 — PostgreSQL + Drizzle, `push: false`: toda mudança de campo por `generate:types` → `migrate:create` → `migrate`.
- 5 Integrações externas — RD Station Marketing por `POST https://api.rd.services/platform/conversions` (D-54), chave no ambiente.
- Regra 7 do CLAUDE.md — nenhum segredo com `NEXT_PUBLIC_`; aqui nem o valor da chave chega ao cliente: só um booleano calculado no servidor.

## Estado atual do código (lido em 15/10)

- `web/src/globals/Integrations.ts` — grupo `rdStationMarketing`: `enabled`, `customFields`, `conversions.{contact, chatLead, newsletter, materialDownload, consultantRequest, dataMaturityDiagnostic}`; validação por `ehIdentificadorDeConversao` (`/^[a-z0-9][a-z0-9_.-]{0,99}$/i` — recusa espaço e acento).
- `web/src/lib/formatos-de-integracao.ts` — `ehIdentificadorDeConversao`, `CONVERSOES_PADRAO`.
- `web/src/lib/mappers/integracao.ts` — `toIntegracaoRd`: `undefined` = nunca gravado → padrão; `''`/`null` = apagado → formulário não vai.
- `web/src/types/content.ts` — `IntegracaoRd`.
- Nenhuma migração de dados lê o global `integrations` → sem armadilha de banco novo para colunas novas.
- ⚠️ Num global **já gravado**, coluna nova chega `null`, que o mapper lê como "apagado". Por isso a migração de dados: preencher `talentPool` e a tag `newsletter` onde estiverem vazios (padrão `20261010_000000_atra_ai_recomenda_conteudo`).

## Plano de implementação

1. **Validação** (`formatos-de-integracao.ts`): `ehIdentificadorDeConversao` aceita texto de 1 a 100 caracteres com ao menos uma letra ou dígito, sem caractere de controle e sem `< > { } \` " \`` (marca de código colado). Mensagem em português. `ehTagDoRd` para as tags (1 a 50, mesmas exclusões).
2. **Global** (`Integrations.ts`):
   - `conversions.talentPool` ("Trabalhe Conosco (banco de talentos)"), padrão `site-trabalhe-conosco` em `CONVERSOES_PADRAO`.
   - grupo `tags` com um campo `text` `hasMany` por formulário; padrão da newsletter `['newsletter']` (`TAGS_PADRAO`).
   - campo `ui` "Chave do RD" com componente de **servidor** `components/admin/situacao-da-chave-rd.tsx`, que lê `process.env.RDSTATION_MARKETING_API_KEY` e desenha só "configurada"/"ausente".
   - textos de ajuda atualizados (candidatura com currículo nunca vai; Trabalhe Conosco passa a ir com a 044).
3. **Mapper e tipos:** `IntegracaoRd.conversoes.talentos`, `IntegracaoRd.tags` (lista por formulário, aparada, sem vazias, sem repetição ignorando caixa); `undefined` → padrão.
4. **Função pura** `situacaoDaChaveRd(env)` (para teste) usada pelo componente.
5. **Migrações:** `generate:types`, `migrate:create rd_tags_e_trabalhe_conosco` (conferir o SQL: só `integrations`), migração de dados com trava (global inexistente → pula; preenche só o que estiver vazio).
6. **Guia do editor:** seção do RD.
7. **Testes:** `formatos-de-integracao.test.ts` (identificador e tag), `mappers/integracao.test.ts` (talentos, tags, padrões, null vs undefined), `situacaoDaChaveRd`.

### Pontos de risco
- `ui` field com componente de servidor no admin: primeiro do projeto (o #129 trouxe o primeiro de cliente). Conferir no admin local que renderiza e que a chave não vai ao HTML.
- `hasMany` em `text` dentro de grupo de global: tabela `integrations_texts` — conferir o SQL gerado.

## Quality gates

- [ ] `pnpm typecheck` · `pnpm lint` · `pnpm test`
- [ ] Migrações no banco local e num banco zerado; `migrate:create` sem diferença
- [ ] Admin local: campos, indicador com e sem a chave, `GET /api/globals/integrations` sem a chave
- [ ] Revisão de código (agente)
- [ ] Revisão de segurança (a task toca em credencial)
