import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Mescla classes resolvendo conflitos do Tailwind. Portado de legacy/src/lib/utils.ts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
