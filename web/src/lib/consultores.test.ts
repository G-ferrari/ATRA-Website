import { describe, expect, it } from 'vitest'

import { emOrdem, exibicao, filtrarPerfis, total } from './consultores'
import type { ConsultantRole } from '@/types/content'

/* Fixture com os 8 perfis semeados e suas tags reais
 * (`web/scripts/seed/consultores.ts:23-96`). Os números destes testes vêm do
 * feedback de 20/09 e são os mesmos da FEATURE §1.1 — se o seed mudar, estes
 * testes mudam junto, de propósito. */
const perfil = (role: string, level: string, tags: string[], description?: string): ConsultantRole => ({
  slug: role, role, code: role.slice(0, 2).toUpperCase(), level, gradient: 'blue-cyan',
  description: description ?? `Descrição de ${role}`, tags, ecosystem: 0, allocatedProjects: 0,
  totalTeamSize: 0, certifications: [],
})

const PERFIS: ConsultantRole[] = [
  perfil('Data Engineer', 'Senior', ['Databricks', 'PySpark', 'Delta Lake', 'Airflow', 'AWS', 'BigQuery', 'dbt', 'SQL']),
  perfil('ML Engineer', 'Senior', ['Python', 'Vertex AI', 'MLflow', 'TensorFlow', 'OpenAI', 'LLM', 'LangChain', 'RAG']),
  perfil('Cloud Architect', 'Lead / Principal', ['GCP', 'AWS', 'Terraform', 'Kubernetes', 'FinOps', 'Azure IoT', 'Edge Computing']),
  perfil('Analytics Engineer', 'Senior', ['dbt', 'Snowflake', 'BigQuery', 'Looker', 'Power BI', 'DAX', 'SQL']),
  perfil('Data Governance Specialist', 'Lead / Principal', ['Collibra', 'Data Catalog', 'LGPD', 'ISO 27001', 'Privacy', 'SQL']),
  /* Descrição própria, com um termo que não aparece no cargo nem nas tags: é o
     único jeito de provar que a busca olha a descrição. */
  perfil('Data Scientist', 'Senior', ['Python', 'PySpark', 'SQL', 'Storytelling', 'Tableau', 'TensorFlow', 'LLM'],
    'Modelagem preditiva e desenho de experimentos para decisão de negócio.'),
  perfil('FinOps & Cloud Cost Specialist', 'Senior', ['FinOps', 'GCP', 'AWS', 'BigQuery', 'Looker', 'Kubernetes']),
  perfil('IoT & Edge Computing Specialist', 'Senior', ['Azure IoT', 'IoT', 'MQTT', 'Edge Computing', 'Python', 'Airflow']),
]

const filtrar = (tags: string[] = [], niveis: string[] = [], busca = '') =>
  filtrarPerfis({ perfis: PERFIS, tags: new Set(tags), niveis: new Set(niveis), busca })

const nomes = (lista: { perfil: ConsultantRole }[]) => lista.map((x) => x.perfil.role)

describe('filtrarPerfis (catálogo de /consultores)', () => {
  describe('sem filtro nenhum', () => {
    it('devolve os 8 perfis como completos, com alvo 0', () => {
      const r = filtrar()
      expect(r.completos).toHaveLength(8)
      expect(r.parciais).toHaveLength(0)
      expect(r.alvo).toBe(0)
    })

    it('preserva a ordem que veio do CMS', () => {
      expect(nomes(filtrar().completos)).toEqual(PERFIS.map((p) => p.role))
    })
  })

  describe('os exemplos do feedback de 20/09', () => {
    /* O caso que motivou a task: com corte seco, "E" daria lista vazia. */
    it('"GCP + FinOps + PySpark": 4 perfis no total, nenhum cobrindo tudo', () => {
      const r = filtrar(['GCP', 'FinOps', 'PySpark'])
      expect(total(r)).toBe(4)
      expect(r.completos).toHaveLength(0)
      expect(r.alvo).toBe(3)
      expect(nomes(emOrdem(r))).toEqual([
        'Cloud Architect',
        'FinOps & Cloud Cost Specialist',
        'Data Engineer',
        'Data Scientist',
      ])
    })

    it('"GCP + FinOps + PySpark": os dois primeiros cobrem 2 de 3', () => {
      const r = filtrar(['GCP', 'FinOps', 'PySpark'])
      expect(r.parciais.slice(0, 2)).toEqual([
        { perfil: expect.objectContaining({ role: 'Cloud Architect' }), cobertura: 2 },
        { perfil: expect.objectContaining({ role: 'FinOps & Cloud Cost Specialist' }), cobertura: 2 },
      ])
    })

    /* O caso da Karen: "um profissional que tenha AWS e GCP". */
    it('"AWS + GCP": Cloud Architect e FinOps & Cloud Cost cobrem tudo', () => {
      const r = filtrar(['AWS', 'GCP'])
      expect(nomes(r.completos)).toEqual(['Cloud Architect', 'FinOps & Cloud Cost Specialist'])
      expect(r.alvo).toBe(2)
      expect(total(r)).toBe(3)
      expect(nomes(r.parciais)).toEqual(['Data Engineer'])
    })

    it('"Looker + GCP + Delta Lake + BigQuery": ninguém cobre tudo, e mesmo assim sobra lista', () => {
      const r = filtrar(['Looker', 'GCP', 'Delta Lake', 'BigQuery'])
      expect(r.completos).toHaveLength(0)
      expect(total(r)).toBe(4)
    })
  })

  describe('agrupamento e ordenação', () => {
    it('completos vêm antes dos parciais em emOrdem', () => {
      const r = filtrar(['AWS', 'GCP'])
      expect(nomes(emOrdem(r))).toEqual([
        'Cloud Architect',
        'FinOps & Cloud Cost Specialist',
        'Data Engineer',
      ])
    })

    it('ordena por cobertura decrescente', () => {
      const cobertura = emOrdem(filtrar(['SQL', 'BigQuery', 'dbt'])).map((x) => x.cobertura)
      expect(cobertura).toEqual([...cobertura].sort((a, b) => b - a))
    })

    it('empate de cobertura mantém a ordem do CMS (sort estável)', () => {
      /* Os três têm exatamente 1 tag marcada — a ordem tem de ser a de entrada. */
      const r = filtrar(['Databricks', 'Collibra', 'MQTT'])
      expect(nomes(emOrdem(r))).toEqual([
        'Data Engineer',
        'Data Governance Specialist',
        'IoT & Edge Computing Specialist',
      ])
    })

    it('quem não tem nenhuma das tags marcadas sai da lista', () => {
      expect(nomes(emOrdem(filtrar(['MQTT'])))).toEqual(['IoT & Edge Computing Specialist'])
    })
  })

  describe('senioridade', () => {
    it('um nível corta para aquele nível', () => {
      expect(nomes(emOrdem(filtrar([], ['Lead / Principal'])))).toEqual([
        'Cloud Architect',
        'Data Governance Specialist',
      ])
    })

    /* ⚠️ Sem a tag, a união dos dois níveis **é** o catálogo inteiro (não há
       perfil "Pleno"), e o teste passaria mesmo se a multi-seleção fosse
       ignorada — que é a regressão que ele existe para pegar. `AWS` isola:
       tem dois Senior e um Lead. */
    it('dois níveis devolvem a união, não a interseção', () => {
      expect(nomes(emOrdem(filtrar(['AWS'], ['Senior'])))).toEqual([
        'Data Engineer',
        'FinOps & Cloud Cost Specialist',
      ])
      expect(nomes(emOrdem(filtrar(['AWS'], ['Lead / Principal'])))).toEqual(['Cloud Architect'])
      expect(nomes(emOrdem(filtrar(['AWS'], ['Senior', 'Lead / Principal'])))).toEqual([
        'Data Engineer',
        'Cloud Architect',
        'FinOps & Cloud Cost Specialist',
      ])
    })

    it('nível sem nenhum perfil esvazia — este é um caminho legítimo para o estado vazio', () => {
      expect(total(filtrar([], ['Pleno']))).toBe(0)
    })

    it('corta junto com as tags', () => {
      const r = filtrar(['AWS', 'GCP'], ['Lead / Principal'])
      expect(nomes(r.completos)).toEqual(['Cloud Architect'])
      expect(r.parciais).toHaveLength(0)
    })
  })

  describe('busca textual', () => {
    it('casa a tag, ignorando caixa', () => {
      expect(nomes(emOrdem(filtrar([], [], 'LOOKER')))).toEqual([
        'Analytics Engineer',
        'FinOps & Cloud Cost Specialist',
      ])
    })

    it('casa o cargo', () => {
      expect(nomes(emOrdem(filtrar([], [], 'governance')))).toEqual(['Data Governance Specialist'])
    })

    /* ⚠️ "experimentos" só existe na descrição do Data Scientist — não no cargo
       nem nas tags. Sem isto, tirar `p.description` do texto buscado não
       reprovaria teste nenhum. */
    it('casa a descrição', () => {
      expect(nomes(emOrdem(filtrar([], [], 'experimentos')))).toEqual(['Data Scientist'])
    })

    it('espaço em branco não filtra nada', () => {
      expect(total(filtrar([], [], '   '))).toBe(8)
    })

    it('termo sem casamento esvazia — o outro caminho legítimo para o estado vazio', () => {
      expect(total(filtrar([], [], 'cobol'))).toBe(0)
    })
  })
})

describe('exibicao (como o resultado é lido na tela)', () => {
  const ver = (tags: string[], modo: 'ou' | 'e') => exibicao(filtrar(tags), modo)

  it('modo OU: lista plana, sem faixa, mesmo com cobertura desigual', () => {
    const e = ver(['GCP', 'FinOps', 'PySpark'], 'ou')
    expect(e.faixa).toBe('nenhuma')
    expect(e.parciais).toHaveLength(0)
    expect(nomes(e.principais)).toHaveLength(4)
  })

  it('sem tag marcada não há cobertura a comparar, nem no modo E', () => {
    const e = ver([], 'e')
    expect(e.faixa).toBe('nenhuma')
    expect(e.principais).toHaveLength(8)
  })

  /* ⚠️ O caso que a primeira versão errava: a faixa aparecia como separador e
     dizia "nenhum perfil reúne tudo" com dois que reúnem renderizados acima. */
  it('modo E com os dois grupos: faixa é separador, e o grupo de cima existe', () => {
    const e = ver(['AWS', 'GCP'], 'e')
    expect(e.faixa).toBe('separador')
    expect(nomes(e.principais)).toEqual(['Cloud Architect', 'FinOps & Cloud Cost Specialist'])
    expect(nomes(e.parciais)).toEqual(['Data Engineer'])
  })

  it('modo E sem ninguém cobrindo tudo: faixa é aviso e não há grade de cima', () => {
    const e = ver(['GCP', 'FinOps', 'PySpark'], 'e')
    expect(e.faixa).toBe('aviso')
    expect(e.principais).toHaveLength(0)
    expect(e.parciais).toHaveLength(4)
  })

  it('modo E com todos cobrindo tudo: sem faixa e sem grade de baixo', () => {
    const e = ver(['MQTT'], 'e')
    expect(e.faixa).toBe('nenhuma')
    expect(nomes(e.principais)).toEqual(['IoT & Edge Computing Specialist'])
    expect(e.parciais).toHaveLength(0)
  })

  it('a faixa nunca é separador sem grupo de cima, em nenhuma combinação de tags', () => {
    const TAGS = [...new Set(PERFIS.flatMap((p) => p.tags))]
    for (const a of TAGS) {
      for (const b of TAGS) {
        const e = exibicao(filtrar([a, b]), 'e')
        if (e.faixa === 'separador') expect(e.principais.length).toBeGreaterThan(0)
        if (e.faixa === 'aviso') expect(e.principais).toHaveLength(0)
      }
    }
  })
})
