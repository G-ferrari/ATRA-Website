import React from 'react';
import CaseDetailBase from '@/components/CaseDetailBase';
import caseStrategicDashboards from '@/assets/images/case_strategic_dashboards_1785848371031.jpg';

const StrategicDashboards = () => {
  return (
    <CaseDetailBase
      client="Banco ABC"
      title="Criação de dashboards estratégico para financeira"
      heroImage={caseStrategicDashboards}
      description="Desenvolvimento de KPIs de performance e tomada de decisão estratégica para produtos de crédito."
      challenges={[
        "Falta de estruturação de indicadores para Crédito Pessoal e Consignado;",
        "Necessidade de dados para fundamentar o roadmap de melhorias;",
        "Dificuldade em visualizar a performance dos produtos em tempo real para tomada de decisão."
      ]}
      solution="Estruturação de um dashboard estratégico completo integrando indicadores operacionais, métricas de negócio e dados de mercado. Implementação de visão 360º dos produtos com atualizações frequentes via Looker e dbt no ambiente GCP."
      results={[
        "Decisões estratégicas mais assertivas e 100% orientadas por dados;",
        "Roadmap de produtos construído com base em evidências reais;",
        "Operação sustentada por visão robusta e fundamentada do negócio."
      ]}
      partners="Google Cloud"
      technologies={["GCP", "Looker", "dbt", "BigQuery"]}
      aboutClient="Com expertise sólida em crédito, o Banco ABC Brasil utiliza dados como pilar para sua eficiência operacional e estratégica."
    />
  );
};

export default StrategicDashboards;
