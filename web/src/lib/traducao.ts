import {
  createTranslationProvider,
  openAIComplete,
  ProviderConfigurationError,
  type AccessGuard,
  type CompletionFn,
} from '@focus-reactive/payload-plugin-translator'
import OpenAI from 'openai'

/* Tradução no admin (checklist #66, teste de 21/10): o plugin
 * `@focus-reactive/payload-plugin-translator` traduz os campos localizados de
 * um documento e grava o resultado como rascunho no idioma de destino.
 *
 * Quem traduz é o Gemini, a mesma IA do chat (`GEMINI_API_KEY`), pelo endereço
 * compatível com a API da OpenAI — o plugin fala esse formato, e assim não
 * entra um segundo fornecedor de IA. */

/** O mesmo modelo da ATRA AI (`app/api/chat/route.ts`). */
const MODELO = 'gemini-3.6-flash'
const ENDERECO_COMPATIVEL = 'https://generativelanguage.googleapis.com/v1beta/openai/'

/* ⚠️ O cliente nasce na hora de traduzir, e não ao carregar o config: o SDK da
 * OpenAI lança no construtor quando falta a chave, e o config é carregado no
 * CI, no build e nos scripts, onde ela não existe. Sem a chave, o plugin
 * aparece no admin e a tradução falha dizendo o que falta. */
const completar: CompletionFn = async (pedido) => {
  const chave = process.env.GEMINI_API_KEY?.trim()
  if (!chave) {
    throw new ProviderConfigurationError('GEMINI_API_KEY ausente no servidor: a tradução usa a chave do Gemini da ATRA AI.')
  }
  const cliente = new OpenAI({ apiKey: chave, baseURL: ENDERECO_COMPATIVEL })
  return openAIComplete({ client: cliente, model: MODELO, sampling: { temperature: 0.2 } })(pedido)
}

/* O que se acrescenta à instrução do plugin. Só o que é técnico e não se
 * discute: marca, nome de produto e sigla não se traduzem. Tom e glossário são
 * do marketing (D-22) e entram aqui quando ele pedir. */
const REGRAS_DA_ATRA = [
  'The text belongs to the website of ATRA, a Brazilian data and AI consultancy. Translate Brazilian Portuguese into US English with a professional, clear B2B tone.',
  'Keep unchanged: the name ATRA, company and product names (for example Google Cloud, Databricks, BigID, Denodo, Atlan, Microsoft Azure), acronyms (LGPD, BACEN, CVM, ANS, BI, KPI) and URLs.',
].join('\n')

export const provedorDeTraducao = createTranslationProvider({
  complete: completar,
  systemPrompt: ({ defaultPrompt }) => `${defaultPrompt}\n${REGRAS_DA_ATRA}`,
})

/** Só quem entrou no admin traduz: os endpoints do plugin gastam a chave do
 *  Gemini e gravam no banco. Hoje todo usuário é editor ou administrador. */
export const quemTraduz: AccessGuard = {
  check: ({ req }) => {
    const usuario = req.user as { collection?: string; role?: string } | null | undefined
    return usuario?.collection === 'users' && (usuario.role === 'admin' || usuario.role === 'editor')
  },
}
