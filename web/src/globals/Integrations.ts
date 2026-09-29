import type { GlobalConfig } from 'payload'

import { isAdmin, isPublic } from '@/access'
import { ehEndpointDeIntegracao, ENDPOINT_PADRAO_ATRAIR } from '@/lib/formatos-de-integracao'

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
      pt: 'Integração com o ATRAIR (recrutamento). Só administradores editam. A chave de API fica no servidor — sem ela, nada sincroniza mesmo ligado aqui.',
      en: 'ATRAIR (recruiting) integration. Admins only. The API key lives on the server — without it nothing syncs, even when enabled here.',
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
  ],
}
