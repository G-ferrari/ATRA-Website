# Context — Task 004: formulário de contato no padrão da home

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/6
**Branch:** feature/rc18 · **Depende de:** 003 ✅

## Entregue
- `web/src/app/(frontend)/[locale]/solucoes/[slug]/page.tsx` — `buscarSolucao` passou a
  ler o global `contact` (`lerContato()`) e aplicar `comContato(blocos, contato)`, como
  `lib/paginas.ts:88-90`. Antes a rota de solução não fazia isso, e o cartão de contato do
  `ctaContact` nascia vazio.
- `web/scripts/seed/solucoes-rc18.ts` — `ctaContact` agora usa `variant: 'photo'`,
  `showContactCard: true` e a **mesma foto real da home** (`public/fotos/equipe-atra.jpg`,
  via `midiaDe`), resolvida a partir de `web/` (sem tocar em `legacy/`).

## Verificação
- `/solucoes/rc18`: cartão popula `negocios@atra.com.br`, `+55 (11) 96305-2391`, endereço
  (Av. Queiroz Filho), redes sociais, e a foto (`equipe-atra.webp`). Conferido no navegador.
- Sem regressão: `/solucoes/inteligencia-artificial` (usa `ctaBanner`, não `ctaContact`) e
  `/en/solutions/artificial-intelligence` seguem 200 — `comContato` é no-op sem `ctaContact`.
- `pnpm typecheck` + `pnpm lint` verdes.

## Notas
- Lead grava `kind: contact` pelo `enviarFormulario` já existente (sem mudança de action).
- `midiaDe` deduplica pelo nome sem extensão → reusa a mesma mídia da home (idempotente).
