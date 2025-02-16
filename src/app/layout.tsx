import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import Providers from '../components/Providers'
import { Toaster } from 'sonner'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Image Ecommerce App',
  description: 'Commercial image ecommerce application'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className} antialiased`}>
        <Script
          src='https://checkout.razorpay.com/v1/checkout.js'
          strategy='lazyOnload'
        />
        <Providers>
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
