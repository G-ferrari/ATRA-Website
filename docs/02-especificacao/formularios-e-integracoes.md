---
status: rascunho
atualizado_em: 2026-08-17
depende_de: [modelo-de-conteudo.md, ../00-contexto/decisoes.md]
---

# Formulários e integrações

## Situação atual: 4 formulários, nenhum envia nada

| Formulário | `arquivo:linha` | Comportamento hoje |
|---|---|---|
| Contato (home) | `legacy/src/App.tsx:2309` | `onSubmit={(e) => e.preventDefault()}` — descarta |
| Contato (consultores) | `legacy/src/pages/Consultants.tsx:750` | idem, com estado local |
| Candidatura (carreiras) | `legacy/src/pages/Careers.tsx:487` | só marca `setIsSubmitted(true)` |
| Newsletter (insights) | `legacy/src/pages/Insights.tsx:643` | só marca sucesso |
| Newsletter (home) | `legacy/src/App.tsx:2267` | input sem `<form>` |

**Todo lead preenchido hoje é perdido.** É o débito 🔴 mais direto do projeto:
não é dívida técnica, é receita.

## Arquitetura

Uma collection `form-submissions` no Payload + uma Server Action por formulário.
Sem serviço externo de formulário: o dado é da ATRA e já existe banco.

```
Formulário (client) → Server Action → validação Zod
                                    → grava em form-submissions
                                    → dispara e-mail (Resend)
                                    → devolve estado ao usuário
```

Gravar **antes** de enviar e-mail: se o e-mail falhar, o lead não se perde.

### `form-submissions`

| Campo | Tipo | Observações |
|---|---|---|
| `formType` | `select: contact \| consultants \| job-application \| newsletter \| resource-download` | |
| `data` | `json` | Payload do formulário |
| `sourceUrl` | `text` | Página de origem |
| `locale` | `text` | `pt` \| `en` |
| `utm` | `group{ source, medium, campaign, term, content }` | Preenchido do querystring |
| `status` | `select: new \| contacted \| qualified \| discarded` | Triagem comercial |
| `emailSentAt` | `date` | Nulo = falha no envio; base para reenvio |

Acesso: leitura só para papéis autenticados. **Nunca expor por API pública.**

## Campos por formulário

### Contato (`/contato`, home, consultores)

| Campo | Tipo | Validação |
|---|---|---|
| `name` | text | obrigatório, 2–120 |
| `email` | email | obrigatório, formato válido |
| `phone` | tel | opcional; máscara BR, aceita internacional |
| `company` | text | opcional — **campo novo**, qualifica muito o lead B2B |
| `subject` | select | opcional: Soluções, Consultores, Carreiras, Outro |
| `message` | textarea | obrigatório, 10–2000 |
| `consent` | checkbox | **obrigatório** — LGPD |

Destino: `negocios@atra.com.br` (confirmar com P-09 o telefone; o e-mail é
consistente nas 4 ocorrências).

### Candidatura (`/carreiras`)

Nome, e-mail, telefone, vaga (relationship → `jobs`), LinkedIn, currículo
(upload PDF, máx. 5 MB), mensagem, consentimento.

⚠️ Currículo é dado pessoal sensível: retenção definida, storage privado (não o
bucket público de mídia) e URL assinada com expiração.

> [!DECISÃO PENDENTE] **P-17** — qual o prazo de retenção de currículos e quem no
> RH tem acesso? Exigência de LGPD, não preferência.

### Newsletter

Só e-mail + consentimento. Double opt-in.

> [!DECISÃO PENDENTE] **P-18** — a ATRA já usa ferramenta de e-mail marketing
> (RD Station, Mailchimp, HubSpot)? Se sim, a newsletter integra com ela em vez de
> virar lista no Payload — e provavelmente o formulário de contato também deveria
> alimentar o CRM.

### Download de material (`resources` com `gated: true`)

Nome, e-mail, empresa, consentimento → libera `resources.file` por URL assinada.

## Anti-spam

Em camadas, da menos intrusiva para a mais:

1. **Honeypot** — campo oculto; preenchido = descarta silenciosamente. Pega bot
   burro, custo zero, zero atrito.
2. **Time trap** — envio em menos de 3 s do carregamento = suspeito.
3. **Rate limit por IP** — 5 envios/hora por formulário.
4. **Cloudflare Turnstile** — só se 1–3 não bastarem. O WordPress atual já carrega
   Turnstile (`challenges.cloudflare.com` no `<head>`), então a ATRA já tem conta.

Sem reCAPTCHA v2: atrito alto e transfere dado do usuário para o Google.

## Confirmação ao usuário

| Momento | Comportamento |
|---|---|
| Enviando | Botão desabilitado com spinner; formulário não desmonta |
| Sucesso | Mensagem inline (não modal, não redirect) + e-mail de confirmação |
| Erro de validação | Mensagem no campo, com `aria-describedby` |
| Erro de servidor | Mensagem com caminho alternativo: WhatsApp e e-mail direto |

Nunca limpar o que o usuário digitou em caso de erro.

## E-mail transacional

Resend (API simples, domínio próprio, bom preço no volume esperado).

| E-mail | Para | Quando |
|---|---|---|
| Notificação de lead | `negocios@atra.com.br` | Todo contato |
| Confirmação | quem enviou | Todo contato |
| Notificação de candidatura | RH | Toda candidatura |
| Confirmação de inscrição | inscrito | Double opt-in |
| Entrega de material | quem baixou | Download gated |

Exige SPF, DKIM e DMARC no domínio — **coordenar com quem administra o DNS da
ATRA antes do cutover**, porque propagação leva tempo e e-mail sem autenticação
cai em spam.

## Analytics e GTM

O site atual **não tem analytics nenhum** — nem GA, nem GTM, nem Plausible.
Verificado: zero ocorrências em `legacy/src`.

Isso significa que **não há baseline de tráfego para comparar depois do cutover** —
não dá para provar que a migração melhorou (ou piorou) nada.

> [!DECISÃO PENDENTE] **P-19** — existe GA4 ou GTM na conta da ATRA, aplicado ao
> WordPress por fora do tema? Se existir, o histórico se preserva e o baseline
> existe. Se não, instalar **no WordPress agora**, semanas antes do cutover, é a
> única forma de ter comparação.

Recomendação: GA4 via GTM (marketing ganha autonomia de tags) + consentimento de
cookies antes de qualquer script não essencial, com Consent Mode v2.

Eventos mínimos: `form_submit` (por tipo), `resource_download`, `chat_started`,
`chat_message_sent`, `outbound_click` (WhatsApp, LinkedIn), `video_play`.

## Consentimento de cookies (LGPD)

Ausente hoje. Necessário porque haverá analytics e formulários.

- Banner na primeira visita, com **recusar tão visível quanto aceitar**
- Nenhum script não essencial antes do consentimento
- Preferência persistida e revogável
- Link para `/politicas-e-termos` — que precisa existir (ver
  [lacuna-de-escopo](lacuna-de-escopo.md#5-páginas-soltas-sem-destino-))

## Integração da ATRA AI (D-12)

```
POST /api/chat  (Route Handler, runtime nodejs)
  1. rate limit por IP (ai-assistant.rateLimitPerHour)
  2. checa consumo do mês vs monthlyBudgetBRL
     → excedido: 200 com mensagem de indisponibilidade (não 500)
  3. lê systemPrompt/model/temperature do global
  4. chama Gemini
  5. registra tokens e custo estimado
  6. devolve texto
```

| Item | Decisão |
|---|---|
| Chave | `GEMINI_API_KEY` **sem** `NEXT_PUBLIC_`; só no servidor. Não portar o `define` do `vite.config.ts:12` |
| Rate limit | Por IP, janela deslizante. Sem Redis no início: tabela no Postgres já existente |
| Budget | Contador mensal em `ai-usage`; degradação graciosa |
| Validação | Máx. 20 mensagens por conversa, 2000 caracteres por mensagem |
| Log | Registrar prompt e resposta é útil para melhorar, mas é dado de terceiro → ver P-20 |
| Timeout | 25 s, como hoje (`Chat.tsx:133`) |

> [!DECISÃO PENDENTE] **P-20** — guardar o histórico das conversas com a ATRA AI?
> Ajuda a entender o que o mercado pergunta e a ajustar o prompt, mas é dado
> pessoal de visitante: exige aviso na interface e política de retenção. Alternativa
> é registrar só métricas agregadas (contagem, tokens, custo), sem conteúdo.
