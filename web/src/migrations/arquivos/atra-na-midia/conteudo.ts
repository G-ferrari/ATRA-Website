/* As matérias da página `/atra-na-midia/` do WordPress, como estavam em
 * 02/10/2026 — texto literal (D-22): veículo, título, resumo com as reticências
 * de lá, e o link com os parâmetros de campanha que a ATRA pôs.
 *
 * Quem usa: a migração `20261002_170000_materias_da_imprensa`, que cria os itens
 * na collection `press` onde eles não existem, e o seed, pela mesma função. As
 * capas estão ao lado, baixadas do WordPress; `origemDaImagem` é só registro.
 *
 * ⚠️ Não é a fonte do site: depois de criadas, as matérias são do CMS. Matéria
 * nova entra pelo admin (Conteúdo → ATRA na mídia), não por aqui.
 *
 * A ordem é a da página antiga, e vira o campo `order`. A página não tinha
 * data em nenhuma. `tipo` é `video` para os dois links do YouTube. */

export type MateriaDoWordpress = {
  veiculo: string
  titulo: string
  resumo: string
  url: string
  tipo: 'article' | 'video'
  /** Arquivo nesta pasta. O prefixo `atra-na-midia-NN-` é a chave da mídia no acervo. */
  imagem: string
  origemDaImagem: string
}

export const MATERIAS_DO_WORDPRESS: MateriaDoWordpress[] = [
  {
    veiculo: 'Gazeta Mercantil Digital',
    titulo: 'IA agêntica na banca: ATRA lança plataformas para superar gargalos de infraestrutura e análise de risco',
    resumo: 'A ferramenta permite que gestores realizem simulações financeiras complexas diretamente com a plataforma.',
    url: 'https://gazetamercantil.com.br/ia-agentica-na-banca-atra-lanca-plataformas-para-superar-gargalos-de-infraestrutura-e-analise-de-risco/',
    tipo: 'article',
    imagem: 'atra-na-midia-01-gazeta-mercantil.jpg',
    origemDaImagem: 'https://www.atra.com.br/wp-content/uploads/2026/09/IA-agentica.jpg',
  },
  {
    veiculo: 'Agora no Interior',
    titulo: 'Inteligência artificial impulsiona a modernização de sistemas legados em bancos',
    resumo: 'A inteligência artificial, quando implementada com governança e expertise, tem o potencial de não apenas modernizar sistemas antigos, mas de redefinir….',
    url: 'https://agoranointerior.com.br/aracatuba/ia-moderniza-sistemas-bancos/?utm_source=site&utm_medium=midia&utm_campaign=ATRA+na+midia',
    tipo: 'article',
    imagem: 'atra-na-midia-02-agora-no-interior.jpg',
    origemDaImagem: 'https://www.atra.com.br/wp-content/uploads/2026/09/Febraban.jpg',
  },
  {
    veiculo: 'Diário da Região',
    titulo: 'ATRA faz parceria com Google Cloud e muda processamentos bancários',
    resumo: 'A empresa ATRA liderou o projeto em parceria com o Google Cloud que modernizou a área de risco da instituição financeira; a empresa será uma das expositoras do Rio Preto Tech Summit…',
    url: 'https://www.diariodaregiao.com.br/economia/mais-agilidade.1784933968362',
    tipo: 'article',
    imagem: 'atra-na-midia-03-diario-da-regiao.jpg',
    origemDaImagem: 'https://www.atra.com.br/wp-content/uploads/2026/09/ATRA-faz-parceria-com-Google-Cloud-e-muda-processamentos-bancarios.jpg',
  },
  {
    veiculo: 'Monitor Mercantil',
    titulo: 'Sem governança de dados, a IA é uma bomba-relógio para o Conselho de Administração',
    resumo: 'Mais do que implementar novas tecnologias, o desafio está em criar as condições para que a IA seja utilizada com confiança e alinhada aos objetivos do negócio…',
    url: 'https://monitormercantil.com.br/sem-governanca-de-dados-a-ia-e-uma-bomba-relogio-para-o-conselho-de-administracao/',
    tipo: 'article',
    imagem: 'atra-na-midia-04-monitor-mercantil.jpg',
    origemDaImagem: 'https://www.atra.com.br/wp-content/uploads/2026/09/Sem-governanca-de-dados-a-IA-e-uma-bomba-relogio-para-o-Conselho-de-Administracao.jpg',
  },
  {
    veiculo: 'Universo Empreendedor',
    titulo: 'IA sem DADO é DINHEIRO JOGADO FORA (Raony Falco) | Vozes do Mercado #01 | Ed. Indústria do Amanhã',
    resumo: 'O dado bruto tem potencial, mas é com qualidade, estrutura e boa governança que ele ganha contexto e passa a revelar padrões, tendências e informações relevantes…',
    url: 'https://www.youtube.com/watch?v=Kj0CKK5mO_4&t=1s',
    tipo: 'video',
    imagem: 'atra-na-midia-05-universo-empreendedor.jpg',
    origemDaImagem: 'https://www.atra.com.br/wp-content/uploads/2026/09/Sem-governanca-de-dados-a-IA-e-uma-bomba-relogio-para-o-Conselho-de-Administracao-1.jpg',
  },
  {
    veiculo: 'RCE Talks',
    titulo: 'Antes de falar em Inteligência Artificial, é preciso falar em dados.',
    resumo: 'Por que a qualidade dos dados e governança são a base para projetos de IA bem-sucedidos. O papel da ATRA em ajudar organizações a transformar dados em resultados…',
    url: 'https://www.youtube.com/watch?v=ZSxVlvJh2s0',
    tipo: 'video',
    imagem: 'atra-na-midia-06-rce-talks.jpg',
    origemDaImagem: 'https://www.atra.com.br/wp-content/uploads/2026/09/Entrevista-com-Heribert-em-estudio.jpg',
  },
]
