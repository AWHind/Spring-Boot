import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import './globals.css'
import { Providers } from '@/lib/providers'
import { Chatbot } from '@/components/common/Chatbot'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800']
})

export const metadata: Metadata = {
  title: 'Maison Élysia - Restaurant Gastronomique',
  description: 'Découvrez une cuisine contemporaine inspirée des grandes traditions françaises',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <Providers>
          {children}
          <Chatbot />
        </Providers>
      </body>
    </html>
  )
}
