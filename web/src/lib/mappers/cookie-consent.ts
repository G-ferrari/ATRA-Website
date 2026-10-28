import type { CookieConsent } from '@/payload-types'
import type { AvisoDeCookies } from '@/types/content'
import type { Locale } from '../locales'

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
      /* D-40: o trecho da Lusha é o texto da Karen (22/09), **literal** — sem
         tirar nem pôr, por decisão de G-ferrari em 27/09. Não reescrever aqui:
         a revisão do texto completo dos cookies é da ATRA (P-14).
         D-54: a frase inicial passou a citar o RD Station, porque o
         monitoramento dele carrega sob esta categoria e o visitante precisa
         ler isso antes de aceitar. Redação provisória, entra na mesma P-14. */
      descricao:
        'Guarda de qual campanha você chegou (parâmetros UTM) e permite ao RD Station, nossa ferramenta de marketing, acompanhar sua navegação no site; os dois são enviados a ele se você entrar em contato. ' +
        'Utilizamos tecnologia de identificação de visitantes para entender quais empresas visitam nosso site. Essa tecnologia associa seu endereço IP a informações públicas da empresa. Não identificamos visitantes individuais nem rastreamos o comportamento de navegação pessoal. Esse processamento é baseado no seu consentimento, que pode ser revogado a qualquer momento por meio das preferências de cookies.',
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
      /* ⚠️ Tradução do texto da Karen, não texto dela: ela escreveu só em
         português. Entra na revisão do texto completo dos cookies (P-14). */
      descricao:
        'Remembers which campaign brought you here (UTM parameters) and lets RD Station, our marketing tool, follow your navigation on the site; both are sent to it if you get in touch. ' +
        'We use visitor identification technology to understand which companies visit our site. This technology matches your IP address to public company information. We do not identify individual visitors or track personal browsing behavior. This processing is based on your consent, which you can withdraw at any time through the cookie preferences.',
    },
  },
  es: {
    titulo: 'Cookies y privacidad',
    aceitar: 'Aceptar todas',
    recusar: 'Rechazar',
    preferencias: 'Preferencias',
    salvar: 'Guardar elecciones',
    tituloDoPainel: 'Preferencias de cookies',
    mensagemDoPainel: 'Elija lo que el sitio puede registrar. Puede cambiarlo cuando quiera.',
    necessarios: {
      nome: 'Necesarias',
      descricao: 'Guarda su elección de cookies. Sin ella, el sitio no puede recordar lo que respondió aquí.',
    },
    analytics: {
      nome: 'Estadísticas',
      descricao: 'Google Analytics: mide las visitas y el uso de las páginas. Solo se carga si usted acepta.',
    },
    marketing: {
      nome: 'Marketing',
      /* ⚠️ Traducción del texto de Karen, como la del inglés: entra en la misma
         revisión del texto completo de las cookies (P-14). */
      descricao:
        'Recuerda de qué campaña llegó (parámetros UTM) y permite que RD Station, nuestra herramienta de marketing, acompañe su navegación en el sitio; ambos se le envían si usted se pone en contacto. ' +
        'Utilizamos tecnología de identificación de visitantes para entender qué empresas visitan nuestro sitio. Esta tecnología asocia su dirección IP con información pública de la empresa. No identificamos a visitantes individuales ni rastreamos el comportamiento de navegación personal. Este tratamiento se basa en su consentimiento, que puede revocar en cualquier momento desde las preferencias de cookies.',
    },
  },
} as const

export function toAvisoDeCookies(doc: CookieConsent, locale: Locale): AvisoDeCookies | null {
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
