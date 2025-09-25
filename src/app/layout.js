import React from 'react'
import dynamic from 'next/dynamic'
const NavBarWrapper = dynamic(() => import('@/components/NavBarWrapper'), { ssr: false })
const MainWrapper = dynamic(() => import('@/components/MainWrapper'), { ssr: false })
import Footer from '@/components/Footer'
import AuthProvider from './context/AuthProvider'
import './globals.css'

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`bg-gradient-to-br from-slate-50 via-white to-orange-50 min-h-screen antialiased`} style={{ fontFamily: 'Poppins, Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif' }}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <NavBarWrapper />
            <MainWrapper>
              {children}
            </MainWrapper>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
