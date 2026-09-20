/* Traz para o repositório as imagens que o protótipo referencia por URL.
 *
 * O protótipo desenha 78 imagens que não estão no projeto: 35 fotos do
 * Unsplash, 5 do picsum.photos, 11 hotlinks do WordPress da ATRA e o logo do
 * Google Cloud, servido pelo CDN do próprio Google. Nenhuma delas sobrevive a
 * ficar sem internet, e as do `picsum.photos` **mudam a cada carregamento** —
 * o endereço devolve uma foto aleatória, então o protótipo nunca foi duas vezes
 * a mesma coisa para quem estava analisando.
 *
 * Este script baixa cada URL uma vez, grava em `public/imagens/` e escreve o
 * manifesto ao lado. O manifesto é o que impede a origem de se perder: daqui a
 * seis meses ninguém sabe de onde veio `unsplash-1522071820081-w1200.jpg` sem
 * ele, e a licença de banco de imagem depende de saber.
 *
 * Rodar com: node scripts/baixar-imagens.mjs
 *   --refazer   rebaixa o que já existe
 */
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { readdirSync, statSync } from 'node:fs'

const DESTINO = 'public/imagens'

/**
 * URLs que **morreram na origem**, com o substituto local que ficou no lugar.
 *
 * Não é decisão de estilo: as duas respondem 404 hoje, com ou sem os parâmetros
 * de query, e o protótipo já desenhava imagem quebrada nesses três pontos.
 *
 * - O logo do Google Cloud vinha do CDN do Google, num caminho versionado
 *   (`.../v22100652613437168/...`) que o Google rotacionou. O substituto é o
 *   **mesmo logo**, o que a ATRA publica no próprio WordPress e o que o site
 *   novo serve — restaura o que a página queria mostrar, não inventa outra.
 * - A foto do Unsplash foi removida de lá. Ela ilustra dois cartões de conteúdo
 *   **fictício** (um relatório e um artigo que a migração descarta), então não
 *   há conteúdo a preservar: entra o marcador `capa-pendente`, que já é o
 *   vocabulário do projeto para capa que ainda não existe.
 */
const SUBSTITUIDAS = {
  'https://www.gstatic.com/devrel-devsite/prod/v22100652613437168/cloud/images/cloud-logo.svg':
    'logo-google-cloud.png',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=600':
    'capa-indisponivel.png',
}
const MANIFESTO = join(DESTINO, 'PROVENIENCIA.md')
const REFAZER = process.argv.includes('--refazer')

/* ⚠️ User-agent de browser. O WordPress da ATRA roda atrás do WAF do RunCloud,
 * que responde 302 para `/RUNCLOUD-8G-WAF-BLOCKED` quando o agente parece robô
 * — a mesma armadilha que MIG-080 documenta no cliente da API. */
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

/**
 * ⚠️ Redirect é seguido **menos** no WordPress da ATRA.
 *
 * O `picsum.photos` responde 302 apontando para a foto sorteada — é assim que
 * ele funciona, e recusar o redirect faz as 5 falharem. Já no WordPress o 302
 * é o WAF mandando o robô para `/RUNCLOUD-8G-WAF-BLOCKED`, e segui-lo grava uma
 * página de HTML com nome de imagem. Os dois casos são 302; o que decide é o
 * destino, então a regra é por host.
 */
const seguirRedirect = (url) => !new URL(url).hostname.endsWith('atra.com.br')

const EXTENSAO = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/avif': '.avif',
  'image/gif': '.gif',
}

/**
 * As 52 URLs que o protótipo referenciava direto no código, antes desta pasta
 * existir.
 *
 * ⚠️ A lista fica **aqui**, e não é varrida do código. A primeira versão do
 * script lia as URLs dos `.tsx` — e deixou de achar qualquer coisa no instante
 * em que a reescrita trocou as URLs por caminhos locais, que é exatamente o
 * efeito que ele mesmo produz. Rodar de novo apagava o manifesto e reportava
 * "0 URLs". A proveniência precisa sobreviver ao próprio trabalho.
 *
 * Imagem nova entra por aqui; quem usa cada arquivo é descoberto varrendo o
 * código atrás de `/imagens/<arquivo>`, que continua verdadeiro com o tempo.
 */
const URLS = [
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=300&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=600',
  'https://picsum.photos/seed/tech1/600/400',
  'https://picsum.photos/seed/tech2/600/400',
  'https://picsum.photos/seed/tech3/600/600',
  'https://picsum.photos/seed/tech4/600/600',
  'https://picsum.photos/seed/tech5/600/800',
  'https://www.atra.com.br/wp-content/uploads/2021/03/Google_Cloud_Platform-Logo.wine_-2048x1365.png',
  'https://www.atra.com.br/wp-content/uploads/2021/03/Microsoft_Azure-Logo.wine_-1536x1024.png',
  'https://www.atra.com.br/wp-content/uploads/2023/08/image-removebg-preview-4.png',
  'https://www.atra.com.br/wp-content/uploads/2023/11/denodo-tranparent-logo.png',
  'https://www.atra.com.br/wp-content/uploads/2024/08/GPTW-Selos-site-1-768x768.png',
  'https://www.atra.com.br/wp-content/uploads/2025/02/Atlan-logo-full.svg_.png',
  'https://www.atra.com.br/wp-content/uploads/2025/02/Horizontal_BigID_Logo-2048x1072.jpg',
  'https://www.atra.com.br/wp-content/uploads/2025/05/Databricks_Logo2-1536x813.png',
  'https://www.atra.com.br/wp-content/uploads/2025/06/logo-ibm.png',
  'https://www.atra.com.br/wp-content/uploads/2025/08/GPTW-Selos-site.jpg',
  'https://www.atra.com.br/wp-content/uploads/2025/08/atra_horizontal_cor-2048x1134.png',
  'https://www.gstatic.com/devrel-devsite/prod/v22100652613437168/cloud/images/cloud-logo.svg',
]

/** Quais arquivos do protótipo desenham cada imagem. */
function usosDe(arquivo) {
  const usos = []
  const andar = (dir) => {
    for (const nome of readdirSync(dir)) {
      const caminho = join(dir, nome)
      if (statSync(caminho).isDirectory()) {
        andar(caminho)
        continue
      }
      if (!/\.(tsx?|jsx?)$/.test(nome)) continue
      if (readFileSync(caminho, 'utf8').includes(`/imagens/${arquivo}`)) usos.push(caminho)
    }
  }
  andar('src')
  return usos
}

/**
 * Nome estável, legível e sem colisão.
 *
 * ⚠️ A largura entra no nome, e não é detalhe: o mesmo `photo-1522071820081`
 * aparece em três lugares do protótipo com `w=800`, `w=1000` e `w=1200`, e o
 * Unsplash entrega arquivos diferentes. Guardar um só e apontar os três para
 * ele mudaria a caixa de duas imagens — largura sai do aspecto quando a altura
 * é fixa. O sufixo do hash desempata o resto.
 */
function nomeDe(url) {
  const u = new URL(url)
  const hash = createHash('sha1').update(url).digest('hex').slice(0, 6)

  if (u.hostname === 'images.unsplash.com') {
    const id = u.pathname.replace('/photo-', '').replace(/^\//, '')
    const w = u.searchParams.get('w')
    return `unsplash-${id}${w ? `-w${w}` : ''}-${hash}`
  }
  if (u.hostname === 'picsum.photos') {
    return `picsum-${u.pathname.replace(/^\/seed\//, '').replace(/\//g, 'x')}-${hash}`
  }
  const base = decodeURIComponent(u.pathname.split('/').pop() ?? hash).replace(/\.[^.]+$/, '')
  return `${base.slice(0, 60)}-${hash}`
}

mkdirSync(DESTINO, { recursive: true })

console.log(`→ ${URLS.length} URLs de origem\n`)

const linhas = []
const substituidas = []
let baixadas = 0
let reaproveitadas = 0
const falhas = []

for (const url of [...URLS].sort()) {
  if (SUBSTITUIDAS[url]) {
    substituidas.push({ arquivo: SUBSTITUIDAS[url], url })
    continue
  }

  const base = nomeDe(url)
  const jaExiste = readdirSync(DESTINO).find((f) => f.startsWith(`${base}.`))

  if (jaExiste && !REFAZER) {
    reaproveitadas++
    linhas.push({ arquivo: jaExiste, url })
    continue
  }

  try {
    const r = await fetch(url, {
      headers: { 'user-agent': UA },
      redirect: seguirRedirect(url) ? 'follow' : 'manual',
    })
    if (r.status !== 200) throw new Error(`HTTP ${r.status}`)

    const tipo = (r.headers.get('content-type') ?? '').split(';')[0].trim()
    const ext = EXTENSAO[tipo]
    if (!ext) throw new Error(`content-type inesperado: ${tipo || '(vazio)'}`)

    const bytes = Buffer.from(await r.arrayBuffer())
    const arquivo = `${base}${ext}`
    writeFileSync(join(DESTINO, arquivo), bytes)
    linhas.push({ arquivo, url })
    baixadas++
    console.log(`  ↓ ${arquivo.padEnd(52)} ${(bytes.length / 1024).toFixed(0)} KB`)
  } catch (erro) {
    falhas.push(`${url} → ${erro.message}`)
  }
}

linhas.sort((a, b) => a.arquivo.localeCompare(b.arquivo))

writeFileSync(
  MANIFESTO,
  `# Proveniência das imagens do protótipo

Gerado por \`scripts/baixar-imagens.mjs\`. **Não editar à mão.**

Cada arquivo desta pasta foi baixado de uma URL que o protótipo referenciava
direto no código. A tabela existe por dois motivos: saber de onde veio cada
imagem (licença de banco de imagem depende disso) e poder rebaixar tudo se
alguma se corromper.

⚠️ As \`picsum-*\` vinham de \`picsum.photos\`, que devolve **foto aleatória a cada
requisição**. O que está aqui é o que o endereço devolveu no dia do download —
não há original a que voltar.

| Arquivo | Origem | Usado em |
|---|---|---|
${linhas
  .map((l) => `| \`${l.arquivo}\` | ${l.url} | ${usosDe(l.arquivo).map((a) => `\`${a}\``).join(', ') || '—'} |`)
  .join('\n')}

## Substituídas

Estas URLs **respondem 404 na origem** — o protótipo já desenhava imagem
quebrada nelas. O substituto é local e está explicado em \`SUBSTITUIDAS\`, no
topo de \`scripts/baixar-imagens.mjs\`.

| Arquivo | URL morta | Usado em |
|---|---|---|
${substituidas
  .map((l) => `| \`${l.arquivo}\` | ${l.url} | ${usosDe(l.arquivo).map((a) => `\`${a}\``).join(', ') || '—'} |`)
  .join('\n')}
`,
)

console.log(
  `\n  ${baixadas} baixadas · ${reaproveitadas} já existiam · ${substituidas.length} substituídas (404 na origem) · ${falhas.length} falhas`,
)
for (const f of falhas) console.log(`  ✗ ${f}`)
console.log(`  manifesto em ${MANIFESTO}`)
process.exit(falhas.length ? 1 : 0)
