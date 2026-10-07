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
4. O campo **Cliente** é opcional: se o cliente não autoriza ser identificado,
   deixe vazio e o nome não aparece em lugar nenhum — cartão, destaque, página e
   título no Google. ⚠️ Confira também os textos do case (subtítulo, resumo,
   "Sobre o cliente"): o nome escrito neles continua aparecendo.
5. O seletor de idioma (canto superior) alterna entre **português e inglês**.
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
- **Texto com imagem** — tem o campo **"Tamanho do texto"**: *Normal* (o padrão)
  ou *Grande*, 2 pontos acima, para o texto que precisa de mais presença. Vale
  para todos os parágrafos daquela seção (desde 05/10).
- **Grade de imagens** — é a dos selos (Google Cloud, na página do parceiro e
  em Data Analytics). Para trocar um selo, troque a imagem ali.
- **Mosaico de parceiros** — cartões com imagem, nome do parceiro e link, em
  tamanhos diferentes (feito para a página de Assessoria em Produtos). Use de
  **4 a 6** parceiros; a grade se arruma sozinha: com 4 ou 5, o **primeiro** da
  lista é o cartão grande; com 6, o primeiro e o último são os largos. Arraste
  para mudar quem fica onde. A imagem deve ser **quadrada**, com o principal no
  centro (no cartão largo ela é cortada em faixa). O destino pode ser a página
  do parceiro no site (`/parceiros/google-cloud`) ou o site dele, com
  `https://`.

## ATRA na mídia

Em **Conteúdo → ATRA na mídia** fica cada matéria, entrevista ou vídeo em que a
ATRA aparece na imprensa. Para incluir uma:

1. **Título** e **Resumo** (até 300 caracteres) — como vão aparecer no cartão.
2. **Veículo** — quem publicou. Ex.: Gazeta Mercantil Digital.
3. **Link da matéria** — o endereço completo no site do veículo, começando com
   `https://`. É para onde o cartão leva, em outra aba. A mesma matéria não
   entra duas vezes: o link é único.
4. **Capa** — a imagem do cartão, na proporção 4:3 ou 16:9.
5. **Tipo** — "Vídeo" põe o botão de play sobre a capa e troca "Leia a matéria"
   por "Assistir".
6. **Ordem** — menor aparece primeiro. As **4 primeiras** são o destaque do
   topo da página.

Não existe página interna por matéria: o visitante vai direto para o veículo.

## As páginas de cada seção (páginas-mestras)

A página que abre ao clicar numa seção — **Soluções, Segmentos, Consultores,
Insights, Blog, Webinars, Cases, ATRA na mídia, E-books e Carreiras** — está em
**Conteúdo → Páginas**. Na lista, a coluna **Página-mestra de** diz de que seção
cada uma é.

Cada uma é montada com seções, como qualquer página: dá para mudar o texto do
topo, acrescentar seções antes ou depois da lista, trocar a ordem e escrever o
SEO. Três seções são só destas páginas (grupo **Página-mestra** em **Adicionar
Seção**):

- **Lista da seção** — a lista automática: o que está publicado na seção, com a
  busca e os filtros dela. Você escreve o selo, a etiqueta, o título, o trecho
  em azul e o texto de abertura (uma linha em branco separa os parágrafos); a
  lista se monta sozinha. Em Soluções e Segmentos a etiqueta vem depois da
  contagem ("8 verticais").
- **Destaques da seção** — o carrossel do topo, com os primeiros da seção. Você
  escolhe o texto do botão; vazio, vale o de sempre.
- **Chamada para os webinars** — a faixa do fim do blog. O **trecho em
  destaque** precisa estar escrito igual dentro do título (ex.: título "Assista
  aos nossos Webinars técnicos", trecho "Webinars"). A capa é a do primeiro
  webinar da página de webinars (o de menor **Ordem**). Pode ser usada em
  qualquer página.

O que **não** dá para fazer, de propósito:

- **Apagar** uma página-mestra. Para tirar uma seção do ar, use **Despublicar**:
  a página da seção passa a responder "não encontrado" — o aviso está no campo
  "Página-mestra de".
- **Mudar o endereço**. Ele é o da seção, e as páginas de dentro dependem dele
  (`/blog/<artigo>`). Renomear uma seção é pedido ao time técnico, como foi com
  "Relatórios" → "ATRA na mídia".

A **Insights** não tem lista para manter: ela mostra sozinha os 3 primeiros de
cada tipo (Cases, Blog, Webinars, ATRA na mídia, E-books) — os mesmos que abrem
a página de cada seção: os mais recentes em Cases, Blog e E-books, os de menor
**Ordem** em Webinars e ATRA na mídia —, com "Ver todos" para a seção. Publicou
um case, ele aparece lá. O topo, as pílulas,
os canais, a caixa de inscrição e a chamada final continuam editáveis no bloco
"Hub de insights".

Em **Consultores**, o topo é editável; os números, a lista de perfis e o
formulário de pedido seguem com o time técnico.

## Escrever a página de uma solução

As 18 soluções do menu estão em **Catálogos → Soluções**, em 4 abas. Cada uma
já tem página no ar, mas só com o **esqueleto**: o topo (título e uma frase) e
a faixa final de contato. Falta o meio.

1. Abra a solução. **Título**, **Descrição curta** (a frase do cartão no menu e
   no índice) e **Ícone** já estão preenchidos — ajuste se precisar.
2. Em **Seções da página**, use **Adicionar Seção** para pôr o conteúdo entre o
   topo e a faixa final: texto, cartões, etapas, parceiros. Arraste para
   ordenar. A faixa "Entre em contato" fica por último.
3. **Categoria** é a aba do menu em que a solução aparece; **Ordem** é a
   posição dentro da aba (menor primeiro).
4. **Selo** é opcional: preenchido, o cartão ganha destaque no menu e no índice.
   Hoje só "Analytics Conversacional" tem ("Diferencial ATRA").
5. Confira no Live Preview e **Publicar alterações**.

⚠️ Não desmarque **"Tem página própria"**: sem isso a solução continua no menu,
mas deixa de ser link e o endereço dela responde "não encontrado".

**Trocar o endereço (slug) de uma solução.** Pode, pelo campo "Slug (URL)". Uma
exceção: 14 endereços do site antigo — `cloud`, `data-analytics`,
`cultura-de-dados`, `governanca-de-dados`, `treinamento` e outros — ainda
redirecionam para a solução nova que ficou no lugar. Se você escolher um deles,
o admin recusa ao salvar e diz para onde ele redireciona: escolha outro, ou peça
ao time técnico para liberar aquele (foi feito para `customer-360` e
`master-data-management` em 06/10).

Na lista de Soluções do admin, as soluções vêm **por aba e, dentro da aba, pela
Ordem** — a mesma sequência do menu. Se a sua lista estiver em outra ordem, é
porque você clicou no título de uma coluna em algum momento; clique em
"Categoria" para voltar.

## Diagnóstico de maturidade: as regulações de cada setor

Em **Configuração → Diagnóstico de maturidade**, além dos textos e dos links, há
o grupo **Regulações avaliadas por setor**: um campo para cada setor do
questionário, com as etiquetas que aparecem em "Impactos avaliados" quando o
visitante escolhe aquele setor.

- **LGPD, ANPD e Marco Legal da IA** aparecem sempre, antes das do setor, e não
  estão nos campos. **Reforma Tributária** entra sozinha nos setores que têm
  pergunta sobre ela.
- Para tirar uma regulação de um setor, clique no ✕ dela; para incluir, escolha
  na lista; para mudar a ordem, arraste.
- ⚠️ **A escolha não muda só a etiqueta.** Ela também decide as etiquetas
  "Impacta:" de cada pergunta e as lacunas que entram no resultado e no e-mail
  do visitante. Tirar "ANBIMA" de um setor tira a ANBIMA do resultado dele.
- Cada setor só oferece as regulações que as perguntas dele avaliam. Se a que
  você procura não está na lista, é porque nenhuma pergunta daquele setor a
  mede: incluir exige pergunta nova, com o time técnico e o Roger.
- Setor sem nenhuma regulação escolhida volta à lista padrão do questionário.

## O painel do menu de Soluções

Em **Sistema → Painel do menu de Soluções** fica o painel que aparece à direita
quando o visitante abre o menu de Soluções, em telas largas (de 1280px para
cima). Ele é o mesmo nas três abas; só o case de baixo muda.

- **Título** — "Por onde começar?". ⚠️ Apagar o título **tira o painel do
  menu** inteiro: é o jeito de desligá-lo.
- **Texto de abertura** — a frase sob o título.
- **Caminhos** (até 3; hoje são 2) — ícone, título, descrição e destino de
  cada um. O destino é um endereço do site, começando com `/`; os dois levam
  ao diagnóstico (`/diagnostico-maturidade`).
- **Texto e destino do botão** — "Falar com um especialista", para `/contato`.
- **Texto e destino do segundo botão** — "Faça seu diagnóstico agora", para o
  diagnóstico. Fica ao lado do primeiro (desde 06/10; era o terceiro caminho).
  Os dois dividem a largura do painel: texto curto. ⚠️ Texto vazio tira o
  botão, e o primeiro volta a ocupar a largura toda.
- **Prova social** (até 5) — cada item tem um **destaque** ("140+", "5x") e um
  **rótulo** ("especialistas", "GPTW"). Cabem numa linha só se forem curtos.
  ⚠️ Os números institucionais também moram em Globais → Configurações do
  site: mudou lá, confira aqui.
- **Cases de cada aba** — até 3 por aba (Inovação & IA, Dados, Governança). Com
  mais de um, eles se alternam a cada 5 segundos. Aba sem case escolhido
  mostra os 3 mais recentes, e case despublicado some do painel sozinho.

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
