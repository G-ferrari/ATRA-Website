import type { Locale } from './locales'

/* A resposta padrão para pergunta fora do assunto do site (D-73), quando o
 * campo do admin está vazio. Sugere por onde seguir, em vez de só recusar:
 * quem perguntou da receita pode ser um cliente testando o chat. */
const PADRAO: Record<Locale, string> = {
  pt: 'Por aqui eu só consigo ajudar com assuntos da ATRA e do que publicamos no site: soluções de dados e IA, cases de clientes, conteúdos e como falar com o nosso time. Sobre o que você gostaria de saber?',
  en: 'Here I can only help with ATRA and what we publish on our website: data and AI solutions, client success stories, content and how to reach our team. What would you like to know?',
  es: 'Aquí solo puedo ayudarle con ATRA y con lo que publicamos en nuestro sitio: soluciones de datos e IA, casos de éxito de clientes, contenidos y cómo hablar con nuestro equipo. ¿Qué le gustaría saber?',
}

export function respostaForaDoAssunto(doAdmin: string | null | undefined, locale: Locale): string {
  return doAdmin?.trim() || PADRAO[locale]
}
