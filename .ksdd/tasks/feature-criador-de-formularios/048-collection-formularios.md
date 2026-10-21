---
id: 048
title: Criar a collection "Formulários" no admin, com os campos, o depois do envio e o grupo do RD
status: em revisão
feature: criador-de-formularios
area: data-model
priority: P0
estimate: M
depends_on: []
feature_refs:
  - ".ksdd/features/FEATURE-criador-de-formularios.md#21-o-que-entra-v1"
  - ".ksdd/features/FEATURE-criador-de-formularios.md#41-criar-e-publicar-um-formulário"
  - ".ksdd/features/FEATURE-criador-de-formularios.md#61-novas-entidades"
  - ".ksdd/features/FEATURE-criador-de-formularios.md#92-riscos"
spec_refs:
  - ".ksdd/specs/SPEC.md#21-marina--editora-de-marketing-usuária-primária-do-cms"
  - ".ksdd/specs/SPEC.md#6-perfis-de-usuário-e-permissões"
arch_refs:
  - ".ksdd/specs/architecture.md#3-modelo-de-dados-schemas"
  - ".ksdd/specs/architecture.md#adr-002--postgresql--drizzle-migração-versionada-com-push-false-d-01-d-21"
  - ".ksdd/specs/architecture.md#adr-009--componente-não-conhece-o-cms-mappers-como-fronteira-regra-3"
---

# 048 — Collection "Formulários"

## Objetivo
Dar ao marketing o lugar onde montar um formulário: campos, textos, o que acontece depois do envio, quem recebe o aviso e o que vai ao RD. É a base de todas as outras tarefas da feature.

## Escopo
- Collection `forms` (Conteúdo → Formulários), com rascunho e publicação; leitura pública só do publicado, edição por editor e admin.
- Campos do formulário:
  - **Nome** (interno, obrigatório).
  - **Campos** (array, em ordem): tipo (nome, e-mail, telefone, empresa, cargo, texto curto, texto longo, lista de opções, caixa de marcar), rótulo e texto de exemplo (traduzíveis), obrigatório, largura (meia ou inteira); opções (rótulo traduzível + valor estável) só na lista; "é o consentimento de comunicação" só na caixa de marcar; destino no RD (não enviar ou `cf_…`) só nos tipos sem campo padrão.
  - O **e-mail vem sempre**, obrigatório, e não sai: o formulário nasce com ele e a validação recusa salvar sem exatamente um campo de e-mail.
  - **Botão** (texto traduzível) e **aviso acima do botão** (texto longo traduzível, opcional).
  - **Depois do envio:** mensagem (traduzível) ou página do site (relação com `pages`), com a escolha num campo próprio.
  - **Aviso ao time:** lista de e-mails (opcional).
  - **RD Station:** identificador de conversão sugerido a partir do nome (gancho que preenche só quando está vazio; editável) e tags (até 10), com a mesma normalização e validação de `globals/Integrations.ts` (`lib/formatos-de-integracao.ts`).
- Descrições no admin em português claro, incluindo o que **não** pedir num formulário (documento, dado de saúde, anexo).
- Tipos de apresentação em `types/content.ts` e o mapper (`lib/mappers/`), que converte o formulário publicado para o componente; nenhum componente importa `payload-types`.
- Migração versionada e a **antecipada** datada antes da primeira migração de dados, com `IF NOT EXISTS`, cobrindo a tabela nova e a coluna da collection em `payload_locked_documents_rels` (armadilha da `press` no CLAUDE.md).

## Fora de escopo
- O envio (049), o RD (050), o bloco e o desenho no site (051), a lista em Integrações (052).

## Critérios de aceitação
- [ ] Um editor cria, salva em rascunho e publica um formulário com os nove tipos de campo; o admin está todo em português.
- [ ] Não é possível salvar um formulário sem o campo de e-mail, nem com dois.
- [ ] O identificador do RD aparece preenchido a partir do nome ao salvar pela primeira vez e não muda sozinho depois; nome fora do formato é recusado com a mensagem de Integrações.
- [ ] `cf_` inválido (sem o prefixo, com espaço) é recusado no campo do destino.
- [ ] Testes unitários do mapper (formulário publicado → tipo de apresentação; opções; consentimento; depois do envio) e da sugestão de identificador.
- [ ] `pnpm migrate` num banco zerado passa; `migrate:create` sem diferença em seguida.

## Notas técnicas
- Seguir `collections/Resources.ts` e `collections/Press.ts` como modelo de collection com rascunho; `globals/Integrations.ts` para os validadores do RD.
- A sugestão do identificador reaproveita `normalizarNome`; acento e espaço são aceitos (043).
- Valor da opção estável (gerado do rótulo em português ao criar), para o envio gravado continuar legível se o rótulo mudar.

## Riscos / dependências externas
- Collection nova em banco novo: sem a antecipada, migrações de dados antigas quebram em "column ... does not exist" (CLAUDE.md, 02/10).
