import { createElement } from 'react'

import {
  AppWindow,
  ArrowUpRight,
  Book,
  Briefcase,
  Building2,
  FileText,
  GraduationCap,
  Heart,
  Info,
  Newspaper,
  Star,
  UserCheck,
  Video,
  Award,
  Brain,
  ChartNoAxesColumn,
  Cloud,
  Cpu,
  Database,
  Lock,
  Search,
  Settings,
  ShieldCheck,
  TrendingUp,
  Zap,
  Rocket,
  Shield,
  Sparkles,
  Target,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react'

/* Nome guardado no CMS → componente de ícone.
 *
 * O par com `ICONES` em `src/blocks/shared.ts` precisa bater: lá é a lista que
 * o editor vê, aqui é o que ela desenha. `RECURSO` cobre o caso de os dois
 * divergirem — nome sem ícone vira um ícone neutro, não um buraco na página. */
const REGISTRO: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  target: Target,
  shield: Shield,
  rocket: Rocket,
  users: Users,
  database: Database,
  cloud: Cloud,
  brain: Brain,
  chart: ChartNoAxesColumn,
  lock: Lock,
  workflow: Workflow,
  award: Award,
  app: AppWindow,
  search: Search,
  settings: Settings,
  zap: Zap,
  cpu: Cpu,
  /* `shield-check` e `shield` são glifos diferentes no Lucide, e o legado usa os
   * dois: `Shield` em /sobre, `ShieldCheck` na página de solução. */
  'shield-check': ShieldCheck,
  'trending-up': TrendingUp,
  'arrow-up-right': ArrowUpRight,
  star: Star,
  'file-text': FileText,
  newspaper: Newspaper,
  video: Video,
  book: Book,
  briefcase: Briefcase,
  'graduation-cap': GraduationCap,
  heart: Heart,
  info: Info,
  'user-check': UserCheck,
  building: Building2,
}

const RECURSO = Sparkles

export function iconePorNome(nome: string): LucideIcon {
  return REGISTRO[nome] ?? RECURSO
}

/* Versão em componente, para quando o ícone é resolvido **fora** de um `map`.
 *
 * `const Icone = iconePorNome(x)` no corpo de um componente é criar componente
 * durante a renderização, e a regra `react-hooks/static-components` reprova —
 * com razão: o React remonta a subárvore a cada render, perdendo estado. Dentro
 * de um `map` o lint aceita, que é por onde os blocos mais antigos passam. */
export function Icone({ nome, size, className }: { nome: string; size?: number; className?: string }) {
  /* `createElement` e não JSX: escrever `const C = iconePorNome(nome)` para
   * depois usar `<C />` é o próprio padrão que a regra detecta, mesmo aqui,
   * onde o componente vem de um registro fixo e não é criado de fato. */
  return createElement(iconePorNome(nome), { size, className, 'aria-hidden': true })
}
