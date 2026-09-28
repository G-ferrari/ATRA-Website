# Contexto de implementação — Task 033

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/79
**Branch:** `feature/seletor-de-secoes/033-miniaturas` (em cima da 031) → PR para `feature/seletor-de-secoes/integracao`

## 1. Task em uma página

```yaml
id: 033 · area: frontend · priority: P0 · estimate: M · depends_on: [031, 032]
```

**Objetivo:** cada card do seletor mostra como a seção fica no site, por um script regerável.

**Critérios de aceitação**
- [ ] 28 cards com miniatura própria.
- [ ] Rodar o script de novo regrava as 28 sem passo manual.
- [ ] Teste reprova bloco sem miniatura ou com arquivo inexistente.
- [ ] Guia do editor atualizado.
- [ ] `lint`, `typecheck`, `test` verdes; conferido na homologação.

## 2. Mudança de plano: a 032 foi cancelada (28/09)

Levantamento no banco local: **os 28 blocos aparecem em alguma página real** (home, /sobre, /carreiras, /insights, /solucoes/rc18, /solucoes/inteligencia-artificial, /solucoes/cloud, /solucoes/data-analytics, /parceiros/google-cloud). O catálogo só existia para bloco sem página; sem nenhum nesse caso, a captura sai da própria página — mais fiel ao pedido ("captura real da seção") e sem rota extra a esconder da produção.

## 3. Feature spec relevante

§8.3: miniaturas no tema escuro, 480×320, recorte centrado no topo da seção. §10: 28/28 com miniatura; teste reprova bloco sem miniatura; script regera num comando.

## 4. Payload 3.88

`Block.admin.images.thumbnail: { url, alt }` (o `imageURL` antigo está depreciado); proporção 3:2.

## 5. Plano

- `RenderBlocks`: todo bloco ganha um invólucro `display: contents` com `data-bloco="<slug>"` (a emenda de fundo já usa o mesmo invólucro) — é o alvo da captura.
- `e2e/miniaturas.spec.ts`, fora da suíte padrão (`testIgnore` sem `GERAR_MINIATURAS=1`, como o gabarito): visita a página de cada bloco com **movimento reduzido** (carrossel parado, contador pronto — `?e2e=1` deixa o contador em 0 no servidor de dev), esconde o que é fixo (cabeçalho, alternador de tema, overlay do Next), captura a seção e compõe 480×320 WebP num `<canvas>` do próprio Chromium (sem `sharp`: o `node_modules` do host é do macOS e a captura roda no Linux da imagem do Playwright).
- `public/miniaturas-de-blocos/<slug>.webp` (fora de `public/admin/`, que colidiria com a rota do admin).
- `BLOCOS`: `admin.images.thumbnail` para cada bloco; teste de existência.
- Guia do editor e comando no CLAUDE.md.

## 6. Quality gates
- [ ] `pnpm lint` · `pnpm typecheck` · `pnpm test`
- [ ] Script gera as 28 e roda de novo sem erro
- [ ] CI (build de produção + e2e): o invólucro não quebra nenhum teste
