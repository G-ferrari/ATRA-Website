import type { CookieConsent } from '@/payload-types'
import type { AvisoDeCookies } from '@/types/content'

/* Mapper do aviso de cookies (MIG-151, D-30). */

/* ⚠️ Reserva de texto para **cromo e descrição técnica factual** — rótulos de
 * botão e o que cada categoria faz, escritos pela engenharia e editáveis no
 * CMS (D-22). A `bannerMessage` fica de fora de propósito: é ela que carrega o
 * compromisso jurídico, não se inventa em código, e vazia ela **desliga o
 * banner inteiro** — o gate de código de D-29/D-30. */
const RESERVA = {
  pt: {
    titulo: 'Cookies e privacidade',
    aceitar: 'Aceitar todos',
    recusar: 'Recusar',
    preferencias: 'Preferências',
    salvar: 'Salvar escolhas',
    tituloDoPainel: 'Preferências de cookies',
    mensagemDoPainel: 'Escolha o que o site pode registrar. Você pode mudar isso a qualquer momento.',
    necessarios: {
      nome: 'Essenciais',
      descricao: 'Guardam a sua escolha de cookies. Sem eles o site não sabe o que você respondeu aqui.',
    },
    analytics: {
      nome: 'Estatística',
      descricao: 'Google Analytics: mede visitas e uso das páginas. Só carrega se você aceitar.',
    },
    marketing: {
      nome: 'Marketing',
      descricao:
        'Guarda de qual campanha você chegou (parâmetros UTM), enviada ao nosso CRM se você entrar em contato, e deixa a Lusha identificar a empresa de onde vem a visita, pelo endereço IP.',
    },
  },
  en: {
    titulo: 'Cookies & privacy',
    aceitar: 'Accept all',
    recusar: 'Decline',
    preferencias: 'Preferences',
    salvar: 'Save choices',
    tituloDoPainel: 'Cookie preferences',
    mensagemDoPainel: 'Choose what the site may record. You can change this at any time.',
    necessarios: {
      nome: 'Necessary',
      descricao: 'Stores your cookie choice. Without it the site cannot remember what you answered here.',
    },
    analytics: {
      nome: 'Analytics',
      descricao: 'Google Analytics: measures visits and page usage. Only loads if you accept.',
    },
    marketing: {
      nome: 'Marketing',
      descricao:
        'Remembers which campaign brought you here (UTM parameters), sent to our CRM if you get in touch, and lets Lusha identify the company the visit comes from, by IP address.',
    },
  },
} as const

export function toAvisoDeCookies(doc: CookieConsent, locale: 'pt' | 'en'): AvisoDeCookies | null {
  /* O gate: sem a mensagem jurídica neste idioma, não há banner. */
  const mensagem = doc.bannerMessage?.trim()
  if (!mensagem) return null

  const r = RESERVA[locale]
  return {
    titulo: doc.bannerTitle?.trim() || r.titulo,
    mensagem,
    aceitar: doc.acceptLabel?.trim() || r.aceitar,
    recusar: doc.rejectLabel?.trim() || r.recusar,
    preferencias: doc.preferencesLabel?.trim() || r.preferencias,
    salvar: doc.saveLabel?.trim() || r.salvar,
    tituloDoPainel: doc.panelTitle?.trim() || r.tituloDoPainel,
    mensagemDoPainel: doc.panelMessage?.trim() || r.mensagemDoPainel,
    categorias: {
      necessarios: {
        nome: doc.necessary?.name?.trim() || r.necessarios.nome,
        descricao: doc.necessary?.description?.trim() || r.necessarios.descricao,
      },
      analytics: {
        nome: doc.analytics?.name?.trim() || r.analytics.nome,
        descricao: doc.analytics?.description?.trim() || r.analytics.descricao,
      },
      marketing: {
        nome: doc.marketing?.name?.trim() || r.marketing.nome,
        descricao: doc.marketing?.description?.trim() || r.marketing.descricao,
      },
    },
  }
}
