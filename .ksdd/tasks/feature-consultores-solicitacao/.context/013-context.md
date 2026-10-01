# Context — Task 013: Seção de solicitação viva

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/22
**Branch:** `feature/consultores-solicitacao/013-secao-viva`
**Base:** `feature/consultores-solicitacao/integracao` @ `b829039` — já contém a 010 (#19) e a 012 (#21).

---

## 1. Task em uma página

```yaml
id: 013 · area: frontend · priority: P0 · estimate: M · depends_on: [010, 012]
```

**Objetivo.** Ligar o último formulário morto do site e fazê-lo carregar os perfis
escolhidos, o campo livre e a duração — o ponto em que o pedido vira lead. Com esta
task, o fluxo fica completo e a integração pode ir para `migracao`.

---

## 2. O problema de arquitetura

O carrinho (`escolhidos`) vive **dentro** da ilha `ListaDeConsultores`. O formulário
vive em `SolicitarConsultores`, mais abaixo na página — e **entre os dois** há a seção
de diferenciais, renderizada no servidor por `page.tsx`:

```
<ListaDeConsultores />      ← ilha cliente, dona do carrinho
<section diferenciais />    ← Server Component
<SolicitarConsultores />    ← precisa ler o carrinho
```

**Decisão: Context do React**, num provedor cliente que envolve as três. Server
Components podem ser filhos de um provedor cliente, e qualquer ilha abaixo dele lê o
contexto — é o padrão documentado de "provider envolvendo árvore de servidor".

É o **primeiro `createContext` do repositório**. As alternativas eram piores:
- passar os diferenciais como prop para dentro da ilha da lista, acoplando uma seção
  institucional ao catálogo;
- um store em módulo, estado global escondido e mais difícil de testar.

---

## 3. Contrato com a action (PR #21)

| Campo | Origem no formulário |
|---|---|
| `perfis` | escondido, JSON `[{ slug, quantidade }]` a partir de `itensEscolhidos` — perfil que saiu do catálogo não é enviado |
| `duracao` | `<input type="number">` 1..60, opcional |
| `modelo` | o `select` existente, com **chaves** no `value` (`full-time`…) e os mesmos rótulos visíveis |
| `message` | o campo livre existente (antes `mensagem`) |
| `name` `email` `phone` `company` | `company` **substitui** o campo "Cargo ou tecnologia desejada" — o carrinho já carrega os cargos |
| `source` `carimbo` `utm_*` + isca | escondidos, no padrão de `Formulario` e do diagnóstico |

### ⚠️ O `select` de modelo precisa de uma opção vazia

Hoje a primeira opção é "Modelo: Full-time (Dedicado)" e não há opção vazia. Ligado
como está, **todo lead chegaria ao comercial com "Modelo de alocação: Full-time"**,
inclusive de quem nunca abriu o select. Acrescento uma primeira opção vazia, "Modelo de
alocação (opcional)". Os quatro rótulos existentes não mudam (D-22).

---

## 4. Plano

| Arquivo | Ação |
|---|---|
| `consultores/solicitacao-contexto.tsx` | **novo** — provedor e `useSolicitacao()` |
| `consultores/formulario-de-solicitacao.tsx` | **novo** — ilha do formulário |
| `consultores/solicitar-consultores.tsx` | casca de servidor: título, foto, `PainelDeContatos`; o `<form>` sai para a ilha |
| `consultores/lista-de-consultores.tsx` | `useState` do carrinho → `useSolicitacao()` |
| `consultores/page.tsx` | envolve lista + diferenciais + solicitação no provedor; passa `perfis` à solicitação |
| `lib/consultores.ts` | `MAX_POR_PERFIL` passa a **vir de** `MAX_PESSOAS_POR_PERFIL` — o teto duplicado entre 010 e 012 vira um só |
| `docs/01-descoberta/debito-tecnico.md` | a linha "Formulário de solicitação de consultores é estático" fica resolvida |

### Detalhes que mordem

- ⚠️ **Escondidos ANTES dos reais.** Tailwind 4 trocou `space-y-*` para `margin-bottom`
  em `> :not(:last-child)`; escondido no fim tira do último campo real a condição de
  último filho e soma 24px. Nada de `<fieldset>` em volta.
- ~~Limpar o carrinho no callback da action, não num efeito.~~ **Revisto na
  implementação:** o callback teria de ser um embrulho cliente em volta da Server
  Action, e isso faz o HTML sair com `action="javascript:throw …"` — o formulário
  deixa de funcionar sem JavaScript. O carrinho esvazia num `useEffect` que observa o
  resultado: é sincronizar com algo que vem de fora (o servidor confirmou), e a
  render extra acontece uma vez por envio bem-sucedido.
- ⚠️ **Carimbo e UTM por `ref`, depois da montagem** — `Date.now()` e `sessionStorage`
  no render fariam o HTML do servidor divergir do cliente.
- Rastreio: `useRastrearEnvio(ok, 'form_submit', { form_type: 'consultant-request' })`.
- Aviso de privacidade: a frase que já existe no diagnóstico, com link para
  `/politicas-e-termos` via `hrefDe` (regra 6).

---

## 5. Verificação de ponta a ponta

Pela primeira vez na feature, **gravação real no Postgres**: Playwright escolhe perfis,
preenche, envia, e uma consulta ao banco confere a linha.

⚠️ Esperar **mais de 3 s** entre abrir a página e enviar (`SEGUNDOS_MINIMOS`). Mais
rápido que isso, o anti-spam devolve sucesso falso e **nada é gravado** — um teste que
passaria mentindo. E a cota é de **5 envios por IP**, em memória: poucos envios reais.

Locais: `RESEND_API_KEY` e `RDSTATION_CRM_TOKEN` vazias → nenhum e-mail, nenhuma
negociação, e o hook do CRM sai cedo (o deadlock latente do hook não é acionado).

---

## 6. Quality gates

- [ ] vitest · tsc · eslint (host)
- [ ] Playwright: smoke de consultores + envio real conferido no Postgres
- [ ] Revisão independente
