import type { Locale } from '@/lib/locales'
import type { BlocoSectionListing } from '@/types/content'

import { ListaDeCases } from './lista-de-cases'
import { ListaDeEbooks } from './lista-de-ebooks'
import { ListaDeMidia } from './lista-de-midia'
import { ListaDeSegmentos } from './lista-de-segmentos'
import { ListaDeSolucoes } from './lista-de-solucoes'
import { ListaDeWebinars } from './lista-de-webinars'
import { ListaDoBlog } from './lista-do-blog'
import { SecaoDeConsultores } from './secao-de-consultores'

/**
 * "Lista da seção" (feature paginas-mestras, D-55): a parte automática de cada
 * página-mestra, no desenho que a rota tinha. A seção vem da página em que o
 * bloco está, nunca de um campo — o mesmo bloco numa página comum não lista
 * nada (`conteudo` é `null`) e some.
 */
export function BlocoListaDaSecao({ bloco, locale }: { bloco: BlocoSectionListing; locale: Locale }) {
  const { conteudo, cabecalho, abertura, anchor } = bloco
  if (!conteudo) return null
  const comum = { cabecalho, locale, abertura, anchor }

  switch (conteudo.secao) {
    case 'solucoes':
      return <ListaDeSolucoes {...comum} solucoes={conteudo.solucoes} />
    case 'segmentos':
      return <ListaDeSegmentos {...comum} segmentos={conteudo.segmentos} />
    case 'webinars':
      return <ListaDeWebinars {...comum} webinars={conteudo.webinars} />
    case 'midia':
      return <ListaDeMidia {...comum} materias={conteudo.materias} />
    case 'ebooks':
      return <ListaDeEbooks {...comum} materiais={conteudo.materiais} />
    case 'cases':
      return (
        <ListaDeCases {...comum} cases={conteudo.cases} incompletos={conteudo.incompletos} topicos={conteudo.topicos} />
      )
    case 'blog':
      return (
        <ListaDoBlog
          {...comum}
          posts={conteudo.posts}
          pagina={conteudo.pagina}
          totalDePaginas={conteudo.totalDePaginas}
        />
      )
    case 'consultores':
      return <SecaoDeConsultores {...comum} perfis={conteudo.perfis} contato={conteudo.contato} />
  }
}
