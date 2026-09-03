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
      /* ⚠️ Localizado: o prompt manda o modelo responder num idioma, e o site
       * atende em dois. Ficou **sem** `localized` desde MIG-061, e o efeito era
       * pior do que parece — o seed grava `pt` e depois `en` na mesma coluna, e
       * o inglês vencia. O visitante brasileiro que batia no limite lia a
       * mensagem em inglês. */
      localized: true,
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
      /* Teto **global** por dia, e não por visitante (MIG-110).
       *
       * ⚠️ São dois limites com propósitos diferentes, e um não substitui o
       * outro. `requestsPerHour` protege contra um visitante em laço; este
       * protege o orçamento: cada conversa gasta cota do Gemini, e 500 pessoas
       * educadas fazendo 1 pergunta cada custam o mesmo que uma abusando 500
       * vezes. Sem ele, o teto de gasto do dia é "quantas pessoas visitarem".
       *
       * ⚠️ `0` desliga o teto. O valor de partida é provisório, como o de
       * `requestsPerHour` — o número certo depende de P-04, que é quanto a ATRA
       * aceita gastar por mês.
       */
      name: 'dailyRequestCap',
      type: 'number',
      defaultValue: 500,
      min: 0,
      label: { pt: 'Teto de conversas por dia (todos os visitantes)', en: 'Daily conversation cap (all visitors)' },
      admin: {
        description: {
          pt: 'Atingido o teto, a IA responde a mensagem de indisponibilidade até o dia seguinte. 0 desliga.',
          en: 'Once reached, the assistant replies with the unavailable message until the next day. 0 disables it.',
        },
      },
    },
    {
      name: 'unavailableMessage',
      type: 'textarea',
      required: true,
      /* Localizado pelo mesmo motivo do prompt: é texto que o visitante lê. */
      localized: true,
      label: { pt: 'Mensagem de indisponibilidade', en: 'Unavailable message' },
      admin: {
        description: {
          pt: 'Mostrada quando o limite é atingido ou a IA está desligada. Degradação graciosa, não erro.',
          en: 'Shown when the limit is hit or the AI is off. Graceful degradation, not an error.',
        },
      },
    },
    {
      /* MIG-149 (D-29) — o convite de lead dentro do chat.
       *
       * ⚠️ São **três chaves independentes**, de propósito: `ENABLE_CHAT_LEAD`
       * (env, engenharia) põe o código no ar; este `enabled` (editorial) liga o
       * convite; e o convite só renderiza com `consentNotice` preenchido no
       * idioma — consentimento é gate de código, não combinado (P-14). O campo
       * nasce vazio porque o texto é jurídico e é da ATRA, não nosso.
       *
       * ⚠️ Nenhum campo de texto visível fica sem `localized` — a lição de
       * MIG-061 está no `systemPrompt` acima. */
      name: 'leadCapture',
      type: 'group',
      label: { pt: 'Convite de lead no chat', en: 'Chat lead capture' },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
          label: { pt: 'Convite ligado', en: 'Invite enabled' },
          admin: {
            description: {
              pt: 'Mostra o convite para deixar contato durante a conversa. Também exige o aviso de consentimento preenchido abaixo.',
              en: 'Shows the invite to leave contact details during the conversation. Also requires the consent notice below.',
            },
          },
        },
        {
          name: 'inviteAfterUserMessages',
          type: 'number',
          required: true,
          defaultValue: 2,
          min: 1,
          label: { pt: 'Convidar após quantas mensagens do visitante', en: 'Invite after how many visitor messages' },
        },
        {
          name: 'inviteTitle',
          type: 'text',
          localized: true,
          label: { pt: 'Título do convite', en: 'Invite title' },
        },
        {
          name: 'inviteMessage',
          type: 'textarea',
          localized: true,
          label: { pt: 'Texto do convite', en: 'Invite message' },
        },
        {
          name: 'consentNotice',
          type: 'textarea',
          localized: true,
          label: { pt: 'Aviso de consentimento', en: 'Consent notice' },
          admin: {
            description: {
              pt: 'Obrigatório para o convite aparecer: diz ao visitante o que acontece com o dado (vai ao RD Station CRM). Vazio = convite desligado neste idioma. O texto é decisão da ATRA (P-14).',
              en: 'Required for the invite to show: tells the visitor what happens to the data (it goes to RD Station CRM). Empty = invite off in this locale. The wording is ATRA’s call (P-14).',
            },
          },
        },
        {
          name: 'successMessage',
          type: 'textarea',
          localized: true,
          label: { pt: 'Mensagem de sucesso', en: 'Success message' },
        },
      ],
    },
  ],
}
