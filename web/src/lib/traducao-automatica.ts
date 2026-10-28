import { withAutoTranslate, withFieldTranslation } from '@focus-reactive/payload-plugin-translator'
import type { CollectionAfterChangeHook, CollectionConfig, Field, PayloadRequest } from 'payload'
import { hasDraftsEnabled } from 'payload/shared'

/* D-74 (27/10): o inglês do site se refaz sozinho a cada publicação em
 * português, pelo mesmo Gemini do botão "Traduzir" (D-70, `lib/traducao.ts`).
 * Quem cadastra não pede nada: publica o português, e um minuto depois o
 * inglês está no ar.
 *
 * ⚠️ **O inglês vai ao ar sem revisão.** O modo automático do plugin publica o
 * que escreve, sem opção de rascunho — escolha do Leonardo, 27/10, porque a
 * revisão a cada publicação era o trabalho que se queria tirar do time. O que
 * o marketing revisar à mão fica protegido pela trava abaixo.
 *
 * Desde a D-77 (28/10) o espanhol vai pelo mesmo caminho, com interruptor e
 * trava próprios: um idioma pode parar sem o outro.
 *
 * Três trancas por idioma, e todas precisam abrir para a fila receber o pedido:
 * - o interruptor do admin (Sistema → Integrações → Tradução para o inglês, e
 *   para o espanhol), que nasce **desligado**: sem ele, nem o CI nem um seed
 *   enfileira nada;
 * - a `GEMINI_API_KEY` no ambiente (a mesma de `lib/traducao.ts`);
 * - a trava do documento ("Inglês revisado à mão", "Espanhol revisado à mão")
 *   desmarcada. */

/** Os idiomas que se traduzem do português. */
export const IDIOMAS_TRADUZIDOS = ['en', 'es'] as const
export type IdiomaTraduzido = (typeof IDIOMAS_TRADUZIDOS)[number]

/** As collections que se traduzem sozinhas.
 *
 * ⚠️ Fora de propósito: `press` e `forms`. A trava é coluna nova em cada
 * collection, e as duas tabelas nascem depois de 27/09, a data da migração
 * antecipada (`20260927_215960_trava_do_ingles_antecipada`, e a gêmea do
 * espanhol) que impede as
 * migrações de dados antigas de morrerem em banco novo. Entrar com elas pede
 * outra antecipada, datada depois da criação de cada uma. `media` (texto
 * alternativo) e `glossary-terms` (fora do ar, D-36) também ficam fora. */
export const COLECOES_TRADUZIDAS_SOZINHAS = [
  'cases',
  'jobs',
  'pages',
  'partners',
  'posts',
  'resources',
  'segments',
  'solutions',
  'specialist-roles',
  'testimonials',
  'topics',
  'webinars',
] as const

/* ⚠️ O nome da chave que o próprio plugin põe em `req.context` nas escritas
 * dele, para o gancho de tradução automática não disparar de novo. O plugin
 * não exporta a constante (`types/AutoTranslateContext.js`, 0.17.0): conferir
 * o nome ao atualizar a versão — o teste de `traducao-automatica.test.ts` lê o
 * arquivo do pacote e reprova se mudar. */
export const CHAVE_DO_PLUGIN = 'translatorSkipAutoTranslate'

/* A nossa marca, ao lado da do plugin: separa "eu pus a chave para este
 * documento" de "o tradutor está escrevendo". Num envio em lote do admin (vários
 * documentos publicados num só pedido) o `req` é o mesmo, e sem a marca a trava
 * do primeiro documento valeria para todos os seguintes. */
const NOSSA_MARCA = 'atraDecidiuTraducaoAutomatica'

/** A trava de cada idioma, coluna em cada collection traduzida. */
export const TRAVAS: Record<IdiomaTraduzido, string> = { en: 'englishLocked', es: 'spanishLocked' }

/** A do inglês, com o nome de antes da D-77 (a carga do inglês a lê). */
export const CAMPO_DA_TRAVA = TRAVAS.en

/** O grupo do interruptor de cada idioma no global `integrations`. */
export const INTERRUPTORES: Record<IdiomaTraduzido, 'englishTranslation' | 'spanishTranslation'> = {
  en: 'englishTranslation',
  es: 'spanishTranslation',
}

/* Os nomes que o plugin dá ao fluxo e à fila (`createPayloadJobsRunner`, sem
   `taskName` nem `queueName` no nosso config). As cargas iniciais e o pedido
   de um idioma só (abaixo) enfileiram direto nele. */
export const FLUXO_DE_TRADUCAO = 'translate_document_locales'
export const FILA_DE_TRADUCAO = 'translations'

/** Os idiomas com o interruptor ligado. */
export async function idiomasLigados(req: PayloadRequest): Promise<Set<IdiomaTraduzido>> {
  /* Com o `req`, dentro da transação do próprio salvamento. Global sem
     `localized`: o idioma do pedido não importa. */
  const doc = (await req.payload.findGlobal({ slug: 'integrations', depth: 0, req })) as Partial<
    Record<(typeof INTERRUPTORES)[IdiomaTraduzido], { enabled?: boolean | null } | null>
  >
  return new Set(IDIOMAS_TRADUZIDOS.filter((l) => doc[INTERRUPTORES[l]]?.enabled === true))
}

/* O que não é conteúdo, na comparação do "mudou alguma coisa?" — ver abaixo. */
const FORA_DA_COMPARACAO = new Set(['updatedAt', 'createdAt', '_status', ...Object.values(TRAVAS)])
const semMetadados = (doc: unknown) =>
  JSON.stringify(doc, (chave, valor) => (FORA_DA_COMPARACAO.has(chave) ? undefined : valor))

/* Roda **antes** do gancho do plugin: o plugin acrescenta o dele ao fim do
 * `afterChange` de cada collection, e os ganchos rodam em ordem. A decisão é
 * refeita a cada documento, e a escrita do próprio tradutor (chave do plugin
 * já ligada, sem a nossa marca) passa intacta.
 *
 * ⚠️ O plugin só sabe traduzir para **todos** os idiomas da collection ou para
 * nenhum: a chave de contexto é uma só. Com os dois idiomas abertos, quem
 * enfileira é ele. Com um só (o outro travado ou desligado), o plugin fica de
 * fora e o pedido vai direto para a fila dele, com o idioma aberto — repetindo
 * as condições que ele confere: escrita no português, documento publicado e
 * conteúdo que mudou. A última é aproximada (o plugin compara só os campos
 * traduzíveis, e aqui é o documento inteiro), e o erro dela é o barato: uma
 * tradução a mais. */
export const decidirTraducaoAutomatica: CollectionAfterChangeHook = async ({ doc, previousDoc, req, collection }) => {
  const doTradutor = req.context as Record<string, unknown>
  if (doTradutor[CHAVE_DO_PLUGIN] === true && doTradutor[NOSSA_MARCA] !== true) return doc

  const documento = doc as Record<string, unknown>
  const destravados = IDIOMAS_TRADUZIDOS.filter((l) => documento[TRAVAS[l]] !== true)
  const temChave = Boolean(process.env.GEMINI_API_KEY?.trim())
  /* O interruptor por último: é a única das três que consulta o banco. */
  const ligados = destravados.length > 0 && temChave ? await idiomasLigados(req) : new Set<IdiomaTraduzido>()
  const abertos = destravados.filter((l) => ligados.has(l))

  /* ⚠️ `req.context` lido **depois** da consulta: a Local API chamada com o
     `req` troca o objeto inteiro (`createLocalReq` espalha o contexto num
     novo), e a chave gravada no objeto de antes não chegaria ao plugin — que,
     sem ela, traduzia até documento travado. */
  const contexto = req.context as Record<string, unknown>
  contexto[CHAVE_DO_PLUGIN] = abertos.length < IDIOMAS_TRADUZIDOS.length
  contexto[NOSSA_MARCA] = true

  const soAlguns = abertos.length > 0 && abertos.length < IDIOMAS_TRADUZIDOS.length
  const publicado = !hasDraftsEnabled(collection) || documento._status === 'published'
  if (soAlguns && req.locale === 'pt' && publicado && semMetadados(previousDoc) !== semMetadados(doc)) {
    await req.payload.jobs.queue({
      workflow: FLUXO_DE_TRADUCAO as never,
      queue: FILA_DE_TRADUCAO,
      input: {
        collection_slug: collection.slug,
        collection_id: String(documento.id),
        source_lng: 'pt',
        target_lngs: abertos,
        strategy: 'overwrite',
        publish_on_translation: true,
        requester_id: null,
        requester_collection: null,
      } as never,
      req,
    })
  }
  return doc
}

const NOME_DO_IDIOMA = {
  en: { pt: 'Inglês', en: 'English', descricaoPt: 'o inglês', descricaoEn: 'the English' },
  es: { pt: 'Espanhol', en: 'Spanish', descricaoPt: 'o espanhol', descricaoEn: 'the Spanish' },
} as const

const campoDaTrava = (idioma: IdiomaTraduzido): Field => {
  const n = NOME_DO_IDIOMA[idioma]
  return {
    name: TRAVAS[idioma],
    type: 'checkbox',
    defaultValue: false,
    label: { pt: `${n.pt} revisado à mão: não retraduzir`, en: `${n.en} edited by hand: do not retranslate` },
    admin: {
      position: 'sidebar',
      description: {
        pt: `Marcado, publicar em português não muda mais ${n.descricaoPt}: ele fica como alguém escreveu. Desmarcado, ${n.descricaoPt} é refeito pela IA a cada publicação, e o que foi editado à mão nele se perde.`,
        en: `When checked, publishing in Portuguese no longer changes ${n.descricaoEn}, which stays as written. When unchecked, the AI redoes ${n.descricaoEn} on every publish, and hand edits to it are lost.`,
      },
    },
  }
}

/* ⚠️ O slug nunca vai à IA. Ele é texto localizado (D-07), e com a estratégia
 * `overwrite` a tradução trocaria o endereço inglês a cada publicação — link
 * quebrado sem ninguém pedir. Fora da tradução, o plugin copia o slug
 * português só quando o inglês está vazio, e o que alguém gravou no inglês
 * fica (o `DataReconciler` do plugin dá prioridade ao valor do destino). É o que
 * faz o documento traduzido existir no inglês pela regra da D-69. */
function semTraduzirOSlug(fields: Field[]): Field[] {
  return fields.map((f) =>
    'name' in f && f.name === 'slug' && f.type === 'text' ? withFieldTranslation(f, { exclude: true }) : f,
  )
}

/** A collection com a trava, o gancho que decide e a tradução automática do
 *  plugin. O objeto devolvido vai **igual** ao `buildConfig` e ao plugin: o
 *  plugin lê `localized` nos campos aninhados do objeto original. */
export function comTraducaoAutomatica(collection: CollectionConfig): CollectionConfig {
  return withAutoTranslate(
    {
      ...collection,
      fields: [...semTraduzirOSlug(collection.fields), ...IDIOMAS_TRADUZIDOS.map(campoDaTrava)],
      hooks: {
        ...collection.hooks,
        afterChange: [...(collection.hooks?.afterChange ?? []), decidirTraducaoAutomatica],
      },
    },
    /* `overwrite`: o português mudou, os outros acompanham — inclusive o que
       foi mexido à mão neles, que é para isso que a trava existe. */
    { targets: [...IDIOMAS_TRADUZIDOS], strategy: 'overwrite' },
  )
}
