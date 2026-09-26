# Adaptação — Diagnóstico de Maturidade (Elementor → site novo)

**Status:** material bruto no lugar; falta `/ksdd:new:feature` + implementação Claude Code.
**Origem:** Roger (quiz v1.7). Repasse: Taci. Captura vault/chat: 2026-09-25.

## Arquivos nesta pasta
- `atra-diagnostico-maturidade-dados.html` — quiz monolítico (HTML+CSS+JS) feito para colar no Elementor.
- `README-implantacao-rd-station.md` — guia WP/RD Station (proxy, campos `cf_*`, GTM).
- Este arquivo — contrato de adaptação ao ATRA-Website.

## Não fazer
- Não colar o HTML no WordPress/Elementor do site antigo como solução do cutover.
- Não expor `rdApiKey` no client (o HTML antigo prevê isso como opção B).

## Fazer (site novo)
1. **Produto:** quiz de maturidade DAMA/DMBOK com roteamento por setor; substitui formulário da página RC18 e linka em páginas de normativas (ata 24/09).
2. **Frontend:** reimplementar em React/Next (componentes do design system), a partir da lógica/`QUESTIONS` do HTML — Claude Code.
3. **CMS (Payload), se possível:**
   - Preferência: perguntas, setores, textos de resultado/ofertas/`REG_ACTIONS` editáveis no admin **ou** seed versionado + campos de copy na página.
   - Lead: gravar em `FormSubmissions` via Server Action (`overrideAccess`), sem IP/UA (LGPD).
   - Kind `data-maturity-diagnostic` (D-35). O `rc18-diagnostic` sai junto com o diagnóstico RC18.
4. **Integrações:** manter fluxo D-26 (FormSubmissions → Resend → RD Station CRM). Mapear `cf_*` do README só se o time comercial ainda depender desses campos no RD.
5. **Consentimento / privacidade:** checkbox + base legal alinhados ao banner/política do site novo (D-30 / P-14).
6. **Analytics:** `quiz_maturidade_lead` no dataLayer só após consentimento analytics/marketing conforme regra do projeto.

## Critérios mínimos para abrir a feature KSDD
- [x] HTML + README no repo
- [ ] FEATURE spec + tasks (`/ksdd:new:feature diagnostico maturidade dados`)
- [x] Kind do FormSubmissions: `data-maturity-diagnostic` (D-35)
- [ ] O que fica no CMS vs código

## Referências de código no repo
- `web/src/collections/FormSubmissions.ts`
- Tasks RC18: `.ksdd/tasks/feature-rc18/007-captura-de-lead-do-diagnostico.md`
- `docs/` decisões D-22, D-26, D-30; P-14
