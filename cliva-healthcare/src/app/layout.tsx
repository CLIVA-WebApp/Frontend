import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CLIVA - Clinical Services Evaluation WebApp',
  description: 'A digital platform designed to make invisible healthcare gaps visible, helping local governments, public health planners, and NGOs improve access to care where it\'s needed most.',
  keywords: 'healthcare, clinical services, evaluation, public health, medical planning, NGO, accessibility',
  authors: [{ name: 'Team CLIVA' }],
  creator: 'Team CLIVA',
  publisher: 'Team CLIVA',
  robots: 'index, follow',
  openGraph: {
    title: 'CLIVA - Clinical Services Evaluation WebApp',
    description: 'Making invisible healthcare gaps visible with AI-powered tools',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CLIVA - Clinical Services Evaluation WebApp',
    description: 'Making invisible healthcare gaps visible with AI-powered tools',
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#1e40af',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}