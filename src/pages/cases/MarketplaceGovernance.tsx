import React from 'react';
import CaseDetailBase from '@/components/CaseDetailBase';
import caseMarketplaceGov from '@/assets/images/case_marketplace_gov_1785848321737.jpg';

const MarketplaceGovernance = () => {
  return (
    <CaseDetailBase
      client="Banco ABC"
      title="Gerando valor através de Marketplace e Governança de dados"
      heroImage={caseMarketplaceGov}
      description="Transformação da gestão de dados do Banco ABC com foco em democratização, qualidade e governança através de Marketplace."
      challenges={[
        "Estabelecer um fluxo de trabalho fluído entre as soluções da Informatica e a Plataforma GCP;",
        "Fornecer uma maneira de usar dashboards como produto;",
        "Implementar perfil de dados, linhagem de dados, glossário de dados e classificação de dados dentro do ambiente GCP com bilhões de objetos."
      ]}
      solution="Utilização de ferramentas de catálogo de dados para a catalogação dos dashboards desenvolvidos no Look Studio e de todos os recursos relacionados ao Data Lake (BigQuery). Documentação de informações críticas ao negócio, glossários, classificação e monitoramento de qualidade. Fornecimento de acesso via Data Marketplace."
      results={[
        "Qualificação de dados de vendas resolvendo problemas de completude da informação;",
        "Democratização e qualificação de dados por meio de catálogos e monitoramento;",
        "Melhor experiência ao usuário (dashboards como produto)."
      ]}
      partners="Google Cloud e Informatica"
      technologies={["Informatica CDGC", "Informatica Data Quality", "Google Data Lake (BigQuery)"]}
      testimony={{
        text: "Temos aqui uma grande parceira que é a ATRA! Estamos com muitos projetos trabalhando em conjunto... pessoas extremamente especializadas em cada assunto. Os executivos são muito próximos dos projetos e a comunicação é eficiente e ágil.",
        author: "Rafael Kataoka",
        role: "Big Data Analytics and Information Security Manager — Banco ABC"
      }}
      aboutClient="Com um amplo portfólio de produtos e expertise em análise de crédito, o Banco ABC Brasil possui uma sólida base de clientes composta por médias e grandes empresas."
    />
  );
};

export default MarketplaceGovernance;
