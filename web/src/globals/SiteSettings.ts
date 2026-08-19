import type { GlobalConfig } from 'payload'

import { isAdminFieldLevel, isEditorOrAdmin, isPublic } from '@/access'
import { campoDeIcone } from '@/blocks/shared'

/* Dados institucionais reutilizados por vários blocos (MIG-048).
 *
 * ⚠️ Criado aqui porque **nenhuma task do plano criava os globals** — MIG-072
 * os semeia e MIG-072a consome o `navigation`, mas nada os definia. É o segundo
 * caso do mesmo buraco (o primeiro foi a casca do site, MIG-034): existem
 * tasks de "semear X" sem a de "criar X". Registrado em tasks.md.
 *
 * ⚠️ Os números **estão em disputa** (P-01): `/sobre` diz 140+ profissionais,
 * 30+ clientes e 4x GPTW; a home diz 150+, 20+ e 5x. Aqui ficam os de `/sobre`,
 * que é a página que o gate compara. Quando P-01 for respondida, muda num lugar
 * só — que é metade do motivo de isto ser um global. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: { pt: 'Dados institucionais', en: 'Site settings' },
  admin: {
    group: { pt: 'Sistema', en: 'System' },
    description: {
      pt: 'Números e selos usados em várias páginas. Mudar aqui muda em todas.',
      en: 'Figures and seals used across pages. Changing here changes everywhere.',
    },
  },
  access: { read: isPublic, update: isEditorOrAdmin },
  fields: [
    {
      name: 'metrics',
      type: 'array',
      maxRows: 6,
      label: { pt: 'Números institucionais', en: 'Institutional figures' },
      admin: {
        description: {
          pt: 'Aparecem na home e em /sobre. O mesmo número, no site inteiro.',
          en: 'Shown on the home page and /sobre. One figure, whole site.',
        },
      },
      fields: [
        { name: 'value', type: 'number', required: true, label: { pt: 'Número', en: 'Value' } },
        {
          name: 'suffix',
          type: 'text',
          label: { pt: 'Sufixo', en: 'Suffix' },
          admin: { description: { pt: 'Ex.: “+” ou “x”. Vazio para nenhum.', en: 'E.g. “+” or “x”. Empty for none.' } },
        },
        { name: 'label', type: 'text', required: true, localized: true, label: { pt: 'Rótulo', en: 'Label' } },
        /* Ícone é opcional aqui: no legado os números de /sobre não têm ícone
         * (`About.tsx:134`) e os da home têm. O bloco decide se desenha. */
        { ...campoDeIcone, required: false } as typeof campoDeIcone,
      ],
    },
    {
      name: 'seals',
      type: 'array',
      label: { pt: 'Selos e certificações', en: 'Seals and certifications' },
      fields: [
        { name: 'name', type: 'text', required: true, label: { pt: 'Nome', en: 'Name' } },
        { name: 'image', type: 'upload', relationTo: 'media', required: true, label: { pt: 'Imagem', en: 'Image' } },
      ],
    },
    {
      /* Só admin: mexer aqui muda o rodapé e os CTAs de todas as páginas. */
      name: 'foundedYear',
      type: 'number',
      label: { pt: 'Ano de fundação', en: 'Founded in' },
      access: { update: isAdminFieldLevel },
      admin: { position: 'sidebar' },
    },
  ],
}
