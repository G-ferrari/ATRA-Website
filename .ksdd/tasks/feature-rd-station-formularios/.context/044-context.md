# Contexto de implementação — 044

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/134
**Branch:** `feature/rd-station-formularios/044-conversao-com-tags-e-candidatos`, empilhada sobre a da 043 (#133, em revisão — o G-ferrari mandou seguir em 16/10)
**Task:** `.ksdd/tasks/feature-rd-station-formularios/044-conversao-com-tags-e-candidatos.md`

## Task em uma página

- **Objetivo:** cada conversão chega ao RD com as tags do formulário; o banco de talentos (Trabalhe Conosco) passa a ir, sem currículo.
- **Critérios:** corpo da conversão com tags (contato, newsletter confirmada); banco de talentos com identificador e tag próprios, `linkedin`, área/senioridade só com campos personalizados ligados; nenhum corpo de `talent-pool` com currículo, arquivo ou link de `private-files`; `job-application` fora; ATRAIR igual; integração desligada ou sem chave → nada vai, motivo em `rd.error`.
- **Fora:** aviso do time (045); identificador por e-book (046); `legal_bases` além da newsletter (P-14).

## Feature spec relevante

> **Trabalhe Conosco no RD** (o banco de talentos de `/carreiras`, kind `talent-pool`): vira conversão, com identificador e tag próprios. Vão nome, e-mail, telefone e LinkedIn (campo padrão do RD), mais área e senioridade nos campos personalizados que a conta já tiver. **O currículo nunca vai ao RD.** O envio ao ATRAIR continua como está. Isso revê a D-29 por decisão da ATRA e entra como decisão nova em `decisoes.md`.
>
> **Tags na conversão.** Cada conversão leva as tags do formulário. A newsletter leva `newsletter`.

Decidido por G-ferrari em 15/10: "Vai ao RD, sem o currículo".

## Estado atual do código (lido em 16/10)

- `lib/rd-marketing.ts`: `KINDS_COMERCIAIS` (sem `talent-pool`, comentário citando a D-29); `identificadorDe(kind, conversoes)`; `montarPayload` (sem `tags`); `camposPersonalizados` manda `message` como `cf_site_mensagem` para **qualquer** kind.
- `actions/formularios.ts`: o banco de talentos serializa LinkedIn/área/senioridade **dentro de `message`** (MIG-102). ⚠️ Com o kind indo ao RD e os campos personalizados ligados, o texto livre iria como `cf_site_mensagem` — por isso os extras ganham campos estruturados e a mensagem do banco de talentos não vai ao RD.
- `collections/FormSubmissions.ts`: grupo `diagnostic` é o modelo (grupo condicionado ao kind, somente leitura).
- Nenhuma migração lê `form-submissions` → sem armadilha de banco novo.
- `job-application` grava `cv` (relação com `private-files`); `talent-pool` não tem arquivo.

## Plano de implementação

1. `FormSubmissions`: grupo `talent` (`linkedin`, `area`, `seniority`), só para `talent-pool`, somente leitura. `generate:types` + `migrate:create`.
2. `actions/formularios.ts`: grava o grupo `talent` (mantém a mensagem serializada, que o admin e o aviso por e-mail já usam).
3. `lib/rd-marketing.ts`:
   - `formularioDoRd(kind)` → `FormularioDoRd | null` (fonte única do mapeamento kind → formulário); `identificadorDe` passa por ela; `talent-pool` → `talentos`.
   - `KINDS_COMERCIAIS` → `KINDS_PARA_O_RD`, com `talent-pool`; comentário revendo a D-29 (D-62).
   - `montarPayload`: `tags` do formulário (quando houver); `linkedin` no banco de talentos; `camposPersonalizados`: `cf_area_de_atuacao` e `cf_nivel` (nomes do formulário do WordPress — a confirmar na 047) e **nunca** `message` no banco de talentos.
   - `LeadParaRd.talent`.
4. `Integrations.ts`: descrição de "Enviar campos personalizados" com os dois campos novos.
5. Docs: D-62 em `decisoes.md`; parágrafo do RD no `CLAUDE.md`.
6. Testes (`rd-marketing.test.ts`): espelho da lista com `talent-pool`; `identificadorDe`/`formularioDoRd`; tags no corpo; `linkedin`; `cf_` de candidato só com campos ligados; corpo de candidato sem `message`, `cv` nem `private-files`; `job-application` fora.

## Quality gates

- [ ] typecheck · lint · test
- [ ] migrações no banco local e zerado; `migrate:create` sem diferença
- [ ] revisão de código (agente); revisão de segurança/LGPD (agente: dado de candidato indo a base de marketing)
