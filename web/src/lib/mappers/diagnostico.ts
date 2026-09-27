import { PADRAO_DO_DIAGNOSTICO } from '@/globals/DiagnosticoDeMaturidade'
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
 *    o padrão do global, a mesma constante, sem texto duplicado em código. */

const texto = (valor: string | null | undefined): string | null => valor?.trim() || null

/* Só `http(s)`: o admin já recusa link sem protocolo, e isto segura o que
 * escapar da validação — um `javascript:` num `href` público é XSS vindo do
 * CMS. */
const link = (valor: string | null | undefined): string | null => {
  const v = valor?.trim()
  return v && /^https?:\/\//i.test(v) ? v : null
}

export function toDiagnosticoDeMaturidade(doc: DataMaturityDiagnostic): DiagnosticoDeMaturidade {
  return {
    titulo: texto(doc.title) ?? PADRAO_DO_DIAGNOSTICO.titulo,
    abertura: texto(doc.intro),
    conclusao: texto(doc.doneMessage),
    email: {
      assunto: texto(doc.emailSubject) ?? PADRAO_DO_DIAGNOSTICO.assuntoDoEmail,
      abertura: texto(doc.emailIntro),
    },
    agendaUrl: link(doc.agendaUrl),
    whatsappUrl: link(doc.whatsappUrl) ?? PADRAO_DO_DIAGNOSTICO.whatsapp,
  }
}
