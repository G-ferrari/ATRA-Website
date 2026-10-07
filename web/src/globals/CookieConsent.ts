import type { GlobalConfig } from 'payload'

/* Textos do aviso de cookies (MIG-151, D-30).
 *
 * ⚠️ `bannerMessage` é o **gate de código** — mesmo padrão do `consentNotice`
 * da ATRA AI (D-29): nasce vazio porque é texto jurídico e texto jurídico é da
 * ATRA (P-14), e sem ele o mapper devolve `null` e o banner não renderiza.
 * É o que mantém o gabarito do aceite visual válido: o ambiente do gate nunca
 * tem o texto, então nenhuma das 13 rotas ganha um elemento novo.
 *
 * ⚠️ Todo campo visível é `localized` — a lição de MIG-061 está documentada no
 * `systemPrompt` de `AtraAi.ts`: campo sem `localized` num global gravado em
 * dois idiomas sai no idioma errado, sem erro nenhum.
 *
 * Os rótulos de botão e as descrições de categoria têm reserva em código no
 * mapper (`lib/mappers/cookie-consent.ts`): são cromo de interface e descrição
 * técnica factual, não promessa jurídica — editáveis aqui quando o marketing
 * quiser (D-22). */
export const CookieConsent: GlobalConfig = {
  slug: 'cookie-consent',
  label: { pt: 'Aviso de cookies', en: 'Cookie consent' },
  admin: { group: { pt: 'Configuração', en: 'Settings' } },
  access: { read: () => true },
  fields: [
    {
      name: 'bannerTitle',
      type: 'text',
      localized: true,
      label: { pt: 'Título do banner', en: 'Banner title' },
    },
    {
      name: 'bannerMessage',
      type: 'textarea',
      localized: true,
      label: { pt: 'Mensagem do banner', en: 'Banner message' },
      admin: {
        description: {
          pt: 'Obrigatória para o banner existir: vazio = banner desligado neste idioma. O texto é decisão da ATRA (P-14) e deve dizer o que cada categoria captura.',
          en: 'Required for the banner to exist: empty = banner off in this locale. The wording is ATRA’s call (P-14) and should say what each category captures.',
        },
      },
    },
    { name: 'acceptLabel', type: 'text', localized: true, label: { pt: 'Botão aceitar', en: 'Accept button' } },
    { name: 'rejectLabel', type: 'text', localized: true, label: { pt: 'Botão recusar', en: 'Reject button' } },
    {
      name: 'preferencesLabel',
      type: 'text',
      localized: true,
      label: { pt: 'Link de preferências', en: 'Preferences link' },
    },
    { name: 'saveLabel', type: 'text', localized: true, label: { pt: 'Botão salvar', en: 'Save button' } },
    { name: 'panelTitle', type: 'text', localized: true, label: { pt: 'Título do painel', en: 'Panel title' } },
    {
      name: 'panelMessage',
      type: 'textarea',
      localized: true,
      label: { pt: 'Mensagem do painel', en: 'Panel message' },
    },
    {
      name: 'necessary',
      type: 'group',
      label: { pt: 'Categoria: essenciais', en: 'Category: necessary' },
      fields: [
        { name: 'name', type: 'text', localized: true, label: { pt: 'Nome', en: 'Name' } },
        { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      label: { pt: 'Categoria: estatística', en: 'Category: analytics' },
      fields: [
        { name: 'name', type: 'text', localized: true, label: { pt: 'Nome', en: 'Name' } },
        { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
      ],
    },
    {
      name: 'marketing',
      type: 'group',
      label: { pt: 'Categoria: marketing', en: 'Category: marketing' },
      /* D-40: a descrição precisa citar a Lusha. É ela que o visitante lê
         antes de aceitar, e a Lusha carrega sob esta categoria. D-54: idem
         para o monitoramento do RD Station Marketing. */
      admin: {
        description: {
          pt: 'Esta categoria libera a captura de UTM, a Lusha, que identifica a empresa de onde vem a visita, e o monitoramento do RD Station Marketing (Sistema → Rastreamento). A descrição deve citar os três.',
          en: 'This category enables UTM capture, Lusha, which identifies the company a visit comes from, and RD Station Marketing tracking (System → Tracking). The description should mention all three.',
        },
      },
      fields: [
        { name: 'name', type: 'text', localized: true, label: { pt: 'Nome', en: 'Name' } },
        { name: 'description', type: 'textarea', localized: true, label: { pt: 'Descrição', en: 'Description' } },
      ],
    },
  ],
}
