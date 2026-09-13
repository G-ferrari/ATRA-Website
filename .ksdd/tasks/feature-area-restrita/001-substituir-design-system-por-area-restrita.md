---
id: 001
title: Substituir o link Design System do rodapé por Área Restrita e remover a página /design-system
status: concluída
feature: area-restrita
area: frontend
priority: P0
estimate: S
depends_on: []
feature_refs:
  - ".ksdd/features/FEATURE-area-restrita.md#2-escopo"
  - ".ksdd/features/FEATURE-area-restrita.md#10-critérios-de-aceite"
spec_refs:
  - ".ksdd/specs/SPEC.md#71-navegação-global"
  - ".ksdd/specs/SPEC.md#78-interativas--internas"
---

# 001 — Substituir Design System por Área Restrita e remover /design-system

## Objetivo
Aposentar a vitrine interna `/design-system` e usar o único ponto de link livre do rodapé para um atalho "Área Restrita" que abre o ERP (`https://erp.atra.com.br/`) em nova aba — sem quebrar nenhuma outra rota nem os testes.

## Escopo
Feito na **ordem abaixo** para nunca deixar o typecheck quebrado num estado intermediário:

1. **Rodapé — trocar o link** em `web/src/components/layout/site-footer.tsx` (faixa inferior, hoje `<Link href={hrefDe('designSystem', locale)}>{t.designSystem}</Link>`):
   - Virar `<a href="https://erp.atra.com.br/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{t.areaRestrita}</a>`.
   - Remover o import de `hrefDe` **somente se** deixar de ser usado no arquivo (conferir).
2. **Rótulo localizado** em `web/src/lib/navegacao.ts`: substituir a chave `designSystem` por `areaRestrita` nos dois locales — `pt: 'Área Restrita'`, `en: 'Restricted Area'`.
3. **Remover a página**: apagar o diretório `web/src/app/(frontend)/[locale]/design-system/` inteiro (`page.tsx` + `bancada.tsx`).
4. **Limpeza de referência morta** em `web/src/lib/routes.ts`: remover a entrada `designSystem: { pt: 'design-system', en: 'design-system' }` (verificado: só o rodapé a consumia via `hrefDe`).
5. **Smoke test** em `web/e2e/smoke.spec.ts`: remover as linhas `'/design-system'` e `'/en/design-system'` da lista de rotas esperando 200.

## Fora de escopo
- Componentes `TabFilter` (`ui/tab-filter.tsx`) e `ChipFilter` (`ui/chip-filter.tsx`): as menções a `/design-system` são **comentários históricos**; os componentes são usados em filtros reais — **não tocar**.
- Comentário em `web/src/app/(frontend)/[locale]/roadmap/page.tsx:17` que cita `/design-system` como exemplo — pode permanecer.
- `web/e2e/paridade-ds.spec.ts` — já não usa a página (bancada saiu no MIG-059); **não alterar**.
- `ROTAS_COM_GABARITO` e gabaritos visuais — a rota **não** está sob gate; nada a mudar.
- Qualquer autenticação/SSO com o ERP — é um link simples; o login é do próprio ERP.
- Migração de schema / global `Footer` do Payload — o link é cromo hardcoded, não conteúdo de CMS.

## Critérios de aceitação
- [ ] `web/src/app/(frontend)/[locale]/design-system/` não existe mais.
- [ ] `GET /design-system` e `GET /en/design-system` respondem 404 (not-found do site), sem 500 e sem erro no log.
- [ ] O rodapé em PT mostra "Área Restrita" e em EN mostra "Restricted Area", no lugar de "Design System".
- [ ] O botão aponta para `https://erp.atra.com.br/` com `target="_blank"` e `rel="noopener noreferrer"`; clicar abre nova aba e mantém o site na aba original.
- [ ] `web/src/lib/routes.ts` não tem mais `designSystem`; `web/src/lib/navegacao.ts` tem `areaRestrita` (pt/en) e não tem mais `designSystem`.
- [ ] `web/e2e/smoke.spec.ts` não lista mais `/design-system` nem `/en/design-system`.
- [ ] Busca por `hrefDe('designSystem'` e por `/design-system` em `src/` não retorna referência de código viva (só comentários permitidos).
- [ ] Sitemap gerado não inclui `/design-system` (conferir a geração do sitemap).
- [ ] `proxy.ts` não depende da entrada `designSystem` removida (conferir antes de remover).
- [ ] `pnpm typecheck` e `pnpm lint` passam sem novos erros.
- [ ] `pnpm test:e2e -- smoke.spec.ts` passa; demais rotas continuam 200.

## Notas técnicas
- **URL externa é exceção à regra §6 do CLAUDE.md** ("URL nunca é escrita à mão"): `hrefDe`/`routes.ts` são a fonte só de **rota interna localizada**. Um destino externo absoluto vai em `<a href>` literal — exatamente como os links de redes sociais já fazem em `site-footer.tsx` (linhas ~58-69).
- **Não introduzir propriedade tipográfica/cor nova** (D-15/D-25): reaproveitar as classes do link atual (`hover:text-primary transition-colors`). Visualmente é o mesmo elemento, só muda texto e destino.
- **Ordem importa**: se remover `designSystem` de `routes.ts` (passo 4) antes de trocar o rodapé (passo 1), o `hrefDe('designSystem')` deixa de compilar. Seguir a ordem 1→5.
- A rota removida cai no `not-found` catch-all já existente do site — **não** criar redirect nem 410: a página era `noindex`, nunca esteve em menu/sitemap (SPEC §7.8; comentário em `roadmap/page.tsx:17`), então 404 é o correto.
- Rótulo é **cromo de casca** (`lib/navegacao.ts`), não conteúdo de CMS — não é decisão de marketing (D-22 não se aplica); "Restricted Area" já foi confirmado como o texto EN.

## Riscos / dependências externas
- Depende de `https://erp.atra.com.br/` estar no ar — fora do controle desta task; o link não valida o destino (comportamento correto: erro eventual é do ERP, na nova aba).
- Se a verificação do sitemap/`proxy.ts` revelar dependência inesperada da entrada `designSystem`, tratar antes de remover — mitigado pelos critérios de aceite que exigem a checagem.
