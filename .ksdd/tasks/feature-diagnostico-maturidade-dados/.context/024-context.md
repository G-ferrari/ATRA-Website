# Contexto de implementação — Task 024

**Issue:** https://github.com/G-ferrari/ATRA-Website/issues/56
**Branch:** `feature/diagnostico-maturidade-dados/024-email` → PR para `feature/diagnostico-maturidade-dados/integracao`

## 1. Task em uma página

```yaml
id: 024
title: E-mail HTML do resultado ao lead e aviso à ATRA
area: backend · priority: P0 · estimate: M · depends_on: [022]  # 022 concluída
```

**Objetivo.** Entregar por e-mail o que o HTML do Roger mostrava na tela — é o **único** canal do resultado (decisão de 26/09) — e dar ao comercial o resultado completo com as respostas.

**Critérios de aceitação**
- [ ] Avisos existentes continuam saindo só com texto (testes atuais verdes).
- [ ] O HTML do resultado renderiza legível em cliente de e-mail sem CSS externo (estilos em linha, largura ≤ 600 px, sem JS, sem imagens obrigatórias).
- [ ] Sem `agendaUrl`, o e-mail não tem o botão de agenda.
- [ ] Testes de snapshot do texto e das seções presentes para 2 perfis (nível baixo e alto).

## 2. Decisão nova incorporada — D-38 (26/09, G-ferrari)

O HTML v1.7 tem dois critérios de nível que discordam em três faixas: o rótulo (`computeScores`, limiares 1,8 / 2,6 / 3,5 / 4,3 — é o que vai ao CRM) e o título do resultado (`lvlNum = Math.round(overall)`). **Decisão: o rótulo em todo lugar.** O número do título, a chave de `NIVEIS` (nome e descrição do nível) e o e-mail passam a sair do rótulo. Registrar em `docs/00-contexto/decisoes.md` como **D-38** e ajustar `nivelNumerico` no motor (task 022, já concluída — o ajuste entra aqui porque o e-mail é o primeiro consumidor). Os testes de paridade de `nivelNumerico` com o original passam a documentar o desvio deliberado nas três faixas.

## 3. Feature spec relevante

§5.2 — **E-mail "Seu diagnóstico de maturidade de dados" (ao lead).** "Objetivo: entregar o resultado que o HTML v1.7 mostrava na tela. Seções: nota e nível (com a leitura pelo porte), impactos do setor, maturidade por pilar (barras simples em HTML de e-mail), o que está em jogo, regulações com maior gap, roadmap em 3 fases, ações por regulação, nota metodológica, botões WhatsApp e Agendar. Versão texto como alternativa."

§7.2 — "`lib/email.ts` (`enviarAviso`): aceitar corpo **HTML** opcional além do texto (hoje só `text`)."

§8.3 — "Cores dos pilares no e-mail: crítico (< 2,6) e atenção (< 3,5) como no HTML do Roger, mapeados para o laranja e o azul da marca."

## 4. SPEC (§9) e arquitetura (§5)

- Touchpoints críticos incluem os CTAs de contato; o e-mail do resultado é o touchpoint do diagnóstico.
- **Resend** — "E-mail transacional de leads · `RESEND_API_KEY` · Via `fetch` HTTP puro (sem SDK). Sem chave, lead grava e fica pendente."

## 5. Plano de implementação

1. **D-38** em `decisoes.md` + `nivelNumerico` derivado de `nivelDaMedia`; atualizar os testes que fixavam o `lvlNum` original (paridade vira "igual ao rótulo; difere do original só nas três faixas, de propósito").
2. `lib/email.ts`: `Aviso` ganha `html?: string`; o corpo enviado ao Resend inclui `html` só quando existe. Teste de que aviso sem `html` manda só `text`.
3. `lib/diagnostico-maturidade/email.ts` — funções **puras**:
   - `montarEmailDoResultado({ nome, setor, porte, calculo, roadmap, textos, whatsappUrl, agendaUrl })` → `{ assunto, html, texto }`, com as seções do `renderResult` do HTML na mesma ordem e com os mesmos títulos (copiar o texto da nota metodológica **do HTML**); HTML de e-mail (tabelas, estilos em linha, ≤ 600 px, sem imagens obrigatórias, sem JS); escapar todo texto variável.
   - `montarAvisoParaAtra({ contato, perfil, calculo, roadmap, respostas })` → `{ assunto, texto }`: contato, perfil, nível, pilares, top 3 e cada pergunta com a alternativa escolhida.
4. Testes: `email.test.ts` com 2 perfis (baixo e alto) — seções presentes/ausentes (ex.: "Ações por regulação" só com mais de uma regulação, "O que está em jogo" só com pilar < 3,5), sem agenda → sem botão, escape de `<script>` no nome, snapshot do texto.

**Riscos:** clientes de e-mail ignoram CSS moderno — tabelas e estilos em linha; nada de `display:flex` nem variáveis CSS.

## 6. Quality gates
- [ ] `pnpm test`, `pnpm lint`, `pnpm typecheck` (container)
- [ ] Renderizar o HTML de exemplo num arquivo local e abrir para conferência visual
- [ ] Security: texto do lead (nome) escapado no HTML
