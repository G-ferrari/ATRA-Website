import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'ATRA',
    template: '%s | ATRA',
  },
  description: 'Consultoria de Dados e IA.',
}

// A tipografia (Mona Sans via next/font/google) entra em MIG-009,
// o roteamento por idioma em MIG-006. Aqui, só a casca.
export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
