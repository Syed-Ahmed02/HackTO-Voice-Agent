import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'

import ConvexClientProvider from '@/components/ConvexClientProvider'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app-sidebar'
import { VapiProvider } from '@/contexts/VapiContext'
import { AuthenticatedLayout } from '../components/AuthenticatedLayout'

const inter = Inter({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Health Dashboard',
  description: 'Your personal health and fitness companion',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <ClerkProvider>
          <ConvexClientProvider>
            <VapiProvider>
              <AuthenticatedLayout>
                {children}
              </AuthenticatedLayout>
            </VapiProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}