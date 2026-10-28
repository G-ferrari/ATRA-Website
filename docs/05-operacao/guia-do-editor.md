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
5. O seletor de idioma (canto superior, "Local") alterna entre **português,
   inglês e espanhol**. São conteúdos independentes da mesma página: preencher
   um não traduz o outro à mão — quem traduz é a tradução automática (ver "O
   inglês do site" e "O espanhol do site").

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
- **Etapas de processo** — tem o campo **"Formato"** (desde 15/10): *Cartões*
  (o padrão, a grade numerada de Carreiras) ou *Linha do tempo*, os círculos
  numerados ligados por uma linha que a página da RC18 usa. No celular a linha
  fica de pé, com o texto ao lado de cada círculo. Funciona bem de **3 a 8**
  etapas; com mais que isso, os textos ficam estreitos demais no computador.

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
questionário, com as regulações que o diagnóstico avalia quando o visitante
escolhe aquele setor.

- **Na linha "Impactos avaliados" aparece o órgão, não a norma** (pedido do
  Roger, 08/10). As três normas do Banco Central que estão no campo de Mercado
  Financeiro aparecem como uma etiqueta só, "BACEN (Banco Central)"; "Resolução
  CVM 244/2026" aparece como "CVM"; "SRO (SUSEP)" como "SUSEP"; a TISS como
  "ANS"; o RGC como "Anatel". Nas perguntas e no resultado, o nome completo de
  cada norma continua.
- **LGPD/ANPD e Marco Legal da IA** aparecem sempre, depois das do setor, e não
  estão nos campos. **Reforma Tributária** entra sozinha, no fim, nos setores
  que têm pergunta sobre ela.
- Para tirar uma regulação de um setor, clique no ✕ dela; para incluir, escolha
  na lista; para mudar a ordem, arraste.
- ⚠️ **A escolha não muda só a etiqueta.** Ela também decide as etiquetas
  "Impacta:" de cada pergunta e as lacunas que entram no resultado e no e-mail
  do visitante. Tirar "ANBIMA" de um setor tira a ANBIMA do resultado dele.
- Cada setor só oferece as regulações que as perguntas dele avaliam. Se a que
  você procura não está na lista, é porque nenhuma pergunta daquele setor a
  mede: incluir exige pergunta nova, com o time técnico e o Roger.
- Setor sem nenhuma regulação escolhida volta à lista padrão do questionário.

## ATRA AI: o que o assistente recomenda

Em **Configuração → ATRA AI** ficam o texto de instrução da IA e, desde 09/10, o
campo **O que a IA pode recomendar**.

- A IA passou a **ler o que está publicado no site** a cada conversa. Publicar,
  editar ou despublicar uma solução, um case, um artigo… vale já na conversa
  seguinte, sem fazer mais nada.
- Ela recomenda mostrando um **cartão com link**. O título, o resumo e o
  endereço do cartão vêm do cadastro de cada item, e não do texto da IA: para
  mudar o que aparece ali, edite o item (o resumo é a "descrição curta" da
  solução ou do segmento, o "resumo" do case, a "descrição" do artigo, do
  webinar e do e-book).
- **O que a IA pode recomendar** liga e desliga cada tipo: soluções, segmentos,
  cases, webinars, e-books, artigos do blog e páginas do site. Sem nenhum tipo
  ligado, ela não recomenda conteúdo do site.
- Os artigos do blog são metade da lista que a IA lê. Desligá-los reduz o custo
  de cada conversa.
- No **texto de instrução** não é preciso listar as soluções nem escrever
  endereços: a lista entra sozinha. Use o texto para dizer quem a IA é e como
  ela conduz a conversa. ⚠️ O trecho "Sobre a ATRA" ainda descreve a oferta
  antiga, em três pilares: vale atualizar.
- Em inglês, a IA só recomenda o que tem endereço em inglês.
- A IA **não fala de preço nem de condição de contratação**: quando perguntam,
  ela diz que isso é com o time comercial e oferece o contato. Essa regra é
  fixa, não depende do texto de instrução.

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

## Escolher um ícone

Todo campo **"Ícone"** (cartões, segmentos, soluções, menu, linha de apoio das
seções) mostra o desenho escolhido e o nome dele em português. **"Trocar
ícone"** abre a grade com os 99 disponíveis, em grupos (Dados e tecnologia,
Negócio e resultados, Pessoas e comunicação, Segurança e regulação, Setores,
Conteúdo e navegação). O campo de busca acha pelo nome do desenho e também pelo
assunto: "saúde" mostra o hospital e o estetoscópio, "LGPD" a balança, "IA" o
robô e o cérebro. Acento não importa. Nos campos opcionais, **"Sem ícone"**
tira o que estiver lá. Ícone que não existe na lista precisa do time técnico.

## O peso dos títulos

Em **Configuração → Aparência do site**, o campo **"Peso dos títulos"** escolhe
como saem os títulos do site inteiro: **Negrito**, **Normal** ou **Fino**.
Fino é o desenho original e vem marcado. Vale para os títulos de página, de
seção e de cartão, em todas as páginas e nos dois idiomas, e muda o site ao
salvar, sem deploy. Os títulos pequenos (nome de autor de depoimento, itens do
menu, rótulos em caixa-alta) têm peso próprio e não mudam. O tamanho das
letras não fica aqui: é do código (D-65).

## Candidatura a vagas e Trabalhe Conosco: o aviso de privacidade

A candidatura com currículo, na página de cada vaga, ainda está **desligada**:
espera o RH dizer quem acessa os currículos (P-17). Quando ligar, o texto que o
candidato lê antes de enviar fica em **Contato → Candidaturas → Aviso de
privacidade da candidatura**. É texto do RH e do jurídico. **Vazio, o formulário
não aparece**, mesmo com a candidatura ligada no servidor.

O site apaga sozinho, depois de **6 meses**, o currículo e os dados de cada
candidatura (D-61). O aviso precisa dizer isso, e também quem tem acesso e para
que o currículo é usado. O e-mail que avisa o RH de cada candidatura não é
apagado pelo site: quem recebe precisa apagar no mesmo prazo, ou o aviso precisa
dizer que ele fica.

O **Trabalhe Conosco** (o banco de talentos de /carreiras, sem currículo) tem o
aviso dele no mesmo lugar: **Contato → Candidaturas → Aviso de privacidade do
banco de talentos**. Também é do RH e do jurídico: para que o cadastro é usado,
por quanto tempo fica guardado e como pedir a exclusão. Diferente do da
candidatura, **vazio, o formulário continua aparecendo**, só que sem aviso.
Cada cadastro guarda uma cópia do aviso que a pessoa viu ("Aviso exibido no
cadastro", no envio do formulário), e trocar o texto não muda os cadastros
antigos. O cadastro fica em Envios de formulário e vai ao ATRAIR quando essa
integração está ligada; **não vai ao RD** (D-67, 22/10).

## Leads no RD Station: identificadores, tags e a chave

Em **Sistema → Integrações → RD Station Marketing** (papel de administrador)
fica o que o site manda ao RD a cada formulário:

- **Chave do RD** — o quadro do topo diz **Configurada** ou **Ausente**. A
  chave em si não aparece em lugar nenhum do painel, de propósito: ela fica no
  servidor (variável `RDSTATION_MARKETING_API_KEY`), e quem a põe é quem cuida
  do servidor. **Ausente** quer dizer que nada vai ao RD, mesmo com a
  integração ligada.
- **Identificadores de conversão** — o nome com que cada formulário chega ao
  RD. Escreva **exatamente** como está no RD, com espaço e acento se tiver
  (ex.: "Formulário Home"): é por esse nome que as automações do RD (o e-mail
  de agradecimento e o aviso ao time) disparam. Vazio: aquele formulário não
  vai ao RD.
- **Tags** — as tags que o lead recebe no RD, por formulário: digite e tecle
  Enter para cada uma. A newsletter já vem com `newsletter`, que é como os
  envios são segmentados. Desde 16/10 a inscrição na newsletter vai ao RD na
  hora, sem e-mail de confirmação: quem se inscreve já está na lista. Em
  Envios de formulário, "Confirmado em" vazio só aparece em inscrição antiga
  que nunca confirmou, e essa não vai ao RD.
- **E-books** — cada e-book chega ao RD com o **identificador dele**, para o
  RD saber qual material foi baixado e o marketing montar uma automação por
  e-book. Ele fica no próprio e-book, em **Conteúdo → Materiais**, no campo
  **Identificador no RD** da lateral (mesma regra: escreva como está no RD).
  Vazio, o e-book vai como `ebook-` seguido do endereço dele em português (ex.:
  `ebook-governanca-de-dados-na-era-da-ia-generativa`). ⚠️ Esse nome muda se o
  endereço do e-book mudar, e a automação do RD para de disparar sem aviso:
  preencha o campo antes de montar a automação. E o campo vale **depois de
  publicar** — "Salvar rascunho" não muda o que vai ao RD. O identificador
  "Download de material" daqui virou o **liga/desliga** dos downloads: vazio,
  nenhum e-book vai ao RD; preenchido, cada um vai com o seu. As tags do
  "Download de material" valem para todos os e-books. Na página do e-book, o
  formulário fica depois do texto, antes de "Entre em contato", e o botão do
  topo leva até ele; o formulário só aparece quando o e-book tem o PDF.
- **Trabalhe Conosco** — **não vai ao RD** desde 22/10 (D-67): cada inscrição
  gastava um lead do plano com quem não é cliente. O cadastro fica em Envios
  de formulário (e no ATRAIR, com a integração ligada), e quem avisa o RH é o
  site. Por isso ele não tem mais identificador nem tags aqui. A candidatura
  com currículo também nunca vai.
- **Quem avisa o time a cada contato ou cadastro** — se o lead chegou ao RD
  ("Sincronizado em" preenchido no envio), quem avisa é a automação do RD, como
  no site antigo, e o site não manda e-mail. Se não chegou (integração
  desligada, chave ausente, nome recusado pelo RD), o site manda o aviso dele,
  e o envio fica com "Aviso por e-mail enviado" marcado. Um aviso por lead, nunca dois.
  ⚠️ Confira no RD que a automação de aviso ao time existe para cada
  formulário que vai para lá, senão o lead aceito fica sem aviso.
- **Aviso ao candidato** — saiu daqui em 22/10. O aviso de privacidade do
  banco de talentos agora fica em Contato → Candidaturas (ver "Candidatura a
  vagas e Trabalhe Conosco: o aviso de privacidade", acima).

## Criar um formulário e pôr numa página

Um formulário de inscrição, de pesquisa ou de pedido se monta em **Conteúdo →
Formulários** e vai para qualquer página com a seção **Formulário**. Cada envio
fica em **Sistema → Envios de formulário** e vai ao RD com o identificador de
conversão e as tags que você escolher no próprio formulário. Os formulários que já existiam (contato,
newsletter, e-book) continuam como estão; o Trabalhe Conosco segue fora do RD.

**1. Criar.** Em **Conteúdo → Formulários**, crie um novo e dê um **Nome** (é
interno: aparece no admin e nos envios, não no site).

**2. Campos** (aba **Campos**). Até 20, na ordem em que aparecem. O **e-mail
vem sempre e é obrigatório**: é por ele que o RD reconhece a pessoa. Os tipos
são nome, e-mail, telefone, empresa, cargo, texto curto, texto longo, lista de
opções e caixa de marcar. Nome, telefone, empresa e cargo entram no máximo uma
vez cada, e só uma caixa de marcar pode ser o consentimento: o admin recusa o
resto ao salvar. Em cada campo:

- **Rótulo** — o que o visitante lê acima do campo. **Texto de exemplo** é o
  que aparece apagado dentro dele (opcional).
- **Obrigatório** e **Largura** (linha inteira ou meia linha; no celular, todo
  campo ocupa a linha inteira).
- **Lista de opções** — escreva cada opção. O **Valor gravado** é criado sozinho
  na primeira vez e não muda depois, nem se você corrigir o texto da opção: é
  ele que fica no envio e vai ao RD.
- **Caixa de marcar** — pode ser **o consentimento para receber comunicações**.
  Marcada pelo visitante, o lead chega ao RD com a autorização registrada. Ela
  nunca é obrigatória: quem não quer receber também pode enviar.
- **Campo personalizado no RD** (só em texto curto, texto longo, lista de
  opções e caixa de marcar) — nome, e-mail, telefone, empresa e cargo vão
  sempre para os campos padrão do RD. Os outros só vão se você escrever aqui o
  campo personalizado do RD (`cf_…`), exatamente como ele está lá; vazio, a
  resposta fica só no site. Esses campos só vão com **Enviar campos
  personalizados** ligado em Sistema → Integrações, e o campo precisa existir na
  conta do RD antes: se não existir, o RD recusa o lead inteiro, e o erro
  aparece no envio. Caixa de marcar desmarcada não vai.

⚠️ **Não peça documento (CPF, RG), dado de saúde nem arquivo.** O formulário vai
para uma base de marketing, e não há tipo de campo para isso de propósito: não
use "texto curto" para contornar.

**3. Botão e envio** (aba **Botão e envio**):

- **Texto do botão** e **Aviso acima do botão** (por exemplo, a frase de
  privacidade).
- **Depois do envio** — **Mostrar uma mensagem** (no lugar do formulário) ou
  **Ir para outra página**. A página é um endereço do próprio site, como
  `/contato` ou `/cases-de-sucesso`; no inglês o site acrescenta o `/en`
  sozinho.
- **Quem recebe o aviso do site** — os e-mails que recebem o envio quando o RD
  não o aceita. Vazio, vale o destino geral do contato.

**4. RD Station** (aba **RD Station**):

- **Identificador de conversão** — o nome com que o envio chega ao RD. Ele vem
  sugerido a partir do Nome; escreva exatamente como está no RD. Vazio, o
  formulário não vai ao RD (os envios continuam chegando ao admin e ao e-mail
  do aviso).
- **Tags** — as tags que o lead recebe no RD (digite e tecle Enter).

Para onde vai cada resposta se escolhe em cada campo, na aba **Campos** (acima).

**5. Publicar.** Só formulário **publicado** aparece no site e recebe envio.
"Salvar rascunho" num formulário já publicado não muda o que está no ar.
Despublicar tira a seção do site e o formulário para de receber.

**6. Pôr numa página.** Na página (Páginas, Soluções, Segmentos ou Parceiros),
**Adicionar Seção → Formulário** (grupo "Chamadas e contato"). Escolha o
formulário, escreva o título e o texto e a forma: **sozinho, centralizado**, ou
**com o texto ao lado** (no celular, um embaixo do outro). No preview a seção
aparece mesmo com o formulário em rascunho, com um aviso amarelo dizendo o que
falta para ela ir ao site.

**7. O que o RD faz, e o que você monta lá.** O site cria a conversão no RD com o
identificador e as tags. O **e-mail de agradecimento** ao visitante e o
**aviso ao time** são automações que o marketing monta no RD, disparadas por
esse identificador: o RD não deixa o site criar formulário, landing page nem
automação. Quem avisa o time segue a regra dos outros formulários: o RD aceitou,
avisa a automação dele; não aceitou, o site manda o e-mail aos endereços do
formulário.

**8. Conferir.**

- Em **Sistema → Integrações → RD Station Marketing (leads)**, a lista
  **Formulários do admin** mostra cada formulário com o identificador e as tags com que vai ao
  RD, "Não vai ao RD" quando falta o identificador, e o aviso quando dois
  formulários usam o mesmo identificador (é permitido, mas os leads se misturam
  no RD).
- Em **Sistema → Envios de formulário**, o filtro **Formulário** mostra os
  envios de um só. Aberto, o envio mostra cada resposta como "Pergunta:
  resposta", na ordem do formulário.

**Inglês.** Rótulos, textos de exemplo, opções, botão, aviso e mensagem têm
versão em inglês: troque o idioma no topo do admin e preencha. Vazio em
inglês, o site usa o português.

## O inglês do site

Desde 27/10 o inglês **se refaz sozinho**: ao publicar em português, a IA da
ATRA AI (o Gemini) traduz o documento e **publica** o inglês, em cerca de um
minuto, sem revisão. Vale para páginas, soluções, segmentos, cases, artigos,
webinars, e-books, vagas, parceiros, depoimentos, temas e especialidades.

- **Ligar e desligar** é de quem administra: **Sistema → Integrações →
  Tradução para o inglês**. Desligado, nada é traduzido sozinho.
- **Para escrever o inglês à mão**, marque **"Inglês revisado à mão: não
  retraduzir"**, na barra lateral do documento, e edite com o admin em
  **English** (no topo, "Local"). Marcada a caixa, publicar o português não
  mexe mais no inglês. ⚠️ Sem a caixa, a próxima publicação em português
  **apaga** as correções feitas no inglês.
- O **endereço** em inglês não é traduzido: fica o do português até alguém
  trocar o campo "Slug" com o admin em English. Mudar o endereço de algo
  publicado quebra links.
- Marca, nome de produto e sigla (ATRA, Google Cloud, LGPD, BACEN) não são
  traduzidos.
- Menu, rodapé, contato, aviso de cookies, notícias de "ATRA na mídia" e
  formulários **não** se traduzem sozinhos: edite-os em English no admin.

**A carga inicial** (27/10) traduziu de uma vez o que já estava publicado
antes de a tradução automática existir: páginas primeiro, o Blog por último,
um documento por minuto, umas 6 horas. Ela respeitou a caixa "Inglês revisado
à mão" e não tocou em rascunho. Para acompanhar, abra o site em `/en`: o que
já foi traduzido aparece em inglês.

**Traduzir sob pedido.** O botão de tradução (o ícone **文A**, ao lado de
"Salvar rascunho") continua em cada documento, e acima da lista para vários de
uma vez. Pedida por ele, a tradução chega como **rascunho** em inglês, para
revisar antes de publicar — útil para o que está travado. A fila traduz **um
documento por minuto**, e tenta de novo sozinha se o Gemini estiver ocupado.

⚠️ **Publicar o rascunho publica o documento inteiro**, nos dois idiomas. Se
houver mudança em português salva como rascunho e ainda não publicada, ela vai
ao ar junto. Publique o português primeiro, ou confira que ele não tem
rascunho pendente.

## O espanhol do site

Desde 28/10 o site tem espanhol, em `/es`, e ele **se refaz sozinho** como o
inglês: ao publicar em português, a IA traduz e publica o espanhol (neutro, da
América Latina, tratando o leitor por "usted").

- **Ligar e desligar**: **Sistema → Integrações → Tradução para o espanhol**,
  separado do inglês. Desligar um não para o outro.
- **Para escrever o espanhol à mão**, marque **"Espanhol revisado à mão: não
  retraduzir"** na barra lateral e edite com o admin em **Español**.
- O **endereço** de cada página em espanhol é o mesmo do português
  (`/es/soluciones/<endereço em português>`); o das seções é em espanhol.
- **Menu, rodapé, painel do menu, aviso de cookies e os textos da ATRA AI e
  do diagnóstico também se traduzem para o espanhol**, a cada vez que forem
  salvos em português. ⚠️ Esses textos não têm a caixa de trava: corrigir o
  espanhol deles à mão vale só até a próxima vez que alguém salvar o português.
  O aviso de consentimento da ATRA AI fica de fora (texto jurídico).
- Notícias de "ATRA na mídia" e formulários não se traduzem: edite-os em
  Español no admin, ou deixe que mostrem o português.

**A carga inicial** (28/10) traduz o que já estava publicado: páginas
primeiro, o Blog por último, depois o menu e o rodapé. Um por minuto, umas 6
horas, começando quando alguém abrir o admin depois da publicação do site.
Até a fila chegar em cada página, o `/es` a mostra em português.

O espanhol pede um idioma novo no site inteiro, e é outra tarefa.

## O que mais é editável

- **Depoimentos e clientes** — Catálogos. Depoimento sem foto mostra
  iniciais, de propósito (ver a seção 3).
- **Contato, rodapé e menu** — Globais (papel de administrador). O
  **endereço** em Contato é opcional desde 29/09 (a ATRA não tem endereço
  fixo): vazio, ele não aparece no rodapé nem ao lado dos formulários. A
  **foto de fundo** do cartão "Nossos Contatos" também mora lá (desde 21/10):
  é uma só para a home, /contato e consultores, e trocar ali troca nos três.
- **SEO de cada página** — todo conteúdo tem o grupo "SEO": título para
  buscadores, **descrição** (o texto cinza no resultado do Google) e imagem de
  compartilhamento. ⚠️ A **descrição da home está vazia** — preencher é
  provavelmente sua primeira tarefa real neste painel.
- **Leads** — os envios do formulário de contato ficam em "Form submissions",
  com a campanha de origem de cada um. Eles também vão para o RD Station
  Marketing como conversões: o nome de cada conversão, as tags e o liga/desliga
  ficam em Sistema → Integrações (ver "Leads no RD Station", acima) — menos os
  formulários de Conteúdo → Formulários, que levam o nome e as tags no próprio
  cadastro (ver "Criar um formulário", acima) —, e "Sincronizado em" vazio
  num envio quer dizer que ele ainda não chegou lá — editar o envio tenta de
  novo.
- **Google Tag Manager, Lusha e RD Station** — Sistema → Rastreamento (papel de
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
