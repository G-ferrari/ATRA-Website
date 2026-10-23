import type { GlobalConfig } from 'payload'

import { isEditorOrAdmin, isPublic } from '@/access'

/* Aparência do site (#215, D-65): o peso dos títulos, escolhido pelo marketing.
 *
 * Um controle só, para o site inteiro — decisão de 20/10. Vale para todo título
 * do tamanho de cartão para cima; os títulos pequenos (nome de autor, título de
 * item de menu, rótulo em caixa-alta) têm peso próprio no código e não mudam.
 * O tamanho da letra fica no código, pela escala da #215: aqui só o peso.
 *
 * O padrão é **Fino**, o desenho que estava no ar (a "Regra do Título Leve" do
 * DESIGN.md): quem não mexer aqui não vê diferença nos títulos. */
export const Appearance: GlobalConfig = {
  slug: 'appearance',
  label: { pt: 'Aparência do site', en: 'Site appearance' },
  admin: {
    group: { pt: 'Configuração', en: 'Settings' },
    description: {
      pt: 'Ajustes visuais que valem para o site inteiro. Mudar aqui muda todas as páginas ao salvar.',
      en: 'Visual settings for the whole site. Saving here changes every page.',
    },
  },
  access: { read: isPublic, update: isEditorOrAdmin },
  fields: [
    {
      name: 'headingWeight',
      type: 'radio',
      required: true,
      defaultValue: 'light',
      options: [
        { value: 'bold', label: { pt: 'Negrito', en: 'Bold' } },
        { value: 'normal', label: { pt: 'Normal', en: 'Normal' } },
        { value: 'light', label: { pt: 'Fino', en: 'Light' } },
      ],
      label: { pt: 'Peso dos títulos', en: 'Heading weight' },
      admin: {
        layout: 'horizontal',
        description: {
          pt: 'Vale para os títulos de página, de seção e de cartão, no site inteiro. Fino é o desenho original. Títulos pequenos, como nome de autor e rótulos em caixa-alta, têm peso próprio e não mudam.',
          en: 'Applies to page, section and card headings across the site. Light is the original design. Small headings, such as author names and uppercase labels, keep their own weight.',
        },
      },
    },
  ],
}
