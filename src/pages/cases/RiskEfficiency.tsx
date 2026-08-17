import React from 'react';
import CaseDetailBase from '@/components/CaseDetailBase';
import caseRiskEfficiency from '@/assets/images/case_risk_efficiency_1785848355083.jpg';

const RiskEfficiency = () => {
  return (
    <CaseDetailBase
      client="Banco Carrefour"
      title="Ingestão impulsionando a eficiência em processos de risco com GCP"
      heroImage={caseRiskEfficiency}
      description="Modernização radical do processamento de dados regulatórios, alcançando uma velocidade 51x maior."
      challenges={[
        "Processamento de dados lento e não escalável para relatórios regulatórios;",
        "Dependência de ferramentas locais limitadas;",
        "Risco de perda de prazos de conformidade e excesso de horas extras."
      ]}
      solution="Migração total para Google Cloud utilizando BigQuery para análises escaláveis, Dataflow para ingestão eficiente, Dataform para gerenciamento de transformações SQL, Dataplex para linhagem e Looker para visualização estratégica."
      results={[
        "Processamento 51 vezes mais rápido para relatórios regulatórios;",
        "Garantia absoluta de conformidade nos prazos;",
        "Regras comerciais claras que melhoraram a manutenção;",
        "Redução de modificações de código via parametrização flexível."
      ]}
      partners="Google Cloud"
      technologies={["Cloud Storage", "Dataflow", "Dataform", "BigQuery", "Looker", "Dataplex"]}
      testimony={{
        text: "A expertise e a parceria da ATRA foram fundamentais... Sua capacidade de se alinhar às necessidades da nossa equipe de Riscos proporcionou uma solução 51 vezes mais rápida e totalmente automatizada.",
        author: "Paulo Ruza",
        role: "Superintendente de Dados — Banco Carrefour"
      }}
      aboutClient="O Carrefour Soluções Financeiras é o único varejista no Brasil com banco próprio, empoderando famílias através de soluções de crédito inovadoras."
    />
  );
};

export default RiskEfficiency;
