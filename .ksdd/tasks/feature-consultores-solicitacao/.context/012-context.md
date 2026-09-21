# Context — Task 012: Server Action `solicitarConsultores`

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/20
**Branch:** `feature/consultores-solicitacao/012-server-action`
**Base:** `feature/consultores-solicitacao/integracao` @ `6f4ad71` — ver o README das tasks, seção "Integração".
**Dependência:** 011 ✅ (kind `consultant-request` já existe no banco e no CRM).

---

## 1. Task em uma página

```yaml
id: 012 · area: backend · priority: P0 · estimate: M · depends_on: [011]
```

**Objetivo.** Persistir o pedido de consultores com o recorte legível do que foi
selecionado, e avisar o comercial.

---

## 2. Feature spec (§7.1, colado)

> Uma **Server Action**, seguindo o contrato de `architecture.md` §4 (*anti-spam →
> grava → avisa → sincroniza*, com aviso/CRM incapazes de derrubar a gravação).
>
> ⚠️ **Os perfis pedidos são revalidados no servidor.** A Server Action é endpoint
> público (MIG-142): os slugs recebidos são conferidos contra `specialist-roles` e o
> resumo é montado a partir do que o banco diz, não do que o cliente mandou.

## 3. Arquitetura (§4, colado)

> **Server Actions** — contrato comum **anti-spam → grava (Postgres) → avisa
> (e-mail) → sincroniza (CRM)**; o aviso/CRM nunca derruba a gravação (lead perdido
> não volta).

---

## 4. O que a leitura do código estabeleceu

| Fato | Onde | Consequência |
|---|---|---|
| `enviarAviso` captura tudo e devolve `boolean` | `lib/email.ts:26-53` | "aviso não derruba a gravação" vale por construção |
| `conferir`: isca preenchida reprova; carimbo ausente **passa** | `lib/anti-spam.ts:35-49` | JS bloqueado não perde o lead |
| Campos dos formulários: `name`, `email`, `phone`, `company`, `message`, `source` | `actions/formularios.ts` | texto livre vai em **`message`** |
| O slug do perfil é `String(doc.id)` | `lib/mappers/consultant.ts` | o servidor procura **por id**; slug não numérico é descartado antes da consulta |
| `specialist-roles` é `isPublic` e **sem drafts** | `collections/SpecialistRoles.ts` | a consulta **não** precisa do filtro `_status` da regra 4 |
| Chaves locais `RESEND_API_KEY` e `RDSTATION_CRM_TOKEN` vazias | container `web` | testes locais não disparam e-mail nem negociação reais |

### Um defeito do modelo que não vou copiar

`diagnostico-rc18.ts` marca `notified` **buscando** o lead por e-mail + kind com
`sort: '-createdAt'`. Dois envios simultâneos do mesmo e-mail marcam o errado. Aqui uso
o id devolvido pelo `payload.create`.

---

## 5. Contrato com o formulário (a task 013 consome)

| Campo | Formato | Saneamento no servidor |
|---|---|---|
| `perfis` | JSON `[{ "slug": "12", "quantidade": 3 }]` | slug só dígitos; quantidade inteira `1..20`; duplicata descartada; teto de entradas |
| `duracao` | meses, opcional | inteiro `1..60`, senão ausente |
| `modelo` | chave fixa, opcional | `full-time` · `part-time` · `squad` · `staff-augmentation`, senão ausente |
| `message` | texto livre | `MAX_MENSAGEM = 5000` |
| `name` `email` `phone` `company` `source` `utm_*` `carimbo` + isca | como os demais formulários | `MAX_CAMPO = 200` |

⚠️ **`modelo` entra aqui e não na 013.** O `select` de modelo de alocação já existe no
formulário e a 013 diz que ele "passa a ser enviado" — mas as opções hoje são rótulos
("Modelo: Full-time (Dedicado)"), não chaves. O servidor define as chaves aceitas; a
013 só as usa.

⚠️ **Teto de 20 por perfil duplicado.** A 010 define `MAX_POR_PERFIL` em
`lib/consultores.ts`, que ainda não está nesta base. Aqui fica uma constante própria,
de mesmo valor, e a **013 unifica** quando as duas estiverem na integração.

---

## 6. Plano

| Arquivo | Ação |
|---|---|
| `web/src/lib/solicitacao-consultores.ts` | **novo** — leitura/saneamento e montagem do resumo, puros |
| `web/src/lib/solicitacao-consultores.test.ts` | **novo** |
| `web/src/actions/consultores.ts` | **novo** — a Server Action |
| `web/src/actions/consultores.test.ts` | **novo** — fluxo da action com `next/headers`, payload e e-mail simulados |

⚠️ **Arquivo novo e não `lib/consultores.ts`**: a 010 também edita aquele arquivo, e
duas branches mexendo nele para a mesma integração seria conflito certo.

**Testar a action, não só o lib.** Não há precedente de teste de Server Action no
repositório, mas os critérios são quase todos de **fluxo** (robô recebe sucesso sem
gravar; vazio recusa sem gravar; aviso falho não derruba a gravação; slug inexistente
descartado). Com `vi.mock` de `next/headers`, `@/lib/payload`, `@/lib/email` e
`@/lib/contato`, cada um vira asserção direta sobre o que foi — ou não foi — gravado.
A gravação de verdade no banco é verificada na 013, pelo formulário real.

---

## 7. Quality gates

- [ ] `./node_modules/.bin/vitest run` · `tsc --noEmit` · `eslint` (host, a partir de `web/`)
- [ ] Revisão independente — **com olhar de segurança**: endpoint público recebendo
      dado pessoal e JSON do cliente.
