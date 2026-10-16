'use client'

import {
  FieldDescription,
  FieldError,
  FieldLabel,
  useField,
  useTranslation,
  withCondition,
} from '@payloadcms/ui'
import type { SelectFieldClientComponent, Validate } from 'payload'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'

import { DESCRICAO_DOS_ICONES, GRUPOS_DE_ICONES, ICONES, type Icone as NomeDeIcone } from '@/blocks/icones'
import { Icone } from '@/components/blocks/icones'

import estilos from './campo-de-icone.module.css'

/* O campo "Ícone" dos blocos, com o desenho (15/10).
 *
 * O `select` padrão do Payload só mostrava o nome técnico em inglês
 * ("sparkles", "target"), e o time de conteúdo escolhia no escuro. Aqui o campo
 * mostra o ícone escolhido e abre uma grade com todos, agrupados, com busca
 * pelo nome em português. O valor guardado é o mesmo do `select` — trocar de
 * volta para o padrão é tirar o `admin.components.Field` do campo. */

const TEXTOS = {
  pt: {
    nenhum: 'Nenhum ícone',
    trocar: 'Trocar ícone',
    fechar: 'Fechar',
    procurar: 'Procurar (ex.: cadeado, nuvem, saúde)',
    rotuloDaBusca: 'Procurar ícone',
    semIcone: 'Sem ícone',
    vazio: 'Nenhum ícone com esse nome.',
  },
  en: {
    nenhum: 'No icon',
    trocar: 'Change icon',
    fechar: 'Close',
    procurar: 'Search (e.g. lock, cloud, health)',
    rotuloDaBusca: 'Search icon',
    semIcone: 'No icon',
    vazio: 'No icon matches.',
  },
}

/* "Saúde" casa "saude": quem digita no admin nem sempre acentua. */
const normalizar = (s: string) =>
  s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()

const ehIcone = (v: unknown): v is NomeDeIcone =>
  typeof v === 'string' && Object.hasOwn(DESCRICAO_DOS_ICONES, v)

const CampoDeIconeBase: SelectFieldClientComponent = (props) => {
  const { field, path: caminhoDaProp, readOnly, validate } = props
  const { label, localized, required, options } = field
  const { i18n } = useTranslation()
  const t = i18n.language === 'en' ? TEXTOS.en : TEXTOS.pt
  const emIngles = i18n.language === 'en'

  /* Mesma validação do `select` padrão, para o "obrigatório" e a lista fechada
   * avisarem antes de salvar, e não só na volta do servidor. */
  const validarNoCliente = useCallback<Validate>(
    (valor, opcoes) =>
      typeof validate === 'function'
        ? validate(valor, { ...opcoes, hasMany: false, options, required } as Parameters<typeof validate>[1])
        : true,
    [validate, options, required],
  )

  const { value, setValue, showError, disabled, path } = useField<string | null>({
    potentiallyStalePath: caminhoDaProp,
    validate: validarNoCliente,
  })

  const [aberto, setAberto] = useState(false)
  const [busca, setBusca] = useState('')
  const campoDeBusca = useRef<HTMLInputElement>(null)
  const idDoPainel = useId()
  const bloqueado = Boolean(readOnly || disabled)
  const atual = ehIcone(value) ? value : null

  useEffect(() => {
    if (aberto) campoDeBusca.current?.focus()
  }, [aberto])

  const grupos = useMemo(() => {
    const termo = normalizar(busca.trim())
    return GRUPOS_DE_ICONES.map((g) => ({
      ...g,
      icones: ICONES.filter(
        (nome) =>
          DESCRICAO_DOS_ICONES[nome].grupo === g.id &&
          (!termo ||
            normalizar(
              `${DESCRICAO_DOS_ICONES[nome].nome} ${DESCRICAO_DOS_ICONES[nome].termos} ${nome} ${g.nome}`,
            ).includes(termo)),
      ),
    })).filter((g) => g.icones.length > 0)
  }, [busca])

  const fechar = () => {
    setAberto(false)
    setBusca('')
  }

  const escolher = (nome: NomeDeIcone | null) => {
    setValue(nome)
    fechar()
  }

  const nomeVisivel = (nome: NomeDeIcone) => (emIngles ? nome : DESCRICAO_DOS_ICONES[nome].nome)

  return (
    <div className="field-type select">
      <FieldLabel label={label} localized={localized} path={path} required={required} />
      <FieldError path={path} showError={showError} />
      <button
        type="button"
        className={estilos.gatilho}
        onClick={() => (aberto ? fechar() : setAberto(true))}
        disabled={bloqueado}
        aria-expanded={aberto}
        aria-controls={idDoPainel}
      >
        <span className={estilos.amostra}>{atual ? <Icone nome={atual} size={22} /> : '—'}</span>
        <span className={estilos.nome}>{atual ? nomeVisivel(atual) : t.nenhum}</span>
        <span className={estilos.acao}>{aberto ? t.fechar : t.trocar}</span>
      </button>

      {aberto && (
        <div id={idDoPainel} className={estilos.painel}>
          <div className={estilos.topo}>
            <input
              ref={campoDeBusca}
              type="search"
              className={estilos.busca}
              placeholder={t.procurar}
              aria-label={t.rotuloDaBusca}
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') fechar()
                /* Enter no campo de busca submeteria o documento inteiro. Com
                   um resultado só, Enter escolhe esse. */
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const unicos = grupos.flatMap((g) => g.icones)
                  if (unicos.length === 1) escolher(unicos[0])
                }
              }}
            />
            {!required && (
              <button type="button" className={estilos.semIcone} onClick={() => escolher(null)}>
                {t.semIcone}
              </button>
            )}
          </div>

          <div className={estilos.lista}>
            {grupos.length === 0 && <p className={estilos.vazio}>{t.vazio}</p>}
            {grupos.map((g) => (
              <div key={g.id}>
                <p className={estilos.grupo}>{g.nome}</p>
                <div className={estilos.grade}>
                  {g.icones.map((nome) => (
                    <button
                      key={nome}
                      type="button"
                      className={estilos.opcao}
                      aria-pressed={nome === atual}
                      title={nome}
                      onClick={() => escolher(nome)}
                    >
                      <Icone nome={nome} size={22} />
                      <span>{nomeVisivel(nome)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <FieldDescription description={field.admin?.description} path={path} />
    </div>
  )
}

export const CampoDeIcone = withCondition(CampoDeIconeBase)
