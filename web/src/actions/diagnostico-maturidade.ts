'use server'

import { headers } from 'next/headers'

import { CAMPO_ISCA, conferir, excedeuPorIp } from '@/lib/anti-spam'
import { lerContato } from '@/lib/contato'
import { destinoDoAviso } from '@/lib/destino-do-aviso'
import { lerDiagnosticoDeMaturidade } from '@/lib/diagnostico'
import {
  CARGOS,
  PORTES,
  SETORES,
  VERSAO,
  calcular,
  ehCargo,
  ehEmailCorporativo,
  ehPorte,
  ehSetor,
  montarAvisoParaAtra,
  montarEmailDoResultado,
  montarRoadmap,
  perguntasDoSetor,
  roadmapEmTexto,
  validarRespostas,
  type Cargo,
  type Porte,
  type Setor,
} from '@/lib/diagnostico-maturidade'
import { enviarAviso } from '@/lib/email'
import { ipDe } from '@/lib/ip'
import { getPayload } from '@/lib/payload'
import { MAX_POR_VALOR } from '@/lib/utm'
import type { Contato } from '@/types/content'

/* Captura do Diagnóstico de Maturidade de Dados (feature
 * diagnostico-maturidade-dados, task 025).
 *
 * Mesmo contrato dos outros formulários (`architecture.md` §4): anti-spam →
 * grava → avisa, com o aviso incapaz de derrubar a gravação. Aqui o "avisa" são
 * dois e-mails, nesta ordem: o **resultado ao lead** (o único lugar onde ele vê
 * o diagnóstico — decisão de 26/09) e o aviso à caixa de Diagnóstico. A
 * sincronização com o RD Station CRM não vem aqui: é o hook `afterChange` de
 * `form-submissions`, e `data-maturity-diagnostic` já está na lista comercial
 * de `lib/crm.ts` (task 023).
 *
 * ⚠️ **Nada do resultado vem do navegador** (MIG-142: Server Action é endpoint
 * público). O cliente manda só perfil e `{ perguntaId: índice }`; pergunta de
 * outro setor e índice inexistente somem em `validarRespostas`, e média, nível,
 * pilares, gaps e roadmap são refeitos aqui pelo motor da task 022. Qualquer
 * nota que venha no formulário é ignorada — não há campo que a leia.
 *
 * ⚠️ **Depois que o lead é gravado, a resposta é sucesso, aconteça o que
 * acontecer** — a lição de `consultores.ts`. Resend fora do ar, sem chave ou
 * com o global ilegível: o lead fica no banco com `resultSentAt` vazio e
 * `notified` falso, e o admin mostra. Devolver erro com o lead salvo faria o
 * visitante reenviar, e o comercial receberia duplicata.
 *
 * ⚠️ Sem IP e sem user agent no documento (LGPD, topo de `FormSubmissions.ts`):
 * o IP serve ao limite por IP, em memória, e não passa daqui. */

/** O que o visitante mandou no contato, devolvido quando o envio é recusado.
 *
 * ⚠️ O React 19 **reseta o formulário** quando a action termina — com sucesso
 * ou com erro (ver `consultores.ts`). O formulário usa isto como
 * `defaultValue`, e o reset restaura o que foi digitado. Perfil e respostas
 * não voltam: moram no estado da ilha, não em campo de formulário. Volta só
 * para quem enviou, na mesma resposta; nada vai para log. */
export type ValoresEnviados = {
  name: string
  email: string
  phone: string
  company: string
  consentimento: boolean
}

export type CampoDoContato = keyof ValoresEnviados

/** ⚠️ `codigo` existe para o formulário decidir o que fazer sem comparar texto:
 *  `contato` marca os campos de `campos`; `perfil` e `respostas` só acontecem
 *  com página velha ou envio forjado, e a saída é recomeçar; `falha` é o banco. */
export type CodigoDeErro = 'contato' | 'perfil' | 'respostas' | 'falha'

export type ResultadoDoDiagnostico =
  /** `email` é o endereço para onde o resultado foi — a conclusão o mostra. */
  | { ok: true; email: string }
  | {
      ok: false
      codigo: CodigoDeErro
      erro: string
      /** Um problema por campo, com o texto do HTML do Roger. A chave **é** o
       *  código: cada campo só tem um jeito de estar errado. */
      campos: Partial<Record<CampoDoContato, string>>
      valores: ValoresEnviados
    }

/* Textos dos erros de campo e da falha de envio: os do HTML v1.7
 * (`.aq-field .err` e `#aq-send-error`), caractere a caractere — conteúdo do
 * Roger, não da engenharia (D-22). */
/* A empresa não tem mensagem: no HTML v1.7 ela é "(opcional)", e o porte já
 * qualifica o lead. Obrigá-la seria regra nossa sobre o questionário do Roger
 * (D-22). O assunto do aviso à ATRA já trata a empresa vazia. */
const ERRO_DO_CAMPO: Record<Exclude<CampoDoContato, 'company'>, string> = {
  name: 'Informe seu nome.',
  email: 'Use um e-mail corporativo válido (não aceitamos gmail, hotmail, etc.).',
  phone: 'Informe um telefone com DDD.',
  consentimento: 'É preciso autorizar o contato para receber o diagnóstico.',
}
const ERRO = 'Não conseguimos registrar agora. Tente novamente ou fale direto com a gente pelo WhatsApp.'
/* Estes dois o HTML nunca mostra — lá o perfil e as respostas não saem da
 * página. Aqui chegam pela rede, e o único conserto é recomeçar. */
const PERFIL = 'Não conseguimos ler o seu perfil. Atualize a página e refaça o diagnóstico.'
const SEM_RESPOSTAS = 'Não recebemos as suas respostas. Atualize a página e refaça o diagnóstico.'

/* MIG-142: todo campo entra cortado no teto do servidor, como nos outros
 * formulários. As respostas cabem folgadas em 5.000: o setor com mais perguntas
 * tem 18, e cada entrada tem uns 30 caracteres. JSON maior que isso é forjado —
 * cortado, deixa de ser JSON e vira "nenhuma resposta". */
const MAX_CAMPO = 200
const MAX_MENSAGEM = 5000

/* O formato de `validateLead` no HTML — o mesmo de `ehEmailCorporativo`.
 *
 * ⚠️ Não é redundante. `ehEmailCorporativo` tira quebras de linha **antes** de
 * testar (refaz a sanitização do `<input type="email">`), então aprova
 * "ana@ban\nco.com.br" — mas o valor gravado e usado como destinatário é o
 * cru. Este teste, sobre o cru, recusa qualquer espaço no endereço. */
const FORMATO_DE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/* Teto do "tempo de resposta": a janela do carimbo do anti-spam
 * (`MINUTOS_MAXIMOS`, 120 min). Aba esquecida por mais que isso é barrada
 * antes de chegar aqui; o que passar disso é relógio errado ou carimbo forjado,
 * e um número absurdo no admin é pior que vazio. */
const MAX_DURACAO_S = 2 * 60 * 60

const texto = (dados: FormData, campo: string, max = MAX_CAMPO): string =>
  String(dados.get(campo) ?? '')
    .trim()
    .slice(0, max)

/** Campo de uma linha só — nome, telefone, empresa.
 *
 * ⚠️ Os três vão para o aviso à ATRA, e a empresa vai para o assunto. Com
 * quebra de linha no meio, o telefone forjaria um bloco "Resultado" dentro do
 * e-mail do comercial, com cara de texto gerado pelo sistema (o defeito que
 * `consultores.ts` corrigiu). O `<input>` já tira quebras de quem digita. */
const linha = (dados: FormData, campo: string): string => texto(dados, campo).replace(/\s+/g, ' ')

const campanha = (dados: FormData, campo: string): string | undefined =>
  texto(dados, campo).slice(0, MAX_POR_VALOR) || undefined

/** O que um erro pode deixar no log: o código do Postgres ou o nome.
 *
 * ⚠️ **Nunca `console.error(..., e)`.** A mensagem do erro do Drizzle leva
 * `params:` — e-mail, nome e telefone do visitante iriam inteiros para o log
 * (ver `consultores.ts`). */
const semDadoPessoal = (e: unknown): string => {
  const erro = e as { cause?: { code?: unknown }; code?: unknown; name?: unknown } | null
  return String(erro?.cause?.code ?? erro?.code ?? erro?.name ?? 'erro desconhecido')
}

/** Quanto o visitante levou do início do questionário ao envio — o
 * `cf_quiz_duracao_seg` do HTML (`Date.now() - state.startedAt`).
 *
 * ⚠️ `inicio` é o relógio **do navegador** e a conta é contra o relógio do
 * servidor: um celular com a hora errada dá número negativo ou de horas. É
 * métrica, não segurança — quem forja o carimbo só estraga o próprio número —,
 * então o implausível vira vazio em vez de recusa. */
function duracaoEmSegundos(inicio: string, agora = Date.now()): number | undefined {
  const t = Number(inicio)
  if (!Number.isFinite(t) || t <= 0) return undefined
  const segundos = Math.round((agora - t) / 1000)
  return segundos > 0 && segundos <= MAX_DURACAO_S ? segundos : undefined
}

/** Para onde vai o aviso do diagnóstico, e o `reply_to` do resultado — quando o
 * lead responde ao e-mail, a resposta cai na mesma caixa que recebeu o aviso.
 * É o campo "Diagnóstico" de Contato → Destino dos formulários, com o e-mail
 * geral quando vazio (`lib/destino-do-aviso.ts`, P-29). A variável
 * `RC18_LEAD_EMAIL` saiu com o diagnóstico RC18 (D-35): o destino agora se
 * troca no admin. */
function caixaDoDiagnostico(contato: Contato): string {
  return destinoDoAviso(contato, 'diagnostico')
}

const rotuloDe = <V extends string>(lista: readonly { valor: V; rotulo: string }[], valor: V) =>
  lista.find((o) => o.valor === valor)?.rotulo ?? valor

/** `message` curto: o que a anotação do CRM **não** tem. Nível, média, pilares
 * e maiores gaps já vão por `resumoDoDiagnostico` (`lib/crm.ts`), que lê o
 * grupo `diagnostic`; repetir aqui duplicaria as linhas na negociação. O perfil
 * sai em rótulo, que é o que o comercial lê. */
function resumoDoEnvio(setor: Setor, porte: Porte, cargo: Cargo, respondidas: number): string {
  return [
    `Diagnóstico de maturidade de dados (v${VERSAO}): ${respondidas} de ${perguntasDoSetor(setor).length} perguntas respondidas.`,
    `Setor: ${rotuloDe(SETORES, setor)}`,
    `Porte: ${rotuloDe(PORTES, porte)}`,
    `Cargo: ${rotuloDe(CARGOS, cargo)}`,
  ].join('\n')
}

/** A assinatura que o `useActionState` exige — `(estadoAnterior, dados)` —, para
 * o formulário receber **a própria Server Action**. Com um embrulho cliente o
 * envio deixa de funcionar sem JavaScript (ver o fim de `consultores.ts`). */
export async function enviarDiagnosticoDeMaturidade(
  _anterior: ResultadoDoDiagnostico | null,
  dados: FormData,
): Promise<ResultadoDoDiagnostico> {
  const valores: ValoresEnviados = {
    name: texto(dados, 'name'),
    email: texto(dados, 'email'),
    phone: texto(dados, 'phone'),
    company: texto(dados, 'company'),
    /* O checkbox HTML só manda o campo quando está marcado. */
    consentimento: texto(dados, 'consentimento') !== '',
  }
  const recusa = (
    codigo: CodigoDeErro,
    erro: string,
    campos: Partial<Record<CampoDoContato, string>> = {},
  ): ResultadoDoDiagnostico => ({ ok: false, codigo, erro, campos, valores })

  /* ⚠️ Toda validação vem **antes** das barreiras, e não depois. Na ordem
   * inversa, o robô recebia `{ ok: true }` quando barrado e o erro de campo
   * quando não — um oráculo para testar cada técnica (ver `consultores.ts`). E
   * envio inválido não gasta a cota por IP, que é dividida com os outros
   * formulários. */

  /* Perfil: códigos do motor. O cliente só oferece estes, então fora da lista é
   * página velha ou forja — e sem setor não há como ler as respostas. */
  const setor = texto(dados, 'setor')
  const porte = texto(dados, 'porte')
  const cargo = texto(dados, 'cargo')
  if (!ehSetor(setor) || !ehPorte(porte) || !ehCargo(cargo)) return recusa('perfil', PERFIL)

  /* Respostas: `{ perguntaId: índice }` em JSON. JSON quebrado é o mesmo que
   * nenhuma resposta. Resposta parcial passa — a conta do motor é sobre o que
   * foi respondido —, mas sem nenhuma não há diagnóstico a entregar. */
  let bruto: unknown = null
  try {
    bruto = JSON.parse(texto(dados, 'respostas', MAX_MENSAGEM))
  } catch {
    bruto = null
  }
  const respostas = validarRespostas(setor, bruto)
  if (Object.keys(respostas).length === 0) return recusa('respostas', SEM_RESPOSTAS)

  /* Contato: as regras de `validateLead` no HTML — a empresa fica opcional, como lá.
   * Todos os campos de uma vez — errar dois e descobrir um por envio é o que o
   * HTML evita marcando todos juntos. */
  const nome = linha(dados, 'name')
  const telefone = linha(dados, 'phone')
  const empresa = linha(dados, 'company')
  const campos: Partial<Record<CampoDoContato, string>> = {}
  if (nome.length < 3) campos.name = ERRO_DO_CAMPO.name
  if (!FORMATO_DE_EMAIL.test(valores.email) || !ehEmailCorporativo(valores.email)) campos.email = ERRO_DO_CAMPO.email
  if (telefone.replace(/\D/g, '').length < 10) campos.phone = ERRO_DO_CAMPO.phone
  if (!valores.consentimento) campos.consentimento = ERRO_DO_CAMPO.consentimento
  const primeiro = Object.values(campos)[0]
  if (primeiro) return recusa('contato', primeiro, campos)

  /* Minúsculo como no `buildPayload` do HTML: é o e-mail que o CRM procura para
   * não duplicar contato, e "Ana@Banco" e "ana@banco" são a mesma pessoa. */
  const email = valores.email.toLowerCase()

  /* Robô barrado recebe sucesso: dizer "você foi barrado" entrega o critério.
   * O limite por IP vem antes de qualquer trabalho caro (a conexão ao banco). */
  const veredito = conferir({ isca: texto(dados, CAMPO_ISCA), carimbo: texto(dados, 'carimbo') })
  if (!veredito.ok) {
    console.warn(`[diagnostico-maturidade] barrado por ${veredito.motivo}`)
    return { ok: true, email }
  }
  if (excedeuPorIp(ipDe(await headers()))) return { ok: true, email }

  const calculo = calcular(setor, respostas)
  const roadmap = montarRoadmap(calculo)
  /* Uma entrada por pergunta respondida, na ordem da base: legível no admin sem
   * abrir o HTML da versão que o lead respondeu. `validarRespostas` já garantiu
   * que o índice aponta para uma alternativa. */
  const respondidas = perguntasDoSetor(setor).flatMap((q) => {
    if (!Object.hasOwn(respostas, q.id)) return []
    const a = q.alternativas[respostas[q.id]]
    return [{ id: q.id, pilar: q.pilar, nota: a.nota, tags: [...a.tags], texto: a.texto }]
  })

  /* B4 de `consultores.ts`: banco fora do ar na inicialização vira resposta,
   * não exceção que o formulário teria de tratar. */
  let payload: Awaited<ReturnType<typeof getPayload>>
  try {
    payload = await getPayload()
  } catch (e) {
    console.error('[diagnostico-maturidade] sem conexão com o banco:', semDadoPessoal(e))
    return recusa('falha', ERRO)
  }

  let id: number
  try {
    const doc = await payload.create({
      collection: 'form-submissions',
      /* `create` é fechado no admin (`access.create: () => false`): quem grava
         lead é só a action. Explícito para ninguém "corrigir" o padrão da Local
         API sem ver que é ele que abre a porta. */
      overrideAccess: true,
      data: {
        kind: 'data-maturity-diagnostic',
        email,
        name: nome,
        phone: telefone,
        company: empresa,
        message: resumoDoEnvio(setor, porte, cargo, respondidas.length).slice(0, MAX_MENSAGEM),
        source: linha(dados, 'source') || undefined,
        utm: {
          source: campanha(dados, 'utm_source'),
          medium: campanha(dados, 'utm_medium'),
          campaign: campanha(dados, 'utm_campaign'),
          term: campanha(dados, 'utm_term'),
          content: campanha(dados, 'utm_content'),
        },
        diagnostic: {
          sector: setor,
          size: porte,
          role: cargo,
          average: calculo.media,
          level: calculo.nivel,
          pillars: calculo.pilares,
          dama: calculo.damas,
          gaps: calculo.gaps,
          /* O formato do `cf_quiz_gaps_top3` do HTML, que a nota do CRM repete. */
          topGaps: calculo.topGaps.join(' | '),
          answers: respondidas,
          roadmap: roadmapEmTexto(roadmap),
          version: VERSAO,
          durationSeconds: duracaoEmSegundos(texto(dados, 'inicio')),
        },
        status: 'new',
        notified: false,
      },
    })
    id = doc.id
  } catch (e) {
    console.error('[diagnostico-maturidade] não gravou:', semDadoPessoal(e))
    return recusa('falha', ERRO)
  }

  /* Daqui em diante o lead está salvo: falha só vai para o log, e o que não
   * saiu fica visível no admin (`resultSentAt` vazio, `notified` falso). */
  let resultSentAt: string | undefined
  let notified = false
  try {
    /* `pt`: o corpo do e-mail é o texto do motor (perguntas, níveis, roadmap),
       que só existe em português — a rota EN serve o diagnóstico em PT pelo
       mesmo motivo. Assunto em inglês sobre corpo em português seria pior. */
    const [contato, textos] = await Promise.all([lerContato(), lerDiagnosticoDeMaturidade('pt')])
    const caixa = caixaDoDiagnostico(contato)

    try {
      const resultado = montarEmailDoResultado({
        nome,
        setor,
        porte,
        calculo,
        roadmap,
        textos,
        whatsappUrl: textos.whatsappUrl,
        agendaUrl: textos.agendaUrl,
      })
      const enviou = await enviarAviso({
        para: email,
        assunto: resultado.assunto,
        texto: resultado.texto,
        html: resultado.html,
        responderPara: caixa,
      })
      if (enviou) resultSentAt = new Date().toISOString()
    } catch (e) {
      console.error(`[diagnostico-maturidade] lead ${id} gravado, mas o resultado falhou:`, semDadoPessoal(e))
    }

    /* Em `try` próprio: um defeito no e-mail do resultado não pode calar o
       aviso — sem ele, ninguém na ATRA sabe que o lead existe. */
    try {
      const aviso = montarAvisoParaAtra({
        contato: { nome, email, telefone, empresa },
        setor,
        porte,
        cargo,
        calculo,
        roadmap,
        respostas,
      })
      notified = await enviarAviso({ para: caixa, assunto: aviso.assunto, texto: aviso.texto, responderPara: email })
    } catch (e) {
      console.error(`[diagnostico-maturidade] lead ${id} gravado, mas o aviso falhou:`, semDadoPessoal(e))
    }
  } catch (e) {
    console.error(`[diagnostico-maturidade] lead ${id} gravado, mas não leu contato/textos:`, semDadoPessoal(e))
  }

  /* Uma escrita só para as duas marcas, e só com o que deu certo. Cada `update`
   * dispara o hook do CRM de novo (é o retry dele): duas escritas seguidas
   * seriam duas tentativas no mesmo segundo, falhando pelo mesmo motivo.
   *
   * ⚠️ Pelo **id que o `create` devolveu**, e não por e-mail + kind: dois envios
   * simultâneos do mesmo e-mail marcariam o errado (ver `consultores.ts`). */
  if (resultSentAt || notified) {
    try {
      await payload.update({
        collection: 'form-submissions',
        id,
        data: { ...(resultSentAt ? { resultSentAt } : {}), ...(notified ? { notified: true } : {}) },
      })
    } catch (e) {
      console.error(`[diagnostico-maturidade] lead ${id} gravado, mas não marcou o envio:`, semDadoPessoal(e))
    }
  }

  return { ok: true, email }
}
