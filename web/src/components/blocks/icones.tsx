import {
  AppWindow,
  Award,
  Brain,
  ChartNoAxesColumn,
  Cloud,
  Database,
  Lock,
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
}

const RECURSO = Sparkles

export function iconePorNome(nome: string): LucideIcon {
  return REGISTRO[nome] ?? RECURSO
}
