import type { CollectionConfig } from 'payload'

import { isEditorOrAdmin, isPublic } from '@/access'
import { campoDeIcone } from '@/blocks/shared'

/* Perfis de consultores (MIG-052).
 *
 * O catálogo de /consultores filtra por especialidade (as `tags`) e por
 * senioridade (`level`). Collection e não bloco: são 8 perfis que mudam com o
 * time, item a item, sem passar por dev. */
export const SpecialistRoles: CollectionConfig = {
  slug: 'specialist-roles',
  admin: {
    useAsTitle: 'role',
    defaultColumns: ['role', 'level', 'code', 'updatedAt'],
    listSearchableFields: ['role', 'description'],
    group: { pt: 'Catálogos', en: 'Catalogs' },
    description: {
      pt: 'Perfis de consultores exibidos em /consultores.',
      en: 'Consultant profiles shown on /consultores.',
    },
  },
  labels: { singular: { pt: 'Perfil', en: 'Role' }, plural: { pt: 'Perfis de consultores', en: 'Specialist roles' } },
  access: { read: isPublic, create: isEditorOrAdmin, update: isEditorOrAdmin, delete: isEditorOrAdmin },
  defaultSort: 'order',
  fields: [
    { name: 'role', type: 'text', required: true, localized: true, label: { pt: 'Cargo', en: 'Role' } },
    {
      name: 'code',
      type: 'text',
      required: true,
      label: { pt: 'Sigla', en: 'Code' },
      admin: { description: { pt: 'Duas ou três letras, no selo do card. Ex.: DE, MLE.', en: 'Two or three letters, on the card badge.' } },
    },
    {
      name: 'level',
      type: 'select',
      required: true,
      options: [
        { value: 'Senior', label: { pt: 'Senior', en: 'Senior' } },
        { value: 'Pleno', label: { pt: 'Pleno', en: 'Mid' } },
        { value: 'Lead / Principal', label: { pt: 'Lead / Principal', en: 'Lead / Principal' } },
      ],
      label: { pt: 'Senioridade', en: 'Seniority' },
    },
    { ...campoDeIcone },
    {
      /* Gradiente do selo, por perfil. `select` e não texto: o valor vira
       * classe Tailwind, e classe dinâmica (`bg-${x}`) o Tailwind não enxerga —
       * cada opção precisa existir como string literal no código do card. */
      name: 'gradient',
      type: 'select',
      required: true,
      defaultValue: 'blue-cyan',
      options: [
        { value: 'blue-cyan', label: { pt: 'Azul → Ciano', en: 'Blue → Cyan' } },
        { value: 'cyan-teal', label: { pt: 'Ciano → Verde-água', en: 'Cyan → Teal' } },
        { value: 'indigo-blue', label: { pt: 'Índigo → Azul', en: 'Indigo → Blue' } },
        { value: 'sky-indigo', label: { pt: 'Céu → Índigo', en: 'Sky → Indigo' } },
        { value: 'purple-indigo', label: { pt: 'Roxo → Índigo', en: 'Purple → Indigo' } },
        { value: 'emerald-teal', label: { pt: 'Esmeralda → Verde-água', en: 'Emerald → Teal' } },
        { value: 'amber-orange', label: { pt: 'Âmbar → Laranja', en: 'Amber → Orange' } },
        { value: 'blue-teal', label: { pt: 'Azul → Verde-água', en: 'Blue → Teal' } },
      ],
      label: { pt: 'Cor do selo', en: 'Badge colour' },
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      label: { pt: 'Descrição', en: 'Description' },
    },
    {
      name: 'tags',
      type: 'array',
      required: true,
      minRows: 1,
      label: { pt: 'Especialidades', en: 'Specialties' },
      admin: { description: { pt: 'Tecnologias e temas. Também alimentam o filtro da página.', en: 'Technologies and topics. Also feed the page filter.' } },
      fields: [{ name: 'name', type: 'text', required: true, label: { pt: 'Especialidade', en: 'Specialty' } }],
    },
    {
      type: 'row',
      fields: [
        { name: 'allocatedProjects', type: 'number', label: { pt: 'Projetos alocados', en: 'Allocated projects' } },
        { name: 'allocatedPartners', type: 'number', label: { pt: 'Parceiros', en: 'Partners' } },
        { name: 'totalTeamSize', type: 'number', label: { pt: 'Tamanho do time', en: 'Team size' } },
      ],
    },
    {
      name: 'certifications',
      type: 'array',
      localized: true,
      label: { pt: 'Certificações', en: 'Certifications' },
      fields: [{ name: 'name', type: 'text', required: true, label: { pt: 'Certificação', en: 'Certification' } }],
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: { pt: 'Ordem', en: 'Order' },
      admin: { position: 'sidebar' },
    },
  ],
}
