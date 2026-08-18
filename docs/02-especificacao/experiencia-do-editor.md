---
status: rascunho
atualizado_em: 2026-08-18
depende_de: [modelo-de-conteudo.md, blocos.md]
---

# Experiência do editor

> **Por que este documento existe.** O objetivo de negócio da migração é o
> marketing publicar sem depender de desenvolvedor. Até a Etapa 4, o plano cobria
> a fundo o lado dos **dados** — 15 collections, drafts, localization, a regra de
> nunca hardcodar conteúdo editável — e quase nada do lado de **quem usa**. Não
> havia uma única task cujo critério de aceite fosse "uma pessoa de marketing
> publica um case sem chamar um dev". Lacuna apontada por Leonardo em 18/08/2026.

## O critério que define sucesso

> **Uma pessoa de marketing, sem acesso ao código e sem ajuda, consegue: criar um
> case novo com imagem, ver como ficou antes de publicar, publicar, e corrigir um
> número institucional errado — tudo em português.**

Se isso não for verdade no cutover, a migração entregou SSR e SEO mas não o que a
justificou. Vira critério de conclusão da Fase 6.

## Papéis (D-18)

Dois papéis. Todo usuário tem um.

| | `editor` | `admin` |
|---|---|---|
| Cases, posts, materiais, webinars, glossário | criar, editar, **publicar**, excluir | idem |
| Páginas, soluções, segmentos | criar, editar, **publicar** | idem |
| Vagas e candidaturas | criar, editar, publicar | idem |
| Mídia | enviar, editar, excluir | idem |
| Depoimentos, parceiros, clientes, perfis | criar, editar, excluir | idem |
| `navigation`, `footer`, `contact`, `site-settings` | **ler** | editar |
| `ai-assistant` (system prompt da IA) | — | editar |
| `form-submissions` (leads) | ler | ler, editar status, excluir |
| Usuários | — | tudo |

O que separa os dois é **alcance, não conteúdo**: o editor mexe em tudo que é
conteúdo; o admin também mexe no que muda o comportamento do site (menu, rodapé,
o que a IA responde em nome da ATRA) e em dado pessoal de terceiros.

⚠️ `ai-assistant` restrito a `admin` resolve **P-20**: um campo de prompt editável
por qualquer pessoa é injeção de prompt por design.

⚠️ `form-submissions` contém dado pessoal de quem preencheu formulário —
incluindo currículo (P-17). Leitura para editor, exclusão só para admin.

### Padrão de implementação

```ts
// src/access/index.ts
export const isAdmin: Access = ({ req: { user } }) => user?.role === 'admin'
export const isEditorOrAdmin: Access = ({ req: { user } }) => Boolean(user)
export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => user?.role === 'admin'
```

Regras:
1. **Toda collection declara `access` explicitamente.** Sem declaração, o Payload
   permite a quem está autenticado — que é justamente o que queremos evitar nos
   globals.
2. O campo `role` em `users` usa `access.update: isAdminFieldLevel` — senão um
   editor se promove a admin editando o próprio perfil.
3. `read: () => true` só onde o conteúdo é público (`media`, e as collections
   consultadas pelo site).

## Sem etapa de aprovação (D-19)

Quem edita, publica. Sem workflow de revisão.

**Por quê:** o Payload não traz aprovação embutida — construir isso recria
exatamente a dependência que a migração existe para eliminar, só que trocando
"esperar o dev" por "esperar o aprovador". Os drafts já permitem trabalhar sem
expor nada, e o versionamento torna reverter trivial.

**O que compensa a ausência de aprovação:**
- `drafts: true` em tudo que tem URL pública
- Live Preview, para ver antes de publicar
- Versões, com "restaurar" disponível no admin
- D-08: nada vai ao ar sem corpo

## Idioma do admin

O Payload 3.88 **já traz tradução pt** — verificado no pacote instalado:
`Salvar`, `Criar`, `Publicar`. Só não estava configurada.

```ts
i18n: {
  supportedLanguages: { pt, en },
  fallbackLanguage: 'pt',
},
```

Distinção que confunde e vale fixar:

| | O quê | Configurado em |
|---|---|---|
| **`i18n`** | Idioma da **interface** do admin: botões, menus, mensagens de validação | `i18n` na config |
| **`localization`** | Idioma do **conteúdo**: os dois valores de cada campo traduzido | `localization` na config (D-07) |

São independentes: dá para editar conteúdo em inglês com a interface em
português. É o caso de uso real do time da ATRA.

## Live Preview

Sem isso, o editor publica no escuro e confere depois — que é o comportamento que
o CMS deveria eliminar.

```ts
admin: {
  livePreview: {
    url: ({ data, collectionConfig, locale }) =>
      `${process.env.NEXT_PUBLIC_SITE_URL}${pathFor(collectionConfig.slug, data.slug, locale.code)}?preview=1`,
    breakpoints: [
      { name: 'mobile', width: 375, height: 812, label: 'Celular' },
      { name: 'tablet', width: 768, height: 1024, label: 'Tablet' },
      { name: 'desktop', width: 1440, height: 900, label: 'Desktop' },
    ],
  },
}
```

Exige do lado do Next uma rota de draft mode que autentica o preview e busca o
rascunho em vez do publicado. Aplicar em: `cases`, `posts`, `resources`,
`webinars`, `solutions`, `segments`, `pages`.

## Organização do admin

Com 15 collections, uma lista alfabética plana é inutilizável. Agrupar por
`admin.group`:

| Grupo | Collections |
|---|---|
| **Conteúdo** | cases, posts, resources, webinars, glossary-terms |
| **Site** | pages, solutions, segments, partners, clients, testimonials |
| **Pessoas** | jobs, specialist-roles |
| **Biblioteca** | media |
| **Configurações** | navigation, footer, contact, site-settings, ai-assistant |
| **Sistema** | users, form-submissions |

Por collection, definir também:

- **`useAsTitle`** — o que aparece na lista. Nunca deixar cair no id.
- **`defaultColumns`** — para `cases`: título, cliente, status, data.
- **`listSearchableFields`** — busca por título e cliente, não por id.
- **`admin.description`** na collection: uma frase dizendo para que serve.
- **`admin.description` em todo campo** — já previsto no
  [modelo-de-conteudo](modelo-de-conteudo.md), e é o que evita o editor adivinhar
  a diferença entre "resumo" e "descrição".

## Mídia utilizável

A biblioteca vai passar de ~40 para centenas de arquivos depois da migração dos
207 posts. Sem organização, vira depósito.

- `alt` obrigatório (já implementado) — acessibilidade e busca
- Campo `category` (`case`, `post`, `logo`, `evento`, `selo`, `parceiro`) para filtrar
- `defaultColumns` com miniatura, alt e categoria
- Aviso de tamanho: acima de 2 MB, sugerir otimizar antes de subir

## Handoff

O plano tinha ~229h de engenharia e zero hora de transferência para quem vai usar.

| Entrega | Quando | Formato |
|---|---|---|
| Guia do editor | Fase 6 | Markdown com captura de tela, publicado no próprio admin |
| Sessão ao vivo (~1h) | Antes do cutover | Marketing + RH, gravada |
| Checklist "publicar um case" | Fase 6 | Uma página, impressa/fixada |
| Ponto de contato para dúvidas | Primeiros 30 dias | Definir quem |

O guia cobre: entrar, criar um case, subir imagem com alt, usar o Live Preview,
publicar, corrigir depois, e o que **não** se edita pelo CMS (microcopy de
interface — ver [inventario-conteudo](../01-descoberta/inventario-conteudo.md)).

> [!DECISÃO PENDENTE] **P-24** — quem da ATRA são as pessoas que vão editar, e
> quem é o ponto de contato nos 30 dias seguintes ao cutover? Sem nome, o
> treinamento não tem convidado e o guia não tem destinatário.

## Teste do objetivo

Na Fase 6, antes do cutover: **alguém do marketing, sem ajuda e sem acesso ao
código, executa a lista abaixo enquanto observamos.** O que travar vira correção,
não item de treinamento.

1. Entrar no admin
2. Criar um case novo com imagem e texto alternativo
3. Ver no Live Preview, no celular e no desktop
4. Publicar
5. Achar e corrigir uma métrica em `site-settings`
6. Despublicar o case criado

Se qualquer passo exigir um desenvolvedor, o objetivo da migração não foi
atingido — independentemente de o site estar rápido e indexado.
