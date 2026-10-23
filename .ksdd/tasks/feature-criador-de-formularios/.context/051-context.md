# Contexto de implementação — 051

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/164
**Branch:** `feature/criador-de-formularios/051-secao-formulario` (a partir da branch da 050, PR #163; PR para a `migracao`, mesclar depois do #158, do #161 e do #163)
**Task:** `.ksdd/tasks/feature-criador-de-formularios/051-secao-formulario.md`

## Task em uma página

- **Objetivo:** pôr qualquer formulário publicado numa página, com o desenho dos formulários do site, para o visitante preencher e ver a confirmação.
- **Critérios:** capturas a 1280 e 390, nos dois temas, das duas formas, com os nove tipos, um erro e o sucesso; campo com 16px no celular e contraste nos dois temas; teclado; envio sem JavaScript; testes do mapper (publicado, rascunho, apagado); migração em banco zerado e sem diferença.
- **Fora de escopo:** e2e (053); download depois do envio, campo oculto, anexo.

## Feature spec relevante (FEATURE-criador-de-formularios.md, 2.1, 4.1, 8)

> - **Seção "Formulário"** (bloco novo) para pôr um formulário publicado em qualquer página montada por blocos (Páginas, Soluções, Segmentos, Parceiros). A seção tem título, texto e duas formas: o formulário **sozinho, centralizado**, ou **com o texto ao lado**. Ganha miniatura no seletor de seções, como as outras.

> Seção com formulário em rascunho → o site não desenha nada; o preview mostra o rascunho.

> | Campos e botão dos formulários atuais (`contato-com-foto`, `bloco-contato`) | seção "Formulário" | mesmos estilos de campo, foco e erro, nos dois temas |
> | `Formulario` (casca cliente: carimbo, UTM, estado de envio) | seção "Formulário" | generalizada para o formulário do admin |

> Os do DESIGN.md: raio de 6px, sem borda em caixa, campo com 16px no celular (D-65), contraste medido nos dois temas.

## Estado atual do código

- `blocks/index.ts` + `BLOCOS` (Páginas, Soluções, Segmentos, Parceiros); `GRUPO_DO_BLOCO`; `index.test.ts` exige grupo e miniatura em `public/miniaturas-de-blocos/`.
- `lib/mappers/blocks.ts` (`toBlocos`), chamado em `lib/paginas.ts` e nas rotas de solução, segmento e parceiro, todas com `depth: 2` e `draft` no preview.
- `components/forms/formulario.tsx`: a casca dos formulários de hoje. ⚠️ Embrulha a action numa função do navegador antes do `useActionState`.
- 049: `enviarFormularioDoAdmin(dados)` (`formulario`, `locale`, `campo-<id>`, anti-spam, `redirect` fora do `try`).
- Preview: modo rascunho do Next (`/api/preview`), renderizado no servidor; `Forms` já está em `comRevalidacao`.

## Design (Impeccable)

Sem a entrevista do `shape`: a especificação já fixou as duas formas e o estilo dos campos (os do contato, que a home define). Decisões tomadas aqui:
- rótulo visível acima de cada campo (o texto de exemplo é só exemplo), asterisco nos obrigatórios;
- o formulário num cartão (tom de superfície e sombra leve, sem borda), 12px por ser superfície grande;
- foco e erro engrossam o traço para 2px; erro ao lado do campo, no idioma da página (`noValidate`);
- sucesso no lugar do formulário, com o foco nele; erro leva o foco ao primeiro campo recusado;
- com o texto ao lado, o texto fica preso no alto enquanto o formulário rola (lg).

## Plano de implementação

- Bloco `formSection` (formulário, título, texto, forma, `camposComuns`) no grupo "Chamadas e contato"; migração gerada (idempotente) e antecipada `20260927_220000` sem as chaves para `forms`.
- `toBlocos` ganha o 3º argumento (`locale`, `rascunho`); o formulário vem populado e o `_status` dele decide; aviso do preview para formulário sem escolha, incompleto ou com alterações não publicadas.
- `components/forms/campos-ocultos.tsx` (origem, carimbo, UTM, isca, extraídos de `Formulario` sem mudar o HTML); `components/forms/formulario-da-secao.tsx` (os nove tipos); `components/blocks/bloco-formulario.tsx` (as duas formas).
- `enviarFormularioDoAdminNoEstado`: a action entregue direto ao `useActionState` (funciona sem JS), devolvendo o que foi digitado quando há erro.
- Testes: mapper (`blocks.test.ts`), action (`formularios-do-admin.test.ts`), registro (`index.test.ts`).

## Quality gates

- [ ] `typecheck` · `lint` · `test`
- [ ] Migração em banco zerado e num banco existente; `migrate:create` sem diferença
- [ ] Capturas 1280/390 × claro/escuro × duas formas, erro, sucesso, inglês e preview
- [ ] Sem JavaScript: erro, envio gravado e o "ir para outra página"
- [ ] Teclado e contraste
- [ ] Detector do Impeccable
- [ ] Revisão de código (agente)
