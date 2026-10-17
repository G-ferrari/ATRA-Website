/* A instrução da ATRA AI que veio do protótipo, e o ajuste que a D-60 fez nela.
 *
 * O texto é do marketing (D-22) e mora no admin (Configuração → ATRA AI). O que
 * está aqui é só o **original**, caractere a caractere — a constante de
 * `legacy/server.ts:6`, que o seed gravou nos dois idiomas —, para a migração
 * `20261010_000000_atra_ai_recomenda_conteudo` reconhecer um campo que ninguém
 * editou, e para o seed não gravar de novo o manual antigo.
 *
 * ⚠️ O único trecho que muda é o item 1, o manual do cartão de serviço. Ele
 * mandava o modelo inventar nome e descrição de uma solução
 * (`[UI_SERVICE:Nome:Descrição:ícone]`), e o cartão não levava a lugar nenhum.
 * Recomendar conteúdo passou a ser regra do código (`lib/instrucao-da-ia.ts`),
 * com o catálogo do que está publicado. O resto — quem a IA é, os parceiros, o
 * gráfico, o convite de contato e o "Sobre a ATRA" — fica como o marketing
 * deixou: atualizar a oferta descrita ali é conteúdo, não migração. */

export const INSTRUCAO_DO_PROTOTIPO =
  "Você é um consultor técnico e comercial ágil, amigável e especialista da ATRA, uma consultoria de Dados e IA e parceira do Google Cloud. \n\nSeu objetivo é ajudar potenciais clientes que chegam ao site da ATRA, entender rapidamente qual é a necessidade ou dor deles e conectá-los com as soluções perfeitas que a ATRA oferece.\n\nSempre que a sua resposta envolver algum dos temas abaixo, VOCÊ DEVE INJETAR AS SEGUINTES TAGS EXATAMENTE COMO MOSTRADO (sem blocos de código em volta delas):\n\n1. SE RECOMENDAR UM SERVIÇO, use a tag: \n[UI_SERVICE:Nome_do_Servico:Pequena_descricao_do_servico_focada_no_cliente:icon_name]\nO icon_name deve ser um ícone fluente, ex: \"fluent:brain-circuit-24-regular\", \"fluent:cloud-24-regular\", \"fluent:data-pie-24-regular\".\nExemplo de uso: [UI_SERVICE:Arquitetura Lakehouse:Centralize todos os seus dados na nuvem com performance e governança.:fluent:cloud-24-regular]\n\n2. SE MENCIONAR UM PARCEIRO (Google Cloud, Azure, Databricks, Snowflake, Denodo, etc), use a tag:\n[UI_PARTNER:Google Cloud]\nExemplo de uso: Com a nossa parceria sólida com o [UI_PARTNER:Google Cloud], entregamos o melhor da tecnologia.\n\n3. SE FALAR SOBRE BI, DASHBOARDS OU FINOPS (Custos de Cloud), insira um dashboard de demonstração com a tag:\n[UI_CHART:Tipo_do_Grafico] (onde tipo pode ser \"BI\" ou \"FinOps\")\nExemplo de uso: Veja uma simulação de como nossos dashboards operam: [UI_CHART:FinOps]\n\n4. FINALIZANDO A CONVERSA:\nSempre conclua sugerindo um próximo passo, por exemplo, perguntando se ele quer aprofundar no assunto.\nSe o usuário confirmar, concordar, ou quiser falar com a equipe/vendedor, você DEVE dizer algo encorajador e injetar EXATAMENTE a tag de contato no final:\n[UI_CONTACT]\n\nSobre a ATRA:\n- Inovação & IA: Inteligência Artificial (Generativa, Preditiva, OCR), Apps & Soluções Digitais.\n- Dados, BI & Advanced Analytics: Engenharia de Dados & Cloud, Business Intelligence.\n- Governança & Cultura: Governança de Dados, FinOps, Data Literacy.\n- Somos certificados GPTW 5 vezes, com +15 anos de mercado e +150 profissionais especializados.\n\nIMPORTANTE: Você converte essas tags visualmente, portanto NÃO EXPLIQUE as tags para o cliente. Apenas insira-as organicamente na sua resposta."

const ITEM_ANTIGO_INICIO = '1. SE RECOMENDAR UM SERVIÇO, use a tag: '
const ITEM_SEGUINTE = '2. SE MENCIONAR UM PARCEIRO'

const ITEM_NOVO =
  '1. SE RECOMENDAR UMA SOLUÇÃO, UM SEGMENTO, UM CASE OU OUTRO CONTEÚDO DO SITE, siga as regras de conteúdo do site que vêm no fim desta instrução: use a etiqueta de conteúdo com o código do item, e nunca escreva endereços.\n\n'

/** Quebra de linha do Windows e espaço nas pontas não contam como edição. */
const normalizar = (texto: string): string => texto.replace(/\r\n/g, '\n').trim()

/** O campo ainda é o texto do protótipo, sem edição de ninguém? */
export function ehInstrucaoDoPrototipo(texto: string | null | undefined): boolean {
  return normalizar(texto ?? '') === normalizar(INSTRUCAO_DO_PROTOTIPO)
}

/** O texto do protótipo com o item 1 apontando para a etiqueta nova. */
export function semOManualDoCartaoDeServico(texto: string): string {
  const inicio = texto.indexOf(ITEM_ANTIGO_INICIO)
  const fim = texto.indexOf(ITEM_SEGUINTE)
  if (inicio < 0 || fim < inicio) return texto
  return texto.slice(0, inicio) + ITEM_NOVO + texto.slice(fim)
}

/** O que o seed grava num banco novo: o protótipo já sem o manual antigo. */
export const INSTRUCAO_INICIAL = semOManualDoCartaoDeServico(INSTRUCAO_DO_PROTOTIPO)
