---
id: 004
title: Formulário de contato na página RC18 no padrão da home
status: em revisão
feature: rc18
area: frontend
priority: P0
estimate: S
depends_on: [003]
feature_refs:
  - ".ksdd/features/FEATURE-rc18.md#51-telas-modificadas"
  - ".ksdd/features/FEATURE-rc18.md#42-contato-direto-pela-pagina"
spec_refs:
  - ".ksdd/specs/SPEC.md#8-componentes-globais-reutilizaveis"
  - ".ksdd/specs/SPEC.md#132-visitante-converte-por-formulario"
arch_refs:
  - ".ksdd/specs/architecture.md#4-apis-e-endpoints"
---

# 004 — Formulário de contato na página RC18 no padrão da home

## Objetivo
Fazer o bloco `ctaContact` da página RC18 funcionar igual ao da home — com o cartão de
contato (telefone/e-mail/endereço/redes) populado — gravando o lead como `kind: contact`.

## Escopo
- Estender `buscarSolucao` em
  `web/src/app/(frontend)/[locale]/solucoes/[slug]/page.tsx` para chamar
  `comContato(blocos, contato)` ao montar os blocos, espelhando o loader de páginas
  (`web/src/lib/paginas.ts:88-90`) — hoje a rota de solução **não** chama `comContato`, e o
  cartão do `ctaContact` fica `null`.
- Buscar o global `contact` (não localizado) na mesma consulta da solução (depth adequado).
- Confirmar no seed (task 003) que o `ctaContact` da RC18 usa a variante do padrão da home
  (`variant: 'photo'` se for para bater com a home) e `showContactCard: true`.
- Verificar que o formulário usa `kind: 'contact'` (já aceito por `enviarFormulario`).

## Fora de escopo
- Alterar a Server Action `enviarFormulario` (`actions/formularios.ts`) — `contact` já é aceito.
- O formulário/lead do diagnóstico (tasks 006–007).
- Mudar o comportamento de outras páginas de solução que não tenham `ctaContact`.

## Critérios de aceitação
- [ ] Em `/solucoes/rc18`, o bloco de contato mostra o formulário **e** o cartão de contato
      populado (telefone/e-mail/endereço/redes), como na home.
- [ ] Enviar o formulário grava `FormSubmissions` com `kind: contact` (anti-spam → grava →
      notifica → CRM); robô (honeypot/carimbo) recebe sucesso falso e não grava.
- [ ] Páginas de solução **sem** `ctaContact` continuam idênticas (nenhuma regressão) — o
      `comContato` é no-op quando não há bloco de contato.
- [ ] A âncora `#fale-conosco` leva à seção de contato (usada pelo menu fixo da página).
- [ ] `pnpm typecheck` e `pnpm lint` verdes.

## Notas técnicas
- `comContato` vive em `web/src/lib/mappers/blocks.ts:658` e só é chamado hoje em
  `lib/paginas.ts` — por isso o cartão nasce vazio na rota de solução.
- Mapper é a fronteira (regra 3): a injeção do contato acontece no loader/mapper, não no
  componente.
- Não escrever telefone/e-mail à mão — vêm do global `Contact` (dois formatos do telefone,
  D-15).

## Riscos / dependências externas
- Nenhuma dependência externa. Depende do doc RC18 existir com o bloco `ctaContact` (task 003).
