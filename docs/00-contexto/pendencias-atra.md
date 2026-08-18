---
status: rascunho
atualizado_em: 2026-08-18
depende_de: [decisoes.md]
---

# Perguntas para a ATRA

As decisões da migração que **não são técnicas** — dependem de alguém da ATRA
responder. Cada uma diz o que trava e o que custa não decidir.

Nenhuma bloqueia o desenvolvimento hoje. O que elas travam é o **seed** (valores
reais no ar), a **priorização de redirects** e o **cutover**. Deixar todas para
o fim concentra risco na semana da virada.

Registro técnico completo em [decisoes.md](decisoes.md).

## As duas urgentes

Perdem valor a cada semana que passa. Ambas são baratas hoje.

### P-19 — Existe Google Analytics ou GTM no site atual?

Precisamos saber se `atra.com.br` tem GA4 ou Google Tag Manager instalado, e ter
acesso à conta.

**Por que agora:** sem medição **antes** da virada, não há como provar se o site
novo melhorou ou piorou tráfego, conversão ou posição. A comparação exige os dois
lados. Se não houver analytics hoje, instalar **esta semana** é a única forma de
ter histórico para comparar — cada semana sem isso é uma semana a menos de base.

### P-13 — Export do Search Console

Precisamos do relatório de **URLs com impressões nos últimos 12 meses**
(Desempenho → Páginas → exportar).

**Por que agora:** o site atual tem ~259 URLs e o novo precisa redirecionar cada
uma. Sem esse dado, a prioridade de preservação é palpite. Com ele, sabemos
exatamente quais páginas trazem gente do Google e não podem quebrar. É um clique
e resolve de uma vez.

## Marketing e conteúdo

| # | Pergunta | O que trava | Custo de não decidir |
|---|---|---|---|
| **P-01** | **Quais são os números institucionais corretos?** Home e `/sobre` divergem: profissionais (150+ ou 140+), clientes (20+ ou 30+), e **GPTW 5x ou 4x** | Publicação dos números no site | Hoje a divergência passa despercebida entre duas páginas. No site novo vira **um dado só**, indexado pelo Google — errado em todo lugar de uma vez |
| **P-08** | O **conteúdo em inglês** do protótipo (169 textos) foi traduzido e aprovado por alguém, ou é saída de máquina? | Escopo de revisão antes da virada | Se for de máquina, a ATRA publica inglês não revisado no próprio domínio |
| **P-09** | **Qual é o telefone oficial?** O site usa `+55 11 96305-2391`; o contato institucional registrado é `+55 11 96306-0267` | Dados de contato do site | Lead ligando para o número errado |
| **P-10** | Um parceiro está cadastrado no protótipo apenas como **"Partner"**, sem nome. Qual é? | Página de parceiros | Card genérico em produção |
| **P-11** | O **case "RD Saúde"**, que aparece no carrossel da home, existe? Hoje o link dele aponta para o case do Banco ABC | Publicação dos cases | Ou o case é real e precisa de conteúdo, ou sai — mas não pode continuar levando ao cliente errado |
| **P-16** | O site atual tem **13 páginas de solução** e **10 de segmento** (bancos, saúde, varejo…). O protótipo tem 6 soluções e nenhum segmento. Foi **decisão de posicionamento** ou simplificação de protótipo? | Escopo do que será restaurado | O plano é restaurar tudo. Se a redução foi deliberada, restaurar desfaz uma decisão de negócio sem querer |
| **P-26** | Quais as **URLs reais de LinkedIn, Instagram e YouTube**? No protótipo os três apontam para lugar nenhum | Rodapé | O rodapé agora aparece em **todas** as páginas — seriam três links mortos em 100% do site |
| **P-07** | Quem escreve o conteúdo dos **9 materiais** (3 relatórios, 3 ebooks, 3 webinars) que existem só como capa no protótipo? | Publicação desses 9 itens | Ficam como rascunho, invisíveis no site, até alguém escrever |

## Jurídico e LGPD

| # | Pergunta | O que trava | Custo de não decidir |
|---|---|---|---|
| **P-14** | A página **`/politicas-e-termos/`** continua no site novo? Hoje ela existe no site atual, mas os três links legais do rodapé do protótipo não levam a lugar nenhum | Rodapé e formulários | **Formulário coletando dado pessoal sem política de privacidade publicada é exposição de LGPD.** O site novo terá formulários funcionando — os atuais não enviam nada |
| **P-17** | Por **quanto tempo** guardamos os currículos recebidos, e **quem no RH** tem acesso? | Formulário de vagas | Exigência de LGPD, não preferência. Precisa estar definido antes do formulário entrar no ar |
| **P-12** | O `robots.txt` atual autoriza **treinar modelos de IA** com o conteúdo da ATRA (`Content-Signal: ai-train=yes`). Mantemos? | Configuração do site novo | Decisão de negócio. Se ninguém decidir, replicamos o que está lá hoje |

## Comercial e operação

| # | Pergunta | O que trava | Custo de não decidir |
|---|---|---|---|
| **P-18** | A ATRA usa alguma ferramenta de **e-mail marketing ou CRM** (RD Station, HubSpot)? | Destino dos leads | ⚠️ Hoje **os quatro formulários do protótipo não enviam nada** — todo lead preenchido se perde. Se existe CRM, os formulários novos devem alimentá-lo em vez de virar lista isolada |
| **P-24** | **Quem da ATRA vai editar o site** depois da virada, e quem é o ponto de contato nos 30 dias seguintes? | Treinamento e guia do editor | O objetivo declarado da migração é o marketing publicar sem depender de dev. Sem nome, o treinamento não tem convidado |
| **P-02** | O RH quer manter as **vagas publicadas como páginas** do site (é como funciona hoje), ou adotar um sistema de recrutamento? | Modelagem de vagas | Nenhum — o modelo atual funciona. Vale confirmar antes de investir na tela |

## TI e infraestrutura

| # | Pergunta | O que trava | Custo de não decidir |
|---|---|---|---|
| **P-23** | **Quem tem acesso à conta Cloudflare da ATRA?** O DNS do domínio está lá | O cutover | Sem resolver com antecedência, a virada **trava no passo mais crítico**. Barato agora, caro às 7h da manhã do dia marcado |

> ⚠️ **No dia da virada, não tocar nos registros MX.** O e-mail da ATRA é Google
> Workspace e está no mesmo DNS. Mexer em DNS e derrubar o e-mail da empresa é o
> erro clássico desse tipo de migração — está registrado no runbook, mas vale
> dizer em voz alta para quem tiver acesso.

## Como isso volta para o projeto

Cada resposta vira uma linha em [decisoes.md](decisoes.md) com data, e destrava
o que estiver esperando. As respostas de P-01, P-09, P-10, P-11 e P-26 entram
direto no conteúdo do site; as de P-13 e P-19 mudam a prioridade dos redirects;
as de P-14, P-17 e P-18 mudam o que os formulários podem fazer.
