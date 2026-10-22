import type { UIFieldServerComponent } from 'payload'
import { formatAdminURL } from 'payload/shared'

import { identificadoresRepetidos } from '@/lib/formularios-do-admin'
import { toFormularioNoRd } from '@/lib/mappers/form'
import { toIntegracaoRd } from '@/lib/mappers/integracao'
import type { IntegracaoRd } from '@/types/content'

import estilos from './formularios-no-rd.module.css'

/* "Formulários do admin", em Sistema → Integrações → RD (task 052): cada
 * formulário de Conteúdo → Formulários com o identificador e as tags com que
 * vai ao RD, para o marketing conferir num lugar só tudo o que chega lá.
 *
 * Componente de **servidor**, como a situação da chave ao lado: lê os
 * formulários pela Local API na renderização e manda ao navegador só a tabela
 * pronta. Lê só nome, situação e o grupo do RD (`select`) — nada dos envios,
 * nem os endereços do aviso —, com o acesso de quem está vendo.
 *
 * Do formulário publicado, valem os valores **publicados**, que são os que o
 * envio usa (050); um rascunho salvo por cima não aparece aqui. Do que nunca
 * foi publicado, a última versão: salvar rascunho não toca a tabela principal,
 * e ela mostraria o nome e o identificador do primeiro salvamento.
 *
 * Só leitura, de propósito: identificador e tags se editam no formulário. */

const TEXTOS = {
  pt: {
    titulo: 'Formulários do admin',
    explicacao:
      'Os formulários de Conteúdo → Formulários vão ao RD com o identificador e as tags do próprio cadastro, e não com os desta página. Para mudar, abra o formulário.',
    desligada: 'A integração está desligada: nenhum formulário vai ao RD agora.',
    vazio: 'Nenhum formulário criado ainda.',
    criar: 'Criar formulário',
    formulario: 'Formulário',
    situacao: 'Situação',
    identificador: 'Identificador no RD',
    tags: 'Tags',
    publicado: 'Publicado',
    rascunho: 'Rascunho',
    rascunhoDica: 'Não está no site: não recebe envios.',
    naoVai: 'Não vai ao RD',
    naoVaiDica: 'Sem identificador de conversão (aba RD Station do formulário).',
    repetido: 'Mesmo identificador de:',
    semTags: 'sem tags',
  },
  en: {
    titulo: 'Admin forms',
    explicacao:
      'The forms in Content → Forms reach RD with the identifier and tags set on each form, not the ones on this page. To change them, open the form.',
    desligada: 'The integration is off: no form goes to RD right now.',
    vazio: 'No forms yet.',
    criar: 'Create a form',
    formulario: 'Form',
    situacao: 'Status',
    identificador: 'RD identifier',
    tags: 'Tags',
    publicado: 'Published',
    rascunho: 'Draft',
    rascunhoDica: 'Not on the site: it gets no submissions.',
    naoVai: 'Does not go to RD',
    naoVaiDica: 'No conversion identifier (RD Station tab on the form).',
    repetido: 'Same identifier as:',
    semTags: 'no tags',
  },
}

/* Os formulários fixos, com os nomes do grupo "Identificadores de conversão"
   logo acima — para a repetição apontar para eles também. Menos o "Download de
   material": cada e-book vai com o próprio identificador (046), e aquele só
   vale quando o e-book não é achado. Comparar com ele avisaria do que quase
   nunca acontece. */
const FIXOS: Partial<Record<keyof IntegracaoRd['conversoes'], { pt: string; en: string }>> = {
  contato: { pt: 'Contato', en: 'Contact' },
  chat: { pt: 'Lead do chat (ATRA AI)', en: 'Chat lead (ATRA AI)' },
  newsletter: { pt: 'Newsletter', en: 'Newsletter' },
  consultores: { pt: 'Solicitação de consultores', en: 'Consultant request' },
  diagnostico: { pt: 'Diagnóstico de maturidade de dados', en: 'Data maturity diagnostic' },
  talentos: { pt: 'Trabalhe Conosco (banco de talentos)', en: 'Work with us (talent pool)' },
}

const SELECT = { name: true, _status: true, rd: true } as const

export const FormulariosNoRd: UIFieldServerComponent = async ({ payload, i18n, user }) => {
  const idioma = i18n?.language === 'en' ? 'en' : 'pt'
  const t = TEXTOS[idioma]
  const link = (caminho: `/${string}`) =>
    formatAdminURL({ adminRoute: payload.config.routes.admin, path: caminho, relative: true })
  /* Com o acesso de quem vê, e não o da Local API: hoje quem lê Integrações
     lê Formulários, mas isso é coincidência de configuração. */
  const comAcesso = { overrideAccess: false, user } as const

  let docs: Parameters<typeof toFormularioNoRd>[0][]
  let integracao: IntegracaoRd
  try {
    const [publicados, global] = await Promise.all([
      payload.find({ collection: 'forms', depth: 0, pagination: false, sort: 'name', select: SELECT, ...comAcesso }),
      payload.findGlobal({ slug: 'integrations', depth: 0, ...comAcesso }),
    ])
    const nuncaPublicados = publicados.docs.filter((d) => d._status !== 'published').map((d) => d.id)
    const ultimas = nuncaPublicados.length
      ? await payload.find({
          collection: 'forms',
          draft: true,
          depth: 0,
          pagination: false,
          where: { id: { in: nuncaPublicados } },
          select: SELECT,
          ...comAcesso,
        })
      : { docs: [] }
    const porId = new Map(ultimas.docs.map((d) => [d.id, d]))
    docs = publicados.docs.map((d) => porId.get(d.id) ?? d).sort((a, b) => a.name.localeCompare(b.name, 'pt'))
    integracao = toIntegracaoRd(global)
  } catch {
    /* Sem acesso a Formulários (ou o banco fora), a lista não aparece — o
       resto de Integrações continua de pé. */
    return null
  }
  const formularios = docs.map(toFormularioNoRd)

  const repetidos = identificadoresRepetidos([
    ...formularios.map((f) => ({ chave: `form-${f.id}`, nome: f.nome, identificador: f.identificador })),
    ...Object.entries(integracao.conversoes).flatMap(([chave, identificador]) => {
      const fixo = FIXOS[chave as keyof typeof FIXOS]
      return fixo ? [{ chave, nome: fixo[idioma], identificador }] : []
    }),
  ])

  return (
    <div className={estilos.quadro} data-testid="formularios-no-rd">
      <p id="formularios-no-rd-titulo" className={estilos.titulo}>
        {t.titulo}
      </p>
      <p className={estilos.explicacao}>{t.explicacao}</p>
      {!integracao.ligado && <p className={estilos.alerta}>{t.desligada}</p>}

      {formularios.length === 0 ? (
        <p className={estilos.explicacao}>
          {t.vazio} <a href={link('/collections/forms/create')}>{t.criar}</a>
        </p>
      ) : (
        /* Região com foco: em tela estreita a tabela rola de lado, e quem usa
           teclado precisa poder rolar. */
        <div className={estilos.rolagem} role="region" aria-labelledby="formularios-no-rd-titulo" tabIndex={0}>
          <table className={estilos.tabela} aria-labelledby="formularios-no-rd-titulo">
            <thead>
              <tr>
                <th scope="col">{t.formulario}</th>
                <th scope="col">{t.situacao}</th>
                <th scope="col">{t.identificador}</th>
                <th scope="col">{t.tags}</th>
              </tr>
            </thead>
            <tbody>
              {formularios.map((f) => {
                const mesmos = repetidos.get(`form-${f.id}`)
                return (
                  <tr key={f.id}>
                    <td>
                      <a href={link(`/collections/forms/${f.id}`)}>{f.nome}</a>
                    </td>
                    <td>
                      <span className={`${estilos.selo} ${f.publicado ? estilos.publicado : estilos.rascunho}`}>
                        {f.publicado ? t.publicado : t.rascunho}
                      </span>
                      {!f.publicado && <span className={estilos.dica}>{t.rascunhoDica}</span>}
                    </td>
                    <td>
                      {f.identificador ? (
                        <>
                          <code className={estilos.identificador}>{f.identificador}</code>
                          {mesmos && (
                            <span className={`${estilos.dica} ${estilos.repetido}`}>
                              {t.repetido} {mesmos.join(', ')}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <span className={`${estilos.selo} ${estilos.naoVai}`}>{t.naoVai}</span>
                          <span className={estilos.dica}>{t.naoVaiDica}</span>
                        </>
                      )}
                    </td>
                    <td>
                      {f.tags.length ? (
                        <span className={estilos.tags}>
                          {f.tags.map((tag) => (
                            <span key={tag} className={estilos.tag}>
                              {tag}
                            </span>
                          ))}
                        </span>
                      ) : (
                        <span className={estilos.vazio}>{t.semTags}</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
