# GEO: o que fazer fora do código

O que a D-80 deixou pronto no site e o que depende de alguém com acesso às
contas. Em ordem: cada passo vale sozinho.

## 1. Bing Webmaster Tools

O Bing alimenta o Copilot, e o relatório **AI Performance** mostra quantas
vezes o site é citado em respostas de IA e por quais perguntas.

1. Entrar em <https://www.bing.com/webmasters> com a conta Microsoft da ATRA.
2. **Importar do Google Search Console**: é o caminho mais curto, porque traz o
   site já verificado e o sitemap. Sem o Search Console, verificar pelo DNS
   (registro TXT ou CNAME que o Bing indica).
3. Conferir que o sitemap `https://www.atra.com.br/sitemap.xml` aparece em
   **Sitemaps**.

## 2. IndexNow

1. Gerar uma chave: 32 caracteres hexadecimais servem (`openssl rand -hex 16`).
2. Pôr no `.env.prod` da VM: `INDEXNOW_KEY=<chave>` e refazer o deploy.
3. Abrir `https://www.atra.com.br/indexnow-key.txt`: tem de mostrar a chave.
4. Publicar qualquer artigo e conferir, no Bing Webmaster Tools, em
   **IndexNow**, que o endereço chegou. Falha aparece no log do contêiner
   `web` como `[indexnow]`.

Sem a chave o site funciona igual; só não avisa o Bing.

## 3. Visitas vindas dos assistentes (GA4)

No GA4, em **Admin → Grupos de canais → Criar grupo**, um canal "Assistentes
de IA" com a regra *Origem da sessão* corresponde à regex:

```
chatgpt\.com|chat\.openai\.com|perplexity\.ai|gemini\.google\.com|copilot\.microsoft\.com|claude\.ai
```

O canal precisa ficar **acima** de "Referral" na lista, ou as visitas caem lá.
O tráfego dos resumos de IA do Google entra junto com a busca orgânica, no
Search Console (relatório de desempenho, tipo "Web"): o Google não separa.

## 4. Visitas dos robôs (log do servidor)

Na VM, a partir da raiz do deploy:

```bash
python3 infra/monitoramento/robos-de-ia.py --dias 30 logs/caddy/access*.log*
```

Mostra cada robô (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, bingbot…),
quantas visitas por dia e as páginas que ele mais leu.

## 5. Checagem mensal nas IAs (marketing)

Uma lista de 20 perguntas que um cliente faria ("empresa de governança de
dados para bancos", "como se adequar à RC 18/2025"), perguntada todo mês no
ChatGPT, Gemini, Perplexity e Copilot. Anotar se a ATRA aparece e com qual
página. É o único jeito de ver o efeito fora do Google e do Bing.
