/* O Diagnóstico de Maturidade em espanhol (D-77, 28/10).
 *
 * Mesmo desenho do inglês (`ingles.ts`, D-76): a base do Roger (`dados.ts`)
 * segue a única fonte da conta, e aqui mora só o texto, chaveado pelos mesmos
 * códigos — pergunta pelo `id`, alternativa pela **posição**. `espanhol.test.ts`
 * reprova se a base ganhar pergunta, alternativa, setor ou tag sem tradução.
 *
 * Espanhol neutro da América Latina, tratando o leitor por "usted", como o
 * resto do `/es` (`lib/traducao.ts`). Traduzido do português, com o inglês
 * revisado ao lado para conferir termo técnico, e **revisado à mão** antes de
 * ir ao ar (Roger e Taciane): um termo errado muda a pergunta.
 *
 * As normas brasileiras ficam com o nome delas (RC 18, CVM, SUSEP, LGPD…), com
 * o órgão explicado onde o leitor estrangeiro não o conheceria. Valores em
 * reais continuam em reais: a faixa é a mesma que vai ao comercial.
 *
 * ⚠️ O que vai ao CRM e ao aviso da ATRA continua em **português**, como no
 * inglês: as automações do RD leem esses textos. */

import type { Cargo, Faixa, NivelNumerico, NomeDoPilar, Oferta, PerguntaId, Porte, Setor, Tag } from './dados'

export const SETORES_ES: Readonly<Record<Setor, string>> = {
  financeiro: 'Servicios Financieros · Bancos, Fintechs, Pagos',
  capitais: 'Mercado de Capitales · Gestoras, Corredoras',
  seguros: 'Seguros y Previsión',
  saude: 'Salud · Ciencias de la Vida · Planes de Salud',
  telecom: 'Telecomunicaciones',
  educacao: 'Educación · Grupos Educativos, EdTechs',
  varejo: 'Comercio, Industria y Servicios',
  outros: 'Otro',
}

export const PORTES_ES: Readonly<Record<Porte, string>> = {
  ate_50mi: 'Hasta R$ 50 millones',
  '50_300mi': 'R$ 50 – 300 millones',
  '300mi_1bi': 'R$ 300 millones – 1.000 millones',
  '1_5bi': 'R$ 1.000 – 5.000 millones',
  acima_5bi: 'Más de R$ 5.000 millones',
}

export const CARGOS_ES: Readonly<Record<Cargo, string>> = {
  ceo_presidente: 'CEO / Presidente / Socio',
  cfo_cro: 'CFO / CRO / Director de Finanzas o Riesgos',
  cio_cto_cdo: 'CIO / CTO / CDO',
  diretor_gerente: 'Director / Gerente de Área',
  coordenador_analista: 'Coordinador / Especialista / Analista',
  outro: 'Otro',
}

export const PILARES_ES: Readonly<Record<NomeDoPilar, string>> = {
  Governança: 'Gobierno',
  Qualidade: 'Calidad',
  Segurança: 'Seguridad',
  Conformidade: 'Cumplimiento',
}

interface PerguntaEmEspanhol {
  enunciado: string
  /** Na ordem das alternativas da base: nota 1, 2, 3, 5. */
  alternativas: readonly [string, string, string, string]
}

export const PERGUNTAS_ES: Readonly<Record<PerguntaId, PerguntaEmEspanhol>> = {
  gov_estrategia: {
    enunciado: '¿Cómo se conecta la estrategia de datos con la estrategia del negocio?',
    alternativas: [
      'No hay una estrategia de datos formal; las iniciativas surgen según la demanda.',
      'Hay iniciativas en áreas aisladas, sin un patrocinio ejecutivo claro.',
      'Hay una estrategia documentada, con un patrocinador ejecutivo y metas anuales.',
      'Los datos son un pilar de la planificación estratégica, con KPI seguidos por la dirección ejecutiva.',
    ],
  },
  gov_papeis: {
    enunciado: '¿Quién responde por los datos críticos de la empresa (data owners y data stewards)?',
    alternativas: [
      'Nadie formalmente; se llama a TI cuando algo sale mal.',
      'Algunos responsables informales en áreas puntuales.',
      'Roles definidos para los dominios principales, con un comité de datos activo.',
      'Owners y stewards designados en todos los dominios, con metas y rituales de gobierno.',
    ],
  },
  gov_catalogo: {
    enunciado: '¿Cómo se entera la gente de qué datos existen, qué significan y de dónde vienen?',
    alternativas: [
      'Preguntando a quien conoce el sistema; no hay documentación centralizada.',
      'Planillas o wikis mantenidas a mano y con frecuencia desactualizadas.',
      'Catálogo de datos implementado para los dominios principales, con glosario de negocio.',
      'Catálogo con linaje automatizado de punta a punta, clasificación y uso monitoreado.',
    ],
  },
  gov_arquitetura: {
    enunciado: '¿Cómo llegan los datos a las áreas que toman decisiones?',
    alternativas: [
      'Extracciones manuales y planillas; cada área arma su propia versión del número.',
      'Algunos reportes centralizados, pero con varias fuentes que compiten entre sí.',
      'Plataforma de datos (data warehouse / lakehouse) con una fuente única para los indicadores principales.',
      'Plataforma moderna en la nube, con productos de datos por dominio, autoservicio y monitoreo.',
    ],
  },
  gov_decisao: {
    enunciado:
      'Cuando la dirección ejecutiva necesita una respuesta nueva de los datos (un indicador que aún no existe, un análisis entre áreas), ¿cuánto tiempo toma?',
    alternativas: [
      'Semanas: depende de un pedido a TI, de extracciones y de planillas armadas a mano.',
      'Días: los analistas pueden hacerlo, pero cada respuesta es un proyecto.',
      'Horas: los indicadores principales son de autoservicio y el resto es un pedido puntual.',
      'Minutos: las áreas de negocio exploran por su cuenta los datos gobernados, con IA y analítica avanzada.',
    ],
  },
  qual_confianca: {
    enunciado: '¿Con qué frecuencia la dirección ejecutiva cuestiona la confiabilidad de un número que se le presenta?',
    alternativas: [
      'Con frecuencia; conciliar números entre áreas ocupa parte de las reuniones.',
      'A veces; hay diferencias conocidas que todavía no se han resuelto.',
      'Rara vez; los indicadores principales tienen reglas de calidad definidas.',
      'Prácticamente nunca; la calidad se mide, se publica y se mejora de forma continua.',
    ],
  },
  qual_regras: {
    enunciado: '¿Existen reglas y monitoreo de calidad (completitud, consistencia, oportunidad) sobre los datos críticos?',
    alternativas: [
      'No; los problemas los descubre el usuario final o el cliente.',
      'Validaciones puntuales en algunos procesos, sin monitoreo continuo.',
      'Reglas definidas y monitoreadas para los datos críticos, con tratamiento de incidentes.',
      'Observabilidad de datos con alertas, SLA y tableros de calidad por dominio.',
    ],
  },
  qual_mdm: {
    enunciado: '¿En qué estado están los registros maestros (clientes, productos, proveedores)?',
    alternativas: [
      'Duplicados e inconsistentes entre sistemas; no hay una visión única.',
      'Depuración de duplicados puntual, hecha a mano en campañas.',
      'Proceso de gestión de datos maestros (MDM) para los registros principales.',
      'MDM multidominio con golden record, reglas de supervivencia y stewardship activo.',
    ],
  },
  seg_acesso: {
    enunciado: '¿Cómo se otorga y se revisa el acceso a los datos sensibles?',
    alternativas: [
      'Acceso amplio por conveniencia; no se hacen revisiones.',
      'Perfiles por sistema, con revisión ocasional.',
      'Control de acceso por rol (RBAC), clasificación de datos y revisión periódica de accesos.',
      'Acceso por atributo y finalidad, enmascaramiento dinámico, registro de auditoría y revisión automatizada.',
    ],
  },
  seg_incidente: {
    enunciado: 'Si hoy ocurriera una filtración de datos, ¿cuánto tardaría la empresa en enterarse y responder?',
    alternativas: [
      'No tendríamos cómo saberlo; dependeríamos de que alguien nos avisara.',
      'Hay un monitoreo básico, pero no un plan de respuesta probado.',
      'Plan de respuesta a incidentes definido, que incluye la notificación a la ANPD (la autoridad brasileña de protección de datos) y a los titulares.',
      'Detección continua, respuesta ensayada (tabletop) y métricas de tiempo de detección y de respuesta.',
    ],
  },
  conf_lgpd_mapa: {
    enunciado:
      '¿Sabe la empresa dónde están los datos personales que trata, con qué base legal y por cuánto tiempo, y evalúa el riesgo de los tratamientos más sensibles?',
    alternativas: [
      'No hay inventario de datos personales, ni evaluación de impacto (RIPD) ni encargado de protección de datos (DPO) designado.',
      'Inventario parcial hecho una vez; existen políticas, pero sin seguimiento ni evaluación de impacto.',
      'Registro de las operaciones de tratamiento (ROPA) actualizado, DPO activo, evaluación de impacto para los tratamientos de alto riesgo, retención y eliminación aplicadas.',
      'Privacidad desde el diseño: clasificación automatizada, consentimiento gestionado, evaluación de impacto revisada y auditoría continua.',
    ],
  },
  conf_lgpd_titular: {
    enunciado:
      '¿Cómo atiende la empresa las solicitudes de los titulares (acceso, corrección, eliminación), y cómo reaccionaría ante un incidente que deba informarse a la ANPD?',
    alternativas: [
      'Caso por caso, sin proceso, sin control de plazos y sin plan de comunicación de incidentes (la ANPD exige la notificación dentro de un plazo definido).',
      'Proceso manual, con dificultad para ubicar los datos en todos los sistemas; incidentes tratados de forma improvisada.',
      'Flujo definido para titulares y para incidentes, con plazos monitoreados y acciones trazables.',
      'Portal del titular integrado a los sistemas, ejecución automatizada, playbook de incidentes probado y evidencias.',
    ],
  },
  conf_ia: {
    enunciado:
      '¿Sabe la empresa qué sistemas de IA usan sus datos, con qué nivel de riesgo, y de dónde vienen y qué calidad tienen los datos que los alimentan?',
    alternativas: [
      'No sabemos qué sistemas de IA usan datos de la empresa; las iniciativas empiezan sin evaluación.',
      'Tenemos una lista informal de iniciativas de IA, sin clasificación de riesgo ni control de los datos usados.',
      'Inventario de sistemas de IA con clasificación de riesgo, evaluación de impacto y reglas para los datos personales.',
      'Gobierno de IA integrado al gobierno de datos: linaje de los datos de entrenamiento, monitoreo de sesgo, explicabilidad y registro de auditoría.',
    ],
  },
  conf_fin_rc18: {
    enunciado:
      '¿En qué punto está la institución frente a la Resolución Conjunta CMN/BCB n.º 18/2025 (Política de Calidad de la Información, director estatutario responsable, diccionario de datos, informe semestral)? El plazo de adecuación vence el 31/12/2026.',
    alternativas: [
      'Todavía no mapeamos el impacto; no hay política, ni director designado, ni diccionario de datos.',
      'Política en elaboración y director designado, pero el diccionario de datos y el informe semestral todavía no existen.',
      'Política aprobada por el Directorio, diccionario de datos para los reportes críticos y primer informe semestral elaborado.',
      'Programa completo en marcha: política, diccionario integrado al catálogo, pruebas previas al envío, e indicadores e informe semestral automatizados.',
    ],
  },
  conf_fin_rc18_dim: {
    enunciado:
      'Para cada información enviada al Banco Central de Brasil, ¿puede la institución comprobar las 12 dimensiones de calidad de la RC 18 (trazabilidad desde el origen hasta el envío, exactitud, completitud, consistencia y oportunidad), en línea con BCBS 239?',
    alternativas: [
      'No; los reportes se arman a mano y no logramos reconstruir de dónde vino un número.',
      'Rastreamos algunos reportes con esfuerzo manual; los errores aparecen después del envío o cuando el Banco Central pregunta.',
      'Linaje documentado para los reportes críticos, validaciones previas al envío y tratamiento de irregularidades con plan de acción.',
      'Linaje automatizado de punta a punta, reglas de calidad por dimensión monitoreadas de forma continua y evidencias listas para el supervisor.',
    ],
  },
  conf_fin_ciber: {
    enunciado:
      '¿Ya se adecuó la institución a la Resolución CMN 5.274/2025 (que actualiza la Resolución de ciberseguridad 4.893/2021, con plazo el 1/3/2026): controles extendidos a terceros y a la nube, prueba de intrusión independiente anual y evidencias de corrección?',
    alternativas: [
      'No conocemos los cambios; los controles sobre proveedores y nube no se verifican.',
      'Existe una política de ciberseguridad, pero sin cláusulas ni evidencias de los terceros críticos y sin pentest independiente.',
      'Contratos con proveedores críticos revisados, pentest independiente anual y planes de acción documentados.',
      'Gestión continua del riesgo de terceros, monitoreo integrado, pruebas recurrentes e informes al Directorio.',
    ],
  },
  conf_fin_of: {
    enunciado:
      'En Open Finance, ¿hace la institución seguimiento de la disponibilidad y la calidad de los datos que comparte y recibe, y de la trazabilidad de los consentimientos de los clientes?',
    alternativas: [
      'Hacemos lo mínimo; no seguimos la disponibilidad de las API ni los indicadores de calidad.',
      'Seguimos los indicadores obligatorios, pero las fallas de datos y de consentimiento se tratan de forma reactiva.',
      'Monitoreo de las API y de los consentimientos con alertas, y uso gobernado de los datos recibidos.',
      'Open Finance como producto de datos: calidad medida, consentimientos auditables y datos recibidos integrados al crédito y a la relación con el cliente.',
    ],
  },
  conf_fin_ifrs9: {
    enunciado:
      '¿Son trazables y conciliables con la contabilidad los datos que alimentan los modelos de pérdida esperada (IFRS 9 / Resolución CMN 4.966)?',
    alternativas: [
      'Los cálculos dependen de planillas y de ajustes manuales difíciles de reproducir.',
      'Hay un proceso, pero conciliar riesgos y contabilidad requiere mucho trabajo.',
      'Pipelines documentados, con linaje y conciliación periódica.',
      'Linaje automatizado, conciliación diaria y rastro completo para auditores y para el regulador.',
    ],
  },
  conf_cap_cvm: {
    enunciado:
      '¿Cómo asegura la gestora o corredora la calidad y la trazabilidad de la información enviada a la CVM (el regulador brasileño de valores) y a ANBIMA (Resolución CVM 175, informes periódicos, suitability)?',
    alternativas: [
      'Consolidación manual en planillas, con retrabajo y riesgo de error en los envíos.',
      'Proceso semiautomatizado, pero sin controles de calidad antes del envío.',
      'Bases gobernadas, validaciones previas al envío y rastro de las versiones enviadas.',
      'Generación automatizada con validación, linaje y conciliación con administradores y custodios.',
    ],
  },
  conf_cap_suit: {
    enunciado:
      '¿Están completos, actualizados y disponibles para el área de cumplimiento los datos del perfil del inversionista (suitability, KYC, PLD/FT)?',
    alternativas: [
      'Están dispersos en sistemas y formularios, con registros desactualizados.',
      'Centralizados, pero con actualización y monitoreo manuales.',
      'Registro único con reglas de actualización y alertas para cumplimiento.',
      'Monitoreo continuo con modelos de riesgo y evidencias automatizadas para la auditoría.',
    ],
  },
  conf_cap_esg: {
    enunciado:
      'Con la Resolución CVM 244/2026, el reporte IFRS S1/S2 pasó a ser voluntario, con el deber de "cumplir o explicar" a partir de 2027. ¿Tiene la empresa (o tienen las empresas que cubre) datos de sostenibilidad gobernados para reportar o para justificar?',
    alternativas: [
      'No hay una recopilación estructurada de datos de sostenibilidad; la decisión de reportar no se ha discutido.',
      'Datos recopilados en planillas para informes puntuales, sin control de calidad.',
      'Decisión tomada, indicadores definidos con responsables y validados antes de la publicación.',
      'Datos de sostenibilidad integrados a la plataforma de datos, auditables y conectados a las decisiones de inversión.',
    ],
  },
  conf_seg_ifrs17: {
    enunciado:
      '¿Están integrados y son conciliables los datos de contratos, siniestros y reservas que alimentan IFRS 17 / CPC 50 (empresas cotizadas) y los informes prudenciales a la SUSEP (el regulador brasileño de seguros)?',
    alternativas: [
      'Cada sistema tiene su propia base; la consolidación es manual y lenta.',
      'Hay una integración parcial, con ajustes manuales en el cierre.',
      'Bases actuariales y contables integradas, con linaje y conciliación periódica.',
      'Cierre automatizado, conciliación continua y evidencias listas para la auditoría.',
    ],
  },
  conf_seg_sro: {
    enunciado:
      '¿Cómo asegura la aseguradora la calidad y la oportunidad en el Sistema de Registro de Operaciones (SRO) y en Open Insurance (intercambio de datos y consentimientos)?',
    alternativas: [
      'Registros enviados fuera de plazo con rechazos recurrentes; no medimos la calidad.',
      'Envío automatizado, pero los rechazos se tratan a mano y sin causa raíz.',
      'Validaciones previas al envío, indicadores de rechazo y consentimientos de Open Insurance trazables.',
      'Calidad monitoreada en el origen, conciliación automática con la registradora y datos de Open Insurance usados en el negocio.',
    ],
  },
  conf_seg_ciber: {
    enunciado:
      '¿Cumple la aseguradora con la Circular SUSEP 638/2021 y sus actualizaciones de 2026 (contratos de nube y de procesamiento de datos accesibles a la SUSEP, gestión de incidentes, manual de ciberseguridad)?',
    alternativas: [
      'No tenemos inventario de los servicios de nube y de procesamiento contratados ni plan de respuesta a incidentes.',
      'Existe una política, pero los contratos y evidencias de los proveedores no están organizados para la SUSEP.',
      'Inventario de proveedores críticos, contratos accesibles, plan de incidentes definido y probado.',
      'Gestión continua del riesgo cibernético y de terceros, con métricas informadas al Directorio.',
    ],
  },
  conf_sau_anvisa: {
    enunciado:
      '¿Cómo asegura la organización la integridad, la trazabilidad y la protección de los datos clínicos (historia clínica electrónica, datos sensibles de salud) que exigen Anvisa, el CFM (Consejo Federal de Medicina) y la LGPD? Los datos de salud son un foco de la ANPD en 2026-2027.',
    alternativas: [
      'Registros en sistemas separados, sin un registro de auditoría confiable ni clasificación de los datos sensibles.',
      'Registro de auditoría en algunos sistemas; integración hecha a mano.',
      'Datos clínicos gobernados, con registro de auditoría, clasificación de los datos sensibles y controles de acceso.',
      'Plataforma integrada con auditoría continua, privacidad desde el diseño y evidencias automatizadas.',
    ],
  },
  conf_sau_tiss: {
    enunciado:
      'Con la Resolución Normativa ANS 639/2025 (fin del SIP y centralización en el Monitoreo TISS desde marzo de 2026) y la interoperabilidad con la RNDS en HL7 FHIR (Decreto 12.560/2025), ¿en qué estado están los datos asistenciales y de facturación?',
    alternativas: [
      'Cuentas y registros con muchas glosas y rechazos; no hay un estándar ni integración con la RNDS.',
      'TISS atendido con retrabajo manual; la interoperabilidad FHIR todavía no empezó.',
      'Datos asistenciales estandarizados en el origen, validaciones previas al envío e integración con la RNDS en curso.',
      'Interoperabilidad FHIR en funcionamiento, calidad monitoreada por indicador y datos usados en la gestión clínica y financiera.',
    ],
  },
  conf_tel_anatel: {
    enunciado:
      '¿Cómo produce la operadora los indicadores e informes que exige Anatel (el regulador brasileño de telecomunicaciones) y las evidencias de transparencia y protección de datos del nuevo Reglamento General de Derechos del Consumidor (RGC, vigente desde septiembre de 2025)?',
    alternativas: [
      'Consolidación manual desde varios sistemas, con retrabajo recurrente.',
      'Rutinas parcialmente automatizadas, sin validación de calidad antes del envío.',
      'Bases gobernadas con validaciones y rastro de los informes enviados.',
      'Generación automatizada, monitoreo de calidad y tableros de cumplimiento en tiempo real.',
    ],
  },
  conf_tel_ciber: {
    enunciado:
      '¿Cumple la operadora con el Reglamento de Ciberseguridad de Anatel y con las exigencias recientes: notificación de incidentes, prevención de fraude y suplantación, retención de registros del Marco Civil y verificación de edad del ECA Digital (vigente desde marzo de 2026)?',
    alternativas: [
      'No hay un proceso formal de incidentes ni controles de identidad o de edad en los canales digitales.',
      'Existe un proceso de incidentes, pero la verificación de edad y el antifraude son puntuales.',
      'Incidentes notificados a tiempo, antifraude integrado y mecanismos de verificación de edad definidos.',
      'Seguridad e identidad monitoreadas de forma continua, con evidencias automatizadas para Anatel y la ANPD.',
    ],
  },
  conf_edu_mec: {
    enunciado:
      '¿Son consistentes entre los sistemas académico, financiero y de inscripción, y trazables hasta el origen, los datos académicos y financieros enviados al MEC/INEP (Censo de la Educación Superior, e-MEC, Enade, FIES/ProUni)?',
    alternativas: [
      'Cada sistema tiene su propia versión del alumno; los envíos exigen conciliación manual y las diferencias se repiten.',
      'Hay un proceso de consolidación, pero depende de planillas y de pocas personas.',
      'Registro único del alumno, validaciones previas al envío y rastro de las versiones enviadas.',
      'Datos académicos gobernados como producto, con linaje, conciliación automática e indicadores regulatorios en un tablero.',
    ],
  },
  conf_edu_menores: {
    enunciado:
      '¿Cómo trata la institución los datos de niños y adolescentes en las plataformas digitales (ECA Digital, vigente desde marzo de 2026: verificación de edad, consentimiento de los padres, uso de IA en tutorías y evaluaciones)?',
    alternativas: [
      'No distinguimos los datos de menores; el consentimiento y la verificación de edad no se controlan.',
      'Consentimiento de los padres recogido en la inscripción, pero sin control en las plataformas ni en los proveedores EdTech.',
      'Datos de menores clasificados, verificación de edad y consentimiento gestionados, proveedores evaluados.',
      'Privacidad desde el diseño para menores, evaluación de impacto de los sistemas de IA educativos y auditoría continua.',
    ],
  },
  conf_edu_retencao: {
    enunciado:
      '¿Son lo bastante buenos los datos de captación, matrícula, deserción y morosidad para los modelos de retención y para los informes a inversionistas y al MEC?',
    alternativas: [
      'Los indicadores de deserción y morosidad difieren entre áreas; no hay una definición única.',
      'Hay definiciones, pero los datos de origen (sedes, franquicias, plataformas) llegan con errores.',
      'Glosario de negocio y reglas de calidad para los indicadores de alumnos, con monitoreo.',
      'Indicadores certificados, modelos predictivos de deserción en producción y evidencias para auditores e inversionistas.',
    ],
  },
  conf_ger_esg: {
    enunciado:
      '¿Cómo produce la empresa los datos de auditoría y sostenibilidad que exigen los auditores, los grandes clientes y, en las empresas cotizadas, la CVM (IFRS S1/S2 voluntario con "cumplir o explicar" a partir de 2027, Resolución CVM 244/2026)?',
    alternativas: [
      'A pedido, con esfuerzo manual y poca confianza en los números.',
      'Proceso definido, pero dependiente de planillas y de pocas personas.',
      'Datos gobernados, con responsables y validación antes de la publicación.',
      'Informes automatizados, auditables e integrados a la plataforma de datos.',
    ],
  },
  conf_ger_tributaria: {
    enunciado:
      'La Reforma Tributaria de Brasil (CBS/IBS) entró en fase de prueba en 2026, y la CBS rige plenamente en 2027. ¿Están listos para la transición los registros de productos, clientes y proveedores y las reglas fiscales en los sistemas?',
    alternativas: [
      'Todavía no evaluamos el impacto en los registros y sistemas; dependemos del proveedor del ERP.',
      'Impacto mapeado, pero los registros maestros tienen inconsistencias que retrasan la parametrización.',
      'Registros depurados, reglas fiscales parametrizadas y pruebas en un ambiente de homologación.',
      'Transición en marcha con datos maestros gobernados, simulaciones de carga tributaria y monitoreo de las obligaciones accesorias.',
    ],
  },
}

export const ROTULOS_DAS_TAGS_ES: Readonly<Record<Tag, string>> = {
  governanca: 'Gobierno de datos',
  qualidade: 'Calidad de datos',
  seguranca: 'Seguridad de datos',
  lgpd: 'LGPD',
  anpd: 'ANPD',
  lgpd_saude: 'LGPD (datos de salud)',
  ia: 'Marco Legal de la IA',
  rc18: 'Resolución Conjunta CMN/BCB 18/2025',
  bcb: 'Banco Central de Brasil',
  cmn5274: 'Resolución CMN 5.274/2025',
  bcbs239: 'BCBS 239',
  openfinance: 'Open Finance',
  ifrs9: 'IFRS 9',
  ifrs17: 'IFRS 17',
  cvm: 'CVM',
  cvm244: 'Resolución CVM 244/2026',
  anbima: 'ANBIMA',
  pld: 'PLD/FT',
  susep: 'SUSEP',
  sro: 'SRO (SUSEP)',
  openinsurance: 'Open Insurance',
  anvisa: 'Anvisa',
  cfm: 'CFM',
  ans: 'ANS',
  tiss: 'RN ANS 639/2025 (TISS)',
  rnds: 'RNDS',
  anatel: 'Anatel',
  rgc: 'RGC (Anatel)',
  eca: 'ECA Digital (Ley 15.211/2025)',
  marco_civil: 'Marco Civil de Internet',
  mec: 'MEC',
  inep: 'INEP',
  fies: 'FIES / ProUni',
  esg: 'ESG / IFRS S1-S2',
  fiscal: 'Fiscal / auditoría',
  reforma_tributaria: 'Reforma Tributaria',
}

/** A linha "Impactos avaliados" do perfil, onde ela não usa o rótulo da tag
 *  (`ROTULO_NA_LINHA`, em `perfil.ts`). */
export const ROTULOS_NA_LINHA_ES: Readonly<Partial<Record<Tag, string>>> = {
  bcb: 'BACEN (Banco Central de Brasil)',
  eca: 'ECA Digital',
  lgpd: 'LGPD/ANPD',
}

export const NIVEIS_ES: Readonly<Record<NivelNumerico, { nome: string; descricao: string }>> = {
  1: {
    nome: 'Inicial',
    descricao:
      'Los datos dependen de personas, planillas y esfuerzo heroico. Se decide con números que nadie logra reproducir.',
  },
  2: {
    nome: 'Repetible',
    descricao:
      'Hay islas de organización, pero sin patrocinio, roles ni estándares compartidos. El riesgo regulatorio se concentra en pocas personas.',
  },
  3: {
    nome: 'Definido',
    descricao: 'Políticas, responsables y catálogo cubren los datos críticos. El próximo salto es medir y automatizar.',
  },
  4: {
    nome: 'Gestionado',
    descricao:
      'Calidad medida, accesos revisados y evidencias listas. Falta escalar a toda la organización y a la IA.',
  },
  5: {
    nome: 'Optimizado',
    descricao:
      'Datos tratados como producto, con monitoreo continuo. El foco pasa al valor: IA, nuevos productos y eficiencia.',
  },
}

export const OFERTAS_ES: Readonly<Record<NomeDoPilar, Readonly<Record<Faixa, Oferta>>>> = {
  Governança: {
    low: {
      titulo: 'Estructura de gobierno de datos',
      descricao:
        'Diagnóstico ejecutivo, designación de data owners y stewards, comité de datos, política y glosario de negocio para los dominios críticos.',
    },
    mid: {
      titulo: 'Catálogo y linaje',
      descricao:
        'Implementación de un catálogo de datos con linaje para los indicadores y reportes críticos, integrado al diccionario de datos que exigen los reguladores.',
    },
    high: {
      titulo: 'Datos como producto',
      descricao: 'Productos de datos por dominio, contratos de datos y gobierno federado con autoservicio monitoreado.',
    },
  },
  Qualidade: {
    low: {
      titulo: 'Fuente única y reglas de calidad',
      descricao:
        'Plataforma de datos con una fuente única para los indicadores principales, y reglas de completitud, consistencia y oportunidad sobre los datos críticos.',
    },
    mid: {
      titulo: 'MDM y monitoreo',
      descricao:
        'Gestión de datos maestros (cliente, producto, proveedor) con golden record y tableros de calidad por dominio.',
    },
    high: {
      titulo: 'Observabilidad de datos',
      descricao: 'Alertas, SLA y detección de anomalías en los pipelines, con la calidad medida en el origen.',
    },
  },
  Segurança: {
    low: {
      titulo: 'Accesos y respuesta a incidentes',
      descricao:
        'Clasificación de datos, control de acceso por rol, revisión periódica y plan de respuesta a incidentes que incluye la notificación a la ANPD.',
    },
    mid: {
      titulo: 'Protección por finalidad',
      descricao: 'Enmascaramiento dinámico, registro de auditoría centralizado y gestión del riesgo de terceros y de la nube.',
    },
    high: {
      titulo: 'Seguridad continua',
      descricao: 'Detección y respuesta automatizadas, revisión automática de accesos y métricas informadas al Directorio.',
    },
  },
  Conformidade: {
    low: {
      titulo: 'Mapa regulatorio y evidencias',
      descricao:
        'Inventario de datos personales y regulatorios, evaluación de impacto, responsables por regulación y rastro de evidencias para el regulador del sector.',
    },
    mid: {
      titulo: 'Automatización de reportes',
      descricao:
        'Pipelines gobernados para los reportes regulatorios, validaciones previas al envío y conciliación con la contabilidad.',
    },
    high: {
      titulo: 'Cumplimiento continuo',
      descricao: 'Controles automatizados, tableros de auditoría y gobierno de IA integrado al gobierno de datos.',
    },
  },
}

export const ACOES_POR_REGULACAO_ES: Readonly<Partial<Record<Tag, string>>> = {
  rc18: 'Programa RC 18/2025 hasta el 31/12/2026: política de calidad de la información, director responsable, diccionario de datos, pruebas previas al envío e informe semestral.',
  cmn5274:
    'Adecuación a la CMN 5.274/2025: controles de ciberseguridad sobre terceros y nube, prueba de intrusión independiente anual y evidencias de corrección.',
  bcb: 'Trazabilidad de punta a punta de la información enviada al Banco Central de Brasil, con linaje y conciliación.',
  openfinance:
    'Monitoreo de la disponibilidad y la calidad de las API y de los consentimientos de Open Finance; uso gobernado de los datos recibidos.',
  ifrs9:
    'Linaje y conciliación diaria entre riesgos y contabilidad para los modelos de pérdida esperada (IFRS 9 / CMN 4.966).',
  ifrs17:
    'Integración de las bases actuariales y contables para IFRS 17 / CPC 50 y para los informes prudenciales a la SUSEP, con cierre automatizado y evidencias para la auditoría.',
  lgpd: 'Inventario de datos personales (ROPA), evaluación de impacto, DPO activo, retención y eliminación, y flujo de solicitudes de titulares con plazos monitoreados.',
  anpd: 'Playbook de notificación de incidentes a la ANPD y evidencias para sus prioridades de fiscalización 2026-2027.',
  ia: 'Inventario de sistemas de IA con clasificación de riesgo y gobierno de los datos de entrenamiento, anticipándose al Marco Legal de la IA de Brasil (PL 2338/2023, con votación prevista para fines de 2026) y a la fiscalización de la ANPD.',
  bcbs239:
    'Agregación de datos de riesgo con linaje, conciliación y controles, según los principios de BCBS 239 que la RC 18 trae a Brasil.',
  cfm: 'Historia clínica electrónica con integridad, registro de auditoría y retención conforme a las normas del CFM y a la Ley 13.787/2018.',
  marco_civil:
    'Retención de los registros de conexión y de acceso en los plazos del Marco Civil de Internet, con acceso controlado y auditable.',
  cvm: 'Bases gobernadas y validaciones antes de los envíos a la CVM y a ANBIMA, con rastro de las versiones enviadas.',
  cvm244: 'Decisión documentada sobre IFRS S1/S2 y datos de sostenibilidad gobernados para reportar o justificar a partir de 2027.',
  pld: 'Registro único del inversionista con reglas de actualización y alertas para cumplimiento (suitability, KYC, PLD/FT).',
  susep: 'Inventario de proveedores de nube y de procesamiento, contratos accesibles a la SUSEP y plan de incidentes probado.',
  sro: 'Validaciones antes del envío al SRO, indicadores de rechazo y conciliación con la registradora.',
  openinsurance: 'Consentimientos trazables y datos de Open Insurance integrados al negocio.',
  anvisa: 'Datos clínicos gobernados con registro de auditoría, clasificación de los datos sensibles y controles de acceso.',
  ans: 'Datos asistenciales estandarizados en el origen y validaciones antes del envío al Monitoreo TISS.',
  tiss: 'Adecuación a la RN ANS 639/2025: datos asistenciales en el estándar TISS con calidad medida por indicador.',
  rnds: 'Interoperabilidad HL7 FHIR con la RNDS, empezando por los registros de mayor volumen.',
  anatel: 'Bases gobernadas para los indicadores e informes de Anatel, con validación antes del envío.',
  rgc: 'Evidencias de transparencia y protección de datos que exige el RGC, generadas de forma automática.',
  eca: 'Clasificación de los datos de menores, verificación de edad y consentimiento de los padres en las plataformas digitales (ECA Digital, Ley 15.211/2025, vigente desde el 17/3/2026).',
  mec: 'Registro único del alumno y conciliación entre los datos académicos, financieros y de inscripción antes de los envíos al MEC/INEP.',
  inep: 'Rastro de las versiones enviadas al Censo y al Enade, con validación previa.',
  fies: 'Consistencia de los datos de FIES/ProUni entre sistemas y evidencias para la auditoría.',
  esg: 'Indicadores de sostenibilidad con responsables, validación e integración a la plataforma de datos.',
  fiscal: 'Datos fiscales y de auditoría gobernados, auditables e integrados.',
  reforma_tributaria:
    'Depuración de los registros maestros y parametrización de las reglas fiscales (CBS/IBS) con pruebas en homologación antes de 2027.',
  lgpd_saude: 'Privacidad desde el diseño para los datos sensibles de salud, con auditoría continua.',
}

export const O_QUE_ESTA_EM_JOGO_ES: Readonly<Record<NomeDoPilar, string>> = {
  Governança:
    'Sin responsables, definiciones compartidas ni fuente única, cada área produce su propia versión del número. Las decisiones y los reportes regulatorios quedan expuestos a cuestionamientos, y cada nueva respuesta para la dirección ejecutiva se vuelve un proyecto.',
  Qualidade:
    'Los datos inconsistentes se convierten en retrabajo en el cierre, en reportes devueltos por el regulador y en modelos de IA que no llegan a producción. El costo aparece en horas de conciliación y en decisiones postergadas.',
  Segurança:
    'El acceso amplio y la respuesta improvisada a incidentes aumentan la probabilidad de una filtración. La LGPD prevé multas de hasta el 2% de la facturación, con un tope de R$ 50 millones por infracción, además del daño a la reputación.',
  Conformidade:
    'Las evidencias armadas a mano para cada pedido desgastan al equipo y no escalan. Plazos como el de la RC 18 (31/12/2026) y las prioridades de fiscalización de la ANPD para 2026-2027 aumentan la presión sobre quienes todavía no tienen diccionario, linaje ni registro de auditoría.',
}

/** Os textos que moram dentro da lógica do HTML (`motor.ts`). */
export const MOTOR_ES = {
  fases: [
    { fase: 'Fase 1', prazo: '0 a 3 meses' },
    { fase: 'Fase 2', prazo: '3 a 6 meses' },
    { fase: 'Fase 3', prazo: '6 a 12 meses' },
  ],
  diagnosticoExecutivo: {
    titulo: 'Diagnóstico ejecutivo de datos',
    descricao:
      'Revisión detallada de este resultado con un especialista de ATRA, priorización de las brechas por riesgo y plazo regulatorio, y una hoja de ruta aprobada por la dirección ejecutiva.',
  },
  frenteRegulatoria: 'Frente regulatorio prioritario',
  iaSobreDadosConfiaveis: {
    titulo: 'IA sobre datos confiables',
    descricao: 'Casos de uso de IA y analítica avanzada sobre los datos gobernados, con gobierno de los modelos y de los datos de entrenamiento.',
  },
  leitura: {
    abaixo: 'Para el tamaño de su empresa, este nivel está por debajo de lo que esperan sus pares y los reguladores.',
    acima: 'Nivel por encima del promedio del mercado brasileño.',
    compativel: 'Nivel similar al de la mayoría de las empresas de su tamaño, con un margen claro de mejora.',
  },
} as const
