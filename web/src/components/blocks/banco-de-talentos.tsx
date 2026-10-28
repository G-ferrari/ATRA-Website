import { Send, Upload } from 'lucide-react'

import { Formulario } from '@/components/forms/formulario'
import { TechCornerBraces } from '@/components/ui'
import { AREAS, SENIORIDADES } from '@/lib/banco-de-talentos'
import type { Locale } from '@/lib/locales'
import type { BlocoJobsList } from '@/types/content'

import { TextoDestacado } from './texto-destacado'

/* Cartão "Banco de Talentos" — porte de `legacy/src/pages/Careers.tsx:450`.
 *
 * ⚠️ Fica **dentro** da seção de vagas, sob a grade, e não numa faixa própria no
 * fim da página: é para lá que os cards de vaga do legado apontam
 * (`href="#banco-talentos"`). MIG-050 o portou como um `ctaContact` final, e a
 * página nasceu com a ordem trocada e 700px a menos.
 *
 * O envio é MIG-102: Server Action `enviarFormulario` (kind `talent-pool`)
 * grava em form-submissions e sincroniza com o ATRAIR (`lib/atrair.ts`) —
 * melhor esforço, o admin é a fonte primária. Os campos foram portados com o
 * visual do estado ativo, então ligar o envio não moveu um pixel.
 *
 * Os rótulos não vêm do CMS: são chrome de formulário, não texto de marketing
 * (D-22). Quem edita a página muda o painel da esquerda, não os campos. Os
 * `value` dos selects são os próprios rótulos, no idioma da página — o ATRAIR
 * normaliza os valores em inglês para pt-BR do lado de lá. */

const TEXTOS = {
  pt: {
    nome: 'Nome Completo *',
    email: 'E-mail Corporativo/Pessoal *',
    linkedin: 'LinkedIn',
    telefone: 'Telefone / WhatsApp',
    area: 'Área de atuação',
    areas: AREAS.pt,
    senioridade: 'Senioridade',
    senioridades: SENIORIDADES.pt,
    enviar: 'Enviar Candidatura',
    sucesso: 'Candidatura recebida! Nossa equipe de recrutamento avaliará seu perfil e entrará em contato quando surgir uma oportunidade.',
  },
  en: {
    nome: 'Full name *',
    email: 'Work/personal e-mail *',
    linkedin: 'LinkedIn',
    telefone: 'Phone / WhatsApp',
    area: 'Field',
    areas: AREAS.en,
    senioridade: 'Seniority',
    senioridades: SENIORIDADES.en,
    enviar: 'Send application',
    sucesso: 'Application received! Our recruiting team will review your profile and reach out when an opportunity comes up.',
  },
  es: {
    nome: 'Nombre completo *',
    email: 'Correo corporativo/personal *',
    linkedin: 'LinkedIn',
    telefone: 'Teléfono / WhatsApp',
    area: 'Área de actuación',
    areas: AREAS.es,
    senioridade: 'Seniority',
    senioridades: SENIORIDADES.es,
    enviar: 'Enviar postulación',
    sucesso: '¡Postulación recibida! Nuestro equipo de selección evaluará su perfil y se pondrá en contacto cuando surja una oportunidad.',
  },
} as const

const CAMPO =
  'w-full bg-surface-2  rounded-[6px] px-3.5 py-2.5 text-xs text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary transition-colors disabled:opacity-100'

export function BancoDeTalentos({
  banco,
  locale,
}: {
  banco: NonNullable<BlocoJobsList['talentBank']>
  locale: Locale
}) {
  const t = TEXTOS[locale]

  return (
    <div
      id="banco-talentos"
      className="bg-surface-1  rounded-[6px] shadow-xl overflow-hidden max-w-5xl mx-auto flex flex-col lg:flex-row relative scroll-mt-32"
    >
      {/* Painel temático (D-31): claro no tema claro, grafite no escuro. */}
      <div className="lg:w-5/12 bg-surface-2 dark:bg-linear-to-br dark:from-[#12151c] dark:via-[#1a2130] dark:to-[#0e1015] p-8 lg:p-12 text-slate-900 dark:text-white flex flex-col justify-center relative">
        <TechCornerBraces color="blue" position="top-left" size={14} />
        <div className="relative z-10">
          {banco.eyebrow && (
            <span className="text-primary font-bold uppercase tracking-wider text-xs mb-3 block">{banco.eyebrow}</span>
          )}
          {banco.title && (
            <h3 className="text-2xl lg:text-3xl font-display leading-tight mb-4">
              {/* ⚠️ Laranja e **sem** `font-normal`: `Careers.tsx:456` usa só
                  `text-secondary`, enquanto o padrão do `TextoDestacado` é
                  `text-primary font-normal`. As duas diferenças importam — a
                  cor à vista, o peso na largura do trecho. */}
              <TextoDestacado texto={banco.title} destaque={banco.highlight} className="text-secondary" />
            </h3>
          )}
          {banco.description && (
            <p className="text-slate-600 dark:text-white/70 text-sm leading-relaxed mb-6">{banco.description}</p>
          )}

          {banco.note && (
            <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5  p-4 rounded-[6px]">
              <Upload size={20} className="text-primary shrink-0" aria-hidden />
              <p className="text-sm text-slate-600 dark:text-white/80 leading-relaxed">{banco.note}</p>
            </div>
          )}
        </div>
      </div>

      <div className="lg:w-7/12 p-8 lg:p-12 flex flex-col justify-center">
        {/* Os `name` são os que a action lê (`name`/`email`/`phone`); `linkedin`,
            `area` e `senioridade` são extras do kind `talent-pool`. */}
        <Formulario kind="talent-pool" className="space-y-3.5" sucesso={t.sucesso}>
          <input type="text" name="name" placeholder={t.nome} required className={CAMPO} />
          <input type="email" name="email" placeholder={t.email} required className={CAMPO} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <input type="text" name="linkedin" placeholder={t.linkedin} className={CAMPO} />
            <input type="tel" name="phone" placeholder={t.telefone} className={CAMPO} />
          </div>

          {/* ⚠️ NÃO existe seletor de vaga aqui, e é decisão (D-33). Este
              formulário é para quem NÃO encontrou vaga que sirva: quem
              encontrou clica no card da grade acima e se candidata na página
              da vaga, no ATRAIR, com a descrição à vista. O seletor chegou a
              existir (item 172 do ATRAIR) e foi retirado: eram duas portas
              para a mesma coisa, e a de baixo não mostrava a vaga. */}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <select name="area" aria-label={t.area} className={CAMPO}>
              <option value="">{t.area}</option>
              {t.areas.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>

            <select name="senioridade" aria-label={t.senioridade} className={CAMPO}>
              <option value="">{t.senioridade}</option>
              {t.senioridades.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* O aviso de privacidade (RH e jurídico, em Sistema → Contato →
              Candidaturas, D-67) vem antes do botão, para ser lido antes de
              enviar. A action guarda no cadastro uma cópia do que estava
              valendo. */}
          {banco.aviso && (
            <p
              id="aviso-do-banco-de-talentos"
              className="text-sm leading-relaxed text-text-muted whitespace-pre-line"
            >
              {banco.aviso}
            </p>
          )}

          <div className="pt-2">
            <button
              type="submit"
              aria-describedby={banco.aviso ? 'aviso-do-banco-de-talentos' : undefined}
              className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white px-7 py-3 rounded-[6px] text-xs font-semibold transition-all cursor-pointer shadow-md shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <Send size={13} aria-hidden />
              <span>{t.enviar}</span>
            </button>
          </div>
        </Formulario>
      </div>
    </div>
  )
}
