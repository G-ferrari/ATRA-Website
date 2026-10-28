/* Os textos fixos da ilha do questionário, por idioma (D-76).
 *
 * O português é o do HTML do Roger (v1.7), caractere a caractere (D-22) — só
 * mudou de lugar, saindo de `questionario.tsx`. O inglês é tradução nossa,
 * revisada pelo marketing antes de ir ao ar. Mora fora do componente para o
 * teste conferir que os dois idiomas têm as mesmas chaves. */

import type { Idioma } from './idioma'

export const TEXTOS_DA_TELA = {
  pt: {
    marca: 'Diagnóstico de Maturidade de Dados',
    campos: {
      setor: { rotulo: 'Setor de atuação', erro: 'Informe o setor.' },
      porte: {
        rotulo: 'Faturamento anual aproximado',
        erro: 'Informe o porte.',
      },
      cargo: { rotulo: 'Seu cargo', erro: 'Informe o cargo.' },
    },
    selecione: 'Selecione…',
    voltar: 'Voltar',
    enviando: 'Enviando…',
    tentarDeNovo: 'Tentar novamente',
    receber: 'Receber meu diagnóstico',
    comecar: 'Começar',
    proxima: 'Próxima',
    ajuda: 'Gostaria de um atendimento mais personalizado?',
    ajudaLink: 'Clique para falar com nossos especialistas da ATRA',
    perfil: 'Perfil da empresa',
    instrucao: 'Escolha a alternativa que mais se aproxima da realidade hoje.',
    grupoDeEtiquetas: 'Área DAMA e regulações impactadas',
    tituloDama: 'Área de conhecimento DAMA-DMBOK',
    impacta: 'Impacta:',
    base: 'Base para todas as regulações do setor',
    impactosAvaliados: 'Impactos avaliados:',
    entreOutros: 'entre outros',
    contato: {
      pilula: 'Quase lá',
      titulo: 'Para onde enviamos o seu diagnóstico?',
      texto:
        'Você recebe por e-mail a leitura da maturidade por pilar, os gaps regulatórios do seu setor e recomendações práticas da ATRA.',
      isca: 'Não preencha este campo',
      nome: 'Nome completo',
      nomeExemplo: 'Como devemos te chamar',
      email: 'E-mail corporativo',
      emailExemplo: 'voce@suaempresa.com.br',
      telefone: 'Telefone / WhatsApp',
      telefoneExemplo: '(11) 99999-9999',
      empresa: 'Empresa',
      opcional: '(opcional)',
      empresaExemplo: 'Razão social ou nome fantasia',
      consentimentoAntes: 'Autorizo a ATRA a entrar em contato e a tratar meus dados conforme a',
      politica: 'Política de Privacidade',
      consentimentoDepois: '(LGPD).',
    },
    whatsapp: 'Falar no WhatsApp',
    conclusao: {
      titulo: 'Diagnóstico registrado. Obrigado!',
      enviamos: 'Enviamos o seu resultado para',
      spam: 'Não encontrou o e-mail? Confira também a caixa de spam ou de lixo eletrônico.',
      agenda: 'Agendar com um especialista',
    },
  },
  en: {
    marca: 'Data Maturity Assessment',
    campos: {
      setor: { rotulo: 'Industry', erro: 'Please select your industry.' },
      porte: {
        rotulo: 'Approximate annual revenue',
        erro: 'Please select your company size.',
      },
      cargo: { rotulo: 'Your role', erro: 'Please select your role.' },
    },
    selecione: 'Select…',
    voltar: 'Back',
    enviando: 'Sending…',
    tentarDeNovo: 'Try again',
    receber: 'Get my assessment',
    comecar: 'Start',
    proxima: 'Next',
    ajuda: 'Would you like more personalized assistance?',
    ajudaLink: "Click to talk to ATRA's specialists",
    perfil: 'Company profile',
    instrucao: 'Choose the option that best reflects your current reality.',
    grupoDeEtiquetas: 'DAMA area and impacted regulations',
    tituloDama: 'DAMA-DMBOK knowledge area',
    impacta: 'Impacts:',
    base: 'Foundation for all regulations in the sector',
    impactosAvaliados: 'Impacts assessed:',
    entreOutros: 'among others',
    contato: {
      pilula: 'Almost there',
      titulo: 'Where should we send your assessment?',
      texto:
        'You will receive by e-mail the maturity reading for each pillar, the regulatory gaps in your sector and practical recommendations from ATRA.',
      isca: 'Do not fill in this field',
      nome: 'Full name',
      nomeExemplo: 'What should we call you?',
      email: 'Work e-mail',
      emailExemplo: 'you@yourcompany.com',
      telefone: 'Phone / WhatsApp',
      telefoneExemplo: '+55 11 99999-9999',
      empresa: 'Company',
      opcional: '(optional)',
      empresaExemplo: 'Company name',
      consentimentoAntes: 'I authorize ATRA to contact me and to process my data in accordance with the',
      politica: 'Privacy Policy',
      consentimentoDepois: '(LGPD).',
    },
    whatsapp: 'Chat on WhatsApp',
    conclusao: {
      titulo: 'Assessment received. Thank you!',
      enviamos: 'We have sent your result to',
      spam: "Can't find the e-mail? Please also check your spam or junk folder.",
      agenda: 'Schedule with a specialist',
    },
  },
} as const

type Textos<T> = {
  readonly [K in keyof T]: T[K] extends string ? string : Textos<T[K]>
}
export type TextosDaTela = Textos<(typeof TEXTOS_DA_TELA)['pt']>

/* D-77: o espanhol sai em português até a tradução revisada entrar. */
export const textosDaTela = (idioma: Idioma): TextosDaTela => TEXTOS_DA_TELA[idioma === 'en' ? 'en' : 'pt']
