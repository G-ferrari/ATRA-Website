# Contexto de implementação — 052

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/166
**Branch:** `feature/criador-de-formularios/052-integracoes-e-envios` (a partir da branch da 051, PR #165; PR para a `migracao`, mesclar depois do #158, #161, #163 e #165)
**Task:** `.ksdd/tasks/feature-criador-de-formularios/052-integracoes-e-envios.md`

## Task em uma página

- **Objetivo:** o marketing confere num lugar só tudo o que vai ao RD e acha os leads de cada formulário.
- **Critérios:** a lista em Integrações mostra os formulários, com os sem identificador marcados; filtrar a lista de envios por formulário mostra só os dele; nenhum dado de lead em Integrações.
- **Fora de escopo:** editar identificador ou tags pela lista.

## Feature spec relevante (FEATURE-criador-de-formularios.md, 2.1, 5.1 e 9.2)

> - **Sistema → Integrações lista os formulários do admin**, com nome, identificador, tags e o link para editar, para o marketing ver num lugar só tudo o que vai ao RD. O liga/desliga geral do RD continua valendo para eles.

> | Admin → Sistema → Integrações | Lista dos formulários do admin (nome, identificador, tags, link) | grupo do RD Station, depois dos formulários fixos | US-04 |
> | Admin → Sistema → Envios de formulário | Tipo novo "Formulário do admin"; o formulário de origem e as respostas legíveis no envio; filtro por formulário | lista e documento | conferir os leads de cada formulário |

> | Identificador repetido entre formulários mistura leads no RD | Baixo | Média | permitido de propósito (dois formulários podem ser a mesma conversão); a lista em Integrações mostra a repetição |

## Estado atual do código

- `globals/Integrations.ts`: grupo `rdStationMarketing` com a situação da chave (campo `ui`, `components/admin/situacao-da-chave-rd.tsx`, componente de servidor), liga/desliga, campos personalizados, identificadores e tags dos formulários fixos, aviso ao candidato.
- `collections/FormSubmissions.ts` (049): `form` (relação, somente leitura, só no tipo novo) e `answers` (array somente leitura: pergunta e resposta, na ordem do formulário).
- `lib/mappers/form.ts`: `toConfigDoFormulario` normaliza identificador e tags (o que vai ao RD na 050).

## Plano de implementação

- `components/admin/formularios-no-rd.tsx` (servidor) + `.module.css`: a tabela com nome (link), situação, identificador (ou "Não vai ao RD"), tags, repetição de identificador (também com os fixos) e o aviso de integração desligada. A consulta lê só `name`, `_status` e `rd`.
- `toFormularioNoRd` e `rdDoFormulario` (regra única com o envio) em `lib/mappers/form.ts`; `identificadoresRepetidos` em `lib/formularios-do-admin.ts`.
- Campo `ui` `adminForms` no grupo do RD, depois das tags; `generate:importmap`.
- Envios: `form` nas colunas padrão; o filtro sai do próprio campo de relação; rótulo das respostas "Pergunta: resposta" (`components/admin/rotulo-da-resposta.tsx`), recolhidas de saída.
- Testes: componente renderizado com `payload` falso, mapper e regra de repetição.

## Quality gates

- [ ] `typecheck` · `lint` · `test`
- [ ] `migrate:create` sem diferença (campo `ui` e configuração de admin não têm coluna)
- [ ] Capturas do admin: Integrações, lista de envios filtrada e envio aberto
- [ ] Revisão de código (agente)
