import { describe, expect, it } from 'vitest'

import { PADRAO_DO_DIAGNOSTICO } from '@/globals/DiagnosticoDeMaturidade'
import { REGULACOES_PADRAO } from '@/lib/diagnostico-maturidade'
import type { DataMaturityDiagnostic } from '@/payload-types'

import { toDiagnosticoDeMaturidade } from './diagnostico'

/* O que estes testes protegem: a diferença entre vazio-escolha (o editor tirou o
 * parágrafo ou o botão) e vazio-acidente (página sem título, e-mail sem assunto,
 * lead sem WhatsApp). Trocar um pelo outro não dá erro nenhum — dá uma página
 * que parece certa e um lead que some. */

const global = (over: Partial<DataMaturityDiagnostic> = {}): DataMaturityDiagnostic => ({
  id: 1,
  title: 'Título do marketing',
  intro: 'Abertura do marketing',
  doneMessage: 'Conclusão do marketing',
  emailSubject: 'Assunto do marketing',
  emailIntro: 'Abertura do e-mail do marketing',
  agendaUrl: 'https://calendly.com/atra/diagnostico',
  whatsappUrl: 'https://wa.me/5511999999999',
  ...over,
})

describe('toDiagnosticoDeMaturidade', () => {
  it('leva o que o marketing escreveu', () => {
    expect(toDiagnosticoDeMaturidade(global())).toEqual({
      titulo: 'Título do marketing',
      abertura: 'Abertura do marketing',
      conclusao: 'Conclusão do marketing',
      email: { assunto: 'Assunto do marketing', abertura: 'Abertura do e-mail do marketing' },
      agendaUrl: 'https://calendly.com/atra/diagnostico',
      whatsappUrl: 'https://wa.me/5511999999999',
      /* Nenhum setor escolhido no admin: a lista do questionário. */
      regulacoes: REGULACOES_PADRAO,
    })
  })

  /* 07/10: a lista de regulações de cada setor é do admin. O setor que o editor
     mexeu sai como ele deixou; os outros seguem com a do questionário. */
  it('leva as regulações que o admin escolheu, setor a setor', () => {
    const d = toDiagnosticoDeMaturidade(global({ regulations: { capitais: ['anbima', 'cvm'], seguros: [] } }))
    expect(d.regulacoes.capitais).toEqual(['anbima', 'cvm'])
    expect(d.regulacoes.seguros).toEqual(REGULACOES_PADRAO.seguros)
    expect(d.regulacoes.financeiro).toEqual(REGULACOES_PADRAO.financeiro)
  })

  /* Vazio é escolha: o componente não desenha o parágrafo, e sem agenda não há
     botão "Agendar conversa" — nem na conclusão, nem no e-mail. */
  it('opcional vazio vira null', () => {
    for (const vazio of [null, undefined, '', '   ']) {
      const d = toDiagnosticoDeMaturidade(
        global({ intro: vazio, doneMessage: vazio, emailIntro: vazio, agendaUrl: vazio }),
      )
      expect(d.abertura).toBeNull()
      expect(d.conclusao).toBeNull()
      expect(d.email.abertura).toBeNull()
      expect(d.agendaUrl).toBeNull()
    }
  })

  it('título, assunto e WhatsApp esvaziados voltam ao padrão do global', () => {
    const d = toDiagnosticoDeMaturidade(global({ title: '  ', emailSubject: null, whatsappUrl: '' }))
    expect(d.titulo).toBe(PADRAO_DO_DIAGNOSTICO.titulo)
    expect(d.email.assunto).toBe(PADRAO_DO_DIAGNOSTICO.assuntoDoEmail)
    expect(d.whatsappUrl).toBe(PADRAO_DO_DIAGNOSTICO.whatsapp)
  })

  /* Link sem protocolo vira caminho relativo no site; `javascript:` num href
     público é XSS vindo do CMS. */
  it('descarta link que não é http(s)', () => {
    const d = toDiagnosticoDeMaturidade(
      global({ agendaUrl: 'calendly.com/atra', whatsappUrl: 'javascript:alert(1)' }),
    )
    expect(d.agendaUrl).toBeNull()
    expect(d.whatsappUrl).toBe(PADRAO_DO_DIAGNOSTICO.whatsapp)
  })

  it('apara espaços das bordas', () => {
    const d = toDiagnosticoDeMaturidade(global({ title: '  Título  ', agendaUrl: ' https://x.com/a ' }))
    expect(d.titulo).toBe('Título')
    expect(d.agendaUrl).toBe('https://x.com/a')
  })
})
