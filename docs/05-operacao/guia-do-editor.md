---
status: rascunho
atualizado_em: 2026-08-25
depende_de: []
---

# Guia do editor

Para quem vai **publicar conteúdo no site da ATRA** — sem precisar de ninguém
de tecnologia. Se algo aqui não funcionar como descrito, isso é um defeito do
site ou deste guia, nunca seu: anote o que travou e mande para o ponto de
contato do projeto. É assim que o guia melhora (MIG-127).

O painel fica em **`/admin`** (por exemplo, `www.atra.com.br/admin`). Durante a
homologação, o endereço é o do ambiente de teste e pede a senha extra do site
antes do login.

## 1. Entrar

1. Abra `/admin` no navegador.
2. Entre com **seu e-mail** e senha. O painel é em português.
3. Esqueceu a senha? Use "Esqueceu?" na tela de login — a redefinição chega no
   seu e-mail.

O menu à esquerda agrupa tudo em três blocos:

| Grupo | O que tem | Exemplos |
|---|---|---|
| **Conteúdo** | O que vira página no site | Cases, Artigos, Vagas, Soluções, Segmentos |
| **Catálogos** | Listas que as páginas usam | Clientes, Depoimentos, Parceiros, Assuntos |
| **Biblioteca** | Imagens e arquivos | Mídia |

Existem dois papéis: **editor** publica conteúdo; **administrador** também
mexe em navegação, rodapé, na IA do site e em usuários. Se um item não aparece
para você, é papel — não erro.

## 2. Criar um case

1. Menu **Conteúdo → Cases** → botão **Criar novo**.
2. Preencha título, cliente e o texto. Os campos obrigatórios ficam marcados;
   o que não for obrigatório pode ficar para depois.
3. O sistema salva **rascunho** automaticamente enquanto você edita. Rascunho
   **não aparece no site** — pode salvar pela metade sem medo.
4. O seletor de idioma (canto superior) alterna entre **português e inglês**.
   São dois conteúdos independentes da mesma página: preencher um não traduz o
   outro.

## 3. Imagens — e o texto alternativo

1. Em qualquer campo de imagem, **Enviar nova** ou **Escolher da biblioteca**.
   Prefira a biblioteca: a mesma imagem serve várias páginas sem duplicar.
2. O campo **"Texto alternativo" é obrigatório**, e não é burocracia: é o que
   um leitor de tela diz para quem não vê a imagem, e o que o Google lê.
   Descreva o que a imagem mostra — "Equipe da ATRA no evento X", não "foto1".
3. Fotos de **pessoas** só com autorização de quem aparece. Foto de banco de
   imagem representando cliente ou funcionário real não entra — sem foto, o
   site mostra as iniciais da pessoa, e isso é o comportamento correto.

## 4. Ver antes de publicar (pré-visualização)

Na edição de um case (e das páginas), a aba **Live Preview** mostra a página
**enquanto você digita**, em três tamanhos: **Mobile, Tablet e Desktop** —
clique nos botões para alternar. O que você vê ali é o rascunho, exatamente
como vai ficar.

Se aparecer um aviso de "conteúdo incompleto" no lugar de uma seção, é a
pré-visualização dizendo **o que falta preencher** — preencha e o aviso some.

## 5. Publicar

1. Botão **Publicar alterações**. A partir daí a página está no ar.
2. Para tirar do ar sem apagar: **Despublicar** — vira rascunho de novo.
3. Publicou algo errado? O painel guarda **versões**: abra "Versões" no topo
   do documento e restaure a anterior.

⚠️ Duas coisas boas de saber:

- Ao publicar, o site **revalida os campos obrigatórios do idioma que você
  está salvando**. Se ele recusar apontando um campo que parece preenchido,
  confira se você não está no **outro idioma** — é a causa mais comum.
- Ao publicar, a página pública se atualiza na visita seguinte — a primeira
  pessoa a abrir depois da mudança já vê a versão nova.

## 6. Corrigir uma métrica institucional

Os números da empresa (profissionais, clientes, certificações, selo GPTW)
moram num lugar só: **Globais → Configurações do site**. Corrigir ali corrige
**em todas as páginas de uma vez** — home e "Sobre" nunca mais divergem.

Alguns números estão marcados como **pendentes de confirmação** (P-01): estão
esperando o valor oficial. Quem tiver o número certo, é só preencher e
desmarcar.

## Adicionar uma seção a uma página

Em qualquer página, solução, segmento ou parceiro, o campo **"Seções"** é a
lista de blocos da página, na ordem em que aparecem no site. **"Adicionar
Seção"** abre o seletor:

- os blocos vêm **em grupos** (Abertura e navegação · Texto e cards · Etapas ·
  Prova: números, selos e parceiros · Carrosséis e vitrines · Chamadas e
  contato), em ordem alfabética dentro de cada um;
- cada card mostra **uma miniatura de como a seção fica no site**;
- o campo **"Procurar bloco"**, no topo, filtra pelo nome.

Depois de inserir, arraste a seção para o lugar certo e confira no
pré-visualizar.

Três seções que mudaram de comportamento em 29/09:

- **Vitrine de parceiros** — em **"Quais parceiros: Todos os cadastrados"**
  (o padrão), ela mostra o catálogo **Parceiros** inteiro, na ordem de lá:
  parceiro novo, removido ou reordenado muda em todas as páginas de uma vez.
  "Escolher os parceiros" libera a lista para uma seleção só daquela página.
- **Faixa de chamada no fim da página** — o padrão de toda página interna é
  "Entre em contato", com "Fale conosco" (para /contato) e o botão da IA. Nas
  soluções e segmentos não há mais formulário no fim; quem quer falar vai para
  /contato.
- **Grade de imagens** — é a dos selos (Google Cloud, na página do parceiro e
  em Data Analytics). Para trocar um selo, troque a imagem ali.

## O que mais é editável

- **Depoimentos e clientes** — Catálogos. Depoimento sem foto mostra
  iniciais, de propósito (ver a seção 3).
- **Contato, rodapé e menu** — Globais (papel de administrador). O
  **endereço** em Contato é opcional desde 29/09 (a ATRA não tem endereço
  fixo): vazio, ele não aparece no rodapé nem ao lado dos formulários.
- **SEO de cada página** — todo conteúdo tem o grupo "SEO": título para
  buscadores, **descrição** (o texto cinza no resultado do Google) e imagem de
  compartilhamento. ⚠️ A **descrição da home está vazia** — preencher é
  provavelmente sua primeira tarefa real neste painel.
- **Leads** — os envios do formulário de contato ficam em "Form submissions",
  com a campanha de origem de cada um. Eles também vão para o RD Station CRM.
- **Google Tag Manager e Lusha** — Sistema → Rastreamento (papel de
  administrador). O campo aceita só o formato certo: `GTM-XXXXXXX` para o
  Tag Manager e o `siteId` do painel Website Visitors para a Lusha. Salvar
  atualiza o site sem deploy. ⚠️ Preencher **não liga nada sozinho**: o GTM só
  carrega para quem aceitar "estatística" no aviso de cookies, e a Lusha para
  quem aceitar "marketing". Sem o texto do aviso preenchido, ninguém aceita.
  Se a Lusha estiver ligada, a descrição da categoria marketing (Configuração →
  Aviso de cookies) precisa dizer que ela identifica a empresa da visita.

## O que NÃO fazer

- **Não apague itens da Biblioteca** sem certeza de que nada os usa — uma
  imagem apagada some de todas as páginas que a usavam.
- **Não edite "ATRA AI"** sem combinar com o time técnico: é o cérebro do
  assistente do site, e o custo dele tem teto.
- Conteúdo em **inglês**: enquanto a revisão da tradução não acontecer (P-08),
  publicar em inglês é opcional — sem o inglês, a página simplesmente não
  existe naquele idioma, o que é melhor que inglês de máquina.
