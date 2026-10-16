---
id: 045
title: Avisar o time pelo site só quando a conversão não chegou ao RD
status: para implementar
feature: rd-station-formularios
area: backend
priority: P0
estimate: M
depends_on: [044]
feature_refs:
  - ".ksdd/features/FEATURE-rd-station-formularios.md#21-o-que-entra-v1"
  - ".ksdd/features/FEATURE-rd-station-formularios.md#41-lead-de-contato-home-contato-páginas-de-solução"
  - ".ksdd/features/FEATURE-rd-station-formularios.md#10-critérios-de-aceite"
spec_refs:
  - ".ksdd/specs/SPEC.md#132-visitante-converte-por-formulário"
arch_refs:
  - ".ksdd/specs/architecture.md#4-apis-e-endpoints"
  - ".ksdd/specs/architecture.md#5-integrações-externas"
---

# 045 — Aviso do time só quando o RD falha

## Objetivo
Um aviso por lead, nem zero nem dois: quando o RD aceita a conversão, quem avisa o time é a automação do RD (como no site atual); quando não aceita, o site manda o aviso dele, como hoje.

## Escopo
- `actions/formularios.ts` (contato e banco de talentos): depois de gravar, o gancho de RD já rodou (ele espera a resposta do RD). Ler o resultado do envio (`rd.syncedAt` do documento) e só chamar `enviarAviso` quando a conversão **não** foi aceita: integração desligada, chave ausente, sem identificador, RD recusou, rede.
- Uma função pura que decide ("o site deve avisar?") a partir do documento gravado, para a matriz de teste.
- `notified` continua significando "o site mandou o aviso dele".
- Guia do editor: onde chega o aviso em cada caso, e que lead com `rd.syncedAt` vazio teve aviso do site.

## Fora de escopo
- Pedido de consultores, diagnóstico de maturidade e lead do chat: mantêm o aviso do site como hoje (o do diagnóstico leva o resultado completo, que o RD não reproduz). Revisitar depois, se o marketing pedir.
- Download de material e newsletter: o site não avisa o time hoje, e continua não avisando.

## Critérios de aceitação
- [ ] Teste: RD aceitou → `enviarAviso` não é chamado; RD recusou, chave ausente, integração desligada ou erro de rede → é chamado uma vez.
- [ ] Teste: a falha do aviso ou do RD nunca derruba a gravação nem mostra erro ao visitante (contrato atual de MIG-100).
- [ ] O documento no admin mostra, em todos os casos, ou `rd.syncedAt` ou `notified: true` (nenhum lead sem um dos dois, exceto se o próprio aviso falhar — e então `notified: false` e `rd.error` ficam visíveis).

## Notas técnicas
- O gancho `afterChange` (`hooks/sincronizar-rd.ts`) grava `rd.syncedAt` com um `update` aninhado; o documento devolvido pelo `create` pode não trazer esse valor. Reler pelo id (`findByID` com `select` de `rd`) ou fazer o gancho expor o resultado no `context` da requisição.
- O retry atual (qualquer edição do documento tenta de novo) continua; um retry que dê certo depois não manda aviso de novo.

## Riscos / dependências externas
- Se a automação de aviso ao time não existir no RD para algum identificador, aquele lead fica sem aviso nenhum quando o RD aceita — conferir na 047, formulário por formulário.
