/* A fixture da seção "Formulário" (task 053), num arquivo sem efeito colateral
 * para o e2e poder importar — o `formulario-de-teste.ts` ao lado grava no
 * banco ao ser carregado. Só existe com `SEED_FIXTURES=1`, que só o CI liga. */

/** A página que recebe as duas seções: uma solução que o contraste e o axe já
 *  medem (`ROTAS_COM_GABARITO`), para eles medirem a seção também. */
export const PAGINA_COM_FORMULARIO = '/solucoes/ia-generativa-e-agentes-conversacionais'
export const SLUG_DA_PAGINA_COM_FORMULARIO = 'ia-generativa-e-agentes-conversacionais'

/** O formulário que termina na mensagem. */
export const FORMULARIO_DE_TESTE = {
  nome: 'Formulário de teste (e2e)',
  ancora: 'formulario-e2e',
  botao: 'Enviar inscrição',
  mensagem: 'Recebemos a sua inscrição de teste.',
  rotulos: { nome: 'Nome', email: 'E-mail', area: 'Área de interesse', consentimento: 'Aceito receber comunicações.' },
  opcoes: ['Dados', 'Inteligência artificial'],
} as const

/** O formulário que leva a outra página depois do envio. */
export const FORMULARIO_QUE_LEVA_A_OUTRA_PAGINA = {
  nome: 'Formulário de teste que leva a outra página (e2e)',
  ancora: 'formulario-e2e-pagina',
  botao: 'Enviar e continuar',
  destino: '/contato',
} as const
