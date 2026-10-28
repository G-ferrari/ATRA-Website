import {
  PADRAO_DO_DIAGNOSTICO,
  PADRAO_DO_DIAGNOSTICO_EN,
  PADRAO_DO_DIAGNOSTICO_ES,
} from '@/globals/DiagnosticoDeMaturidade'
import { resolverRegulacoes } from '@/lib/diagnostico-maturidade'
import type { Locale } from '@/lib/locales'
import type { DataMaturityDiagnostic } from '@/payload-types'
import type { DiagnosticoDeMaturidade } from '@/types/content'

/* Mapper do global do Diagnóstico de Maturidade de Dados (D-35, task 023).
 *
 * O global nunca salvo já chega com os padrões (o Payload aplica `defaultValue`
 * na leitura de global sem documento). O que este mapper resolve é o campo que
 * o editor **esvaziou**, e aí a pergunta é se o vazio é escolha ou acidente:
 *
 *  - parágrafo (abertura, conclusão, abertura do e-mail) e agenda: vazio é
 *    escolha — `null`, e o componente não desenha;
 *  - título, assunto e WhatsApp: vazio é acidente — página sem cabeçalho, e-mail
 *    sem assunto (cara de spam) e lead sem saída quando o e-mail não chega. Volta
 *    o padrão do global, a mesma constante, sem texto duplicado em código.
 *
 *  No inglês (D-76) o vazio é outra coisa: é texto que ninguém traduziu, porque
 *  global não entra na tradução automática. Ali todo texto vazio volta ao
 *  padrão inglês — o documento chega lido sem fallback, para o português não
 *  aparecer no meio da página inglesa. */

const texto = (valor: string | null | undefined): string | null => valor?.trim() || null

/* Só `http(s)`: o admin já recusa link sem protocolo, e isto segura o que
 * escapar da validação — um `javascript:` num `href` público é XSS vindo do
 * CMS. */
const link = (valor: string | null | undefined): string | null => {
  const v = valor?.trim()
  return v && /^https?:\/\//i.test(v) ? v : null
}

/* ⚠️ O `defaultValue` dos campos é o português, e o Payload o aplica também à
 * leitura em inglês de global nunca salvo. No inglês, o padrão português conta
 * como não traduzido. */
const PADROES_EM_PORTUGUES = new Set<string>(Object.values(PADRAO_DO_DIAGNOSTICO))

const PADROES_TRADUZIDOS: Record<Exclude<Locale, 'pt'>, Record<keyof typeof PADRAO_DO_DIAGNOSTICO_EN, string>> = {
  en: PADRAO_DO_DIAGNOSTICO_EN,
  es: PADRAO_DO_DIAGNOSTICO_ES,
}

export function toDiagnosticoDeMaturidade(doc: DataMaturityDiagnostic, locale: Locale = 'pt'): DiagnosticoDeMaturidade {
  /* `en` é o padrão do idioma traduzido — o nome é de antes do espanhol (D-77). */
  const en = locale === 'pt' ? null : PADROES_TRADUZIDOS[locale]
  const traduzido = (valor: string | null | undefined) => {
    const v = texto(valor)
    return en && v && PADROES_EM_PORTUGUES.has(v) ? null : v
  }
  return {
    titulo: traduzido(doc.title) ?? (en ?? PADRAO_DO_DIAGNOSTICO).titulo,
    abertura: traduzido(doc.intro) ?? en?.abertura ?? null,
    conclusao: traduzido(doc.doneMessage) ?? en?.conclusao ?? null,
    email: {
      assunto: traduzido(doc.emailSubject) ?? (en ?? PADRAO_DO_DIAGNOSTICO).assuntoDoEmail,
      abertura: traduzido(doc.emailIntro) ?? en?.aberturaDoEmail ?? null,
    },
    agendaUrl: link(doc.agendaUrl),
    whatsappUrl: link(doc.whatsappUrl) ?? PADRAO_DO_DIAGNOSTICO.whatsapp,
    /* Setor vazio no admin volta à lista do questionário; ver `regulacoes.ts`. */
    regulacoes: resolverRegulacoes(doc.regulations),
  }
}
