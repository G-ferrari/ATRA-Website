---
id: 051
title: Desenhar a seção "Formulário" no site, com os nove tipos de campo e o depois do envio
status: para implementar
feature: criador-de-formularios
area: frontend
priority: P0
estimate: L
depends_on: [048, 049]
feature_refs:
  - ".ksdd/features/FEATURE-criador-de-formularios.md#21-o-que-entra-v1"
  - ".ksdd/features/FEATURE-criador-de-formularios.md#51-telas-modificadas"
  - ".ksdd/features/FEATURE-criador-de-formularios.md#82-componentes-novos-necessários"
  - ".ksdd/features/FEATURE-criador-de-formularios.md#10-critérios-de-aceite"
spec_refs:
  - ".ksdd/specs/SPEC.md#8-componentes-globais-reutilizáveis"
  - ".ksdd/specs/SPEC.md#10-responsividade"
arch_refs:
  - ".ksdd/specs/architecture.md#adr-009--componente-não-conhece-o-cms-mappers-como-fronteira-regra-3"
  - ".ksdd/specs/architecture.md#adr-003--i18n-pt-na-raiz-en-em-en-com-slugs-traduzidos-d-07"
---

# 051 — Seção "Formulário"

## Objetivo
Pôr qualquer formulário publicado numa página, com o desenho dos formulários do site, para o visitante preencher e ver a confirmação.

## Escopo
- Bloco `formSection` em `blocks/index.ts`: formulário (relação com `forms`), título, texto, forma (sozinho centralizado ou com o texto ao lado) e `camposComuns` (fundo, borda, âncora). Entra em Páginas, Soluções, Segmentos e Parceiros pelos `BLOCOS`.
- Mapper do bloco; formulário em rascunho, despublicado ou apagado → a seção não desenha nada no site, e no preview desenha o rascunho.
- Componente da seção, com a casca `Formulario` generalizada (carimbo, UTM, estado de envio, rastreio do envio) e os campos nos estilos de `contato-com-foto`/`bloco-contato`:
  - os nove tipos, com largura meia ou inteira (no celular, sempre inteira);
  - lista de opções e caixa de marcar, que o site ainda não tem, acessíveis por teclado e com rótulo ligado ao campo;
  - erro por campo, vindo do servidor (049);
  - aviso acima do botão;
  - depois do envio: a mensagem no lugar do formulário, ou navegação para a página escolhida.
- Funciona sem JavaScript (o `<form action>` da Server Action).
- Dois idiomas: rótulos, exemplos e mensagens no idioma da página.
- Migração aditiva das tabelas do bloco, com a **antecipada** (o adapter faz JOIN em toda tabela de bloco a cada consulta).

## Fora de escopo
- A miniatura do seletor e o e2e (053).
- Download depois do envio, campo oculto, anexo (fora da v1).

## Critérios de aceitação
- [ ] Capturas a 1280 e 390 px, nos dois temas, das duas formas da seção, com os nove tipos de campo, um erro e a mensagem de sucesso.
- [ ] Campo com 16px no celular; contraste conferido nos dois temas (`e2e/contraste.spec.ts` não piora).
- [ ] Teclado: tab passa por todos os campos na ordem, a caixa de marcar e a lista funcionam sem mouse.
- [ ] Com JavaScript desligado, o envio grava e mostra a confirmação.
- [ ] Testes unitários do mapper do bloco (formulário publicado, rascunho, apagado).
- [ ] `pnpm migrate` num banco zerado passa; `migrate:create` sem diferença.

## Notas técnicas
- Rodar `/impeccable shape` antes de desenhar e `polish` depois (D-31); seguir DESIGN.md (6px, sem borda em caixa, Regra do Par).
- Nada de `space-y` com campo escondido no fim do `<form>` (armadilha dos 24px no CLAUDE.md): escondidos vêm antes.

## Riscos / dependências externas
- Se a #215 (escala de letras, PR #155) ainda não estiver mesclada, alinhar os tamanhos com ela no merge.
