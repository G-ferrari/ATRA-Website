import { withAutoTranslate, withFieldTranslation } from '@focus-reactive/payload-plugin-translator'
import type { CollectionAfterChangeHook, CollectionConfig, Field, PayloadRequest } from 'payload'

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
 * Três trancas, e todas precisam abrir para a fila receber o pedido:
 * - o interruptor do admin (Sistema → Integrações → Tradução para o inglês),
 *   que nasce **desligado**: sem ele, nem o CI nem um seed enfileira nada;
 * - a `GEMINI_API_KEY` no ambiente (a mesma de `lib/traducao.ts`);
 * - a trava do documento ("Inglês revisado à mão") desmarcada. */

/** As collections que se traduzem sozinhas.
 *
 * ⚠️ Fora de propósito: `press` e `forms`. A trava é coluna nova em cada
 * collection, e as duas tabelas nascem depois de 27/09, a data da migração
 * antecipada (`20260927_215960_trava_do_ingles_antecipada`) que impede as
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

export const CAMPO_DA_TRAVA = 'englishLocked'

async function traducaoLigada(req: PayloadRequest): Promise<boolean> {
  /* Com o `req`, dentro da transação do próprio salvamento. Global sem
     `localized`: o idioma do pedido não importa. */
  const doc = (await req.payload.findGlobal({ slug: 'integrations', depth: 0, req })) as {
    englishTranslation?: { enabled?: boolean | null } | null
  }
  return doc.englishTranslation?.enabled === true
}

/* Roda **antes** do gancho do plugin: o plugin acrescenta o dele ao fim do
 * `afterChange` de cada collection, e os ganchos rodam em ordem. A decisão é
 * refeita a cada documento, e a escrita do próprio tradutor (chave do plugin
 * já ligada, sem a nossa marca) passa intacta. */
export const decidirTraducaoAutomatica: CollectionAfterChangeHook = async ({ doc, req }) => {
  const doTradutor = (req.context as Record<string, unknown>)
  if (doTradutor[CHAVE_DO_PLUGIN] === true && doTradutor[NOSSA_MARCA] !== true) return doc

  const travado = (doc as Record<string, unknown>)[CAMPO_DA_TRAVA] === true
  const temChave = Boolean(process.env.GEMINI_API_KEY?.trim())
  /* O interruptor por último: é a única das três que consulta o banco. */
  const saltar = travado || !temChave || !(await traducaoLigada(req))

  /* ⚠️ `req.context` lido **depois** da consulta: a Local API chamada com o
     `req` troca o objeto inteiro (`createLocalReq` espalha o contexto num
     novo), e a chave gravada no objeto de antes não chegaria ao plugin — que,
     sem ela, traduzia até documento travado. */
  const contexto = req.context as Record<string, unknown>
  contexto[CHAVE_DO_PLUGIN] = saltar
  contexto[NOSSA_MARCA] = true
  return doc
}

const campoDaTrava: Field = {
  name: CAMPO_DA_TRAVA,
  type: 'checkbox',
  defaultValue: false,
  label: { pt: 'Inglês revisado à mão: não retraduzir', en: 'English edited by hand: do not retranslate' },
  admin: {
    position: 'sidebar',
    description: {
      pt: 'Marcado, publicar em português não muda mais o inglês: ele fica como alguém escreveu. Desmarcado, o inglês é refeito pela IA a cada publicação, e o que foi editado à mão no inglês se perde.',
      en: 'When checked, publishing in Portuguese no longer changes the English, which stays as written. When unchecked, the AI redoes the English on every publish, and hand edits to it are lost.',
    },
  },
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
      fields: [...semTraduzirOSlug(collection.fields), campoDaTrava],
      hooks: {
        ...collection.hooks,
        afterChange: [...(collection.hooks?.afterChange ?? []), decidirTraducaoAutomatica],
      },
    },
    /* `overwrite`: o português mudou, o inglês acompanha — inclusive o que foi
       mexido à mão no inglês, que é para isso que a trava existe. */
    { targets: ['en'], strategy: 'overwrite' },
  )
}
