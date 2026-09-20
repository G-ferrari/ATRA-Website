/* As imagens que o protótipo desenha e o site novo não tem — só para revisão.
 *
 * O protótipo ilustra 35 pontos com foto de banco de imagens: 30 hotlinks do
 * Unsplash e 5 do `picsum.photos`. Nenhuma é acervo da ATRA, e o site novo põe
 * marcador em todos — `capa-pendente` nas capas, monograma nos depoimentos.
 * Isso é decisão registrada, não lacuna: escolher capa é conteúdo (D-22), e os
 * retratos representam gente desconhecida como pessoa identificável de dois
 * bancos clientes (D-14).
 *
 * ⚠️ **Só com `SEED_FIXTURES=1`.** Sem o sinal, tudo aqui devolve `null` e o
 * chamador cai no marcador. É o que separa "a revisão interna vê o protótipo
 * inteiro" de "foto de banco assinada pela ATRA no ar no cutover" — e é a mesma
 * chave que já guarda os 6 posts e as 6 vagas fictícias.
 *
 * ⚠️ Os arquivos ficam em `legacy/public/imagens/`, não aqui. Foi
 * `legacy/scripts/baixar-imagens.mjs` que os baixou, e é o `PROVENIENCIA.md` ao
 * lado deles que registra de onde cada um veio — copiar para cá duplicaria 4,6
 * MB e criaria uma segunda cópia para sair de sincronia com o manifesto. Cinco
 * seeds já leem de `../legacy` pelo mesmo motivo, e a dependência morre junto
 * com elas em MIG-135.
 *
 * A origem vai junto para o CMS, no campo `credit`: no admin, `filename` sozinho
 * não diz que a foto é de banco nem de qual.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'

import type { Payload } from 'payload'

const PASTA = path.resolve(process.cwd(), '../legacy/public/imagens')
const MIMES: Record<string, string> = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }

type Imagem = { arquivo: string; origem: string }

/* Cada chave é um ponto do protótipo, com o `file:linha` que a desenha. A
 * conferência foi por título, não por ordem: o array do seed e o do legado
 * batem hoje, e ordem é o que mais barato se desalinha.
 *
 * ⚠️ Dois pontos **não** estão aqui, de propósito — o relatório "Benchmarks de
 * Cloud Computing na América Latina" (`Reports.tsx:33`) e o artigo "Data Center
 * no Varejo" (`Blog.tsx:42`). A URL dos dois responde 404 na origem: o próprio
 * protótipo desenha imagem quebrada ali, e o legado já pôs um marcador local no
 * lugar. Não há imagem do protótipo a trazer, então eles seguem no
 * `capa-pendente`, que é o marcador **deste** lado. */
export const DO_PROTOTIPO = {
  // App.tsx:1462 — as 4 abas de destaque do herói
  'home.destaque.transformacao': { arquivo: 'unsplash-1522071820081-009f0129c71c-w1200-d4d8bc.jpg', origem: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop' },
  'home.destaque.eficiencia': { arquivo: 'unsplash-1551836022-d5d88e9218df-w1200-40c9aa.jpg', origem: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop' },
  'home.destaque.governanca': { arquivo: 'unsplash-1573496359142-b8d87734a5a2-w1200-4a8584.jpg', origem: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop' },
  'home.destaque.ia': { arquivo: 'unsplash-1531482615713-2afd69097998-w1200-f14c6f.jpg', origem: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop' },

  // App.tsx:2225-2267 — a vitrine de conteúdo, 4 cartões e o destaque
  'home.vitrine.inovacao': { arquivo: 'picsum-tech1x600x400-6656d3.jpg', origem: 'https://picsum.photos/seed/tech1/600/400' },
  'home.vitrine.impacto': { arquivo: 'picsum-tech2x600x400-7656a4.jpg', origem: 'https://picsum.photos/seed/tech2/600/400' },
  'home.vitrine.ceos': { arquivo: 'picsum-tech3x600x600-80827c.jpg', origem: 'https://picsum.photos/seed/tech3/600/600' },
  'home.vitrine.ia-generativa': { arquivo: 'picsum-tech4x600x600-8054dd.jpg', origem: 'https://picsum.photos/seed/tech4/600/600' },
  'home.vitrine.destaque': { arquivo: 'picsum-tech5x600x800-aa403b.jpg', origem: 'https://picsum.photos/seed/tech5/600/800' },

  // Insights.tsx:99-211 — as 7 capas que não são de case
  'insights.panorama-dados-ia': { arquivo: 'unsplash-1460925895917-afdab827c52f-w1000-2a70d8.jpg', origem: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000' },
  'insights.squad-gerenciada': { arquivo: 'unsplash-1522071820081-009f0129c71c-w1000-4dc2c5.jpg', origem: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000' },
  'insights.guia-governanca': { arquivo: 'unsplash-1451187580459-43490279c0fa-w1000-be1d3a.jpg', origem: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000' },
  'insights.rag-em-producao': { arquivo: 'unsplash-1677442136019-21780ecad995-w1000-23cfa2.jpg', origem: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000' },
  'insights.multicloud': { arquivo: 'unsplash-1519389950473-47ba0277781c-w1000-1bdba7.jpg', origem: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000' },
  'insights.finops-benchmark': { arquivo: 'unsplash-1551836022-d5d88e9218df-w1000-876296.jpg', origem: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1000' },
  'insights.playbook-lakehouse': { arquivo: 'unsplash-1518770660439-4636190af475-w1000-a794b4.jpg', origem: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000' },

  // Reports.tsx:17-25 — o terceiro relatório é o da URL morta
  'relatorio.anual-2025': { arquivo: 'unsplash-1504868584819-f8e8b4b6d7e3-w1000-effa6f.jpg', origem: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1000' },
  'relatorio.ia-produtividade': { arquivo: 'unsplash-1460925895917-afdab827c52f-w600-4ac9c8.jpg', origem: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600' },

  // Ebooks.tsx:16-32
  'ebook.lakehouse-executivos': { arquivo: 'unsplash-1544716278-ca5e3f4abd8c-w600-64c640.jpg', origem: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600' },
  'ebook.governanca-ia': { arquivo: 'unsplash-1516979187457-637abb4f9353-w600-d699f1.jpg', origem: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600' },
  'ebook.cloud-native': { arquivo: 'unsplash-1507842217343-583bb7270b66-w600-b23e43.jpg', origem: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=600' },

  // Webinars.tsx:16-32
  'webinar.tendencias-madureira': { arquivo: 'unsplash-1511578314322-379afb476865-w1200-9c9576.jpg', origem: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200' },
  'webinar.ia-sociedade': { arquivo: 'unsplash-1485827404703-89b55fcc595e-w1200-43de5f.jpg', origem: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200' },
  'webinar.data-show-lakehouse': { arquivo: 'unsplash-1516110833967-0b5716ca1387-w1200-2e772b.jpg', origem: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&q=80&w=1200' },

  // Blog.tsx:18-58 — o quarto artigo é o da URL morta
  'blog.squad-gerenciada': { arquivo: 'unsplash-1522071820081-009f0129c71c-w1000-4dc2c5.jpg', origem: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000' },
  'blog.ia-preditiva': { arquivo: 'unsplash-1677442136019-21780ecad995-w600-726822.jpg', origem: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600' },
  'blog.multicloud': { arquivo: 'unsplash-1519389950473-47ba0277781c-w600-018738.jpg', origem: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600' },
  'blog.roi-em-ti': { arquivo: 'unsplash-1460925895917-afdab827c52f-w600-4ac9c8.jpg', origem: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600' },
  'blog.seguranca-2026': { arquivo: 'unsplash-1550751827-4bd374c3f58b-w600-1d7730.jpg', origem: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600' },

  /* App.tsx:1950-1968 — os 4 retratos dos depoimentos da home.
   *
   * ⚠️ Estes são de outra natureza que o resto do mapa. Não ilustram conteúdo
   * fictício: aparecem legendados com **cargo e empresa reais** de ABC Brasil e
   * Banco Carrefour, então a foto de um desconhecido se apresenta como pessoa
   * identificável daqueles dois bancos. Foi por isso que D-14 descartou as 4 e
   * pôs monograma. Aqui eles existem só para a revisão interna ver o gabarito
   * inteiro; promovê-los a conteúdo é reverter D-14. */
  'depoimento.abc-arquitetura': { arquivo: 'unsplash-1573496359142-b8d87734a5a2-w300-83893e.jpg', origem: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop' },
  'depoimento.abc-cloud-devops': { arquivo: 'unsplash-1507003211169-0a1dd7228f2d-w300-0cf429.jpg', origem: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop' },
  'depoimento.carrefour-engenharia': { arquivo: 'unsplash-1573497019940-1c28c88b4f3e-w300-828d67.jpg', origem: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=300&auto=format&fit=crop' },
  'depoimento.carrefour-risco': { arquivo: 'unsplash-1500648767791-00dcc994a43e-w300-caea79.jpg', origem: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop' },

  // SolutionAI.tsx:166 e :715
  'solucao-ia.hero': { arquivo: 'unsplash-1620712943543-bcc4688e7485-w800-70eab8.jpg', origem: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  'solucao-ia.como-fazemos': { arquivo: 'unsplash-1550751827-4bd374c3f58b-w800-b6bbe4.jpg', origem: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
} as const satisfies Record<string, Imagem>

export type ChaveDoPrototipo = keyof typeof DO_PROTOTIPO

/** `true` quando o seed foi chamado com o sinal de fixture. */
export const comFixtures = () => Boolean(process.env.SEED_FIXTURES)

/**
 * Devolve o id da mídia do protótipo, ou `null` para o chamador cair no
 * marcador. Idempotente: a segunda corrida acha a mídia e não sobe de novo.
 *
 * ⚠️ A busca é por **prefixo do nome sem extensão**, e não pelo nome inteiro. A
 * collection converte todo upload para WebP (`Media.ts`, `formatOptions`), então
 * o `.jpg` que sobe vira `.webp` no `filename` e a comparação exata nunca casa —
 * o efeito seria subir as 27 imagens de novo a cada `pnpm seed`. É o mesmo
 * cuidado que `insights.ts` já toma.
 */
export async function imagemDoPrototipo(
  payload: Payload,
  chave: ChaveDoPrototipo,
  alt: string,
): Promise<number | null> {
  if (!comFixtures()) return null

  const { arquivo, origem } = DO_PROTOTIPO[chave]
  const raiz = arquivo.replace(/\.[^.]+$/, '')
  const { docs } = await payload.find({
    collection: 'media',
    where: { filename: { contains: raiz } },
    limit: 1,
    depth: 0,
  })
  if (docs[0]) return docs[0].id

  const doc = await payload.create({
    collection: 'media',
    data: { alt, credit: origem },
    file: {
      data: readFileSync(path.join(PASTA, arquivo)),
      mimetype: MIMES[path.extname(arquivo).toLowerCase()] ?? 'image/jpeg',
      name: arquivo,
      size: 0,
    },
    locale: 'pt',
  })
  return doc.id
}
