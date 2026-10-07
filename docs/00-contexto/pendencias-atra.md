---
status: rascunho
atualizado_em: 2026-10-02
depende_de: [decisoes.md]
---

# Perguntas para a ATRA

As decisões da migração que **não são técnicas** — dependem de alguém da ATRA
responder. Cada uma diz o que trava e o que custa não decidir.

Nenhuma bloqueia o desenvolvimento hoje. O que elas travam é o **seed** (valores
reais no ar), a **priorização de redirects** e o **cutover**. Deixar todas para
o fim concentra risco na semana da virada.

Registro técnico completo em [decisoes.md](decisoes.md) e
[pendencias.md](pendencias.md).

## Urgente: travam o cutover

### P-14 — Política de privacidade e textos de consentimento

A `/politicas-e-termos` existe no site atual e **precisa ter destino** no site
novo. Além disso, o site novo tem componentes prontos que dependem de texto
jurídico que só a ATRA pode escrever ou aprovar:

| O que espera | Onde fica no admin | Efeito de não ter |
|---|---|---|
| Mensagem do banner de cookies (`bannerMessage`) | Sistema → Aviso de Cookies | Banner não aparece → GA4, Lusha e captura de UTM ficam **desligados em produção** |
| Texto do convite de lead no chat (`consentNotice`) | Sistema → ATRA AI | Formulário inline do chat não aparece → `ENABLE_CHAT_LEAD` não pode ser ligado |
| Política de privacidade publicada em `/politicas-e-termos` | Página a criar no CMS | Formulários coletando dado pessoal sem política = **exposição de LGPD** |

**Parcialmente avançada (27/09):** o texto da Karen sobre a Lusha entrou
literal na descrição da categoria Marketing do aviso de cookies (D-40). O que
ainda falta é da ATRA: a mensagem do banner, o aviso do chat, o consentimento
dos formulários e a política em si — texto e aprovação.

> ⚠️ Enquanto `bannerMessage` estiver vazio, nenhum script de terceiro é
> carregado — nem GA4, nem Lusha. O site está tecnicamente completo; o que falta
> é a autorização jurídica para ligá-los.

### P-23 — Quem tem acesso à conta Cloudflare da ATRA?

O DNS do `atra.com.br` está na Cloudflare. A troca de domínio no cutover exige
alterar os registros A lá. Sem resolver com antecedência, a virada **trava no
passo mais crítico** — às 7h da manhã do dia marcado. Barato hoje, caro naquele
momento.

> ⚠️ **No dia da virada, não tocar nos registros MX.** O e-mail da ATRA é
> Google Workspace e está no mesmo DNS. Mexer em MX é o erro clássico desse
> tipo de migração — está no runbook, mas vale dizer em voz alta.

### P-19 — Confirmar o container GTM com a Karen *(parcialmente respondida)*

✅ **Descoberto em 27/09:** o HTML público do `atra.com.br` carrega o container
`GTM-KR2VWNK` com o GA4 `G-619E22CJKE` dentro — **há baseline de tráfego**.
O id já foi cadastrado no admin (Sistema → Rastreamento).

**O que ainda falta:** a Karen confirmar que o container vale para o site novo e
quem o administra — para que o marketing consiga criar tags e eventos sem
precisar de acesso ao código.

## Marketing e conteúdo

| # | Pergunta | O que trava | Custo de não decidir |
|---|---|---|---|
| **P-01** | **Quais são os números institucionais corretos?** Home e `/sobre` divergem: profissionais (150+ ou 140+), clientes (20+ ou 30+), e **GPTW 5x ou 4x** | Publicação dos números no site | Hoje a divergência passa despercebida entre duas páginas. No site novo vira **um dado só**, indexado pelo Google — errado em todo lugar de uma vez |
| **P-08** | O **conteúdo em inglês** do protótipo (169 textos) foi traduzido e aprovado por alguém, ou é saída de máquina? | Escopo de revisão antes da virada | Se for de máquina, a ATRA publica inglês não revisado no próprio domínio |
| **P-09** | **Qual é o telefone oficial?** O site usa `+55 11 96305-2391`; o contato institucional registrado é `+55 11 96306-0267` | Dados de contato do site | Lead ligando para o número errado |
| **P-10** | Um parceiro está cadastrado no protótipo apenas como **"Partner"**, sem nome. Qual é? | Página de parceiros | Card genérico em produção |
| **P-11** | O **case "RD Saúde"**, que aparece no carrossel da home, existe? Hoje o link dele aponta para o case do Banco ABC | Publicação dos cases | Ou o case é real e precisa de conteúdo, ou sai — mas não pode continuar levando ao cliente errado |
| ✅ **P-16** *(respondida: publicar)* | **As 13 soluções do site atual ainda valem, ou a lista de 6 do protótipo é a nova?** | A lista de ofertas no menu | **Publicadas** — o menu lista as 18 e cada link antigo cai na página certa |
| **P-07** *(reduzida)* | Quem escreve o conteúdo dos **9 materiais** (3 relatórios, 3 ebooks, 3 webinars) que existem só como capa no protótipo? | Publicação desses 9 itens | Ficam como rascunho, invisíveis no site, até alguém escrever |
| **P-13** | Export do **Search Console** com URLs com impressões nos últimos 12 meses (Desempenho → Páginas → exportar) | Priorização dos redirects | Sem esse dado, a prioridade de preservação de SEO é palpite. É um clique e resolve de uma vez |

## Jurídico e LGPD

| # | Pergunta | O que trava | Custo de não decidir |
|---|---|---|---|
| **P-14** | *(detalhada acima)* Textos de consentimento e política de privacidade | Banner de cookies, chat lead, CRM em produção | **Formulário coletando dado pessoal sem política = exposição de LGPD** |
| **P-17** | Por **quanto tempo** guardamos os currículos recebidos, e **quem no RH** tem acesso? | Formulário de vagas | Exigência de LGPD, não preferência. Precisa estar definido antes do formulário entrar no ar |
| **P-12** | O `robots.txt` atual autoriza **treinar modelos de IA** com o conteúdo da ATRA (`Content-Signal: ai-train=yes`). Mantemos? | Configuração do site novo | Decisão de negócio. Se ninguém decidir, replicamos o que está lá hoje |

## Comercial e operação

| # | Pergunta | O que trava | Custo de não decidir |
|---|---|---|---|
| ✅ **P-18** *(respondida: **RD Station Marketing**, corrigida em 02/10)* | A ATRA usa alguma ferramenta de **e-mail marketing ou CRM**? | Destino dos leads | Resolvida — em 21/08 a resposta foi "CRM"; em 02/10 a ATRA esclareceu que os formulários vivem no RD Station **Marketing**, e o site passou a mandar cada lead como conversão (D-54). Para ligar em homologação falta a **Chave de API** (App Store do RD → App Publisher → Gerar chave de API) — **não** os tokens público/privado de "Dados de Integração", que são da API antiga. Produção espera o consentimento (P-14) |
| **P-24** | **Quem da ATRA vai editar o site** depois da virada, e quem é o ponto de contato nos 30 dias seguintes? | Treinamento e guia do editor | O objetivo declarado da migração é o marketing publicar sem depender de dev. Sem nome, o treinamento não tem convidado |
| **P-29** | **Para qual caixa de e-mail vai o resultado do Diagnóstico de Maturidade de Dados?** O dono informaria qual endereço depois (20/09) | Destino do e-mail de resultado | O lead não se perde — cai no e-mail do global `contact` —, mas fica junto com os outros formulários. O campo está no admin (Contato → Destino dos formulários → Diagnóstico); só precisamos do endereço |

## TI e infraestrutura

| # | Pergunta | O que trava | Custo de não decidir |
|---|---|---|---|
| **P-23** | *(detalhado acima)* **Quem tem acesso à conta Cloudflare da ATRA?** | O cutover | Sem resolver, a virada **trava no passo mais crítico** |
| **P-32** | **Com que imagem Docker o MinIO roda em produção?** Em set/2026 o MinIO removeu as imagens públicas do Docker Hub e do quay.io | `docker-compose.prod.yml` e o backup de mídia | O storage funciona hoje só porque as imagens estão no cache da VPS. Se ela for recriada ou limpa, o storage não sobe e o backup de mídia para — em silêncio. Dev e CI já foram para o fork `pgsty/minio`. **Exige acesso à VPS (Leonardo)** |

> ⚠️ **No dia da virada, não tocar nos registros MX.** O e-mail da ATRA é Google
> Workspace e está no mesmo DNS. Mexer em DNS e derrubar o e-mail da empresa é o
> erro clássico desse tipo de migração — está registrado no runbook, mas vale
> dizer em voz alta para quem tiver acesso.

## Já respondidas

| # | Pergunta | Resposta |
|---|---|---|
| ✅ **P-02** | Como as vagas chegam ao site? | Evidência (17/08): o WP publica vagas como páginas comuns — não há ATS. A collection `jobs` está correta |
| ✅ **P-16** | As 13 soluções do WP ou as 6 do protótipo? | Publicar as 18 (21/08) — todas já estão no ar |
| ✅ **P-18** | A ATRA usa CRM? | RD Station CRM (21/08 → D-26) — integração ativa, aguarda P-14 para produção |
| ✅ **P-19** *(detalhe pendente)* | Existe GTM/GA4 no atra.com.br? | Sim: container `GTM-KR2VWNK`, GA4 `G-619E22CJKE` (27/09 → D-40). Falta Karen confirmar quem administra |
| ✅ **P-26** | URLs reais das redes sociais? | Encontradas no código (19/08) — LinkedIn, Instagram e YouTube já aplicadas no rodapé |
| ✅ **P-27** | Como classificar os 207 posts em tópicos? | Ficam sem assunto por ora — o WP tem 1 categoria e 0 tags (21/08) |
| ✅ **P-28** | A área das vagas confere? | Ficam sem área — o WP não tem o campo; `jobs.area` virou opcional (21/08) |

## Como isso volta para o projeto

Cada resposta vira uma linha em [decisoes.md](decisoes.md) com data, e destrava
o que estiver esperando. As respostas de P-01, P-09, P-10, P-11 entram direto
no conteúdo do site; P-13 muda a prioridade dos redirects; P-14 e P-17 mudam o
que os formulários podem fazer; P-23 e P-32 travam o cutover se não resolvidas
antes do dia marcado.
