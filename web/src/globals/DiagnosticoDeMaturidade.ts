import type { GlobalConfig } from 'payload'

/* Textos e links do Diagnóstico de Maturidade de Dados (D-35, task 023).
 *
 * O questionário (perguntas, notas, ofertas) é a base versionada do Roger e mora
 * em código (`lib/diagnostico-maturidade`); o que fica aqui é o que o marketing
 * troca sem deploy: a chamada da página, a conclusão, o e-mail e os links de
 * contato (D-22).
 *
 * ⚠️ Texto é `localized` — a lição de MIG-061, documentada no `systemPrompt` de
 * `AtraAi.ts`. A rota EN serve o conteúdo em português por decisão da feature,
 * e com `fallback: true` o inglês vazio lê o português: ninguém precisa
 * preencher o EN para a página funcionar. Por isso também nenhum texto é
 * `required` — obrigatório localizado recusaria salvar o EN em branco.
 *
 * Os links **não** são localizados: são os mesmos nos dois idiomas, e um campo
 * localizado criaria a chance de o inglês apontar para outra agenda (o mesmo
 * argumento de `Contact.ts`). */

/* Os padrões moram aqui, e o mapper (`lib/mappers/diagnostico.ts`) usa os
 * mesmos como reserva quando o editor esvazia um campo que não pode faltar.
 *
 * `titulo`, `abertura` e `conclusao` são do HTML do Roger (v1.7) caractere a
 * caractere — tela de perfil e `#aq-done-msg`.
 *
 * ⚠️ `assuntoDoEmail` e `aberturaDoEmail` são **provisórios**: o HTML não manda
 * e-mail nenhum (o resultado ia para o RD Station), então não há texto de origem.
 * São um padrão sóbrio escrito pela engenharia para o fluxo não sair sem
 * assunto; o texto final é decisão do marketing (D-22).
 *
 * `whatsapp` é o mesmo "Falar com especialista" da página RC 18
 * (`scripts/seed/solucoes-rc18.ts`). Agenda não tem padrão: vazio = sem botão. */
export const PADRAO_DO_DIAGNOSTICO = {
  titulo:
    'Em 5 minutos, descubra onde sua empresa está na jornada de dados e nos reguladores de 2026-2027.',
  abertura:
    'Três informações nos ajudam a mostrar apenas as perguntas relevantes para o seu setor e regulação.',
  conclusao:
    'Em breve você recebe por e-mail a leitura completa. Se preferir, um especialista da ATRA pode comentar os resultados com você agora.',
  assuntoDoEmail: 'Seu Diagnóstico de Maturidade de Dados — ATRA',
  aberturaDoEmail:
    'Obrigado por responder ao Diagnóstico de Maturidade de Dados da ATRA. Abaixo está a leitura das suas respostas: o nível de maturidade, os pilares que pedem mais atenção e um roteiro de próximos passos.',
  whatsapp:
    'https://api.whatsapp.com/send/?phone=5511963060267&text=Oi+Fabio+vamos+agendar+um+papo&type=phone_number&app_absent=0',
} as const

/* Link colado sem protocolo ("calendly.com/atra") vira caminho relativo no site
 * e botão quebrado no e-mail. Recusar no admin avisa quem colou; o mapper
 * descarta o que escapar (e qualquer `javascript:`). */
const exigirHttp = (valor: string | null | undefined): string | true =>
  !valor?.trim() || /^https?:\/\//i.test(valor.trim()) || 'Use o endereço completo, começando com https://'

export const DiagnosticoDeMaturidade: GlobalConfig = {
  slug: 'data-maturity-diagnostic',
  label: { pt: 'Diagnóstico de maturidade', en: 'Data maturity diagnostic' },
  admin: { group: { pt: 'Configuração', en: 'Settings' } },
  access: { read: () => true },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      defaultValue: PADRAO_DO_DIAGNOSTICO.titulo,
      label: { pt: 'Título da página', en: 'Page title' },
    },
    {
      name: 'intro',
      type: 'textarea',
      localized: true,
      defaultValue: PADRAO_DO_DIAGNOSTICO.abertura,
      label: { pt: 'Texto de abertura', en: 'Intro' },
      admin: {
        description: {
          pt: 'Logo abaixo do título, na tela de perfil. Vazio = sem parágrafo.',
          en: 'Right below the title, on the profile screen. Empty = no paragraph.',
        },
      },
    },
    {
      name: 'doneMessage',
      type: 'textarea',
      localized: true,
      defaultValue: PADRAO_DO_DIAGNOSTICO.conclusao,
      label: { pt: 'Texto da conclusão', en: 'Completion message' },
      admin: {
        description: {
          pt: 'Mostrado depois do envio, junto da confirmação do e-mail de destino. Vazio = sem parágrafo.',
          en: 'Shown after submitting, next to the destination e-mail confirmation. Empty = no paragraph.',
        },
      },
    },
    {
      name: 'emailSubject',
      type: 'text',
      localized: true,
      defaultValue: PADRAO_DO_DIAGNOSTICO.assuntoDoEmail,
      label: { pt: 'Assunto do e-mail do resultado', en: 'Result e-mail subject' },
    },
    {
      name: 'emailIntro',
      type: 'textarea',
      localized: true,
      defaultValue: PADRAO_DO_DIAGNOSTICO.aberturaDoEmail,
      label: { pt: 'Abertura do e-mail do resultado', en: 'Result e-mail intro' },
      admin: {
        description: {
          pt: 'Primeiro parágrafo do e-mail, antes do resultado. Vazio = o e-mail começa direto pelo resultado.',
          en: 'First paragraph of the e-mail, before the result. Empty = the e-mail starts with the result.',
        },
      },
    },
    {
      name: 'agendaUrl',
      type: 'text',
      validate: exigirHttp,
      label: { pt: 'Link da agenda', en: 'Scheduling link' },
      admin: {
        description: {
          pt: 'Opcional. Com link, a conclusão e o e-mail ganham o botão "Agendar conversa"; vazio = sem botão.',
          en: 'Optional. With a link, the completion screen and the e-mail get a "Schedule a call" button; empty = no button.',
        },
      },
    },
    {
      name: 'whatsappUrl',
      type: 'text',
      defaultValue: PADRAO_DO_DIAGNOSTICO.whatsapp,
      validate: exigirHttp,
      label: { pt: 'Link do WhatsApp', en: 'WhatsApp link' },
      admin: {
        description: {
          pt: 'O botão "Falar no WhatsApp" da página, da conclusão e do e-mail. Vazio volta ao link padrão: é o contato que sobra quando o e-mail não chega.',
          en: 'The "Chat on WhatsApp" button on the page, the completion screen and the e-mail. Empty falls back to the default link: it is the way out when the e-mail does not arrive.',
        },
      },
    },
  ],
}
