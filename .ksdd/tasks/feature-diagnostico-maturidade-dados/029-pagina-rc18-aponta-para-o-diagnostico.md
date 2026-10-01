---
id: 029
title: Página RC18 aponta para o diagnóstico e perde o formulário de contato
status: concluída
feature: diagnostico-maturidade-dados
area: frontend
priority: P1
estimate: S
depends_on: [028]
feature_refs:
  - ".ksdd/features/FEATURE-diagnostico-maturidade-dados.md#51-telas-modificadas"
spec_refs:
  - ".ksdd/specs/SPEC.md#74-solucoes-solucoes--slug"
arch_refs:
  - ".ksdd/specs/architecture.md#adr-007--revalidacao-em-processo-ao-publicar-mig-143"
---

# 029 — Página RC18 aponta para o diagnóstico e perde o formulário de contato

## Objetivo
Cumprir a ata de 24/09 ("substituir dentro dessa página da RC18"): quem chega à RC18 vai para o diagnóstico, não para um formulário genérico.

## Escopo
- No conteúdo de `/solucoes/rc18` (CMS): o CTA "Verificar diagnóstico" do herói e o do banner final passam a `/diagnostico-maturidade?setor=financeiro`; o bloco `ctaContact` sai, e o item "Contato" do submenu da página junto.
- Entrega na homologação por **migração de dados com guarda** (padrão do PR #50: só age se o layout ainda for o do seed da RC18; senão só avisa no log) **ou** roteiro para o admin — decidir com o G-ferrari no início da task.
- Seed `solucoes-rc18.ts` atualizado para ambientes novos.
- Roteiro para o admin: CTAs para o diagnóstico nas páginas de segmento e de normativa, com o `?setor=` de cada uma (mapa segmento → setor na nota técnica).

## Fora de escopo
- Texto da página (D-22).

## Critérios de aceitação
- [ ] `/solucoes/rc18` não tem mais formulário e seus CTAs de diagnóstico apontam para a rota nova com `setor=financeiro`.
- [ ] Se a página já tiver sido editada no admin, a migração não altera nada e registra o aviso.
- [ ] Smoke da RC18 atualizado; `lint`, `typecheck` verdes.

## Notas técnicas
- Mapa segmento → setor do quiz: bancos-seguradoras-servicos-financeiros → financeiro · educacao → educacao · saude → saude · telecom → telecom · varejo, industria, logistica → varejo ("Varejo, Indústria e Serviços") · utilidades → outros. Capitais e Seguros não têm segmento próprio no site; ficam alcançáveis pelo seletor.

## Riscos / dependências externas
- Validação jurídica das normas antes de linkar publicamente (FEATURE §9.1).
