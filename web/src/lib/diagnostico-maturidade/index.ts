/* API pública do Diagnóstico de Maturidade de Dados (questionário do Roger, v1.7).
 *
 * `dados.ts` é a base gerada do HTML; `motor.ts`, a lógica portada; `email.ts`,
 * o resultado ao lead e o aviso à ATRA. Quem usa o diagnóstico (rota, action,
 * e-mail) importa daqui. `original.ts` fica de fora de
 * propósito: é só dos testes de paridade e depende de `node:vm` e do disco.
 */

export {
  ACOES_POR_REGULACAO,
  CARGOS,
  DOMINIOS_DE_EMAIL_BLOQUEADOS,
  NIVEIS,
  OFERTAS,
  O_QUE_ESTA_EM_JOGO,
  PERGUNTAS,
  PORTES,
  ROTULOS_DAS_TAGS,
  SETORES,
  TAGS_DO_SETOR,
  TAGS_INTERNAS,
  TAGS_UNIVERSAIS,
  TAGS_UNIVERSAIS_DO_PERFIL,
  VERSAO,
  type Alternativa,
  type Cargo,
  type Faixa,
  type Nivel,
  type NivelNumerico,
  type NomeDoPilar,
  type Nota,
  type Oferta,
  type OpcaoDoPerfil,
  type Pergunta,
  type PerguntaId,
  type Porte,
  type Setor,
  type Tag,
} from './dados'

export {
  calcular,
  ehCargo,
  ehEmailCorporativo,
  ehPorte,
  ehSetor,
  faixa,
  impactosDaPergunta,
  impactosDoSetor,
  leituraPeloPorte,
  montarRoadmap,
  nivelDaMedia,
  nivelNumerico,
  perguntasDoSetor,
  pilaresEmJogo,
  roadmapEmTexto,
  tagRelevante,
  validarRespostas,
  type Calculo,
  type FaseDoRoadmap,
  type Impacto,
  type ItemDoRoadmap,
  type Respostas,
  type Roadmap,
} from './motor'

export { REGULACOES_PADRAO, regulacoesAvaliaveis, resolverRegulacoes, type RegulacoesPorSetor } from './regulacoes'

export { impactosNoPerfil } from './perfil'

export {
  corDoPilar,
  escaparHtml,
  montarAvisoParaAtra,
  montarEmailDoResultado,
  type AvisoParaAtra,
  type EmailDoResultado,
  type EntradaDoAvisoParaAtra,
  type EntradaDoEmailDoResultado,
} from './email'
