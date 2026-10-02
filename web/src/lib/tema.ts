/* Tema claro/escuro (D-48, 02/10).
 *
 * Até aqui o site abria **sempre no escuro** e esquecia a troca a cada
 * carregamento — herança do protótipo (`App.tsx:2575`), anotada no alternador
 * como "melhoria consciente, para depois do aceite visual". Agora:
 *
 * 1. quem já escolheu no botão recebe o que escolheu;
 * 2. quem nunca escolheu recebe o tema do sistema (computador ou celular);
 * 3. sem saber nenhum dos dois — sem JavaScript, robô —, escuro, como sempre.
 *
 * A escolha mora no `localStorage` do navegador, na chave abaixo. É preferência
 * de exibição, não rastreamento: não identifica ninguém e não sai do aparelho.
 * Deve ser citada na política de cookies quando o texto for revisado (P-14). */

export type Tema = 'light' | 'dark'

export const CHAVE_DO_TEMA = 'atra-tema'

export const ehTema = (valor: unknown): valor is Tema => valor === 'light' || valor === 'dark'

/** A regra, em função pura: a escolha salva vence; sem ela, vale o sistema. */
export function temaInicial(salvo: string | null, sistemaPrefereClaro: boolean): Tema {
  if (ehTema(salvo)) return salvo
  return sistemaPrefereClaro ? 'light' : 'dark'
}

/**
 * O mesmo que `temaInicial`, como texto de `<script>` para o topo do `<body>`.
 *
 * ⚠️ Tem de rodar **antes da primeira pintura**, e por isso não pode ser código
 * de componente: o servidor manda `<html class="dark">` (ele não sabe o tema de
 * ninguém), e esperar a hidratação para corrigir faria a página de quem usa
 * tema claro piscar no escuro. Um `<script>` no começo do `<body>` bloqueia a
 * pintura por alguns microssegundos e troca a classe antes de haver o que ver.
 *
 * ⚠️ É a regra escrita **duas vezes** — aqui em texto, acima em TypeScript. O
 * teste roda este texto contra `temaInicial` em todas as combinações, para as
 * duas não divergirem.
 *
 * O `try` cobre `localStorage` bloqueado (modo privado de alguns navegadores,
 * cookies desligados): lança ao ler, e o tema do sistema ainda vale.
 */
export const SCRIPT_DO_TEMA = `(function(){var s=null;try{s=localStorage.getItem('${CHAVE_DO_TEMA}')}catch(e){}var c=false;try{c=window.matchMedia('(prefers-color-scheme: light)').matches}catch(e){}var t=s==='light'||s==='dark'?s:(c?'light':'dark');var l=document.documentElement.classList;l.toggle('dark',t==='dark');l.toggle('light',t==='light')})()`
