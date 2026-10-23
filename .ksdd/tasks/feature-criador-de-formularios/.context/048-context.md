# Contexto de implementação — 048

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/157
**Branch:** `feature/criador-de-formularios/048-collection-formularios` (a partir da `migracao`)
**Task:** `.ksdd/tasks/feature-criador-de-formularios/048-collection-formularios.md`

## Task em uma página

- **Objetivo:** a collection "Formulários" no admin, onde o marketing monta campos, textos, o depois do envio, o aviso ao time e o que vai ao RD. Base das tarefas 049 a 053.
- **Critérios:** nove tipos de campo, rascunho e publicação, admin em português; exatamente um e-mail; identificador do RD sugerido do nome só na criação, com a validação de Integrações; `cf_` validado; testes do mapper e da sugestão; migração em banco zerado e sem diferença.
- **Fora de escopo:** envio (049), RD (050), bloco e desenho (051), lista em Integrações (052).

## Feature spec relevante (FEATURE-criador-de-formularios.md, 2.1)

> **Campos**, em ordem, com rótulo, texto de exemplo, obrigatório ou não e largura (meia ou inteira). Tipos: nome, e-mail, telefone, empresa, cargo, texto curto, texto longo, lista de opções (escolhe uma) e caixa de marcar. O e-mail é obrigatório em todo formulário.
> **Depois do envio:** uma mensagem no lugar do formulário ou ir para uma página do site escolhida no admin.
> **Aviso ao time:** os endereços que recebem o aviso do site quando o RD não aceita o lead. Vazio, vale o destino geral do contato.
> **RD Station:** identificador sugerido a partir do nome, editável, com as regras de Sistema → Integrações; tags (até 10); por campo, para onde vai no RD. Nome, e-mail, telefone, empresa e cargo vão sempre aos campos padrão; os outros escolhem entre não enviar e um `cf_…`.
> **Consentimento:** uma caixa de marcar pode ser o consentimento de comunicação.

## SPEC e arquitetura

- SPEC 6 — editor cria, edita e publica conteúdo; sem etapa de aprovação.
- ADR-002 — `push: false`: `generate:types` → `migrate:create` → `migrate`.
- ADR-009 — componente não conhece o CMS: tipos de apresentação em `types/content.ts`, conversão em `lib/mappers/`.
- CLAUDE.md, armadilha de 02/10 (`press`): collection nova ganha coluna em `payload_locked_documents_rels`, consultada a cada `update`; em banco novo, migração de dados antiga morre em "column … does not exist". Antecipada datada antes da primeira migração de dados (`20260927_215500_locked_documents_press` é o modelo).

## Estado atual do código

- `collections/Press.ts` — modelo de collection de conteúdo com rascunho (`versions.drafts`, `access.read` por `_status`).
- `globals/Integrations.ts` + `lib/formatos-de-integracao.ts` — `normalizarNome`, `ehIdentificadorDeConversao` (até 100, aceita espaço e acento), `ehTagDoRd` (até 50), validação de até 10 tags.
- `payload.config.ts` — `comRevalidacao` põe o `revalidarSite` em toda collection fora da lista de exclusão: formulário publicado muda páginas, então fica dentro.
- ⚠️ **Divergência com a FEATURE (6.1):** `pages` não tem rota genérica. Só as páginas fixas (home, sobre, contato, carreiras) e as páginas-mestras têm endereço; uma página nova em Conteúdo → Páginas não abre em lugar nenhum. A relação com `pages` não serviria para uma página de obrigado. Fica um **endereço interno digitado** (`/contato`, `/cases-de-sucesso/…`), como os destinos do rodapé e do painel do menu: o prefixo `/en` entra no mapper, e o `proxy.ts` faz a ponte dos slugs.

## Plano de implementação

- `web/src/collections/Forms.ts` (novo):
  - `name`; abas "Campos", "Botão e envio", "RD Station".
  - `fields` (array, 1–20): `type` (9 opções), `width`, `label`*, `placeholder`*, `required`, `options` (array 1–50: `label`*, `value` gerado do rótulo na criação, estável), `consent` (só caixa de marcar), `rdField` (`cf_…`, só tipos sem campo padrão). *traduzível.
  - `submitLabel`*, `notice`* (até 1500), `afterSubmit` (`message`|`page`), `successMessage`*, `redirectPath` (endereço interno validado), `notifyEmails` (até 10, e-mail).
  - `rd.conversionIdentifier`, `rd.tags` com os validadores de Integrações.
  - Validação do array: exatamente um `email`; no máximo um de cada tipo padrão (nome, telefone, empresa, cargo). Gancho: e-mail sempre obrigatório; valor das opções gerado e deduplicado; identificador sugerido do nome só em `create`.
- `web/src/lib/formularios-do-admin.ts` (novo, puro): `sugerirIdentificador`, `valorDaOpcao`, `ehCampoPersonalizadoDoRd`, `ehEnderecoInterno`, `conferirCampos`.
- `web/src/types/content.ts`: `FormularioDoAdmin` (apresentação) e `ConfigDoFormulario` (servidor: aviso e RD).
- `web/src/lib/mappers/form.ts` (novo): `toFormularioDoAdmin(doc, locale)` e `toConfigDoFormulario(doc)`, com `ConteudoIncompleto` para o que falta.
- `payload.config.ts`: registrar `Forms`.
- Migrações: `20260927_215960_locked_documents_forms` (antecipada: só a coluna) e a gerada pelo `migrate:create`.
- Testes: `lib/formularios-do-admin.test.ts`, `lib/mappers/form.test.ts`.

## Quality gates

- [ ] `corepack pnpm typecheck` · `corepack pnpm lint` · `corepack pnpm test`
- [ ] `pnpm payload migrate` num banco zerado; `migrate:create` sem diferença
- [ ] Admin conferido no navegador (criar, salvar rascunho, publicar, erros de validação)
- [ ] Revisão de código (agente)
