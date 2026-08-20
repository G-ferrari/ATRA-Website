import type { SpecialistRole } from '@/payload-types'
import type { ConsultantRole } from '@/types/content'

import { toTextos } from './shared'

export function toConsultantRole(doc: SpecialistRole): ConsultantRole {
  return {
    /* Sem slug próprio na collection; o `role` identifica na lista do cliente. */
    slug: doc.id ? String(doc.id) : doc.role,
    role: doc.role,
    code: doc.code,
    level: doc.level,
    gradient: doc.gradient ?? 'blue-cyan',
    description: doc.description,
    tags: toTextos(doc.tags, 'name'),
    ecosystem: (doc.allocatedProjects ?? 0) + (doc.allocatedPartners ?? 0),
    allocatedProjects: doc.allocatedProjects ?? 0,
    totalTeamSize: doc.totalTeamSize ?? 0,
    certifications: toTextos(doc.certifications, 'name'),
  }
}
