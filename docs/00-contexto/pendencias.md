---
status: rascunho
atualizado_em: 2026-09-26
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
| ~~P-05~~ | ~~Plataforma de deploy~~ | — | ✅ **Resolvida em 25/08/2026 → D-28.** Compose + Caddy com esteira no GitHub Actions, decidida na prática ao subir o staging na VPS — a recomendação anterior (Coolify) perdeu para o custo do próprio painel numa máquina de 8 GB que também builda |
| ~~P-06~~ | ~~A branch `migracao` vai para o remoto, ou fork?~~ | — | ✅ **Respondida por evidência (20/08).** O remoto `G-ferrari/ATRA-Website` já existe, `origin/migracao` também, e o CI dispara em push para ela. A branch foi publicada e o CI fechou verde nos dois jobs |
| **P-07** *(reduzida)* | Quem escreve o corpo dos **9 materiais** (3 relatórios, 3 ebooks, 3 webinars) que só existem no protótipo? | publicação desses 9 itens | ✅ Os **6 posts** saíram do escopo: os fictícios são descartados e os 207 reais vêm do WP com corpo (D-17). Restam os 9 materiais, que não existem em lugar nenhum — ficam em rascunho até alguém escrever |
| **P-08** | O **conteúdo EN existente** (169 chaves) é tradução aprovada pelo marketing ou saída de máquina do protótipo? | escopo de revisão antes do cutover | Se for de máquina, o site publica inglês não revisado sob o domínio da ATRA. Entra revisão humana no roadmap |
| **P-09** | Confirmar o **telefone oficial**: o site usa `+55 11 96305-2391` (`App.tsx:2391`); o contato institucional registrado é `+55 11 96306-0267` | global `contact` | Lead ligando para o número errado |
| **P-10** | Qual o **nome real do parceiro** cadastrado como `"Partner"` (`App.tsx:111`)? | collection `partners` | Card de parceiro genérico em produção |
| **P-11** | O **case "RD Saúde"** do carrossel da home (`App.tsx:1658-1669`) existe? Hoje aponta para o slug do Banco ABC | seed de `cases` | Ou some no porte, ou vira case real — mas não pode continuar apontando para o case de outro cliente |
| **P-12** | Manter o `Content-Signal: ai-train=yes` do robots.txt atual? | `robots.ts` | Autoriza treino de modelos com o conteúdo da ATRA — decisão de negócio, não técnica |
| **P-13** | Exportar do **Search Console** as URLs com impressão nos últimos 12 meses | priorização dos redirects | Sem dado real, a prioridade de preservação é palpite estruturado. Barato de obter, caro de não ter |
| **P-14** | `/politicas-e-termos/` e `/eventos/` têm destino no site novo? | redirects + rodapé | Formulário coletando dado pessoal sem política de privacidade publicada é exposição de LGPD. ⚠️ **Desde D-29 também segura o rollout de produção**: o texto de consentimento (`consentNotice`, global `atra-ai`) e a ligação de `ENABLE_CHAT_LEAD`/`RDSTATION_CRM_TOKEN` em produção esperam esta pendência — mandar dado a terceiro sem aviso é a exposição que D-26 explicitou. ⚠️ **E desde D-30 segura o banner de cookies**: `bannerMessage` (global `cookie-consent`) nasce vazio pelo mesmo motivo — sem ele, banner, GA4 e captura de UTM ficam desligados. Em **homologação** há texto provisório desde 03/09 (`web/scripts/seed/cookie-consent.ts`, fora do `run.mjs` para o gate seguir sem banner) — a redação final continua sendo desta pendência |
| ~~P-15~~ | ~~Qual caminho para a lacuna de escopo~~ | — | ✅ **Resolvida em 17/08/2026 → D-17.** Caminho A, paridade de conteúdo antes do cutover |
| ✅ **P-16** *(respondida em 21/08/2026: **publicar**)* | A redução de 13 soluções para 6 foi **decisão de posicionamento** do marketing ou simplificação de protótipo? | MIG-093 | ✅ **Os segmentos saíram da pergunta**: restaurá-los **acrescenta** e não substitui nada, e as 8 verticais entraram publicadas em MIG-092. Resta as soluções, e a Fase 4c mediu o que a pergunta pressupunha: as 13 do WP **não contêm** as 6 do protótipo. As 6 são consolidadas e assinadas pela ATRA ("Engenharia de Dados & Cloud", "Cultura de Dados"); as 13 são o catálogo anterior, com vocabulário de fornecedor ("Master Data Management", "Customer 360") e páginas que citam a Informatica. Publicar as duas listas poria **18 ofertas no menu, em dois vocabulários**. As 12 foram **publicadas**: o site passou de 6 para **18 ofertas**, e os 13 redirects viraram 1:1 sozinhos — o gerador lê o banco |
| **P-17** | Prazo de retenção de currículos e quem no RH tem acesso | formulário de candidatura | Exigência de LGPD, não preferência |
| ~~P-18~~ | ~~A ATRA já usa ferramenta de e-mail marketing / CRM (RD Station, HubSpot)?~~ | — | ✅ **Resolvida em 21/08/2026 → D-26.** É **RD Station CRM** (o CRM, não o RD Station Marketing). Os formulários passam a alimentá-lo, e `form-submissions` deixa de ser a única cópia do lead. A captura de UTM entrou junto: o `source` existente diz *onde* converteu, e o CRM precisa saber *de onde veio*. O consentimento **não** foi decidido junto — ver P-14 |
| **P-19** | Existe GA4/GTM na conta da ATRA aplicado ao WP por fora do tema? | baseline de tráfego | Sem analytics antes do cutover, **não há como provar** se a migração melhorou ou piorou nada. Instalar no WP agora é a única forma de ter comparação. ⚠️ **Com D-30 o site novo está pronto do lado de cá**: GTM com Consent Mode v2 atrás do consentimento, esperando só o id do container em `NEXT_PUBLIC_GTM_ID` |
| **P-20** | Guardar o histórico de conversas da ATRA AI? | `/api/chat` | Dado pessoal de visitante; alternativa é registrar só métricas agregadas. ⚠️ **Parcialmente respondida por D-29**: a conversa continua sem persistir; o que grava é o recorte `chatContext` do lead que o próprio visitante envia pelo formulário inline (≤5 mensagens dele, nada do modelo). Histórico completo segue em aberto |
| **P-24** | **Quem da ATRA vai editar o site**, e quem é o ponto de contato nos 30 dias após o cutover? | treinamento e guia do editor (D-20) | Sem nome, o treinamento não tem convidado e o guia não tem destinatário — e o objetivo da migração depende de alguém do outro lado |
| **P-21** | Ligar o proxy da Cloudflare (nuvem laranja)? Hoje o DNS está lá, mas em modo direto | CDN, cache, WAF | Ganho de graça em performance e proteção; custa uma camada a mais para depurar. Recomendação: **depois** do cutover estabilizar |
| **P-22** | Replicar `form-submissions` para fora do banco em tempo real? | RPO dos leads | Com backup diário, o RPO dos leads é de até 24 h. Para conteúdo é aceitável; para lead, não — lead perdido não volta. ⚠️ **Muda de peso com D-26**: o RD Station CRM passa a receber cada lead e vira a segunda cópia, então isto deixa de ser a única defesa — mas continua aberto. Com MIG-148 o hook existe; a segunda cópia vira fato quando `RDSTATION_CRM_TOKEN` entrar no ambiente (produção espera P-14) |
| ~~P-26~~ | ~~URLs reais de LinkedIn, Instagram e YouTube~~ | — | ✅ **Respondida por evidência (19/08).** O rodapé aponta para `#`, mas o CTA de contato (`App.tsx:2412`) traz as três: linkedin.com/company/atra-tecnologia, instagram.com/atratecnologia, youtube.com/@atratecnologia. Aplicadas no rodapé |
| **P-23** | **Quem tem acesso à conta Cloudflare da ATRA?** | cutover | Sem resolver com antecedência, o cutover trava no passo mais crítico. Barato agora, caro às 7h da manhã do dia da virada |
| ✅ **P-27** *(respondida em 21/08/2026: **manter como está**)* | **Como classificar os 207 posts em `topics`?** Descoberto em MIG-080: o WP tem **1 categoria** (`uncategorized`, com os 207 dentro) e **0 tags** | MIG-084 | Não há de onde mapear. Ou os 207 entram todos sem assunto — e `/blog` e `/insights` nascem com filtro que não filtra — ou alguém classifica. Classificar é decisão de conteúdo (D-22), não de quem migra; o que a engenharia pode oferecer é uma sugestão automática para o marketing revisar no CMS. **Decidido: fica sem assunto.** Os 207 entram sem `topics`, MIG-084 permanece cancelada, e classificar volta a ser tarefa de conteúdo no CMS quando alguém quiser |
| ✅ **P-28** *(respondida em 21/08/2026: **sem área por ora**)* | **A área de atuação das 7 vagas confere?** Descoberto em MIG-085: a página de vaga do WP não tem o campo — os dois `<select>` que parecem taxonomia são a lista de vagas abertas e a de senioridade | MIG-085 | `jobs.area` é obrigatório e aparece na página da vaga. A importação deduziu do título ("Key Account Manager" → Comercial), o que lê o que está escrito mas continua sendo classificação (D-22). **Decidido: as 7 ficam sem área.** `jobs.area` virou **opcional** — campo obrigatório sem fonte de dado obriga o importador a inventar — e a página esconde a etiqueta quando está vazio. A dedução foi **removida** do importador, não desligada: código morto que "só precisa ser religado" volta sozinho |
| **P-29** | **Para qual caixa vai o questionário do `/diagnostico-rc18`?** O dono pediu endereço próprio para o RC18 Quick Check e informa qual depois (20/09/2026) | `RC18_LEAD_EMAIL` no ambiente | Enquanto a variável não existir, o e-mail com as 11 respostas segue para o `email` do global `contact` — o lead não se perde, mas cai junto com os outros formulários. Só configurar a variável no host resolve; não exige deploy de código. ⚠️ **Desde a D-35 (26/09)** o diagnóstico RC18 sai e entra o de maturidade de dados: a pergunta passa a valer para ele, e a variável será outra — a feature do diagnóstico novo define o nome |
| **P-30** | **O que substitui o gate de paridade com o protótipo?** Medido em 24/09: as 12 rotas sob gate divergem do gabarito — de 2% (relatórios) a **21% (home)** dos pixels, com alturas até 316px diferentes | `pnpm gate`, `e2e/gabarito/` | O gabarito foi gravado em **21/08** e o site mudou de propósito desde então: D-31 (02/09) liberou melhoria de UI, e a passada de 13/09 (`d785a12`) padronizou raios, tirou bordas de caixa e unificou o ritmo das seções **no app novo** — o protótipo continua como estava. Regravar a partir do legado não resolve: traria de volta o desenho antigo. Com o gate do CI desligado desde 26/08, ninguém viu. **Três caminhos:** (a) regravar a partir do app novo e aceitar o espelho (recusado para `/consultores` em 24/09, D-34); (b) aposentar a paridade com o protótipo e cobrir rota a rota por comportamento, como D-34 fez; (c) desfazer as melhorias de UI, o que contraria D-31. ⚠️ Religar o gate no CI é pré-requisito do cutover, e hoje ele reprovaria tudo |
| **P-31** | **Liberar da senha da homologação só os arquivos de imagem (`/api/media/file/*`)?** O editor de imagem do admin — cortar, redimensionar, ponto focal — quebra com "Something went wrong" em imagem que já está no CMS | Edição de imagem no admin da homologação | Para editar uma imagem existente, o Payload baixa o original pelo endereço público do próprio site (`getExternalFile`) e repassa só os cookies: o Basic do Caddy não vai junto e a senha devolve 401 (medido em 26/09: `/api/media/file/*` responde 401 sem credencial). Subir um arquivo novo funciona e é o contorno até lá. **Não afeta a produção**, que não tem senha. Proposta, no `Caddyfile`: trocar `basic_auth { … }` por `@protegido not path /api/media/file/*` seguido de `basic_auth @protegido { … }`. Páginas, API, admin e o bucket privado seguem com senha; as imagens ficam abertas como ficarão em produção, e o `X-Robots-Tag: noindex` continua valendo. O custo: quem tiver a URL exata de uma imagem abre sem senha. Aplicar é decisão de quem responde pela homologação e exige acesso à VPS — **Leonardo** |

### Encaminhamento

**Com a ATRA, assumidas por Leonardo:** P-01, P-08, P-09, P-10, P-11, P-12, P-13,
P-14, P-17, P-19.
**Recomendação técnica a apresentar:** P-04 (Etapa 2), P-05 (Etapa 4), P-20.
**Decisão de gestão:** P-07.
**Infra, com Leonardo (acesso à VPS):** P-31.

Duas merecem prioridade por serem baratas agora e caras depois:

- **P-19** — se não há analytics no WordPress, instalar **hoje** é a única forma de
  ter baseline de tráfego para comparar no cutover. Cada semana sem isso é uma
  semana a menos de histórico.
- **P-13** — o export do Search Console transforma a priorização de redirects de
  palpite em dado. É um clique.

Nenhuma bloqueia a Etapa 3. O modelo prevê os campos; **seed** e **priorização de
redirects** ficam esperando valores.

