import type { Contato, Image, Seo } from '@/types/content'
import { absoluta, ORIGEM } from './seo'

/* MIG-107 — dados estruturados schema.org.
 *
 * O que o Google faz com isto: entende que a ATRA é uma organização (e junta o
 * painel de conhecimento com o LinkedIn e o YouTube), que um artigo tem data e
 * autor, e que uma solução é um serviço prestado por ela. Sem isto, tudo é
 * "página com texto".
 *
 * ⚠️ Nada aqui é conteúdo novo: é o que a página já mostra, num formato que a
 * máquina lê. Anunciar dado que a página não exibe é o que o Google chama de
 * markup enganoso, e a penalidade é a desindexação do recurso.
 *
 * ⚠️ Não desenha nada — vai num `<script type="application/ld+json">`, invisível.
 * Por isso não move um pixel do aceite visual.
 */

/** `@id` estável da organização, para os outros nós apontarem sem repetir tudo. */
export const ID_DA_ORGANIZACAO = `${ORIGEM}/#organizacao`

export type JsonLd = Record<string, unknown>

export function organizacao(args: { contato: Contato; logo: Image | null; fundadaEm?: number | null }): JsonLd {
  const { contato, logo, fundadaEm } = args

  /* `sameAs` é o que liga esta organização aos perfis dela. Só entram os que
   * existem: um `null` viraria a string "null" no JSON. */
  const redes = [contato.redes.linkedin, contato.redes.instagram, contato.redes.facebook, contato.redes.youtube].filter(
    (u): u is string => Boolean(u),
  )

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ID_DA_ORGANIZACAO,
    name: 'ATRA',
    url: `${ORIGEM}/`,
    ...(logo ? { logo: { '@type': 'ImageObject', url: absoluta(logo.url), width: logo.width, height: logo.height } } : {}),
    ...(fundadaEm ? { foundingDate: String(fundadaEm) } : {}),
    email: contato.email,
    telephone: contato.telefone,
    // Sem endereço no global, sem `address`: um PostalAddress vazio é pior que nenhum.
    ...(contato.endereco ? { address: { '@type': 'PostalAddress', streetAddress: contato.endereco, addressCountry: 'BR' } } : {}),
    ...(redes.length ? { sameAs: redes } : {}),
  }
}

/** Quem assina um artigo (D-80). Só o que o cadastro de autores tem. */
export type AutorJsonLd = { nome: string; cargo: string | null; perfil: string | null }

export function artigo(args: {
  seo: Seo
  url: string
  publicadoEm: string
  atualizadoEm?: string | null
  autores?: AutorJsonLd[]
}): JsonLd {
  const { seo, url, publicadoEm, atualizadoEm, autores = [] } = args
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: seo.title,
    description: seo.description || undefined,
    ...(seo.image ? { image: [absoluta(seo.image.url)] } : {}),
    datePublished: publicadoEm,
    dateModified: atualizadoEm ?? publicadoEm,
    /* Pessoa quando o artigo tem autor no admin (D-80); a organização quando
     * não tem. O WordPress não trazia autoria, então os 207 importados seguem
     * assinados pela ATRA até alguém atribuir — inventar um nome seria markup
     * enganoso, e o Google pede o autor "preciso". */
    author: autores.length ? autores.map(pessoa) : { '@id': ID_DA_ORGANIZACAO },
    publisher: { '@id': ID_DA_ORGANIZACAO },
    mainEntityOfPage: url,
  }
}

/* O Google pede `Person` para gente, com `url` ou `sameAs` apontando para
 * uma página que identifique a pessoa, e só o nome em `name` — cargo vai em
 * `jobTitle` (documentação de Article, "author best practices"). */
function pessoa(autor: AutorJsonLd): JsonLd {
  return {
    '@type': 'Person',
    name: autor.nome,
    ...(autor.cargo ? { jobTitle: autor.cargo } : {}),
    ...(autor.perfil ? { url: autor.perfil, sameAs: [autor.perfil] } : {}),
    worksFor: { '@id': ID_DA_ORGANIZACAO },
  }
}

/**
 * Serviço: solução ou segmento. No segmento, `publico` é o setor atendido
 * (Bancos, Saúde…) — o mesmo nome que a página mostra no título.
 */
export function servico(args: { seo: Seo; url: string; publico?: string }): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: args.seo.title,
    description: args.seo.description || undefined,
    ...(args.seo.image ? { image: [absoluta(args.seo.image.url)] } : {}),
    provider: { '@id': ID_DA_ORGANIZACAO },
    ...(args.publico ? { audience: { '@type': 'BusinessAudience', name: args.publico } } : {}),
    url: args.url,
  }
}

/**
 * O site (D-80). O Google usa o `WebSite` da página inicial como o sinal
 * principal para o nome do site nos resultados ("Site names"). Só na inicial:
 * é lá que a documentação manda pôr.
 */
export function site(args: { url: string; idioma: string }): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${ORIGEM}/#site`,
    name: 'ATRA',
    url: args.url,
    inLanguage: args.idioma,
    publisher: { '@id': ID_DA_ORGANIZACAO },
  }
}

/**
 * Trilha de navegação (BreadcrumbList), da inicial até a página. Cada degrau é
 * o nome que o visitante vê e a URL absoluta; o último é a própria página.
 */
export function trilha(degraus: { nome: string; url: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: degraus.map((d, i) => ({ '@type': 'ListItem', position: i + 1, name: d.nome, item: d.url })),
  }
}

/** FAQPage do bloco de perguntas frequentes. Texto puro, como a página mostra. */
export function perguntasFrequentes(itens: { question: string; answer: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: itens.map((i) => ({
      '@type': 'Question',
      name: i.question,
      acceptedAnswer: { '@type': 'Answer', text: i.answer },
    })),
  }
}

/**
 * Case de sucesso como `Article` (D-80): é um relato com data e autoria da
 * ATRA, e o tipo que o Google documenta para isso. O cliente, quando o case
 * o identifica, vai em `about` — é sobre ele que o texto fala.
 */
export function estudoDeCaso(args: { seo: Seo; url: string; publicadoEm: string; cliente: string | null }): JsonLd {
  return {
    ...artigo({ seo: args.seo, url: args.url, publicadoEm: args.publicadoEm }),
    ...(args.cliente ? { about: { '@type': 'Organization', name: args.cliente } } : {}),
  }
}

/**
 * Vaga (JobPosting), que também torna a vaga elegível à busca de empregos do
 * Google. Os obrigatórios da documentação: `title`, `description`,
 * `datePosted`, `hiringOrganization` e `jobLocation` — ou, na vaga remota,
 * `jobLocationType` com `applicantLocationRequirements`.
 *
 * ⚠️ A localidade do admin é texto livre ("São Paulo, SP"): vai inteira em
 * `addressLocality`. Separar cidade e estado seria adivinhar.
 */
export function vaga(args: {
  titulo: string
  descricao: string
  publicadaEm: string
  modelo: 'remote' | 'hybrid' | 'onsite'
  localidade: string | null
  url: string
}): JsonLd {
  const { titulo, descricao, publicadaEm, modelo, localidade, url } = args
  const remota = modelo === 'remote'
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: titulo,
    description: descricao,
    datePosted: publicadaEm,
    hiringOrganization: { '@id': ID_DA_ORGANIZACAO, '@type': 'Organization', name: 'ATRA', sameAs: `${ORIGEM}/` },
    ...(remota
      ? {
          jobLocationType: 'TELECOMMUTE',
          applicantLocationRequirements: { '@type': 'Country', name: 'BR' },
        }
      : {}),
    ...(localidade || !remota
      ? {
          jobLocation: {
            '@type': 'Place',
            address: {
              '@type': 'PostalAddress',
              ...(localidade ? { addressLocality: localidade } : {}),
              addressCountry: 'BR',
            },
          },
        }
      : {}),
    url,
  }
}

