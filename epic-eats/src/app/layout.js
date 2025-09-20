import React from 'react'
import { Inter, Poppins } from 'next/font/google'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
import AuthProvider from './context/AuthProvider'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap'
})

export const metadata = {
  title: 'Epic Eats - Discover Amazing Recipes',
  description: 'Join the ultimate recipe sharing community. Discover, create, and share delicious recipes from around the world.',
  keywords: 'recipes, cooking, food, community, sharing, epic eats',
  authors: [{ name: 'Epic Eats Team' }],
  openGraph: {
    title: 'Epic Eats - Discover Amazing Recipes',
    description: 'Join the ultimate recipe sharing community',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} bg-gradient-to-br from-slate-50 via-white to-orange-50 min-h-screen antialiased`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <NavBar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
