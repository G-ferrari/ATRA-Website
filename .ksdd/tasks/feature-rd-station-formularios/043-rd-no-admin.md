---
id: 043
title: Configurar o RD no admin — identificadores livres, tags, Trabalhe Conosco e situação da chave
status: para implementar
feature: rd-station-formularios
area: data-model
priority: P0
estimate: M
depends_on: []
feature_refs:
  - ".ksdd/features/FEATURE-rd-station-formularios.md#21-o-que-entra-v1"
  - ".ksdd/features/FEATURE-rd-station-formularios.md#62-alterações-em-entidades-existentes"
  - ".ksdd/features/FEATURE-rd-station-formularios.md#10-critérios-de-aceite"
spec_refs:
  - ".ksdd/specs/SPEC.md#44-globals"
  - ".ksdd/specs/SPEC.md#6-perfis-de-usuário-e-permissões"
arch_refs:
  - ".ksdd/specs/architecture.md#34-globals"
  - ".ksdd/specs/architecture.md#5-integrações-externas"
  - ".ksdd/specs/architecture.md#adr-002--postgresql--drizzle-migração-versionada-com-push-false-d-01-d-21"
---

# 043 — Configurar o RD no admin

## Objetivo
Dar ao marketing, em Sistema → Integrações, tudo o que precisa para o site falar com o RD com os mesmos nomes de hoje: identificador de cada formulário (inclusive Trabalhe Conosco), tags, e a confirmação de que a chave está no servidor — sem programador e sem expor a chave.

## Escopo
- Global `integrations`, grupo do RD Station:
  - Identificador de conversão do **Trabalhe Conosco** (`talentPool`), com padrão em `CONVERSOES_PADRAO`.
  - **Tags por formulário** (contato, newsletter, download de material, Trabalhe Conosco e os demais que já têm identificador). Padrão da newsletter: `newsletter`.
  - **Validação do identificador** passa a aceitar o nome que o RD já usa — espaço e acento incluídos (ex.: "Formulário Home"); recusa só vazio-com-espaços, caractere de controle e texto acima de um teto. `ehIdentificadorDeConversao` e os testes acompanham.
  - **Situação da chave**: campo só de leitura ("Chave do RD: configurada / ausente"), calculado no servidor a partir de `process.env.RDSTATION_MARKETING_API_KEY`. Só o booleano sai do servidor.
- Mapper (`toIntegracaoRd`) e tipos de apresentação com as tags por formulário.
- Migração de schema (`migrate:create`) e migração de dados com trava: o global já existe, então o `defaultValue` não se aplica — gravar a tag `newsletter` e o identificador do Trabalhe Conosco só se estiverem vazios (padrão D-56/`atra-ai`).
- Guia do editor: seção do RD (o que cada campo faz, que os nomes têm de ser os mesmos do RD, que a chave é com o Léo).

## Fora de escopo
- Mandar as tags e o Trabalhe Conosco ao RD (044).
- Identificador por e-book (046).
- Pôr a chave no admin — decidido em 15/10 que ela fica no servidor.

## Critérios de aceitação
- [ ] O admin aceita e grava "Formulário Home" como identificador; recusa só texto vazio ou inválido, com mensagem em português.
- [ ] Tags por formulário editáveis; a newsletter nasce (e num banco que já existe, passa a ter) `newsletter`.
- [ ] Com `RDSTATION_MARKETING_API_KEY` no ambiente o admin mostra "configurada"; sem, "ausente". A chave não aparece na tela, no HTML do admin, na resposta de `GET /api/globals/integrations` nem no banco.
- [ ] Só administrador edita o grupo (acesso atual do global mantido).
- [ ] `migrate:create` sem diferença depois; migrações rodam num banco zerado (`pnpm migrate`).
- [ ] Testes unitários da validação do identificador e do mapper.

## Notas técnicas
- A situação da chave é um campo `ui` com componente de servidor (o projeto ganhou o primeiro componente de admin em `components/admin/` no #129; ver `campo-de-icone.tsx` e o `importMap`). Componente de servidor lê o ambiente na renderização; nunca passar o valor como prop para cliente.
- Tags: avaliar `text` com `hasMany: true` (gera tabela própria) contra um texto separado por vírgula; o primeiro dá melhor edição, o segundo dispensa tabela.
- ⚠️ Armadilha do banco novo (CLAUDE.md): se alguma migração de dados antiga lê o global `integrations` com o config de hoje, a coluna/tabela nova precisa de migração antecipada idempotente datada antes dela. Conferir com `grep "slug: 'integrations'" src/migrations`.
- ⚠️ `defaultValue` de texto que vem do ambiente é função (D-41); aqui os padrões são literais, sem ambiente.

## Riscos / dependências externas
- Os nomes reais (identificadores e tags do RD) só chegam na 047; aqui ficam padrões editáveis.
