/* O Diagnóstico de Maturidade em inglês (D-76, 28/10).
 *
 * A base do Roger (`dados.ts`) é gerada do HTML dele e continua a única fonte
 * da **conta**: notas, tags, setores e ordem saem de lá nos dois idiomas. Aqui
 * mora só o texto em inglês, chaveado pelos mesmos códigos — pergunta pelo
 * `id`, alternativa pela **posição** na lista da base. `ingles.test.ts`
 * reprova se a base ganhar pergunta, alternativa, setor ou tag sem tradução.
 *
 * ⚠️ Traduzido uma vez (pedido do Leonardo, 28/10) e revisado à mão, não a cada
 * visita: o texto é de quem mede maturidade e regulação, e um termo errado
 * muda a pergunta. Mudar o HTML do Roger pede mudar aqui também.
 *
 * Os nomes das normas brasileiras ficam como são (RC 18, CVM, SUSEP, LGPD…),
 * com o órgão explicado onde o leitor estrangeiro não o conheceria. Valores em
 * reais continuam em reais: a faixa é a mesma que vai ao comercial.
 *
 * ⚠️ O que vai ao CRM e ao aviso da ATRA continua em **português** (nível,
 * maiores gaps, roadmap): as automações do RD leem esses textos. O inglês é só
 * o que o visitante lê — a tela e o e-mail do resultado. */

import type { Cargo, Faixa, NivelNumerico, NomeDoPilar, Oferta, PerguntaId, Porte, Setor, Tag } from './dados'

export const SETORES_EN: Readonly<Record<Setor, string>> = {
  financeiro: 'Financial Services · Banks, Fintechs, Payments',
  capitais: 'Capital Markets · Asset Managers, Brokers',
  seguros: 'Insurance and Pensions',
  saude: 'Healthcare · Life Sciences · Health Plans',
  telecom: 'Telecommunications',
  educacao: 'Education · Education Groups, EdTechs',
  varejo: 'Retail, Manufacturing and Services',
  outros: 'Other',
}

export const PORTES_EN: Readonly<Record<Porte, string>> = {
  ate_50mi: 'Up to R$ 50M',
  '50_300mi': 'R$ 50M – 300M',
  '300mi_1bi': 'R$ 300M – 1B',
  '1_5bi': 'R$ 1B – 5B',
  acima_5bi: 'Over R$ 5B',
}

export const CARGOS_EN: Readonly<Record<Cargo, string>> = {
  ceo_presidente: 'CEO / President / Partner',
  cfo_cro: 'CFO / CRO / Finance or Risk Director',
  cio_cto_cdo: 'CIO / CTO / CDO',
  diretor_gerente: 'Director / Department Manager',
  coordenador_analista: 'Coordinator / Specialist / Analyst',
  outro: 'Other',
}

export const PILARES_EN: Readonly<Record<NomeDoPilar, string>> = {
  Governança: 'Governance',
  Qualidade: 'Quality',
  Segurança: 'Security',
  Conformidade: 'Compliance',
}

interface PerguntaEmIngles {
  enunciado: string
  /** Na ordem das alternativas da base: nota 1, 2, 3, 5. */
  alternativas: readonly [string, string, string, string]
}

export const PERGUNTAS_EN: Readonly<Record<PerguntaId, PerguntaEmIngles>> = {
  gov_estrategia: {
    enunciado: 'How does the data strategy connect to the business strategy?',
    alternativas: [
      'There is no formal data strategy; initiatives come up on demand.',
      'There are initiatives in isolated areas, without clear executive sponsorship.',
      'There is a documented strategy, with an executive sponsor and annual goals.',
      'Data is a pillar of strategic planning, with KPIs tracked by the executive board.',
    ],
  },
  gov_papeis: {
    enunciado: "Who is accountable for the company's critical data (data owners and data stewards)?",
    alternativas: [
      'No one formally; IT gets called when something goes wrong.',
      'A few informal owners in specific areas.',
      'Roles defined for the main domains, with an active data committee.',
      'Owners and stewards appointed for every domain, with goals and governance rituals.',
    ],
  },
  gov_catalogo: {
    enunciado: 'How do people find out what data exists, what it means and where it comes from?',
    alternativas: [
      'By asking whoever knows the system; there is no centralized documentation.',
      'Spreadsheets or wikis kept by hand and often out of date.',
      'Data catalog in place for the main domains, with a business glossary.',
      'Catalog with automated end-to-end lineage, classification and monitored usage.',
    ],
  },
  gov_arquitetura: {
    enunciado: 'How does data reach the areas that make decisions?',
    alternativas: [
      'Manual extracts and spreadsheets; each area builds its own version of the number.',
      'Some centralized reports, but with multiple competing sources.',
      'Data platform (data warehouse / lakehouse) with a single source for the main indicators.',
      'Modern cloud platform with data products by domain, self-service and monitoring.',
    ],
  },
  gov_decisao: {
    enunciado:
      'When the executive board needs a new answer from the data (an indicator that does not exist yet, a cross-area analysis), how long does it take?',
    alternativas: [
      'Weeks: it depends on a request to IT, extracts and spreadsheets built by hand.',
      'Days: analysts can do it, but every answer is a project.',
      'Hours: the main indicators are self-service and the rest is an occasional request.',
      'Minutes: business areas explore governed data on their own, with AI and advanced analytics.',
    ],
  },
  qual_confianca: {
    enunciado: 'How often does the executive board question the reliability of a number presented to it?',
    alternativas: [
      'Often; reconciling numbers across areas takes up part of the meetings.',
      'Sometimes; there are known discrepancies that have not been addressed yet.',
      'Rarely; the main indicators have defined quality rules.',
      'Practically never; quality is measured, published and continuously improved.',
    ],
  },
  qual_regras: {
    enunciado: 'Are there quality rules and monitoring (completeness, consistency, timeliness) on critical data?',
    alternativas: [
      'No; problems are found by the end user or by the customer.',
      'One-off validations in some processes, without continuous monitoring.',
      'Rules defined and monitored for critical data, with incident handling.',
      'Data observability with alerts, SLAs and quality scorecards by domain.',
    ],
  },
  qual_mdm: {
    enunciado: 'What is the state of the master records (customers, products, suppliers)?',
    alternativas: [
      'Duplicated and inconsistent across systems; there is no single view.',
      'Occasional deduplication, done by hand in campaigns.',
      'Master data management (MDM) process for the main records.',
      'Multi-domain MDM with golden record, survivorship rules and active stewardship.',
    ],
  },
  seg_acesso: {
    enunciado: 'How is access to sensitive data granted and reviewed?',
    alternativas: [
      'Broad access for convenience; reviews are not done.',
      'Profiles per system, with occasional review.',
      'Role-based access control (RBAC), data classification and periodic access reviews.',
      'Attribute- and purpose-based access, dynamic masking, audit trail and automated review.',
    ],
  },
  seg_incidente: {
    enunciado: 'If there were a data breach today, how long would it take the company to find out and respond?',
    alternativas: [
      'We would have no way of knowing; we would depend on someone telling us.',
      'There is basic monitoring, but no tested response plan.',
      'Defined incident response plan, including notification to the ANPD (Brazil’s data protection authority) and to data subjects.',
      'Continuous detection, rehearsed response (tabletop) and metrics for time to detect and respond.',
    ],
  },
  conf_lgpd_mapa: {
    enunciado:
      'Does the company know where the personal data it processes is, under which legal basis and for how long, and does it assess the risk of the most sensitive processing?',
    alternativas: [
      'There is no inventory of personal data, no DPIA (RIPD) and no appointed data protection officer (DPO).',
      'Partial inventory done once; policies exist, but without follow-up or DPIA.',
      'Record of processing (ROPA) kept up to date, active DPO, DPIA for high-risk processing, retention and disposal applied.',
      'Privacy by design: automated classification, managed consent, reviewed DPIA and continuous auditing.',
    ],
  },
  conf_lgpd_titular: {
    enunciado:
      'How does the company handle data subject requests (access, correction, deletion), and how would it react to an incident that has to be reported to the ANPD?',
    alternativas: [
      'Case by case, with no process, no tracked deadline and no incident communication plan (the ANPD requires notification within a set deadline).',
      'Manual process, with difficulty locating the data across all systems; incidents handled ad hoc.',
      'Defined workflow for data subjects and for incidents, with monitored deadlines and traceable actions.',
      'Data subject portal integrated with the systems, automated execution, tested incident playbook and evidence.',
    ],
  },
  conf_ia: {
    enunciado:
      'Does the company know which AI systems use its data, at what level of risk, and where the data that feeds them comes from and how good it is?',
    alternativas: [
      'We do not know which AI systems use company data; initiatives start without assessment.',
      'We have an informal list of AI initiatives, with no risk classification and no control over the data used.',
      'Inventory of AI systems with risk classification, impact assessment and rules for personal data.',
      'AI governance integrated with data governance: training data lineage, bias monitoring, explainability and audit trail.',
    ],
  },
  conf_fin_rc18: {
    enunciado:
      'Where does the institution stand on Joint Resolution CMN/BCB No. 18/2025 (Information Quality Policy, accountable statutory director, data dictionary, semiannual report)? The compliance deadline is 12/31/2026.',
    alternativas: [
      'We have not mapped the impact yet; there is no policy, no designated director and no data dictionary.',
      'Policy being drafted and director designated, but the data dictionary and the semiannual report do not exist yet.',
      'Policy approved by the Board, data dictionary for the critical reports and first semiannual report produced.',
      'Full program up and running: policy, dictionary integrated with the catalog, pre-submission tests, and automated indicators and semiannual report.',
    ],
  },
  conf_fin_rc18_dim: {
    enunciado:
      'For each piece of information sent to the Central Bank of Brazil, can the institution prove the 12 quality dimensions of RC 18 (traceability from source to submission, accuracy, completeness, consistency and timeliness), in line with BCBS 239?',
    alternativas: [
      'No; reports are assembled by hand and we cannot reconstruct where a number came from.',
      'We trace some reports with manual effort; errors are found after submission or when the Central Bank asks.',
      'Documented lineage for the critical reports, pre-submission validations and handling of irregularities with an action plan.',
      'Automated end-to-end lineage, quality rules per dimension monitored continuously and evidence ready for the supervisor.',
    ],
  },
  conf_fin_ciber: {
    enunciado:
      'Has the institution already complied with CMN Resolution 5,274/2025 (which updates cybersecurity Resolution 4,893/2021, deadline 3/1/2026): controls extended to third parties and cloud, an annual independent penetration test and evidence of remediation?',
    alternativas: [
      'We are not aware of the changes; supplier and cloud controls are not verified.',
      'A cybersecurity policy exists, but without clauses and evidence from critical third parties or an independent pentest.',
      'Contracts with critical suppliers reviewed, annual independent pentest and documented action plans.',
      'Continuous third-party risk management, integrated monitoring, recurring tests and reporting to the Board.',
    ],
  },
  conf_fin_of: {
    enunciado:
      'In Open Finance, does the institution track the availability and quality of the data it shares and receives, and the traceability of customer consents?',
    alternativas: [
      'We do the minimum; we do not track API availability or quality indicators.',
      'We track the required indicators, but data and consent failures are handled reactively.',
      'Monitoring of APIs and consents with alerts, and governed use of the data received.',
      'Open Finance as a data product: measured quality, auditable consents and received data integrated into credit and customer relationship.',
    ],
  },
  conf_fin_ifrs9: {
    enunciado:
      'Is the data that feeds the expected loss models (IFRS 9 / CMN Resolution 4,966) traceable and reconcilable with accounting?',
    alternativas: [
      'The calculations depend on spreadsheets and manual adjustments that are hard to reproduce.',
      'There is a process, but reconciling risk and accounting takes a lot of work.',
      'Documented pipelines, with lineage and periodic reconciliation.',
      'Automated lineage, daily reconciliation and a complete trail for auditors and the regulator.',
    ],
  },
  conf_cap_cvm: {
    enunciado:
      'How does the asset manager/broker ensure the quality and traceability of the information sent to the CVM (Brazil’s securities regulator) and to ANBIMA (CVM Resolution 175, periodic reports, suitability)?',
    alternativas: [
      'Manual consolidation in spreadsheets, with rework and risk of error in submissions.',
      'Semi-automated process, but without quality controls before submission.',
      'Governed databases, pre-submission validations and a trail of the versions sent.',
      'Automated generation with validation, lineage and reconciliation with administrators and custodians.',
    ],
  },
  conf_cap_suit: {
    enunciado:
      'Is investor profile data (suitability, KYC, AML/CFT) complete, up to date and available to the compliance team?',
    alternativas: [
      'It is scattered across systems and forms, with outdated records.',
      'Centralized, but with manual updating and monitoring.',
      'Single record with update rules and alerts for compliance.',
      'Continuous monitoring with risk models and automated evidence for auditing.',
    ],
  },
  conf_cap_esg: {
    enunciado:
      'With CVM Resolution 244/2026, IFRS S1/S2 reporting became voluntary with a "comply or explain" duty starting in 2027. Does the firm (or do the companies it covers) have governed sustainability data to report or to justify?',
    alternativas: [
      'There is no structured collection of sustainability data; the decision to report has not been discussed.',
      'Data collected in spreadsheets for one-off reports, without quality control.',
      'Decision made, indicators defined with owners and validated before publication.',
      'Sustainability data integrated into the data platform, auditable and connected to investment decisions.',
    ],
  },
  conf_seg_ifrs17: {
    enunciado:
      'Is the contract, claims and reserves data that feeds IFRS 17 / CPC 50 (listed companies) and the prudential reports to SUSEP (Brazil’s insurance regulator) integrated and reconcilable?',
    alternativas: [
      'Each system has its own database; consolidation is manual and slow.',
      'There is partial integration, with manual adjustments at closing.',
      'Actuarial and accounting databases integrated, with lineage and periodic reconciliation.',
      'Automated closing, continuous reconciliation and evidence ready for auditing.',
    ],
  },
  conf_seg_sro: {
    enunciado:
      'How does the insurer ensure quality and timeliness in the Operations Registry System (SRO) and in Open Insurance (data sharing and consents)?',
    alternativas: [
      'Records sent late with recurring rejections; we do not measure quality.',
      'Automated submission, but rejections are handled by hand and without root cause.',
      'Pre-submission validations, rejection indicators and traceable Open Insurance consents.',
      'Quality monitored at the source, automatic reconciliation with the registrar and Open Insurance data used in the business.',
    ],
  },
  conf_seg_ciber: {
    enunciado:
      'Does the insurer comply with SUSEP Circular 638/2021 and its 2026 updates (cloud and data processing contracts accessible to SUSEP, incident management, cybersecurity manual)?',
    alternativas: [
      'We have no inventory of the contracted cloud and processing services and no incident response plan.',
      'A policy exists, but supplier contracts and evidence are not organized for SUSEP.',
      'Inventory of critical suppliers, accessible contracts, incident plan defined and tested.',
      'Continuous management of cyber and third-party risk, with metrics reported to the Board.',
    ],
  },
  conf_sau_anvisa: {
    enunciado:
      'How does the organization ensure the integrity, traceability and protection of clinical data (electronic health records, sensitive health data) required by Anvisa, the CFM (Federal Council of Medicine) and the LGPD? Health data is a focus of the ANPD in 2026-2027.',
    alternativas: [
      'Records in separate systems, with no reliable audit trail or classification of sensitive data.',
      'Audit trail in some systems; integration done by hand.',
      'Governed clinical data, with audit trail, classification of sensitive data and access controls.',
      'Integrated platform with continuous auditing, privacy by design and automated evidence.',
    ],
  },
  conf_sau_tiss: {
    enunciado:
      'With ANS Normative Resolution 639/2025 (end of SIP and centralization in TISS Monitoring since March 2026) and interoperability with RNDS in HL7 FHIR (Decree 12,560/2025), what is the state of care and billing data?',
    alternativas: [
      'Claims and records with many denials and rejections; there is no standard and no integration with RNDS.',
      'TISS met with manual rework; FHIR interoperability not started yet.',
      'Care data standardized at the source, pre-submission validations and integration with RNDS underway.',
      'FHIR interoperability running, quality monitored per indicator and data used in clinical and financial management.',
    ],
  },
  conf_tel_anatel: {
    enunciado:
      "How does the operator produce the indicators and reports required by Anatel (Brazil's telecom regulator) and the transparency and data protection evidence of the new General Consumer Rights Regulation (RGC, in force since September 2025)?",
    alternativas: [
      'Manual consolidation from several systems, with recurring rework.',
      'Partially automated routines, without quality validation before submission.',
      'Governed databases with validations and a trail of the reports sent.',
      'Automated generation, quality monitoring and real-time compliance dashboards.',
    ],
  },
  conf_tel_ciber: {
    enunciado:
      "Does the operator comply with Anatel's Cybersecurity Regulation and the recent requirements: incident notification, fraud and spoofing prevention, Marco Civil record retention and Digital ECA age verification (in force since March 2026)?",
    alternativas: [
      'There is no formal incident process and no identity or age controls in digital channels.',
      'An incident process exists, but age verification and anti-fraud are occasional.',
      'Incidents reported on time, integrated anti-fraud and age verification mechanisms defined.',
      'Security and identity monitored continuously, with automated evidence for Anatel and the ANPD.',
    ],
  },
  conf_edu_mec: {
    enunciado:
      'Is the academic and financial data sent to MEC/INEP (Higher Education Census, e-MEC, Enade, FIES/ProUni) consistent across the academic, financial and enrollment systems, and traceable to the source?',
    alternativas: [
      'Each system has its own version of the student; submissions require manual reconciliation and discrepancies recur.',
      'There is a consolidation process, but it depends on spreadsheets and a few people.',
      'Single student record, pre-submission validations and a trail of the versions sent.',
      'Academic data governed as a product, with lineage, automatic reconciliation and regulatory indicators on a dashboard.',
    ],
  },
  conf_edu_menores: {
    enunciado:
      "How does the institution handle children's and teenagers' data on digital platforms (Digital ECA in force since March 2026: age verification, parental consent, use of AI in tutoring and exams)?",
    alternativas: [
      'We do not distinguish minors’ data; consent and age verification are not controlled.',
      'Parental consent collected at enrollment, but without control on the platforms and EdTech suppliers.',
      'Minors’ data classified, age verification and consent managed, suppliers assessed.',
      'Privacy by design for minors, impact assessment of educational AI systems and continuous auditing.',
    ],
  },
  conf_edu_retencao: {
    enunciado:
      'Is the recruitment, enrollment, dropout and delinquency data good enough for retention models and for reports to investors and to MEC?',
    alternativas: [
      'Dropout and delinquency indicators differ across areas; there is no single definition.',
      'Definitions exist, but source data (campuses, franchises, platforms) arrives with errors.',
      'Business glossary and quality rules for student indicators, with monitoring.',
      'Certified indicators, predictive dropout models in production and evidence for auditors and investors.',
    ],
  },
  conf_ger_esg: {
    enunciado:
      'How does the company produce the audit and sustainability data required by auditors, large customers and, for listed companies, by the CVM (voluntary IFRS S1/S2 with "comply or explain" starting in 2027, CVM Resolution 244/2026)?',
    alternativas: [
      'On demand, with manual effort and little confidence in the numbers.',
      'Defined process, but dependent on spreadsheets and a few people.',
      'Governed data, with owners and validation before publication.',
      'Automated, auditable reports integrated into the data platform.',
    ],
  },
  conf_ger_tributaria: {
    enunciado:
      "Brazil's Tax Reform (CBS/IBS) entered its test phase in 2026, and CBS takes full effect in 2027. Are the product, customer and supplier records and the tax rules in the systems ready for the transition?",
    alternativas: [
      'We have not assessed the impact on records and systems yet; we depend on the ERP vendor.',
      'Impact mapped, but the master records have inconsistencies that delay configuration.',
      'Records cleaned up, tax rules configured and tests in a staging environment.',
      'Transition running with governed master data, tax burden simulations and monitoring of ancillary obligations.',
    ],
  },
}

export const ROTULOS_DAS_TAGS_EN: Readonly<Record<Tag, string>> = {
  governanca: 'Data governance',
  qualidade: 'Data quality',
  seguranca: 'Data security',
  lgpd: 'LGPD',
  anpd: 'ANPD',
  lgpd_saude: 'LGPD (health data)',
  ia: 'AI Legal Framework',
  rc18: 'Joint Resolution CMN/BCB 18/2025',
  bcb: 'Central Bank of Brazil',
  cmn5274: 'CMN Resolution 5,274/2025',
  bcbs239: 'BCBS 239',
  openfinance: 'Open Finance',
  ifrs9: 'IFRS 9',
  ifrs17: 'IFRS 17',
  cvm: 'CVM',
  cvm244: 'CVM Resolution 244/2026',
  anbima: 'ANBIMA',
  pld: 'AML/CFT',
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
  eca: 'Digital ECA (Law 15,211/2025)',
  marco_civil: 'Brazilian Internet Bill of Rights',
  mec: 'MEC',
  inep: 'INEP',
  fies: 'FIES / ProUni',
  esg: 'ESG / IFRS S1-S2',
  fiscal: 'Tax / audit',
  reforma_tributaria: 'Tax Reform',
}

/** A linha "Impactos avaliados" do perfil, onde ela não usa o rótulo da tag
 *  (`ROTULO_NA_LINHA`, em `perfil.ts`). */
export const ROTULOS_NA_LINHA_EN: Readonly<Partial<Record<Tag, string>>> = {
  bcb: 'BACEN (Central Bank of Brazil)',
  eca: 'Digital ECA',
  lgpd: 'LGPD/ANPD',
}

export const NIVEIS_EN: Readonly<Record<NivelNumerico, { nome: string; descricao: string }>> = {
  1: {
    nome: 'Initial',
    descricao:
      'Data depends on people, spreadsheets and heroic effort. Decisions are made with numbers no one can reproduce.',
  },
  2: {
    nome: 'Repeatable',
    descricao:
      'There are islands of organization, but no shared sponsorship, roles or standards. Regulatory risk is concentrated in a few people.',
  },
  3: {
    nome: 'Defined',
    descricao: 'Policies, owners and a catalog cover the critical data. The next leap is to measure and automate.',
  },
  4: {
    nome: 'Managed',
    descricao:
      'Quality measured, access reviewed and evidence ready. What is missing is scaling to the whole organization and to AI.',
  },
  5: {
    nome: 'Optimized',
    descricao:
      'Data treated as a product, with continuous monitoring. The focus shifts to value: AI, new products and efficiency.',
  },
}

export const OFERTAS_EN: Readonly<Record<NomeDoPilar, Readonly<Record<Faixa, Oferta>>>> = {
  Governança: {
    low: {
      titulo: 'Data governance structure',
      descricao:
        'Executive assessment, appointment of data owners and stewards, data committee, policy and business glossary for the critical domains.',
    },
    mid: {
      titulo: 'Catalog and lineage',
      descricao:
        'Rollout of a data catalog with lineage for the critical indicators and reports, integrated with the data dictionary regulators require.',
    },
    high: {
      titulo: 'Data as a product',
      descricao: 'Data products by domain, data contracts and federated governance with monitored self-service.',
    },
  },
  Qualidade: {
    low: {
      titulo: 'Single source and quality rules',
      descricao:
        'Data platform with a single source for the main indicators, and completeness, consistency and timeliness rules on critical data.',
    },
    mid: {
      titulo: 'MDM and monitoring',
      descricao:
        'Master data management (customer, product, supplier) with golden record and quality scorecards by domain.',
    },
    high: {
      titulo: 'Data observability',
      descricao: 'Alerts, SLAs and anomaly detection in the pipelines, with quality measured at the source.',
    },
  },
  Segurança: {
    low: {
      titulo: 'Access and incident response',
      descricao:
        'Data classification, role-based access control, periodic review and an incident response plan including notification to the ANPD.',
    },
    mid: {
      titulo: 'Purpose-based protection',
      descricao: 'Dynamic masking, centralized audit trail and third-party and cloud risk management.',
    },
    high: {
      titulo: 'Continuous security',
      descricao: 'Automated detection and response, automated access reviews and metrics reported to the Board.',
    },
  },
  Conformidade: {
    low: {
      titulo: 'Regulatory map and evidence',
      descricao:
        "Inventory of personal and regulatory data, DPIA, owners per regulation and an evidence trail for the sector's regulator.",
    },
    mid: {
      titulo: 'Report automation',
      descricao:
        'Governed pipelines for regulatory reports, pre-submission validations and reconciliation with accounting.',
    },
    high: {
      titulo: 'Continuous compliance',
      descricao: 'Automated controls, audit dashboards and AI governance integrated with data governance.',
    },
  },
}

export const ACOES_POR_REGULACAO_EN: Readonly<Partial<Record<Tag, string>>> = {
  rc18: 'RC 18/2025 program by 12/31/2026: information quality policy, accountable director, data dictionary, pre-submission tests and semiannual report.',
  cmn5274:
    'Compliance with CMN 5,274/2025: cybersecurity controls on third parties and cloud, an annual independent penetration test and evidence of remediation.',
  bcb: 'End-to-end traceability of the information sent to the Central Bank of Brazil, with lineage and reconciliation.',
  openfinance:
    'Monitoring of availability and quality of Open Finance APIs and consents; governed use of the data received.',
  ifrs9:
    'Lineage and daily reconciliation between risk and accounting for the expected loss models (IFRS 9 / CMN 4,966).',
  ifrs17:
    'Integration of the actuarial and accounting databases for IFRS 17 / CPC 50 and for the prudential reports to SUSEP, with automated closing and audit evidence.',
  lgpd: 'Personal data inventory (ROPA), DPIA, active DPO, retention and disposal, and a data subject request workflow with monitored deadlines.',
  anpd: 'Incident notification playbook for the ANPD and evidence for its 2026-2027 enforcement priorities.',
  ia: "Inventory of AI systems with risk classification and governance of training data, ahead of Brazil's AI Legal Framework (Bill 2338/2023, with a vote expected by the end of 2026) and ANPD enforcement.",
  bcbs239:
    'Risk data aggregation with lineage, reconciliation and controls, following the BCBS 239 principles that RC 18 brings to Brazil.',
  cfm: 'Electronic health records with integrity, audit trail and retention in line with CFM rules and Law 13,787/2018.',
  marco_civil:
    'Retention of connection and access logs within the deadlines of the Brazilian Internet Bill of Rights (Marco Civil), with controlled and auditable access.',
  cvm: 'Governed databases and validations before submissions to the CVM and ANBIMA, with a trail of the versions sent.',
  cvm244: 'Documented decision on IFRS S1/S2 and governed sustainability data to report or justify starting in 2027.',
  pld: 'Single investor record with update rules and alerts for compliance (suitability, KYC, AML/CFT).',
  susep: 'Inventory of cloud and processing suppliers, contracts accessible to SUSEP and a tested incident plan.',
  sro: 'Validations before submission to the SRO, rejection indicators and reconciliation with the registrar.',
  openinsurance: 'Traceable consents and Open Insurance data integrated into the business.',
  anvisa: 'Governed clinical data with audit trail, classification of sensitive data and access controls.',
  ans: 'Standardized care data at the source and validations before submission to TISS Monitoring.',
  tiss: 'Compliance with ANS RN 639/2025: care data in the TISS standard with quality measured per indicator.',
  rnds: 'HL7 FHIR interoperability with RNDS, starting with the highest-volume records.',
  anatel: 'Governed databases for Anatel indicators and reports, with validation before submission.',
  rgc: 'Transparency and data protection evidence required by the RGC, generated automatically.',
  eca: "Classification of minors' data, age verification and parental consent on digital platforms (Digital ECA, Law 15,211/2025, in force since 3/17/2026).",
  mec: 'Single student record and reconciliation between academic, financial and enrollment data before submissions to MEC/INEP.',
  inep: 'Trail of the versions sent to the Census and to Enade, with prior validation.',
  fies: 'Consistency of FIES/ProUni data across systems and evidence for auditing.',
  esg: 'Sustainability indicators with owners, validation and integration into the data platform.',
  fiscal: 'Governed, auditable and integrated tax and audit data.',
  reforma_tributaria:
    'Cleanup of the master records and configuration of the tax rules (CBS/IBS) with tests in a staging environment before 2027.',
  lgpd_saude: 'Privacy by design for sensitive health data, with continuous auditing.',
}

export const O_QUE_ESTA_EM_JOGO_EN: Readonly<Record<NomeDoPilar, string>> = {
  Governança:
    'Without owners, shared definitions and a single source, each area produces its own version of the number. Decisions and regulatory reports are open to challenge, and every new answer for the executive board becomes a project.',
  Qualidade:
    'Inconsistent data turns into rework at closing, reports sent back by the regulator and AI models that cannot go to production. The cost shows up in hours of reconciliation and in postponed decisions.',
  Segurança:
    'Broad access and improvised incident response raise the chance of a breach. The LGPD provides for fines of up to 2% of revenue, capped at R$ 50 million per violation, on top of the reputational damage.',
  Conformidade:
    "Evidence assembled by hand for each request drains the team and does not scale. Deadlines such as RC 18's (12/31/2026) and the ANPD's 2026-2027 enforcement priorities increase the pressure on those who still lack a dictionary, lineage and an audit trail.",
}

/** Os textos que moram dentro da lógica do HTML (`motor.ts`). */
export const MOTOR_EN = {
  fases: [
    { fase: 'Phase 1', prazo: '0 to 3 months' },
    { fase: 'Phase 2', prazo: '3 to 6 months' },
    { fase: 'Phase 3', prazo: '6 to 12 months' },
  ],
  diagnosticoExecutivo: {
    titulo: 'Executive data assessment',
    descricao:
      'Detailed review of this result with an ATRA specialist, gap prioritization by risk and regulatory deadline, and a roadmap approved by the executive board.',
  },
  frenteRegulatoria: 'Priority regulatory front',
  iaSobreDadosConfiaveis: {
    titulo: 'AI on trusted data',
    descricao: 'AI and advanced analytics use cases on the governed data, with governance of models and training data.',
  },
  leitura: {
    abaixo: 'For your company size, this level is below what peers and regulators expect.',
    acima: 'Level above the Brazilian market average.',
    compativel: 'Level in line with most companies of your size, with clear room to improve.',
  },
} as const
