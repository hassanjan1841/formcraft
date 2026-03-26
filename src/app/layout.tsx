import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SessionProvider } from 'next-auth/react'
import ToastProvider from '@/components/ToastProvider'
import { ConfirmDialogProvider } from '@/components/ui/ConfirmDialog'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FormCraft',
  description: 'Simple form builder for everyone'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <ConfirmDialogProvider>
            <ToastProvider />
            {children}
          </ConfirmDialogProvider>
        </SessionProvider>
      </body>
    </html>
  )
}