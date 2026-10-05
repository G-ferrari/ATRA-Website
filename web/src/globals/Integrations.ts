import type { GlobalConfig } from 'payload'

import { isAdmin, isPublic } from '@/access'
import {
  CONVERSOES_PADRAO,
  ehEndpointDeIntegracao,
  ehIdentificadorDeConversao,
  ENDPOINT_PADRAO_ATRAIR,
} from '@/lib/formatos-de-integracao'
import { CAMPOS_PERSONALIZADOS } from '@/lib/rd-marketing'

/* As chaves da integração com o ATRAIR (D-41), o sistema de R&S da ATRA.
 *
 * Até aqui quem decidia era o **ambiente**: `ATRAIR_API_URL` + `ATRAIR_API_KEY`
 * preenchidas ligavam a integração, vazias a desligavam, e mudar isso era
 * deploy. Pior: o desligamento era **implícito** — a grade de `/carreiras` caía
 * para a lista do CMS quando a lista do ATRAIR vinha vazia, e "integração
 * desligada", "ATRAIR fora do ar" e "nenhuma vaga aberta de verdade" eram o
 * mesmo estado para o site. Agora são três, e só o terceiro mostra a página
 * vazia. Mesmo precedente da D-40, que tirou os ids de rastreamento do ambiente.
 *
 * ⚠️ Só **admin** edita. O site manda a `ATRAIR_API_KEY` no cabeçalho para o
 * endereço deste campo — trocar o endereço é escolher para quem a chave de
 * servidor é entregue, e isso não é decisão de editor de conteúdo. O editor vê
 * os valores, não muda.
 *
 * ⚠️ **A chave de API continua no ambiente**, de propósito. Endpoint e
 * liga/desliga são configuração; `ATRAIR_API_KEY` é credencial, e credencial em
 * coluna do Postgres entra no backup diário e aparece no admin. As duas chaves
 * abaixo são, portanto, a **segunda** tranca: ligadas sem `ATRAIR_API_KEY` no
 * ambiente, a integração segue inerte. É o que faz esta migração não mudar o
 * que está no ar — daí `defaultValue: true` nas duas.
 *
 * Sem `localized`: endereço e liga/desliga são os mesmos nos dois idiomas, e o
 * site lê o global sem `locale`.
 */

/* Colar do painel costuma trazer espaço nas pontas; aparado antes de validar,
 * o que se grava é o endereço limpo. */
const aparar = ({ value }: { value?: unknown }) => (typeof value === 'string' ? value.trim() : value)

export const Integrations: GlobalConfig = {
  slug: 'integrations',
  label: { pt: 'Integrações', en: 'Integrations' },
  admin: {
    group: { pt: 'Sistema', en: 'System' },
    description: {
      pt: 'Integrações com o ATRAIR (recrutamento) e com o RD Station Marketing (leads). Só administradores editam. As chaves de API ficam no servidor — sem elas, nada sincroniza mesmo ligado aqui.',
      en: 'ATRAIR (recruiting) and RD Station Marketing (leads) integrations. Admins only. The API keys live on the server — without them nothing syncs, even when enabled here.',
    },
  },
  access: { read: isPublic, update: isAdmin },
  fields: [
    {
      name: 'atrair',
      type: 'group',
      label: { pt: 'ATRAIR (recrutamento)', en: 'ATRAIR (recruiting)' },
      fields: [
        {
          /* A chave que a missão pede: liga e desliga o carregamento dinâmico
           * das vagas. Desligada, `/carreiras` lista as vagas da collection
           * `jobs` — que é cadastro completo, com página própria em
           * `/carreiras/[slug]`, e não um espelho do ATRAIR. */
          name: 'jobsFeed',
          type: 'checkbox',
          defaultValue: true,
          label: { pt: 'Carregar vagas do ATRAIR', en: 'Load jobs from ATRAIR' },
          admin: {
            description: {
              pt: 'Ligado: a grade de /carreiras mostra as vagas publicadas no ATRAIR, e cada card leva para a vaga lá. Desligado: mostra as vagas cadastradas em Conteúdo → Vagas, com página própria no site.',
              en: 'On: the /careers grid lists the jobs published in ATRAIR, each card linking to the role there. Off: it lists the jobs registered under Content → Jobs, with their own page on the site.',
            },
          },
        },
        {
          /* Chave separada da de cima por decisão do dono: a ida do currículo e
           * a vinda das vagas quebram por motivos diferentes e se desligam em
           * momentos diferentes. Nada aqui muda o que o candidato vê — a
           * candidatura é gravada no admin antes de qualquer sincronização
           * (D-26), ligada ou desligada. */
          name: 'talentPool',
          type: 'checkbox',
          defaultValue: true,
          label: { pt: 'Enviar currículos para o ATRAIR', en: 'Send CVs to ATRAIR' },
          admin: {
            description: {
              pt: 'Ligado: quem se inscreve no Banco de Talentos é criado no ATRAIR (que deduplica por e-mail). Desligado: a inscrição fica só em Formulários, aqui no admin. Em nenhum dos casos o candidato vê erro.',
              en: 'On: Talent Pool sign-ups are created in ATRAIR (deduplicated by e-mail there). Off: the sign-up stays in Form Submissions here. Either way the candidate never sees an error.',
            },
          },
        },
        {
          name: 'endpoint',
          type: 'text',
          /* ⚠️ **Função, não literal.** `defaultValue: ENDPOINT_PADRAO_ATRAIR`
           * é assado pelo drizzle como `DEFAULT` da coluna, e o valor sai do
           * `ATRAIR_API_URL` de quem *gerou* a migração — o contêiner de dev.
           * A primeira tentativa produziu
           * `"atrair_endpoint" varchar DEFAULT 'http://host.docker.internal:3300'`
           * num arquivo versionado que roda no CI e em produção, congelando o
           * endereço de desenvolvimento como padrão de schema lá. Função o
           * drizzle não consegue assar: ela roda quando o documento nasce, no
           * ambiente certo. */
          defaultValue: () => ENDPOINT_PADRAO_ATRAIR,
          label: { pt: 'Endereço do ATRAIR', en: 'ATRAIR address' },
          admin: {
            placeholder: 'https://atrair.exemplo.com.br',
            description: {
              pt: 'A base da API do ATRAIR, sem a rota — o site acrescenta /api/public/vagas e /api/public/talent-pool. Já vem preenchido com o endereço deste ambiente; edite só se o ATRAIR mudar de endereço. Vazio: as duas chaves acima ficam inertes.',
              en: 'The base of the ATRAIR API, without the route — the site appends /api/public/vagas and /api/public/talent-pool. Pre-filled with this environment’s address; change it only if ATRAIR moves. Empty: both toggles above stay inert.',
            },
          },
          hooks: { beforeValidate: [aparar] },
          validate: (valor: string | null | undefined) =>
            !valor ||
            ehEndpointDeIntegracao(valor) ||
            'Use o endereço completo, com https:// e sem a rota (ex.: https://atrair.exemplo.com.br). http:// só é aceito para o ATRAIR local.',
        },
      ],
    },
    {
      /* D-54 — os leads dos formulários viram conversões no RD Station
       * Marketing. Mesmo arranjo do ATRAIR: liga/desliga e nomes são
       * configuração e moram aqui; `RDSTATION_MARKETING_API_KEY` é credencial
       * e fica no ambiente, como segunda tranca. */
      name: 'rdStationMarketing',
      type: 'group',
      label: { pt: 'RD Station Marketing (leads)', en: 'RD Station Marketing (leads)' },
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          /* `true` por não mudar o que está no ar: sem a chave no ambiente a
           * integração segue inerte, e com a chave é para sincronizar mesmo. */
          defaultValue: true,
          label: { pt: 'Enviar leads para o RD Station Marketing', en: 'Send leads to RD Station Marketing' },
          admin: {
            description: {
              pt: 'Ligado: cada envio de formulário comercial vira uma conversão no RD (precisa da chave de API no servidor). Desligado: o lead fica só em Envios de formulário. Candidaturas e Banco de Talentos nunca vão — são RH.',
              en: 'On: every commercial form submission becomes a conversion in RD (needs the API key on the server). Off: the lead stays in Form submissions only. Job applications and Talent Pool never go — they are HR data.',
            },
          },
        },
        {
          name: 'customFields',
          type: 'checkbox',
          /* ⚠️ Nasce desligado: `cf_` que não existe na conta derruba a
           * conversão inteira em 400. Primeiro se criam os campos no RD. */
          defaultValue: false,
          label: { pt: 'Enviar campos personalizados', en: 'Send custom fields' },
          admin: {
            description: {
              pt: `Só ligue depois de criar na conta do RD os campos personalizados com exatamente estes nomes: ${CAMPOS_PERSONALIZADOS.mensagem} (mensagem do contato), ${CAMPOS_PERSONALIZADOS.chat} (o que perguntou à ATRA AI) e, para o diagnóstico, ${CAMPOS_PERSONALIZADOS.diagnostico.join(', ')}. Campo inexistente faz o RD recusar o lead inteiro — a falha aparece em Envios de formulário.`,
              en: `Only enable after creating custom fields in the RD account with exactly these names: ${CAMPOS_PERSONALIZADOS.mensagem} (contact message), ${CAMPOS_PERSONALIZADOS.chat} (what they asked ATRA AI) and, for the diagnostic, ${CAMPOS_PERSONALIZADOS.diagnostico.join(', ')}. A missing field makes RD reject the whole lead — the failure shows under Form submissions.`,
            },
          },
        },
        {
          /* Um identificador por formulário. É o nome que o marketing vê nos
           * relatórios e usa nas automações — deles, por isso editável aqui.
           * Vazio = aquele formulário não vai ao RD. */
          name: 'conversions',
          type: 'group',
          label: { pt: 'Identificadores de conversão', en: 'Conversion identifiers' },
          admin: {
            description: {
              pt: 'O nome com que cada formulário aparece no RD. Letras, números, ponto, hífen e sublinhado. Vazio: aquele formulário não é enviado.',
              en: 'The name each form shows up with in RD. Letters, digits, dot, hyphen and underscore. Empty: that form is not sent.',
            },
          },
          fields: (
            [
              ['contact', 'Contato', 'Contact'],
              ['chatLead', 'Lead do chat (ATRA AI)', 'Chat lead (ATRA AI)'],
              ['newsletter', 'Newsletter (só confirmada)', 'Newsletter (confirmed only)'],
              ['materialDownload', 'Download de material', 'Material download'],
              ['consultantRequest', 'Solicitação de consultores', 'Consultant request'],
              ['dataMaturityDiagnostic', 'Diagnóstico de maturidade de dados', 'Data maturity diagnostic'],
            ] as const
          ).map(([name, pt, en]) => ({
            name,
            type: 'text' as const,
            defaultValue: CONVERSOES_PADRAO[name],
            label: { pt, en },
            hooks: { beforeValidate: [aparar] },
            validate: (valor: string | null | undefined) =>
              !valor ||
              ehIdentificadorDeConversao(valor) ||
              'Use letras, números, ponto, hífen ou sublinhado, sem espaço (ex.: site-contato).',
          })),
        },
      ],
    },
  ],
}
