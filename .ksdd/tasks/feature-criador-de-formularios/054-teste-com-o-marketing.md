---
id: 054
title: Testar com o marketing na homologação — criar e publicar um formulário sem ajuda
status: para implementar
feature: criador-de-formularios
area: qa
priority: P1
estimate: S
depends_on: [053]
feature_refs:
  - ".ksdd/features/FEATURE-criador-de-formularios.md#13-métricas-de-sucesso"
  - ".ksdd/features/FEATURE-criador-de-formularios.md#91-dependências"
spec_refs:
  - ".ksdd/specs/SPEC.md#15-métricas-de-sucesso"
arch_refs: []
---

# 054 — Teste com o marketing

## Objetivo
Provar o critério de sucesso da feature: uma pessoa do marketing cria um formulário, põe numa página e publica, sem ajuda, e o lead de teste chega ao RD.

## Escopo
- Publicado na homologação, a Taci (ou quem o marketing indicar) cria um formulário de teste, põe numa página de teste e publica, observada, sem ajuda.
- O que travar vira correção ou texto no guia.
- Com autorização e um e-mail de teste combinado, um envio conferido no RD (identificador, tags, campos) e a automação do marketing para aquele identificador.
- Página e formulário de teste despublicados depois.

## Fora de escopo
- Criar a automação no RD (é do marketing).

## Critérios de aceitação
- [ ] O formulário foi criado e publicado sem ajuda (passa / não passa, registrado).
- [ ] Um lead de teste chegou ao RD com o identificador e as tags do formulário.
- [ ] O que travou virou correção ou guia.

## Notas técnicas
- Mesmas regras da 047: lead de teste só com autorização, e-mail combinado com a Taci, que apaga o lead depois.

## Riscos / dependências externas
- Chave do RD e do Resend no servidor (Léo); acesso da Taci ao RD.
