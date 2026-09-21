---
id: 013
title: Seção de solicitação deixa de ser estática e envia com os perfis escolhidos
status: em revisão
feature: consultores-solicitacao
area: frontend
priority: P0
estimate: M
depends_on: [010, 012]
feature_refs:
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#51-telas-modificadas"
  - ".ksdd/features/FEATURE-consultores-solicitacao.md#81-componentes-existentes-reutilizados"
spec_refs:
  - ".ksdd/specs/SPEC.md#11-interacoes-e-comportamentos"
  - ".ksdd/specs/SPEC.md#13-fluxos-criticos-user-journeys"
arch_refs:
  - ".ksdd/specs/architecture.md#4-apis-e-endpoints"
---

# 013 — Seção de solicitação viva

## Objetivo
Ligar o último formulário morto do site e fazê-lo carregar os perfis escolhidos,
o campo livre e a duração — o ponto em que o pedido vira lead.

## Escopo
- `web/src/app/(frontend)/[locale]/consultores/solicitar-consultores.tsx` deixa
  de ser estático: campos perdem `disabled`, o `<form>` ganha `action`, e o aviso
  "o envio pelo site chega em breve" (`t.aviso`, `:132-168`) sai.
- Recebe os perfis escolhidos e a quantidade da ilha da task 010, e os envia em
  **campos escondidos**.
- Mostra um resumo do que será enviado ("3 perfis, 5 pessoas"), para o visitante
  conferir antes de submeter.
- Campos: nome*, e-mail*, telefone, empresa, **duração estimada em meses**
  (opcional, único) e **campo livre** "descreva o perfil que você procura".
  O `select` de modelo de alocação existente (`:145-151`) permanece e passa a ser
  enviado.
- Confirmação inline no sucesso (padrão do projeto, SPEC §11), não modal.
- Aviso de consentimento conforme o padrão de D-29/D-30: texto provisório em
  homologação, redação final presa a P-14.
- Rótulos em PT e EN.

## Fora de escopo
- CTA "Não encontrou um consultor nesta lista?" (task 014).
- Acabamento visual (task 015) e regravação do gabarito (task 016).
- Mexer no `PainelDeContatos` à direita — fonte única compartilhada.

## Critérios de aceitação
- [ ] O formulário envia e mostra confirmação inline; nenhum campo `disabled`.
- [ ] Os perfis escolhidos e as quantidades chegam à Server Action e aparecem no
      `message` do lead.
- [ ] Enviar sem perfis **e** sem texto livre é recusado com mensagem clara.
- [ ] Nome e e-mail são obrigatórios; telefone, empresa, duração e texto livre são
      opcionais.
- [ ] UTM e `source` chegam junto (`sessionStorage` via `lib/utm.ts`).
- [ ] O `<form>` continua funcionando **sem JavaScript** para o caso do campo
      livre (SPEC §11).
- [ ] Rótulos novos existem em `pt` e `en`.
- [ ] `pnpm lint` e `pnpm typecheck` passam.

## Notas técnicas
- ⚠️ **Os campos escondidos vêm ANTES dos reais.** Tailwind 4 trocou `space-y-*`
  de `margin-top` em `> * + *` para `margin-bottom` em `> :not(:last-child)`:
  campo escondido no fim do `<form>` tira do último campo real a condição de
  último filho e soma 24px à página. E **nada de `<fieldset>`** em volta — com
  `display: contents` ele vira o único filho e o `space-y` some inteiro.
- `components/forms/formulario.tsx` tipa `kind` como
  `'contact' | 'newsletter' | 'talent-pool'` e chama `enviarFormulario` fixo.
  Duas saídas: generalizar a casca para aceitar a action, ou usar `useActionState`
  direto como faz `diagnostico-rc18/diagnostico.tsx`. **Preferir a segunda** —
  generalizar a casca mexe em formulários de rotas sob gate.
- A seção é Server Component hoje (recebe `contato`). A parte que conhece os
  perfis escolhidos precisa ser cliente; manter o `PainelDeContatos` e a foto do
  lado servidor, passando só o necessário para a ilha (regra 4).
- ⚠️ Elemento criado no servidor e passado como **prop** para componente cliente
  atravessa o RSC com `_store.validated` em 0 e o React acusa `key` faltando.
  Chave constante resolve.
- O carimbo anti-spam é escrito **depois da montagem**, por `ref`, não durante o
  render (ver a nota em `formulario.tsx:42-56`).

## Riscos / dependências externas
- **P-14** — o aviso de consentimento definitivo espera a pendência; produção
  continua bloqueada, homologação não.
