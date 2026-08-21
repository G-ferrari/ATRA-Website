---
status: rascunho
atualizado_em: 2026-08-18
depende_de: [decisoes.md]
---

# Decisões pendentes

O que ainda não foi decidido, numerado, com **o custo de não decidir**. Saiu de
[decisoes.md](decisoes.md) quando aquele documento passou de 400 linhas: são
dois ciclos de vida diferentes — decisão registrada é permanente, pendência
existe para deixar de existir.

Ao responder uma, mova-a para `decisoes.md` como `D-xx` com a data. Não deixe
resposta só aqui.

Para levar à ATRA, use [pendencias-atra.md](pendencias-atra.md): é o subconjunto
que depende deles, agrupado por área e escrito para quem não acompanha o
projeto. Este aqui é o registro técnico completo, incluindo as que resolvo
sozinho.

## Decisões pendentes

Numeradas, com o custo de não decidir. **P-01 a P-03 bloqueiam a Etapa 2.**

| # | Pergunta | Bloqueia | Impacto de não decidir |
|---|---|---|---|
| **P-01** | As **métricas institucionais** corretas: profissionais (150+ vs 140+), clientes (20+ vs 30+), certificações (40+), parceiros (9) e **GPTW: 5x ou 4x**? Home e `/sobre` divergem em 4 números | seed + global `siteSettings` | O site novo publica número errado sobre a própria empresa, agora em SSR e indexado. Divergência que hoje passa despercebida entre duas páginas vira dado estruturado único — errado em todo lugar de uma vez |
| ~~P-02~~ | ~~Como as vagas chegam ao site~~ | — | ✅ **Respondida por evidência (17/08/2026).** O sitemap do WP mostra 6 vagas publicadas como páginas comuns — não há ATS. A collection `jobs` está correta e o fluxo atual se mantém, só muda o CMS. Resta confirmar com o RH se querem seguir assim ou adotar um ATS na virada |
| ~~P-03~~ | ~~Tipografia oficial da marca~~ | — | ✅ **Resolvida em 17/08/2026 → D-16.** Mona Sans, SIL OFL 1.1, self-hosted |
| **P-04** | Qual o **teto de custo mensal** aceitável para a ATRA AI? | números concretos de D-12 | ⚠️ **Agora bloqueia código no ar.** MIG-061 subiu `/chat` com limite de **20 req/IP/hora**, escolhido por ser conservador, e contador em memória do processo. Sem o teto real não dá para dimensionar nem trocar por Redis — e a UI generativa do chat fica de fora, porque testá-la é gastar cota |
| **P-05** | Plataforma de deploy: **Coolify/Dokploy ou Compose + Caddy**? | provisionamento da VPS | ✳️ **Comparativo entregue em [deploy-vps](../04-infra/deploy-vps.md), com recomendação de Coolify.** Falta confirmar — e vale checar se a ATRA já tem padrão de infra (o WP roda em RunCloud) |
| ~~P-06~~ | ~~A branch `migracao` vai para o remoto, ou fork?~~ | — | ✅ **Respondida por evidência (20/08).** O remoto `G-ferrari/ATRA-Website` já existe, `origin/migracao` também, e o CI dispara em push para ela. A branch foi publicada e o CI fechou verde nos dois jobs |
| **P-07** *(reduzida)* | Quem escreve o corpo dos **9 materiais** (3 relatórios, 3 ebooks, 3 webinars) que só existem no protótipo? | publicação desses 9 itens | ✅ Os **6 posts** saíram do escopo: os fictícios são descartados e os 207 reais vêm do WP com corpo (D-17). Restam os 9 materiais, que não existem em lugar nenhum — ficam em rascunho até alguém escrever |
| **P-08** | O **conteúdo EN existente** (169 chaves) é tradução aprovada pelo marketing ou saída de máquina do protótipo? | escopo de revisão antes do cutover | Se for de máquina, o site publica inglês não revisado sob o domínio da ATRA. Entra revisão humana no roadmap |
| **P-09** | Confirmar o **telefone oficial**: o site usa `+55 11 96305-2391` (`App.tsx:2391`); o contato institucional registrado é `+55 11 96306-0267` | global `contact` | Lead ligando para o número errado |
| **P-10** | Qual o **nome real do parceiro** cadastrado como `"Partner"` (`App.tsx:111`)? | collection `partners` | Card de parceiro genérico em produção |
| **P-11** | O **case "RD Saúde"** do carrossel da home (`App.tsx:1658-1669`) existe? Hoje aponta para o slug do Banco ABC | seed de `cases` | Ou some no porte, ou vira case real — mas não pode continuar apontando para o case de outro cliente |
| **P-12** | Manter o `Content-Signal: ai-train=yes` do robots.txt atual? | `robots.ts` | Autoriza treino de modelos com o conteúdo da ATRA — decisão de negócio, não técnica |
| **P-13** | Exportar do **Search Console** as URLs com impressão nos últimos 12 meses | priorização dos redirects | Sem dado real, a prioridade de preservação é palpite estruturado. Barato de obter, caro de não ter |
| **P-14** | `/politicas-e-termos/` e `/eventos/` têm destino no site novo? | redirects + rodapé | Formulário coletando dado pessoal sem política de privacidade publicada é exposição de LGPD |
| ~~P-15~~ | ~~Qual caminho para a lacuna de escopo~~ | — | ✅ **Resolvida em 17/08/2026 → D-17.** Caminho A, paridade de conteúdo antes do cutover |
| **P-16** | A redução de 13 soluções para 6, e o sumiço dos segmentos, foi **decisão de posicionamento** do marketing ou simplificação de protótipo? | escopo de D-17 | Com A escolhido, o padrão é **restaurar**. Se foi decisão deliberada, restaurar desfaz uma escolha de negócio sem querer |
| **P-17** | Prazo de retenção de currículos e quem no RH tem acesso | formulário de candidatura | Exigência de LGPD, não preferência |
| **P-18** | A ATRA já usa ferramenta de e-mail marketing / CRM (RD Station, HubSpot)? | newsletter e destino dos leads | Se usa, os formulários devem alimentar o CRM em vez de virar lista isolada no Payload |
| **P-19** | Existe GA4/GTM na conta da ATRA aplicado ao WP por fora do tema? | baseline de tráfego | Sem analytics antes do cutover, **não há como provar** se a migração melhorou ou piorou nada. Instalar no WP agora é a única forma de ter comparação |
| **P-20** | Guardar o histórico de conversas da ATRA AI? | `/api/chat` | Dado pessoal de visitante; alternativa é registrar só métricas agregadas |
| **P-24** | **Quem da ATRA vai editar o site**, e quem é o ponto de contato nos 30 dias após o cutover? | treinamento e guia do editor (D-20) | Sem nome, o treinamento não tem convidado e o guia não tem destinatário — e o objetivo da migração depende de alguém do outro lado |
| **P-21** | Ligar o proxy da Cloudflare (nuvem laranja)? Hoje o DNS está lá, mas em modo direto | CDN, cache, WAF | Ganho de graça em performance e proteção; custa uma camada a mais para depurar. Recomendação: **depois** do cutover estabilizar |
| **P-22** | Replicar `form-submissions` para fora do banco em tempo real? | RPO dos leads | Com backup diário, o RPO dos leads é de até 24 h. Para conteúdo é aceitável; para lead, não — lead perdido não volta. Depende de P-18 |
| ~~P-26~~ | ~~URLs reais de LinkedIn, Instagram e YouTube~~ | — | ✅ **Respondida por evidência (19/08).** O rodapé aponta para `#`, mas o CTA de contato (`App.tsx:2412`) traz as três: linkedin.com/company/atra-tecnologia, instagram.com/atratecnologia, youtube.com/@atratecnologia. Aplicadas no rodapé |
| **P-23** | **Quem tem acesso à conta Cloudflare da ATRA?** | cutover | Sem resolver com antecedência, o cutover trava no passo mais crítico. Barato agora, caro às 7h da manhã do dia da virada |
| **P-27** | **Como classificar os 207 posts em `topics`?** Descoberto em MIG-080: o WP tem **1 categoria** (`uncategorized`, com os 207 dentro) e **0 tags** | MIG-084 | Não há de onde mapear. Ou os 207 entram todos sem assunto — e `/blog` e `/insights` nascem com filtro que não filtra — ou alguém classifica. Classificar é decisão de conteúdo (D-22), não de quem migra; o que a engenharia pode oferecer é uma sugestão automática para o marketing revisar no CMS |
| **P-28** | **A área de atuação das 7 vagas confere?** Descoberto em MIG-085: a página de vaga do WP não tem o campo — os dois `<select>` que parecem taxonomia são a lista de vagas abertas e a de senioridade | MIG-085 | `jobs.area` é obrigatório e aparece na página da vaga. A importação deduziu do título ("Key Account Manager" → Comercial), o que lê o que está escrito mas continua sendo classificação (D-22). São 7 linhas para o RH confirmar, não um projeto |

### Encaminhamento

**Com a ATRA, assumidas por Leonardo:** P-01, P-08, P-09, P-10, P-11, P-12, P-13,
P-14, P-16, P-17, P-18, P-19, P-27, P-28.
**Recomendação técnica a apresentar:** P-04 (Etapa 2), P-05 (Etapa 4), P-20.
**Decisão de gestão:** P-07.

Duas merecem prioridade por serem baratas agora e caras depois:

- **P-19** — se não há analytics no WordPress, instalar **hoje** é a única forma de
  ter baseline de tráfego para comparar no cutover. Cada semana sem isso é uma
  semana a menos de histórico.
- **P-13** — o export do Search Console transforma a priorização de redirects de
  palpite em dado. É um clique.

Nenhuma bloqueia a Etapa 3. O modelo prevê os campos; **seed** e **priorização de
redirects** ficam esperando valores.

