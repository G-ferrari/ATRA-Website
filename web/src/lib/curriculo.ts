/* O currículo anexado pelo candidato no Banco de Talentos: quais formatos
 * entram, até que tamanho, e como o servidor confere que o arquivo é o que diz
 * ser. Obrigatório desde 26/11, junto com o LinkedIn (decisão do Leonardo, a
 * pedido do RH).
 *
 * Uma lista só, que o campo do formulário (`accept`, a checagem no navegador) e
 * a action (`formularios.ts`, kind `talent-pool`) leem — o formato aceito não
 * pode ter duas versões.
 *
 * ⚠️ O navegador confere por conveniência, o servidor por segurança. `accept`
 * é sugestão para o seletor de arquivos, e quem posta o formulário não é
 * obrigado a ser o nosso JavaScript: a extensão, o tamanho **e a assinatura**
 * (os primeiros bytes) são conferidos de novo na action. É a assinatura que
 * barra o `.exe` renomeado para `.pdf` — o RH vai abrir esses arquivos.
 *
 * Word entra (o candidato manda o que tem), mas só pela assinatura de Word: o
 * `.doc` antigo é um contêiner OLE (`D0 CF 11 E0`), o `.docx` é um zip (`PK`).
 * `.docm` (com macro) fica de fora pela extensão. */

/** 5 MB cobre qualquer currículo real; o teto existe porque upload sem teto é
 *  disco alheio de graça. ⚠️ O limite de corpo das Server Actions
 *  (`serverActions.bodySizeLimit`, em `next.config.ts`) tem de ficar acima
 *  disto, com folga para os outros campos do formulário. */
export const MAX_CURRICULO_BYTES = 5 * 1024 * 1024

type Formato = { extensao: string; mimetype: string; assinatura: number[] }

const FORMATOS: Formato[] = [
  { extensao: '.pdf', mimetype: 'application/pdf', assinatura: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  {
    extensao: '.docx',
    mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    assinatura: [0x50, 0x4b, 0x03, 0x04], // PK\3\4
  },
  { extensao: '.doc', mimetype: 'application/msword', assinatura: [0xd0, 0xcf, 0x11, 0xe0] },
]

/** Para o `accept` do `<input type="file">`: extensões e tipos, porque cada
 *  sistema operacional filtra o seletor por um dos dois. */
export const ACCEPT_CURRICULO = [...FORMATOS.map((f) => f.extensao), ...FORMATOS.map((f) => f.mimetype)].join(',')

/** Os tipos que a collection `private-files` aceita para currículo. O
 *  `application/x-cfb` é como a detecção de tipo do Payload (`file-type`) chama
 *  o `.doc`: sem ele o Payload recusaria um Word legítimo. */
export const MIMETYPES_DE_CURRICULO = [...FORMATOS.map((f) => f.mimetype), 'application/x-cfb']

export type MotivoDoCurriculo = 'ausente' | 'formato' | 'grande'

const formatoPeloNome = (nome: string): Formato | undefined => {
  const minusculo = nome.toLowerCase()
  return FORMATOS.find((f) => minusculo.endsWith(f.extensao))
}

/** A checagem que o navegador consegue fazer: existe, tem extensão aceita e
 *  cabe no teto. Sem ler o conteúdo. */
export function conferirArquivoNoNavegador(
  arquivo: { name: string; size: number } | null | undefined,
): MotivoDoCurriculo | null {
  if (!arquivo || arquivo.size === 0) return 'ausente'
  if (!formatoPeloNome(arquivo.name)) return 'formato'
  if (arquivo.size > MAX_CURRICULO_BYTES) return 'grande'
  return null
}

export type CurriculoConferido =
  | { ok: true; conteudo: Buffer; mimetype: string; nome: string }
  | { ok: false; motivo: MotivoDoCurriculo }

/** A checagem do servidor: a do navegador, mais a assinatura do conteúdo. O
 *  `mimetype` devolvido é o do formato **conferido**, não o que o navegador
 *  declarou — esse vem de quem posta. */
export async function conferirCurriculo(valor: FormDataEntryValue | null): Promise<CurriculoConferido> {
  if (!(valor instanceof File)) return { ok: false, motivo: 'ausente' }
  const motivo = conferirArquivoNoNavegador(valor)
  if (motivo) return { ok: false, motivo }

  const formato = formatoPeloNome(valor.name)!
  const conteudo = Buffer.from(await valor.arrayBuffer())
  if (!formato.assinatura.every((byte, i) => conteudo[i] === byte)) return { ok: false, motivo: 'formato' }
  /* ⚠️ O Payload recusa o PDF sem `%%EOF` e `xref` no último 1 KB
     (`validatePDF`, na gravação em `private-files`), e a recusa de lá chegava ao
     candidato como "não foi possível enviar agora". A mesma regra aqui, antes,
     dá a ele a mensagem certa: o arquivo está corrompido ou incompleto. */
  if (formato.extensao === '.pdf') {
    const fim = conteudo.subarray(Math.max(0, conteudo.length - 1024)).toString('latin1')
    if (!fim.includes('%%EOF') || !fim.includes('xref')) return { ok: false, motivo: 'formato' }
  }

  return {
    ok: true,
    conteudo,
    mimetype: formato.mimetype,
    /* O nome sai higienizado: vira parte da chave no bucket. Os últimos 80
       caracteres, e não os primeiros, para a extensão sobreviver ao corte. */
    nome: `cv-${Date.now()}-${valor.name.replace(/[^\w.-]+/g, '_').slice(-80)}`,
  }
}

/** As mensagens, no idioma da página (o campo) e em português (a action, como
 *  o resto dos erros dela). */
export const MENSAGENS_DO_CURRICULO = {
  pt: {
    ausente: 'Anexe seu currículo para enviar a candidatura.',
    formato: 'O currículo precisa ser um PDF ou um documento do Word (.doc ou .docx).',
    grande: 'O arquivo passa de 5 MB. Exporte uma versão mais leve.',
  },
  en: {
    ausente: 'Attach your résumé to send the application.',
    formato: 'The résumé must be a PDF or a Word document (.doc or .docx).',
    grande: 'The file is larger than 5 MB. Please export a lighter version.',
  },
  es: {
    ausente: 'Adjunte su currículum para enviar la postulación.',
    formato: 'El currículum debe ser un PDF o un documento de Word (.doc o .docx).',
    grande: 'El archivo supera los 5 MB. Exporte una versión más liviana.',
  },
} as const
