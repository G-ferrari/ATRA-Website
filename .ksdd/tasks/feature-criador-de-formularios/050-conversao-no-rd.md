---
id: 050
title: Levar o envio do formulário do admin ao RD com identificador, tags, campos mapeados e consentimento
status: para implementar
feature: criador-de-formularios
area: backend
priority: P0
estimate: M
depends_on: [048, 049]
feature_refs:
  - ".ksdd/features/FEATURE-criador-de-formularios.md#21-o-que-entra-v1"
  - ".ksdd/features/FEATURE-criador-de-formularios.md#72-endpoints-modificados"
  - ".ksdd/features/FEATURE-criador-de-formularios.md#92-riscos"
spec_refs:
  - ".ksdd/specs/SPEC.md#132-visitante-converte-por-formulário"
arch_refs:
  - ".ksdd/specs/architecture.md#5-integrações-externas"
  - ".ksdd/specs/architecture.md#7-segurança"
---

# 050 — Conversão no RD

## Objetivo
Cada envio de formulário do admin chega ao RD como conversão, com o nome e as tags que o marketing escolheu no próprio formulário, para as automações dele dispararem.

## Escopo
- `hooks/sincronizar-rd.ts`: para o kind novo, ler o formulário (identificador, tags, destino de cada campo) e montar a conversão; o resto do gancho (retry por edição, `rd.syncedAt`, `rd.error`, gravação com `req`) segue igual.
- `lib/rd-marketing.ts`:
  - `deveSincronizar` aceita o kind novo;
  - identificador e tags do formulário, não de Sistema → Integrações; formulário sem identificador → não vai (motivo em `rd.error`, o site avisa);
  - campos padrão: `name`, `email`, `personal_phone`, `company_name`, `job_title`;
  - campos com destino `cf_…`: só com a chave "Enviar campos personalizados" ligada;
  - caixa de consentimento marcada → `legal_bases` de consentimento e `available_for_mailing`, como a newsletter.
- Liga/desliga geral e chave ausente valem como para os outros formulários.

## Fora de escopo
- Criar campo personalizado no RD (fora da feature).
- Mudar a conversão dos formulários atuais.

## Critérios de aceitação
- [ ] Teste do corpo: identificador e tags do formulário; campos padrão; `cf_` só com a chave ligada; resposta vazia não vai; consentimento marcado leva a base legal, desmarcado não leva.
- [ ] Teste: formulário sem identificador não vai ao RD e o motivo fica em `rd.error`.
- [ ] Teste: a conversão de contato, newsletter, e-book e Trabalhe Conosco continua idêntica (testes atuais verdes).
- [ ] Teste do gancho: formulário apagado depois do envio não derruba a gravação e deixa o motivo em `rd.error`.

## Notas técnicas
- Mesmo endpoint e contrato (`POST https://api.rd.services/platform/conversions`, `event_family: CDP`).
- O destino `cf_` é texto livre do marketing: confere só o formato (049/048); a existência na conta só o RD diz, e a recusa vem com o nome do campo em `rd.error`.

## Riscos / dependências externas
- Campos personalizados precisam existir na conta do RD antes de ligar a chave (marketing).
