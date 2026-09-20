import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { PartnerPageBase, PartnerBadge, PartnerService, PartnerSpecialization } from '@/components/PartnerPageBase';

const PartnerGoogleCloud = () => {
  const { t } = useTranslation();

  // Badges extracted from the original setup
  const badges: PartnerBadge[] = [2018, 2020, 2022, 2024, 2025].map(year => ({
    id: `badge-${year}`,
    topText: 'LATIN AMERICA',
    title: 'Partner of the Year\nService',
    highlightText: String(year),
  }));

  // Services (Benefits) - originally mapped if translation array isn't returned
  const benefitsListRaw = t('partner.benefitsList', { returnObjects: true });
  const servicesListStrings: string[] = Array.isArray(benefitsListRaw)
    ? benefitsListRaw
    : [
        "Certificação oficial pela Google Cloud, garantindo qualidade e segurança.",
        "Soluções personalizadas que atendem às necessidades exclusivas do seu negócio.",
        "Acesso a soluções avançadas e inovação contínua.",
        "Alinhamento com as melhores práticas globais em cloud computing.",
        "Acompanhamento completo durante toda a jornada na nuvem."
      ];
  const servicesList: PartnerService[] = servicesListStrings.map(text => ({ text }));

  // Specializations
  const specListStrings = [
    "Infrastructure",
    "Workplace Transformation (clientes SMB e Enterprise)",
    "Consulting Partner",
    "Data Analytics",
    "Application Development",
    "Cloud Migration",
    "Managed Service Provider" // This was in the visual but not the list in original, adding to the list to unify
  ];
  const specList: PartnerSpecialization[] = specListStrings.map(name => ({ name }));

  return (
    <PartnerPageBase
      partnerName="Google Cloud"
      titleText={
        <Trans i18nKey="partner.title">
          <span className="text-primary">ATRA</span> / Google Cloud Partner
        </Trans>
      }
      subtitleText={t('partner.subtitle')}
      partnerLogoUrl="/imagens/logo-google-cloud.png"
      badges={badges}
      
      // Achievements (was 'About' section)
      achievementsTitle={t('partner.aboutTitle')}
      achievementsP1={t('partner.aboutP1')}
      achievementsP2={t('partner.aboutP2')}
      achievementsImage="/imagens/unsplash-1573164713988-8665fc963095-w800-e53041.jpg"
      achievementsImageLabel="Partner"
      
      // Services (was 'Benefits' section)
      servicesTitle={t('partner.benefitsTitle')}
      servicesDesc={t('partner.benefitsDesc')}
      servicesList={servicesList}
      
      // Specializations
      specTitle={t('partner.specTitle')}
      specDesc={t('partner.specDesc')}
      specList={specList}
      
      // CTA
      contactTitle={t('partner.contactTitle')}
      contactDesc={t('partner.contactDesc')}
      contactUsText={t('partner.contactUs')}
      contactUsLink="/#fale-conosco"
      aiAgentText="Dúvida Rápida? Fale com nossa IA"
      aiAgentLink="/chat"
    />
  );
};

export default PartnerGoogleCloud;
