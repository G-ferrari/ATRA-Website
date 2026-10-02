import type { Field, GlobalConfig } from 'payload'

import { isEditorOrAdmin, isPublic } from '@/access'
import { campoDeIcone } from '@/blocks/shared'

/* Camada de conversão do menu de Soluções (D-51): o painel fixo à direita do
 * mega-menu, presente nas três abas — "Por onde começar?", o botão de falar com
 * um especialista, a prova social em uma linha e o case rotativo da aba.
 *
 * ⚠️ **Global próprio, e não campos em `navigation`**, de propósito. A migração
 * de dados de 01/10 lê o global `navigation` com o config de hoje, e em banco
 * novo ela roda antes de a coluna nova existir — a armadilha do CLAUDE.md, já
 * paga duas vezes. Global novo só cria tabela nova, que nenhuma migração antiga
 * consulta.
 *
 * ⚠️ **Sem título, o painel não é desenhado** e o menu sai como era. É o mesmo
 * desenho do aviso de cookies: o código pode ir ao ar antes do conteúdo.
 *
 * Os números da prova social são texto livre, e não os de "Configurações do
 * site": aqui entram rótulos que não são métrica ("Parceira Google Cloud") e
 * selos que lá são imagem (LIPT). Mudou um número lá, confira aqui. */

const cases = (name: string, pt: string, en: string): Field => ({
  name,
  type: 'relationship',
  relationTo: 'cases',
  hasMany: true,
  maxRows: 3,
  label: { pt, en },
})

export const ConversionPanel: GlobalConfig = {
  slug: 'conversion-panel',
  label: { pt: 'Painel do menu de Soluções', en: 'Solutions menu panel' },
  admin: {
    group: { pt: 'Sistema', en: 'System' },
    description: {
      pt: 'O painel fixo à direita do menu de Soluções: caminhos, botão, números e o case de cada aba. Aparece só em telas largas.',
      en: 'The fixed panel on the right of the Solutions menu: paths, button, figures and each tab’s case. Wide screens only.',
    },
  },
  access: { read: isPublic, update: isEditorOrAdmin },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: { pt: 'Título', en: 'Title' },
      admin: {
        description: {
          pt: 'Ex.: “Por onde começar?”. Vazio: o painel não aparece no menu.',
          en: 'E.g. “Where to start?”. Empty: the panel is not shown.',
        },
      },
    },
    { name: 'intro', type: 'textarea', localized: true, label: { pt: 'Texto de abertura', en: 'Intro text' } },
    {
      name: 'paths',
      type: 'array',
      /* Três, como as abas: o painel tem altura fixa e o quarto empurraria o
       * case para fora da tela num notebook. */
      maxRows: 3,
      label: { pt: 'Caminhos', en: 'Paths' },
      fields: [
        { ...campoDeIcone },
        { name: 'title', type: 'text', required: true, localized: true, label: { pt: 'Título', en: 'Title' } },
        { name: 'description', type: 'text', localized: true, label: { pt: 'Descrição', en: 'Description' } },
        {
          name: 'href',
          type: 'text',
          required: true,
          defaultValue: '/diagnostico-maturidade',
          label: { pt: 'Destino', en: 'Target' },
          admin: {
            description: {
              pt: 'Endereço dentro do site, começando com “/”. Os três caminhos levam ao diagnóstico.',
              en: 'In-site address, starting with “/”. The three paths lead to the assessment.',
            },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'ctaLabel', type: 'text', localized: true, label: { pt: 'Texto do botão', en: 'Button label' } },
        {
          name: 'ctaHref',
          type: 'text',
          defaultValue: '/contato',
          label: { pt: 'Destino do botão', en: 'Button target' },
        },
      ],
    },
    {
      name: 'proof',
      type: 'array',
      maxRows: 5,
      label: { pt: 'Prova social', en: 'Social proof' },
      admin: {
        description: {
          pt: 'Uma linha só: “140+ especialistas · 15+ anos · …”. Cinco itens curtos é o que cabe.',
          en: 'One line only: “140+ specialists · 15+ years · …”. Five short items is what fits.',
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', required: true, localized: true, label: { pt: 'Destaque', en: 'Highlight' } },
            { name: 'label', type: 'text', localized: true, label: { pt: 'Rótulo', en: 'Label' } },
          ],
        },
      ],
    },
    {
      name: 'cases',
      type: 'group',
      label: { pt: 'Cases de cada aba', en: 'Cases per tab' },
      admin: {
        description: {
          pt: 'Até 3 por aba; com mais de um, eles se alternam. Aba sem case escolhido mostra os mais recentes.',
          en: 'Up to 3 per tab; with more than one, they rotate. A tab with none shows the latest ones.',
        },
      },
      fields: [
        cases('innovationAi', 'Inovação & IA', 'Innovation & AI'),
        cases('dataBi', 'Dados, BI & Advanced Analytics', 'Data, BI & Advanced Analytics'),
        cases('governanceCulture', 'Governança & Cultura', 'Governance & Culture'),
      ],
    },
  ],
}
