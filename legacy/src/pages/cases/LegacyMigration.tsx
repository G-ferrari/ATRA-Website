import React from 'react';
import CaseDetailBase from '@/components/CaseDetailBase';
import caseLegacyMigration from '@/assets/images/case_legacy_migration_1785848338358.jpg';

const LegacyMigration = () => {
  return (
    <CaseDetailBase
      client="Banco ABC"
      title="Migrando cargas de trabalho legadas para Google Cloud"
      heroImage={caseLegacyMigration}
      description="Integração ágil de sistemas legados para alimentar uma nova aplicação de Risco de Mercado de forma automática."
      challenges={[
        "Alimentar uma nova aplicação de Risco de Mercado a partir de legado em curto prazo;",
        "Disponibilizar dados de forma corporativa em um Data Lake no GCP;",
        "Desenvolver uma integração ágil, confiável e consistente entre tecnologias diferentes."
      ]}
      solution="Implementação de Google Storage como landing zone e BigQuery como data lake. Uso de Cloud Functions em Python com triggers para detecção automática, padronização e preparação de arquivos. Integração em camadas (raw, stage, refined) via Informatica IDMC CDI."
      results={[
        "Tratamento instantâneo dos arquivos de legado assim que disponibilizados;",
        "Automatização total do processo – do legado até a aplicação;",
        "Redução drástica de custos operacionais e falhas manuais;",
        "Rápido desenvolvimento e fácil manutenção com ferramentas nativas GCP."
      ]}
      partners="Google Cloud"
      technologies={["Pub/Sub", "Cloud Functions", "Google Cloud Storage", "Informatica IDMC"]}
      testimony={{
        text: "Com o uso de Pub/Sub e Cloud Functions, conseguimos obter dados quase em tempo real e escalabilidade em nosso processo, ao mesmo tempo em que reduzimos significativamente nossos custos e esforços operacionais.",
        author: "Rafael Kataoka",
        role: "Big Data Analytics and Information Security Manager — Banco ABC"
      }}
      aboutClient="O Banco ABC Brasil é reconhecido por seu processo ágil de tomada de decisão e sólida base de clientes corporativos."
    />
  );
};

export default LegacyMigration;
