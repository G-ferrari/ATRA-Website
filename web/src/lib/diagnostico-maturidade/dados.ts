/* ⚠️ ARQUIVO GERADO — não editar à mão.
 *
 * Origem: docs/02-especificacao/diagnostico-maturidade/atra-diagnostico-maturidade-dados.html
 * (questionário do Roger, versão 1.7 — `data-version` do #atra-quiz).
 *
 * Regenerar, de `web/` (ou no contêiner, em `/app`):
 *   node scripts/diagnostico-maturidade/extrair-do-html.mjs
 *
 * Os textos saem caractere a caractere do HTML: conteúdo é decisão do marketing
 * (D-22), e correção de texto se faz no HTML de origem, não aqui. As notas das
 * alternativas são 1, 2, 3, 5 — sem 4 — como no original.
 *
 * Nomes: constantes e campos em português; **códigos** (setor, porte, cargo,
 * tag, pilar, faixa) exatamente como no HTML. Equivalências:
 *   QUESTIONS → PERGUNTAS ({ id, pilar, dama, sectors → setores, text → enunciado,
 *     options → alternativas: { s → nota, t → texto, tags } })
 *   TAG_LABELS → ROTULOS_DAS_TAGS · UNIVERSAL_TAGS → TAGS_UNIVERSAIS
 *   SECTOR_TAGS → TAGS_DO_SETOR · INTERNAL_TAGS → TAGS_INTERNAS
 *   PROFILE_UNIVERSAL → TAGS_UNIVERSAIS_DO_PERFIL · LEVELS → NIVEIS ({ n → nome, d → descricao })
 *   OFFERS → OFERTAS ({ t → titulo, d → descricao }) · REG_ACTIONS → ACOES_POR_REGULACAO
 *   STAKES → O_QUE_ESTA_EM_JOGO · CONFIG.blockedEmailDomains → DOMINIOS_DE_EMAIL_BLOQUEADOS
 *   <select id="aq-setor|aq-porte|aq-cargo"> → SETORES | PORTES | CARGOS (sem o "Selecione…")
 *
 * `motor.test.ts` reextrai o HTML e compara com este arquivo: HTML novo sem
 * regenerar reprova o teste.
 */

export const VERSAO = '1.7'

export type Setor =
  | 'financeiro'
  | 'capitais'
  | 'seguros'
  | 'saude'
  | 'telecom'
  | 'educacao'
  | 'varejo'
  | 'outros'
export type Porte =
  | 'ate_50mi'
  | '50_300mi'
  | '300mi_1bi'
  | '1_5bi'
  | 'acima_5bi'
export type Cargo =
  | 'ceo_presidente'
  | 'cfo_cro'
  | 'cio_cto_cdo'
  | 'diretor_gerente'
  | 'coordenador_analista'
  | 'outro'
export type NomeDoPilar =
  | 'Governança'
  | 'Qualidade'
  | 'Segurança'
  | 'Conformidade'
export type PerguntaId =
  | 'gov_estrategia'
  | 'gov_papeis'
  | 'gov_catalogo'
  | 'gov_arquitetura'
  | 'gov_decisao'
  | 'qual_confianca'
  | 'qual_regras'
  | 'qual_mdm'
  | 'seg_acesso'
  | 'seg_incidente'
  | 'conf_lgpd_mapa'
  | 'conf_lgpd_titular'
  | 'conf_ia'
  | 'conf_fin_rc18'
  | 'conf_fin_rc18_dim'
  | 'conf_fin_ciber'
  | 'conf_fin_of'
  | 'conf_fin_ifrs9'
  | 'conf_cap_cvm'
  | 'conf_cap_suit'
  | 'conf_cap_esg'
  | 'conf_seg_ifrs17'
  | 'conf_seg_sro'
  | 'conf_seg_ciber'
  | 'conf_sau_anvisa'
  | 'conf_sau_tiss'
  | 'conf_tel_anatel'
  | 'conf_tel_ciber'
  | 'conf_edu_mec'
  | 'conf_edu_menores'
  | 'conf_edu_retencao'
  | 'conf_ger_esg'
  | 'conf_ger_tributaria'
export type Tag =
  | 'governanca'
  | 'qualidade'
  | 'seguranca'
  | 'lgpd'
  | 'anpd'
  | 'lgpd_saude'
  | 'ia'
  | 'rc18'
  | 'bcb'
  | 'cmn5274'
  | 'bcbs239'
  | 'openfinance'
  | 'ifrs9'
  | 'ifrs17'
  | 'cvm'
  | 'cvm244'
  | 'anbima'
  | 'pld'
  | 'susep'
  | 'sro'
  | 'openinsurance'
  | 'anvisa'
  | 'cfm'
  | 'ans'
  | 'tiss'
  | 'rnds'
  | 'anatel'
  | 'rgc'
  | 'eca'
  | 'marco_civil'
  | 'mec'
  | 'inep'
  | 'fies'
  | 'esg'
  | 'fiscal'
  | 'reforma_tributaria'
export type Nota = 1 | 2 | 3 | 5
export type NivelNumerico = 1 | 2 | 3 | 4 | 5
/** Faixa de maturidade das ofertas: baixa < 2,6 · média < 3,5 · alta (`band` no HTML). */
export type Faixa =
  | 'low'
  | 'mid'
  | 'high'

export interface OpcaoDoPerfil<V extends string> {
  readonly valor: V
  readonly rotulo: string
}
export interface Alternativa {
  readonly nota: Nota
  readonly texto: string
  readonly tags: readonly Tag[]
}
export interface Pergunta {
  readonly id: PerguntaId
  readonly pilar: NomeDoPilar
  /** Área de conhecimento DAMA-DMBOK. */
  readonly dama: string
  /** `'all'` = transversal; senão, só aparece para os setores listados. */
  readonly setores: readonly (Setor | 'all')[]
  readonly enunciado: string
  readonly alternativas: readonly Alternativa[]
}
export interface Nivel {
  readonly nome: string
  readonly descricao: string
}
export interface Oferta {
  readonly titulo: string
  readonly descricao: string
}

export const SETORES: readonly OpcaoDoPerfil<Setor>[] = [
  { valor: 'financeiro', rotulo: 'Mercado Financeiro · Bancos, Fintechs, Meios de Pagamento' },
  { valor: 'capitais', rotulo: 'Mercado de Capitais · Gestoras, Corretoras, Assets' },
  { valor: 'seguros', rotulo: 'Seguros e Previdência' },
  { valor: 'saude', rotulo: 'Saúde · Life Sciences · Operadoras' },
  { valor: 'telecom', rotulo: 'Telecomunicações' },
  { valor: 'educacao', rotulo: 'Educação · Grupos educacionais, EdTechs' },
  { valor: 'varejo', rotulo: 'Varejo, Indústria e Serviços' },
  { valor: 'outros', rotulo: 'Outros' },
]

export const PORTES: readonly OpcaoDoPerfil<Porte>[] = [
  { valor: 'ate_50mi', rotulo: 'Até R$ 50 mi' },
  { valor: '50_300mi', rotulo: 'R$ 50 mi – 300 mi' },
  { valor: '300mi_1bi', rotulo: 'R$ 300 mi – 1 bi' },
  { valor: '1_5bi', rotulo: 'R$ 1 bi – 5 bi' },
  { valor: 'acima_5bi', rotulo: 'Acima de R$ 5 bi' },
]

export const CARGOS: readonly OpcaoDoPerfil<Cargo>[] = [
  { valor: 'ceo_presidente', rotulo: 'CEO / Presidente / Sócio' },
  { valor: 'cfo_cro', rotulo: 'CFO / CRO / Diretor Financeiro ou de Riscos' },
  { valor: 'cio_cto_cdo', rotulo: 'CIO / CTO / CDO' },
  { valor: 'diretor_gerente', rotulo: 'Diretor(a) / Gerente de área' },
  { valor: 'coordenador_analista', rotulo: 'Coordenação / Especialista / Analista' },
  { valor: 'outro', rotulo: 'Outro' },
]

export const PERGUNTAS: readonly Pergunta[] = [
  {
    id: 'gov_estrategia',
    pilar: 'Governança',
    dama: 'Data Governance',
    setores: ['all'],
    enunciado: 'Como a estratégia de dados se conecta à estratégia do negócio?',
    alternativas: [
      { nota: 1, texto: 'Não existe uma estratégia de dados formal; iniciativas surgem por demanda.', tags: ['governanca'] },
      { nota: 2, texto: 'Há iniciativas em áreas isoladas, sem patrocínio executivo claro.', tags: ['governanca'] },
      { nota: 3, texto: 'Existe uma estratégia documentada, com patrocinador executivo e metas anuais.', tags: [] },
      { nota: 5, texto: 'Dados são um pilar do planejamento estratégico, com KPIs acompanhados pela diretoria.', tags: [] },
    ],
  },
  {
    id: 'gov_papeis',
    pilar: 'Governança',
    dama: 'Data Governance',
    setores: ['all'],
    enunciado: 'Quem responde pelos dados críticos da empresa (data owners e data stewards)?',
    alternativas: [
      { nota: 1, texto: 'Ninguém formalmente; a TI é procurada quando algo dá errado.', tags: ['governanca', 'lgpd'] },
      { nota: 2, texto: 'Alguns responsáveis informais em áreas específicas.', tags: ['governanca', 'lgpd'] },
      { nota: 3, texto: 'Papéis definidos para os domínios principais, com comitê de dados ativo.', tags: [] },
      { nota: 5, texto: 'Owners e stewards nomeados para todos os domínios, com metas e rituais de governança.', tags: [] },
    ],
  },
  {
    id: 'gov_catalogo',
    pilar: 'Governança',
    dama: 'Metadata Management',
    setores: ['all'],
    enunciado: 'Como as pessoas descobrem quais dados existem, o que significam e de onde vêm?',
    alternativas: [
      { nota: 1, texto: 'Perguntando a quem conhece o sistema; não há documentação centralizada.', tags: ['governanca', 'ifrs9', 'ifrs17', 'cvm'] },
      { nota: 2, texto: 'Planilhas ou wikis mantidas manualmente e frequentemente desatualizadas.', tags: ['governanca'] },
      { nota: 3, texto: 'Catálogo de dados implantado para os domínios principais, com glossário de negócio.', tags: [] },
      { nota: 5, texto: 'Catálogo com linhagem automática ponta a ponta, classificação e uso monitorado.', tags: [] },
    ],
  },
  {
    id: 'gov_arquitetura',
    pilar: 'Governança',
    dama: 'Data Architecture / Integration',
    setores: ['all'],
    enunciado: 'Como os dados chegam às áreas que decidem?',
    alternativas: [
      { nota: 1, texto: 'Extrações manuais e planilhas; cada área monta a sua versão do número.', tags: ['governanca'] },
      { nota: 2, texto: 'Alguns relatórios centralizados, mas com múltiplas fontes concorrentes.', tags: ['governanca'] },
      { nota: 3, texto: 'Plataforma de dados (data warehouse / lakehouse) com fonte única para os indicadores principais.', tags: [] },
      { nota: 5, texto: 'Plataforma moderna em nuvem com produtos de dados por domínio, self-service e monitoração.', tags: [] },
    ],
  },
  {
    id: 'gov_decisao',
    pilar: 'Governança',
    dama: 'Data Warehousing & BI / Analytics',
    setores: ['all'],
    enunciado: 'Quando a diretoria precisa de uma resposta nova a partir dos dados (um indicador que não existe, um cruzamento entre áreas), quanto tempo leva?',
    alternativas: [
      { nota: 1, texto: 'Semanas: depende de pedido à TI, extrações e planilhas montadas à mão.', tags: ['governanca'] },
      { nota: 2, texto: 'Dias: analistas conseguem, mas cada resposta é um projeto.', tags: ['governanca'] },
      { nota: 3, texto: 'Horas: os indicadores principais estão em self-service e o resto é pedido pontual.', tags: [] },
      { nota: 5, texto: 'Minutos: as áreas exploram dados governados por conta própria, com IA e analytics avançado.', tags: [] },
    ],
  },
  {
    id: 'qual_confianca',
    pilar: 'Qualidade',
    dama: 'Data Quality',
    setores: ['all'],
    enunciado: 'Com que frequência a diretoria questiona a confiabilidade de um número apresentado?',
    alternativas: [
      { nota: 1, texto: 'Frequentemente; reconciliar números entre áreas consome parte das reuniões.', tags: ['qualidade', 'ifrs9', 'ifrs17', 'cvm'] },
      { nota: 2, texto: 'Às vezes; existem divergências conhecidas que ainda não foram tratadas.', tags: ['qualidade'] },
      { nota: 3, texto: 'Raramente; os indicadores principais têm regras de qualidade definidas.', tags: [] },
      { nota: 5, texto: 'Praticamente nunca; a qualidade é medida, publicada e melhorada continuamente.', tags: [] },
    ],
  },
  {
    id: 'qual_regras',
    pilar: 'Qualidade',
    dama: 'Data Quality',
    setores: ['all'],
    enunciado: 'Existem regras e monitoração de qualidade (completude, consistência, atualidade) nos dados críticos?',
    alternativas: [
      { nota: 1, texto: 'Não; problemas são descobertos pelo usuário final ou pelo cliente.', tags: ['qualidade', 'lgpd'] },
      { nota: 2, texto: 'Validações pontuais em alguns processos, sem monitoração contínua.', tags: ['qualidade'] },
      { nota: 3, texto: 'Regras definidas e monitoradas para os dados críticos, com tratamento de incidentes.', tags: [] },
      { nota: 5, texto: 'Observabilidade de dados com alertas, SLAs e scorecards de qualidade por domínio.', tags: [] },
    ],
  },
  {
    id: 'qual_mdm',
    pilar: 'Qualidade',
    dama: 'Master & Reference Data',
    setores: ['all'],
    enunciado: 'Como estão os cadastros mestres (clientes, produtos, fornecedores)?',
    alternativas: [
      { nota: 1, texto: 'Duplicados e divergentes entre sistemas; não há visão única.', tags: ['qualidade', 'lgpd'] },
      { nota: 2, texto: 'Deduplicação eventual, feita manualmente em campanhas.', tags: ['qualidade', 'lgpd'] },
      { nota: 3, texto: 'Processo de gestão de dados mestres (MDM) para o cadastro principal.', tags: [] },
      { nota: 5, texto: 'MDM multidomínio com golden record, regras de sobrevivência e stewardship ativo.', tags: [] },
    ],
  },
  {
    id: 'seg_acesso',
    pilar: 'Segurança',
    dama: 'Data Security',
    setores: ['all'],
    enunciado: 'Como o acesso a dados sensíveis é concedido e revisado?',
    alternativas: [
      { nota: 1, texto: 'Acessos amplos por conveniência; revisões não são feitas.', tags: ['seguranca', 'lgpd', 'bcb', 'susep'] },
      { nota: 2, texto: 'Perfis por sistema, com revisão esporádica.', tags: ['seguranca', 'lgpd'] },
      { nota: 3, texto: 'Controle por papéis (RBAC), classificação de dados e revisão periódica de acessos.', tags: [] },
      { nota: 5, texto: 'Acesso por atributo/finalidade, mascaramento dinâmico, trilha de auditoria e revisão automatizada.', tags: [] },
    ],
  },
  {
    id: 'seg_incidente',
    pilar: 'Segurança',
    dama: 'Data Security',
    setores: ['all'],
    enunciado: 'Se houvesse um vazamento de dados hoje, em quanto tempo a empresa saberia e responderia?',
    alternativas: [
      { nota: 1, texto: 'Não temos como saber; dependeríamos de alguém avisar.', tags: ['seguranca', 'lgpd', 'bcb', 'susep', 'anatel'] },
      { nota: 2, texto: 'Há monitoração básica, mas sem plano de resposta testado.', tags: ['seguranca', 'lgpd'] },
      { nota: 3, texto: 'Plano de resposta a incidentes definido, com comunicação à ANPD e aos titulares prevista.', tags: [] },
      { nota: 5, texto: 'Detecção contínua, resposta ensaiada (tabletop) e métricas de tempo de detecção e resposta.', tags: [] },
    ],
  },
  {
    id: 'conf_lgpd_mapa',
    pilar: 'Conformidade',
    dama: 'Data Governance / Security',
    setores: ['all'],
    enunciado: 'A empresa sabe onde estão os dados pessoais que trata, com que base legal e por quanto tempo, e avalia o risco dos tratamentos mais sensíveis?',
    alternativas: [
      { nota: 1, texto: 'Não há inventário de dados pessoais, RIPD nem encarregado (DPO) nomeado.', tags: ['lgpd', 'anpd'] },
      { nota: 2, texto: 'Inventário parcial feito uma vez; políticas existem, mas sem acompanhamento nem RIPD.', tags: ['lgpd', 'anpd'] },
      { nota: 3, texto: 'Mapeamento (ROPA) mantido, DPO ativo, RIPD para tratamentos de alto risco, retenção e descarte aplicados.', tags: [] },
      { nota: 5, texto: 'Privacidade por design: classificação automática, consentimento gerenciado, RIPD revisado e auditoria contínua.', tags: [] },
    ],
  },
  {
    id: 'conf_lgpd_titular',
    pilar: 'Conformidade',
    dama: 'Data Governance',
    setores: ['all'],
    enunciado: 'Como a empresa atende pedidos de titulares (acesso, correção, exclusão) e como reagiria a um incidente que precise ser comunicado à ANPD?',
    alternativas: [
      { nota: 1, texto: 'Caso a caso, sem processo, prazo controlado nem plano de comunicação de incidentes (a ANPD exige comunicação em prazo definido).', tags: ['lgpd', 'anpd'] },
      { nota: 2, texto: 'Processo manual, com dificuldade de localizar os dados em todos os sistemas; incidentes tratados de improviso.', tags: ['lgpd', 'anpd'] },
      { nota: 3, texto: 'Fluxo definido para titulares e para incidentes, com prazos monitorados e rastreabilidade das ações.', tags: [] },
      { nota: 5, texto: 'Portal do titular integrado aos sistemas, execução automatizada, playbook de incidente testado e evidências.', tags: [] },
    ],
  },
  {
    id: 'conf_ia',
    pilar: 'Conformidade',
    dama: 'Data Governance / Data Ethics',
    setores: ['all'],
    enunciado: 'A empresa sabe quais sistemas de IA usam seus dados, com que nível de risco, e de onde vêm e que qualidade têm os dados que os alimentam?',
    alternativas: [
      { nota: 1, texto: 'Não sabemos quais sistemas de IA usam dados da empresa; iniciativas surgem sem avaliação.', tags: ['ia', 'lgpd', 'anpd'] },
      { nota: 2, texto: 'Temos uma lista informal de iniciativas de IA, sem classificação de risco nem controle dos dados usados.', tags: ['ia', 'lgpd'] },
      { nota: 3, texto: 'Inventário de sistemas de IA com classificação de risco, avaliação de impacto e regras para dados pessoais.', tags: [] },
      { nota: 5, texto: 'Governança de IA integrada à de dados: linhagem dos dados de treinamento, monitoração de viés, explicabilidade e trilha de auditoria.', tags: [] },
    ],
  },
  {
    id: 'conf_fin_rc18',
    pilar: 'Conformidade',
    dama: 'Data Governance / Data Quality',
    setores: ['financeiro'],
    enunciado: 'Como a instituição está em relação à Resolução Conjunta CMN/BCB nº 18/2025 (Política de Qualidade das Informações, diretor estatutário responsável, dicionário de dados, relatório semestral)? O prazo de adequação termina em 31/12/2026.',
    alternativas: [
      { nota: 1, texto: 'Ainda não mapeamos o impacto; não há política, diretor designado nem dicionário de dados.', tags: ['rc18', 'bcb'] },
      { nota: 2, texto: 'Política em elaboração e diretor designado, mas o dicionário de dados e o relatório semestral ainda não existem.', tags: ['rc18', 'bcb'] },
      { nota: 3, texto: 'Política aprovada pelo Conselho, dicionário de dados dos reportes críticos e primeiro relatório semestral produzido.', tags: [] },
      { nota: 5, texto: 'Programa completo e operando: política, dicionário integrado ao catálogo, testes antes do envio, indicadores e relatório semestral automatizados.', tags: [] },
    ],
  },
  {
    id: 'conf_fin_rc18_dim',
    pilar: 'Conformidade',
    dama: 'Data Quality / Metadata Management',
    setores: ['financeiro'],
    enunciado: 'Para cada informação enviada ao Banco Central, a instituição consegue comprovar as 12 dimensões de qualidade da RC 18 (rastreabilidade da origem até o envio, acurácia, completude, consistência e tempestividade), na linha do BCBS 239?',
    alternativas: [
      { nota: 1, texto: 'Não; os reportes são montados manualmente e não sabemos reconstruir a origem de um número.', tags: ['rc18', 'bcb', 'bcbs239', 'qualidade'] },
      { nota: 2, texto: 'Rastreamos alguns reportes com esforço manual; erros são descobertos após o envio ou por questionamento do BCB.', tags: ['rc18', 'bcb', 'bcbs239'] },
      { nota: 3, texto: 'Linhagem documentada para os reportes críticos, validações antes do envio e tratamento de irregularidades com plano de ação.', tags: [] },
      { nota: 5, texto: 'Linhagem automática ponta a ponta, regras de qualidade por dimensão monitoradas continuamente e evidências prontas para o supervisor.', tags: [] },
    ],
  },
  {
    id: 'conf_fin_ciber',
    pilar: 'Conformidade',
    dama: 'Data Security',
    setores: ['financeiro'],
    enunciado: 'A instituição já se adequou à Resolução CMN 5.274/2025 (atualiza a 4.893/2021 de cibersegurança, prazo 1º/3/2026): controles estendidos a terceiros e nuvem, teste de intrusão anual independente e evidências de correção?',
    alternativas: [
      { nota: 1, texto: 'Não conhecemos as mudanças; os controles de fornecedores e nuvem não são verificados.', tags: ['cmn5274', 'bcb', 'seguranca'] },
      { nota: 2, texto: 'Política de cibersegurança existe, mas sem cláusulas e evidências dos terceiros críticos nem pentest independente.', tags: ['cmn5274', 'bcb'] },
      { nota: 3, texto: 'Contratos com fornecedores críticos revisados, pentest anual independente e planos de ação documentados.', tags: [] },
      { nota: 5, texto: 'Gestão contínua de risco de terceiros, monitoração integrada, testes recorrentes e reporte ao Conselho.', tags: [] },
    ],
  },
  {
    id: 'conf_fin_of',
    pilar: 'Conformidade',
    dama: 'Data Integration / Data Quality',
    setores: ['financeiro'],
    enunciado: 'No Open Finance, a instituição acompanha a disponibilidade e a qualidade dos dados que compartilha e recebe, e a rastreabilidade dos consentimentos dos clientes?',
    alternativas: [
      { nota: 1, texto: 'Cumprimos o mínimo; não acompanhamos indicadores de disponibilidade nem qualidade das APIs.', tags: ['openfinance', 'bcb'] },
      { nota: 2, texto: 'Acompanhamos os indicadores exigidos, mas falhas de dados e consentimento são tratadas de forma reativa.', tags: ['openfinance', 'bcb'] },
      { nota: 3, texto: 'Monitoração das APIs e dos consentimentos com alertas, e uso dos dados recebidos governado.', tags: [] },
      { nota: 5, texto: 'Open Finance como produto de dados: qualidade medida, consentimentos auditáveis e dados recebidos integrados a crédito e relacionamento.', tags: [] },
    ],
  },
  {
    id: 'conf_fin_ifrs9',
    pilar: 'Conformidade',
    dama: 'Data Quality / Data Integration',
    setores: ['financeiro'],
    enunciado: 'Os dados que alimentam os modelos de perda esperada (IFRS 9 / Resolução CMN 4.966) são rastreáveis e reconciliáveis com a contabilidade?',
    alternativas: [
      { nota: 1, texto: 'Os cálculos dependem de planilhas e ajustes manuais difíceis de reproduzir.', tags: ['ifrs9', 'bcb'] },
      { nota: 2, texto: 'Existe um processo, mas a reconciliação entre risco e contabilidade é trabalhosa.', tags: ['ifrs9'] },
      { nota: 3, texto: 'Pipelines documentados, com linhagem e reconciliação periódica.', tags: [] },
      { nota: 5, texto: 'Linhagem automática, reconciliação diária e trilha completa para auditoria e regulador.', tags: [] },
    ],
  },
  {
    id: 'conf_cap_cvm',
    pilar: 'Conformidade',
    dama: 'Data Governance / Quality',
    setores: ['capitais'],
    enunciado: 'Como a gestora/corretora garante a qualidade e a rastreabilidade das informações enviadas à CVM e à ANBIMA (Resolução CVM 175, informes periódicos, suitability)?',
    alternativas: [
      { nota: 1, texto: 'Consolidação manual em planilhas, com retrabalho e risco de erro nos envios.', tags: ['cvm', 'anbima'] },
      { nota: 2, texto: 'Processo semiautomatizado, mas sem controles de qualidade antes do envio.', tags: ['cvm', 'anbima'] },
      { nota: 3, texto: 'Bases governadas, validações antes do envio e trilha das versões enviadas.', tags: [] },
      { nota: 5, texto: 'Geração automatizada com validação, linhagem e reconciliação com administradores e custodiantes.', tags: [] },
    ],
  },
  {
    id: 'conf_cap_suit',
    pilar: 'Conformidade',
    dama: 'Master Data / Security',
    setores: ['capitais'],
    enunciado: 'Os dados de perfil do investidor (suitability, KYC, PLD/FT) estão íntegros, atualizados e disponíveis para a área de compliance?',
    alternativas: [
      { nota: 1, texto: 'Estão espalhados entre sistemas e formulários, com cadastros desatualizados.', tags: ['cvm', 'pld', 'lgpd'] },
      { nota: 2, texto: 'Centralizados, mas com atualização e monitoração manual.', tags: ['cvm', 'pld'] },
      { nota: 3, texto: 'Cadastro único com regras de atualização e alertas para compliance.', tags: [] },
      { nota: 5, texto: 'Monitoração contínua com modelos de risco e evidências automáticas para auditoria.', tags: [] },
    ],
  },
  {
    id: 'conf_cap_esg',
    pilar: 'Conformidade',
    dama: 'Data Governance / Quality',
    setores: ['capitais'],
    enunciado: 'Com a Resolução CVM 244/2026, o reporte IFRS S1/S2 passou a ser voluntário com dever de "pratique ou explique" a partir de 2027. A casa (ou as companhias que analisa) tem dados de sustentabilidade governados para reportar ou justificar?',
    alternativas: [
      { nota: 1, texto: 'Não há coleta estruturada de dados de sustentabilidade; a decisão de reportar não foi discutida.', tags: ['cvm244', 'esg'] },
      { nota: 2, texto: 'Dados coletados em planilhas para relatórios pontuais, sem controle de qualidade.', tags: ['cvm244', 'esg'] },
      { nota: 3, texto: 'Decisão tomada, indicadores definidos com responsáveis e validação antes da publicação.', tags: [] },
      { nota: 5, texto: 'Dados de sustentabilidade integrados à plataforma de dados, auditáveis e conectados às decisões de investimento.', tags: [] },
    ],
  },
  {
    id: 'conf_seg_ifrs17',
    pilar: 'Conformidade',
    dama: 'Data Integration / Quality',
    setores: ['seguros'],
    enunciado: 'Os dados de contratos, sinistros e provisões que alimentam o IFRS 17 / CPC 50 (companhias abertas) e os reportes prudenciais à SUSEP são integrados e reconciliáveis?',
    alternativas: [
      { nota: 1, texto: 'Cada sistema tem a sua base; a consolidação é manual e demorada.', tags: ['ifrs17', 'susep'] },
      { nota: 2, texto: 'Existe integração parcial, com ajustes manuais no fechamento.', tags: ['ifrs17', 'susep'] },
      { nota: 3, texto: 'Base atuarial e contábil integradas, com linhagem e reconciliação periódica.', tags: [] },
      { nota: 5, texto: 'Fechamento automatizado, reconciliação contínua e evidências prontas para auditoria.', tags: [] },
    ],
  },
  {
    id: 'conf_seg_sro',
    pilar: 'Conformidade',
    dama: 'Data Quality / Data Integration',
    setores: ['seguros'],
    enunciado: 'Como a seguradora garante qualidade e tempestividade no Sistema de Registro de Operações (SRO) e no Open Insurance (compartilhamento de dados e consentimentos)?',
    alternativas: [
      { nota: 1, texto: 'Registros enviados com atraso e rejeições recorrentes; não medimos a qualidade.', tags: ['susep', 'sro', 'openinsurance'] },
      { nota: 2, texto: 'Envio automatizado, mas as rejeições são tratadas manualmente e sem causa raiz.', tags: ['susep', 'sro'] },
      { nota: 3, texto: 'Validações antes do envio, indicadores de rejeição e consentimentos do Open Insurance rastreáveis.', tags: [] },
      { nota: 5, texto: 'Qualidade monitorada na origem, reconciliação automática com a registradora e dados do Open Insurance usados no negócio.', tags: [] },
    ],
  },
  {
    id: 'conf_seg_ciber',
    pilar: 'Conformidade',
    dama: 'Data Security',
    setores: ['seguros'],
    enunciado: 'A seguradora atende à Circular SUSEP 638/2021 e suas atualizações de 2026 (contratos de nuvem e processamento de dados acessíveis à SUSEP, gestão de incidentes, manual de segurança cibernética)?',
    alternativas: [
      { nota: 1, texto: 'Não temos inventário dos serviços de nuvem e processamento contratados nem plano de resposta a incidentes.', tags: ['susep', 'seguranca', 'lgpd'] },
      { nota: 2, texto: 'Política existe, mas os contratos e evidências dos fornecedores não estão organizados para a SUSEP.', tags: ['susep', 'seguranca'] },
      { nota: 3, texto: 'Inventário de fornecedores críticos, contratos acessíveis, plano de incidentes definido e testado.', tags: [] },
      { nota: 5, texto: 'Gestão contínua de risco cibernético e de terceiros, com métricas reportadas ao Conselho.', tags: [] },
    ],
  },
  {
    id: 'conf_sau_anvisa',
    pilar: 'Conformidade',
    dama: 'Data Governance / Security',
    setores: ['saude'],
    enunciado: 'Como a organização garante integridade, rastreabilidade e proteção dos dados clínicos (prontuário eletrônico, dados sensíveis de saúde) exigidos pela Anvisa, pelo CFM e pela LGPD? Dados de saúde são foco da ANPD em 2026-2027.',
    alternativas: [
      { nota: 1, texto: 'Registros em sistemas separados, sem trilha de auditoria confiável nem classificação de dados sensíveis.', tags: ['anvisa', 'cfm', 'lgpd_saude', 'anpd'] },
      { nota: 2, texto: 'Trilha de auditoria em alguns sistemas; integração feita manualmente.', tags: ['anvisa', 'cfm', 'lgpd_saude'] },
      { nota: 3, texto: 'Dados clínicos governados, com trilha de auditoria, classificação de dados sensíveis e controles de acesso.', tags: [] },
      { nota: 5, texto: 'Plataforma integrada com auditoria contínua, privacidade por design e evidências automatizadas.', tags: [] },
    ],
  },
  {
    id: 'conf_sau_tiss',
    pilar: 'Conformidade',
    dama: 'Data Integration / Quality',
    setores: ['saude'],
    enunciado: 'Com a RN ANS 639/2025 (fim do SIP e centralização no Monitoramento TISS desde março de 2026) e a interoperabilidade com a RNDS em HL7 FHIR (Decreto 12.560/2025), como estão os dados assistenciais e de faturamento?',
    alternativas: [
      { nota: 1, texto: 'Guias e registros com muitas glosas e rejeições; não há padrão nem integração com a RNDS.', tags: ['ans', 'tiss', 'rnds'] },
      { nota: 2, texto: 'TISS atendido com retrabalho manual; interoperabilidade FHIR ainda não iniciada.', tags: ['ans', 'tiss', 'rnds'] },
      { nota: 3, texto: 'Dados assistenciais padronizados na origem, validações antes do envio e integração com a RNDS em andamento.', tags: [] },
      { nota: 5, texto: 'Interoperabilidade FHIR operando, qualidade monitorada por indicador e dados usados na gestão clínica e financeira.', tags: [] },
    ],
  },
  {
    id: 'conf_tel_anatel',
    pilar: 'Conformidade',
    dama: 'Data Governance / Quality',
    setores: ['telecom'],
    enunciado: 'Como a operadora produz os indicadores e reportes exigidos pela Anatel e as evidências de transparência e proteção de dados do novo Regulamento Geral de Direitos do Consumidor (RGC, em vigor desde setembro de 2025)?',
    alternativas: [
      { nota: 1, texto: 'Consolidação manual a partir de vários sistemas, com retrabalho recorrente.', tags: ['anatel', 'rgc', 'lgpd'] },
      { nota: 2, texto: 'Rotinas automatizadas parciais, sem validação de qualidade antes do envio.', tags: ['anatel', 'rgc'] },
      { nota: 3, texto: 'Bases governadas com validações e trilha dos reportes enviados.', tags: [] },
      { nota: 5, texto: 'Geração automatizada, monitoração de qualidade e painéis de conformidade em tempo real.', tags: [] },
    ],
  },
  {
    id: 'conf_tel_ciber',
    pilar: 'Conformidade',
    dama: 'Data Security',
    setores: ['telecom'],
    enunciado: 'A operadora atende ao Regulamento de Segurança Cibernética da Anatel e às exigências recentes: notificação de incidentes, combate a fraude e spoofing, guarda de registros do Marco Civil e verificação de idade do ECA Digital (em vigor desde março de 2026)?',
    alternativas: [
      { nota: 1, texto: 'Não há processo formal de incidentes nem controles de identidade e idade nos canais digitais.', tags: ['anatel', 'eca', 'marco_civil', 'lgpd', 'seguranca'] },
      { nota: 2, texto: 'Processo de incidentes existe, mas verificação de idade e antifraude são pontuais.', tags: ['anatel', 'eca'] },
      { nota: 3, texto: 'Incidentes notificados nos prazos, antifraude integrado e mecanismos de verificação de idade definidos.', tags: [] },
      { nota: 5, texto: 'Segurança e identidade monitoradas continuamente, com evidências automatizadas para Anatel e ANPD.', tags: [] },
    ],
  },
  {
    id: 'conf_edu_mec',
    pilar: 'Conformidade',
    dama: 'Data Quality / Data Integration',
    setores: ['educacao'],
    enunciado: 'Os dados acadêmicos e financeiros enviados ao MEC/INEP (Censo da Educação Superior, e-MEC, Enade, FIES/ProUni) são consistentes entre os sistemas acadêmico, financeiro e de captação, e rastreáveis até a origem?',
    alternativas: [
      { nota: 1, texto: 'Cada sistema tem a sua versão do aluno; os envios exigem conciliação manual e há divergências recorrentes.', tags: ['mec', 'inep', 'fies'] },
      { nota: 2, texto: 'Existe um processo de consolidação, mas depende de planilhas e de poucas pessoas.', tags: ['mec', 'inep'] },
      { nota: 3, texto: 'Cadastro único do aluno, validações antes do envio e trilha das versões enviadas.', tags: [] },
      { nota: 5, texto: 'Dados acadêmicos governados como produto, com linhagem, reconciliação automática e indicadores regulatórios em painel.', tags: [] },
    ],
  },
  {
    id: 'conf_edu_menores',
    pilar: 'Conformidade',
    dama: 'Data Governance / Security',
    setores: ['educacao'],
    enunciado: 'Como a instituição trata dados de crianças e adolescentes nas plataformas digitais (ECA Digital em vigor desde março de 2026: verificação de idade, consentimento dos responsáveis, uso de IA em tutoria e provas)?',
    alternativas: [
      { nota: 1, texto: 'Não diferenciamos dados de menores; consentimento e verificação de idade não são controlados.', tags: ['eca', 'lgpd', 'anpd', 'ia'] },
      { nota: 2, texto: 'Consentimento dos responsáveis coletado na matrícula, mas sem controle nas plataformas e nos fornecedores de EdTech.', tags: ['eca', 'lgpd', 'anpd'] },
      { nota: 3, texto: 'Dados de menores classificados, verificação de idade e consentimento gerenciados, fornecedores avaliados.', tags: [] },
      { nota: 5, texto: 'Privacidade por design para menores, avaliação de impacto dos sistemas de IA educacionais e auditoria contínua.', tags: [] },
    ],
  },
  {
    id: 'conf_edu_retencao',
    pilar: 'Conformidade',
    dama: 'Data Quality / Master Data',
    setores: ['educacao'],
    enunciado: 'Os dados de captação, matrícula, evasão e inadimplência têm qualidade suficiente para modelos de retenção e para os reportes a investidores e ao MEC?',
    alternativas: [
      { nota: 1, texto: 'Indicadores de evasão e inadimplência divergem entre áreas; não há definição única.', tags: ['mec', 'qualidade'] },
      { nota: 2, texto: 'Definições existem, mas os dados de origem (polos, franquias, plataformas) chegam com falhas.', tags: ['mec', 'qualidade'] },
      { nota: 3, texto: 'Glossário de negócio e regras de qualidade para os indicadores de aluno, com monitoração.', tags: [] },
      { nota: 5, texto: 'Indicadores certificados, modelos preditivos de evasão em produção e evidências para auditoria e investidores.', tags: [] },
    ],
  },
  {
    id: 'conf_ger_esg',
    pilar: 'Conformidade',
    dama: 'Data Governance / Quality',
    setores: ['varejo', 'outros'],
    enunciado: 'Como a empresa produz os dados de auditoria e de sustentabilidade exigidos por auditores, grandes clientes e, para companhias abertas, pela CVM (IFRS S1/S2 voluntário com "pratique ou explique" a partir de 2027, Resolução CVM 244/2026)?',
    alternativas: [
      { nota: 1, texto: 'Sob demanda, com esforço manual e pouca confiança nos números.', tags: ['esg', 'cvm244'] },
      { nota: 2, texto: 'Processo definido, mas dependente de planilhas e poucas pessoas.', tags: ['esg', 'cvm244'] },
      { nota: 3, texto: 'Dados governados, com responsáveis e validações antes da publicação.', tags: [] },
      { nota: 5, texto: 'Reportes automatizados, auditáveis e integrados à plataforma de dados.', tags: [] },
    ],
  },
  {
    id: 'conf_ger_tributaria',
    pilar: 'Conformidade',
    dama: 'Data Integration / Master Data',
    setores: ['varejo', 'outros', 'saude', 'telecom', 'educacao'],
    enunciado: 'A Reforma Tributária (CBS/IBS) entrou em fase de teste em 2026 e a CBS passa a valer integralmente em 2027. Os cadastros de produtos, clientes, fornecedores e as regras fiscais nos sistemas estão prontos para a transição?',
    alternativas: [
      { nota: 1, texto: 'Ainda não avaliamos o impacto nos cadastros e nos sistemas; dependemos do fornecedor do ERP.', tags: ['reforma_tributaria', 'fiscal'] },
      { nota: 2, texto: 'Impacto mapeado, mas os cadastros mestres têm inconsistências que atrasam a parametrização.', tags: ['reforma_tributaria', 'fiscal', 'qualidade'] },
      { nota: 3, texto: 'Cadastros saneados, regras fiscais parametrizadas e testes em ambiente de homologação.', tags: [] },
      { nota: 5, texto: 'Transição operando com dados mestres governados, simulações de carga tributária e monitoração das obrigações acessórias.', tags: [] },
    ],
  },
]

export const ROTULOS_DAS_TAGS: Readonly<Record<Tag, string>> = {
  governanca: 'Governança de dados',
  qualidade: 'Qualidade de dados',
  seguranca: 'Segurança de dados',
  lgpd: 'LGPD',
  anpd: 'ANPD',
  lgpd_saude: 'LGPD (dados de saúde)',
  ia: 'Marco Legal da IA',
  rc18: 'Resolução Conjunta CMN/BCB 18/2025',
  bcb: 'Banco Central',
  cmn5274: 'Resolução CMN 5.274/2025',
  bcbs239: 'BCBS 239',
  openfinance: 'Open Finance',
  ifrs9: 'IFRS 9',
  ifrs17: 'IFRS 17',
  cvm: 'CVM',
  cvm244: 'Resolução CVM 244/2026',
  anbima: 'ANBIMA',
  pld: 'PLD/FT',
  susep: 'SUSEP',
  sro: 'SRO (SUSEP)',
  openinsurance: 'Open Insurance',
  anvisa: 'Anvisa',
  cfm: 'CFM',
  ans: 'ANS',
  tiss: 'ANS RN 639/2025 (TISS)',
  rnds: 'RNDS',
  anatel: 'Anatel',
  rgc: 'RGC (Anatel)',
  eca: 'ECA Digital (Lei 15.211/2025)',
  marco_civil: 'Marco Civil da Internet',
  mec: 'MEC',
  inep: 'INEP',
  fies: 'FIES / ProUni',
  esg: 'ESG / IFRS S1-S2',
  fiscal: 'Fiscal / auditoria',
  reforma_tributaria: 'Reforma Tributária',
}

/** Tags que contam em qualquer setor. */
export const TAGS_UNIVERSAIS: readonly Tag[] = [
  'lgpd',
  'anpd',
  'ia',
  'esg',
  'fiscal',
  'reforma_tributaria',
  'governanca',
  'qualidade',
  'seguranca',
]

/** Reguladores relevantes por setor: pergunta transversal só mostra (e só soma gap para) estes e os universais. */
export const TAGS_DO_SETOR: Readonly<Record<Setor, readonly Tag[]>> = {
  financeiro: ['rc18', 'bcb', 'cmn5274', 'bcbs239', 'openfinance', 'ifrs9', 'pld'],
  capitais: ['cvm', 'cvm244', 'anbima', 'pld'],
  seguros: ['susep', 'sro', 'openinsurance', 'ifrs17'],
  saude: ['anvisa', 'cfm', 'ans', 'tiss', 'rnds', 'lgpd_saude'],
  telecom: ['anatel', 'rgc', 'eca', 'marco_civil'],
  educacao: ['mec', 'inep', 'fies', 'eca'],
  varejo: ['cvm244'],
  outros: ['cvm244'],
}

/** Temas internos: pontuam gap, mas não viram etiqueta "Impacta:" na pergunta. */
export const TAGS_INTERNAS: readonly Tag[] = ['governanca', 'qualidade', 'seguranca']

/** Primeiras etiquetas de "Impactos avaliados" na tela de perfil, em qualquer setor. */
export const TAGS_UNIVERSAIS_DO_PERFIL: readonly Tag[] = ['lgpd', 'anpd', 'ia']

export const NIVEIS: Readonly<Record<NivelNumerico, Nivel>> = {
  1: {
    nome: 'Inicial',
    descricao: 'Os dados dependem de pessoas, planilhas e esforço heroico. Decisões são tomadas com números que ninguém consegue reproduzir.',
  },
  2: {
    nome: 'Repetível',
    descricao: 'Há ilhas de organização, mas sem patrocínio, papéis ou padrão comuns. O risco regulatório está concentrado em poucas pessoas.',
  },
  3: {
    nome: 'Definido',
    descricao: 'Políticas, responsáveis e catálogo cobrem os dados críticos. O próximo salto é medir e automatizar.',
  },
  4: {
    nome: 'Gerenciado',
    descricao: 'Qualidade medida, acessos revisados e evidências prontas. Falta escalar para toda a organização e para a IA.',
  },
  5: {
    nome: 'Otimizado',
    descricao: 'Dados tratados como produto, com monitoração contínua. O foco passa a ser valor: IA, novos produtos e eficiência.',
  },
}

/** Oferta da ATRA por pilar e faixa de maturidade. */
export const OFERTAS: Readonly<Record<NomeDoPilar, Readonly<Record<Faixa, Oferta>>>> = {
  Governança: {
    low: {
      titulo: 'Estrutura de governança de dados',
      descricao: 'Diagnóstico executivo, definição de data owners e stewards, comitê de dados, política e glossário de negócio para os domínios críticos.',
    },
    mid: {
      titulo: 'Catálogo e linhagem',
      descricao: 'Implantação de catálogo de dados com linhagem dos indicadores e reportes críticos, integrado ao dicionário de dados exigido pelos reguladores.',
    },
    high: {
      titulo: 'Dados como produto',
      descricao: 'Produtos de dados por domínio, contratos de dados e governança federada com self-service monitorado.',
    },
  },
  Qualidade: {
    low: {
      titulo: 'Fonte única e regras de qualidade',
      descricao: 'Plataforma de dados com fonte única para os indicadores principais, regras de completude, consistência e atualidade nos dados críticos.',
    },
    mid: {
      titulo: 'MDM e monitoração',
      descricao: 'Gestão de dados mestres (cliente, produto, fornecedor) com golden record e scorecards de qualidade por domínio.',
    },
    high: {
      titulo: 'Observabilidade de dados',
      descricao: 'Alertas, SLAs e detecção de anomalias nos pipelines, com qualidade medida na origem.',
    },
  },
  Segurança: {
    low: {
      titulo: 'Acesso e resposta a incidentes',
      descricao: 'Classificação de dados, controle de acesso por papéis, revisão periódica e plano de resposta a incidentes com comunicação à ANPD.',
    },
    mid: {
      titulo: 'Proteção por finalidade',
      descricao: 'Mascaramento dinâmico, trilha de auditoria centralizada e gestão de risco de terceiros e nuvem.',
    },
    high: {
      titulo: 'Segurança contínua',
      descricao: 'Detecção e resposta automatizadas, revisão de acessos automatizada e métricas reportadas ao Conselho.',
    },
  },
  Conformidade: {
    low: {
      titulo: 'Mapa regulatório e evidências',
      descricao: 'Inventário de dados pessoais e regulatórios, RIPD, responsáveis por norma e trilha de evidências para o regulador do setor.',
    },
    mid: {
      titulo: 'Automação dos reportes',
      descricao: 'Pipelines governados para os reportes regulatórios, validações antes do envio e reconciliação com a contabilidade.',
    },
    high: {
      titulo: 'Conformidade contínua',
      descricao: 'Controles automatizados, painéis para auditoria e governança de IA integrada à de dados.',
    },
  },
}

/** Ação recomendada por regulação (prazo e frente de trabalho). */
export const ACOES_POR_REGULACAO: Readonly<Partial<Record<Tag, string>>> = {
  rc18: 'Programa RC 18/2025 até 31/12/2026: política de qualidade das informações, diretor responsável, dicionário de dados, testes antes do envio e relatório semestral.',
  cmn5274: 'Adequação à CMN 5.274/2025: controles de cibersegurança em terceiros e nuvem, teste de intrusão anual independente e evidências de correção.',
  bcb: 'Rastreabilidade ponta a ponta das informações enviadas ao Banco Central, com linhagem e reconciliação.',
  openfinance: 'Monitoração de disponibilidade e qualidade das APIs e dos consentimentos do Open Finance; uso governado dos dados recebidos.',
  ifrs9: 'Linhagem e reconciliação diária entre risco e contabilidade para os modelos de perda esperada (IFRS 9 / CMN 4.966).',
  ifrs17: 'Integração das bases atuarial e contábil para o IFRS 17 / CPC 50 e para os reportes prudenciais à SUSEP, com fechamento automatizado e evidências para auditoria.',
  lgpd: 'Inventário de dados pessoais (ROPA), RIPD, DPO ativo, retenção e descarte, e fluxo de atendimento ao titular com prazo monitorado.',
  anpd: 'Playbook de comunicação de incidentes à ANPD e evidências para os temas prioritários de fiscalização 2026-2027.',
  ia: 'Inventário de sistemas de IA com classificação de risco e governança dos dados de treinamento, antecipando o Marco Legal da IA (PL 2338/2023, votação prevista para o fim de 2026) e a fiscalização da ANPD.',
  bcbs239: 'Agregação de dados de risco com linhagem, reconciliação e controles, nos princípios do BCBS 239 que a RC 18 traz para o Brasil.',
  cfm: 'Prontuário eletrônico com integridade, trilha de auditoria e guarda conforme as normas do CFM e a Lei 13.787/2018.',
  marco_civil: 'Guarda de registros de conexão e de acesso nos prazos do Marco Civil da Internet, com acesso controlado e auditável.',
  cvm: 'Bases governadas e validações antes dos envios à CVM e à ANBIMA, com trilha das versões enviadas.',
  cvm244: 'Decisão documentada sobre o IFRS S1/S2 e dados de sustentabilidade governados para reportar ou justificar a partir de 2027.',
  pld: 'Cadastro único do investidor com regras de atualização e alertas para compliance (suitability, KYC, PLD/FT).',
  susep: 'Inventário de fornecedores de nuvem e processamento, contratos acessíveis à SUSEP e plano de incidentes testado.',
  sro: 'Validações antes do envio ao SRO, indicadores de rejeição e reconciliação com a registradora.',
  openinsurance: 'Consentimentos rastreáveis e dados do Open Insurance integrados ao negócio.',
  anvisa: 'Dados clínicos governados com trilha de auditoria, classificação de dados sensíveis e controles de acesso.',
  ans: 'Padronização dos dados assistenciais na origem e validações antes do envio ao Monitoramento TISS.',
  tiss: 'Adequação à RN ANS 639/2025: dados assistenciais no padrão TISS com qualidade medida por indicador.',
  rnds: 'Interoperabilidade HL7 FHIR com a RNDS, começando pelos registros de maior volume.',
  anatel: 'Bases governadas para os indicadores e reportes da Anatel, com validação antes do envio.',
  rgc: 'Evidências de transparência e proteção de dados exigidas pelo RGC, geradas de forma automatizada.',
  eca: 'Classificação de dados de menores, verificação de idade e consentimento dos responsáveis nas plataformas digitais (ECA Digital, Lei 15.211/2025, em vigor desde 17/3/2026).',
  mec: 'Cadastro único do aluno e reconciliação entre acadêmico, financeiro e captação antes dos envios ao MEC/INEP.',
  inep: 'Trilha das versões enviadas ao Censo e ao Enade, com validação prévia.',
  fies: 'Consistência dos dados de FIES/ProUni entre sistemas e evidências para auditoria.',
  esg: 'Indicadores de sustentabilidade com responsáveis, validação e integração à plataforma de dados.',
  fiscal: 'Dados fiscais e de auditoria governados, auditáveis e integrados.',
  reforma_tributaria: 'Saneamento dos cadastros mestres e parametrização das regras fiscais (CBS/IBS) com testes em homologação antes de 2027.',
  lgpd_saude: 'Privacidade por design para dados sensíveis de saúde, com auditoria contínua.',
}

/** Consequência prática de cada pilar fraco — bloco "O que está em jogo". */
export const O_QUE_ESTA_EM_JOGO: Readonly<Record<NomeDoPilar, string>> = {
  Governança: 'Sem donos, definições comuns e uma fonte única, cada área produz a sua versão do número. Decisões e reportes regulatórios ficam expostos a contestação, e cada resposta nova à diretoria vira um projeto.',
  Qualidade: 'Dados inconsistentes viram retrabalho no fechamento, reportes devolvidos pelo regulador e modelos de IA que não podem ir para produção. O custo aparece em horas de conciliação e em decisões adiadas.',
  Segurança: 'Acessos amplos e resposta improvisada a incidentes elevam a chance de vazamento. A LGPD prevê sanções de até 2% do faturamento, limitadas a R$ 50 milhões por infração, além do dano de reputação.',
  Conformidade: 'Evidências montadas à mão a cada demanda consomem o time e não escalam. Prazos como o da RC 18 (31/12/2026) e as prioridades de fiscalização da ANPD para 2026-2027 aumentam a pressão sobre quem ainda não tem dicionário, linhagem e trilha de auditoria.',
}

/** Domínios de e-mail pessoal recusados no contato (lista do Roger). */
export const DOMINIOS_DE_EMAIL_BLOQUEADOS: readonly string[] = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'yahoo.com.br',
  'icloud.com',
  'live.com',
  'bol.com.br',
  'uol.com.br',
  'terra.com.br',
  'msn.com',
  'aol.com',
  'protonmail.com',
]
