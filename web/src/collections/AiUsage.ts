import type { CollectionConfig } from 'payload'

import { isAdmin, isEditorOrAdmin } from '@/access'

/* Consumo diário da ATRA AI (MIG-110).
 *
 * ⚠️ Uma linha por dia, e **no banco**, não em memória. O limite por IP de
 * MIG-061 pode viver em memória: ele protege contra um visitante em laço, e
 * perder a contagem num reinício custa alguns pedidos. Este aqui protege
 * **dinheiro** — cada chamada gasta cota do Gemini — e um contador que zera a
 * cada deploy não protege nada: bastaria reiniciar para o teto sumir.
 *
 * ⚠️ Só leitura no admin: o número é medição, não configuração. O teto se
 * ajusta no global `atra-ai`; mexer no contador seria falsificar o consumo.
 */
export const AiUsage: CollectionConfig = {
  slug: 'ai-usage',
  admin: {
    useAsTitle: 'day',
    defaultColumns: ['day', 'requests'],
    group: { pt: 'Sistema', en: 'System' },
    description: {
      pt: 'Quantas conversas a ATRA AI atendeu por dia. Só leitura — o teto fica em “IA da ATRA”.',
      en: 'How many conversations ATRA AI served per day. Read-only — the cap lives in “ATRA AI”.',
    },
  },
  labels: { singular: { pt: 'Consumo diário', en: 'Daily usage' }, plural: { pt: 'Consumo da IA', en: 'AI usage' } },
  access: {
    read: isEditorOrAdmin,
    /* Escrita só pela rota, que roda com `overrideAccess`. Ninguém cria nem
     * edita pelo admin — seria reescrever a conta do próprio consumo. */
    create: () => false,
    update: () => false,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'day',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: { pt: 'Dia (AAAA-MM-DD)', en: 'Day (YYYY-MM-DD)' },
      admin: { readOnly: true },
    },
    {
      name: 'requests',
      type: 'number',
      required: true,
      defaultValue: 0,
      label: { pt: 'Conversas atendidas', en: 'Conversations served' },
      admin: { readOnly: true },
    },
  ],
}
