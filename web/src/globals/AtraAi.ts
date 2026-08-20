import type { GlobalConfig } from 'payload'

/* Configuração da ATRA AI (D-12).
 *
 * ⚠️ O system prompt **sai do código** e vira campo editável. No legado ele é
 * uma constante de 30 linhas dentro de `server.ts:6`, e mudá-lo exige deploy —
 * num texto que é decisão de marketing e vendas, não de engenharia (D-22).
 *
 * ⚠️ Os **números** do rate limit são provisórios. D-12 decidiu limite por IP
 * mais teto de custo com degradação graciosa, e disse que os valores concretos
 * (requisições por IP/hora e teto em R$) dependem de **P-04**, que segue em
 * aberto. Os padrões daqui são conservadores de propósito: erram para o lado de
 * gastar menos, e ficam editáveis para não precisar de deploy quando a ATRA
 * responder. */
export const AtraAi: GlobalConfig = {
  slug: 'atra-ai',
  label: { pt: 'ATRA AI', en: 'ATRA AI' },
  admin: { group: { pt: 'Configuração', en: 'Settings' } },
  access: { read: () => true },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      label: { pt: 'Chat ligado', en: 'Chat enabled' },
      admin: {
        description: {
          pt: 'Desligado, a página continua no ar e responde que o serviço está indisponível.',
          en: 'When off, the page stays up and answers that the service is unavailable.',
        },
      },
    },
    {
      name: 'systemPrompt',
      type: 'textarea',
      required: true,
      label: { pt: 'Instrução do sistema', en: 'System prompt' },
      admin: {
        description: {
          pt: 'Quem a IA é, o que sabe da ATRA e como deve conduzir a conversa.',
          en: 'Who the AI is, what it knows about ATRA and how it should steer the conversation.',
        },
      },
    },
    {
      name: 'requestsPerHour',
      type: 'number',
      required: true,
      defaultValue: 20,
      min: 1,
      label: { pt: 'Requisições por IP por hora', en: 'Requests per IP per hour' },
      admin: { description: { pt: 'Provisório até P-04.', en: 'Provisional until P-04.' } },
    },
    {
      name: 'unavailableMessage',
      type: 'textarea',
      required: true,
      label: { pt: 'Mensagem de indisponibilidade', en: 'Unavailable message' },
      admin: {
        description: {
          pt: 'Mostrada quando o limite é atingido ou a IA está desligada. Degradação graciosa, não erro.',
          en: 'Shown when the limit is hit or the AI is off. Graceful degradation, not an error.',
        },
      },
    },
  ],
}
