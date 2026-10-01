# Contexto de implementação — Task 029

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/66
**Branch:** `feature/diagnostico-maturidade-dados/029-pagina-rc18` → PR para `feature/diagnostico-maturidade-dados/integracao`

## 1. Task em uma página

```yaml
id: 029
title: Página RC18 aponta para o diagnóstico e perde o formulário de contato
area: frontend · priority: P1 · estimate: S · depends_on: [028]  # concluída
```

**Critérios de aceitação**
- [ ] `/solucoes/rc18` não tem mais formulário e seus CTAs de diagnóstico apontam para a rota nova com `setor=financeiro`.
- [ ] Se a página já tiver sido editada no admin, a migração não altera nada e registra o aviso.
- [ ] Smoke da RC18 atualizado; `lint`, `typecheck` verdes.

## 2. Decisão de entrega (26/09, G-ferrari): migração de dados com trava

Mesmo padrão do PR #50 (`src/migrations/20260926_171500_alocacao_de_consultores.ts`): só age se a página ainda for a do seed; senão avisa no log e não toca. Sem snapshot `.json` (schema não muda). Grava só o que muda.

## 3. O que muda na página (conteúdo no CMS, documento `solutions` slug `rc18`)

- Herói (`pageHero`): o CTA "Verificar diagnóstico" (`/diagnostico-rc18`) → `/diagnostico-maturidade?setor=financeiro`. `href` **não é localizado** (comentário do seed, linha ~190) — gravar em PT com os ids preservados vale para os dois idiomas.
- Bloco final `ctaContact` (âncora `contato`, item "Contato" do submenu) **sai**. O submenu (`stickyPageNav`) se monta das âncoras — conferir que o item some sozinho.
- Qualquer outro link para `/diagnostico-rc18` no layout → rota nova (o seed tem só o do herói; conferir o banco).

## 4. Trava

A migração age só se: existe o doc `rc18`; o layout (tipos em ordem) é exatamente o do seed (`pageHero, stickyPageNav, audienceSplit, iconCardGrid, accordionSteps, audienceSplit, processSteps, processSteps, ctaBanner, ctaContact`); e o herói ainda tem um CTA com `href` `/diagnostico-rc18`. Qualquer desvio → `payload.logger.warn` e sai. Atualização preservando os `id` de todos os blocos e itens (reenviar o layout lido com `depth: 0`, alterado só onde precisa), para não perder textos localizados (armadilha do CLAUDE.md, `casarIds`).

## 5. Também

- Seed `scripts/seed/solucoes-rc18.ts`: `HREF_DIAGNOSTICO` → rota nova; bloco `ctaContact` fora; comentários de topo atualizados (o formulário saiu por decisão da ata de 24/09 / D-35).
- Smoke: o que testa formulário/"Contato" na RC18 muda; afirmar que o CTA leva a `/diagnostico-maturidade?setor=financeiro` e que não há `#contato`.
- Rota de solução: se `comContato` só existia por causa do `ctaContact` da RC18, **não** remover (outras soluções podem ter `ctaContact`).
- Roteiro para o admin no PR (não é código): CTAs para o diagnóstico nas páginas de segmento, com o mapa segmento → setor: bancos-seguradoras-servicos-financeiros → financeiro · educacao → educacao · saude → saude · telecom → telecom · varejo, industria, logistica → varejo · utilidades → outros.

## 6. Quality gates
- [ ] Testar os dois caminhos no banco local: página no formato do seed → migração aplica; página editada → não mexe (mesmo `updatedAt`)
- [ ] `/solucoes/rc18` e `/en/solutions/rc18` → 200, sem `id="contato"`, com o link novo
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`
