import type { Metadata } from 'next'
import '../index.css'

import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: 'AI PRO HUB',
  description: 'AI Project Monitoring Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="zh-Hant" className="dark">
        <body className="antialiased min-h-screen">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}

