"use client";
import React from 'react'
import { usePathname } from 'next/navigation'

export default function MainWrapper({ children }) {
  const pathname = usePathname()
  const isHome = pathname === '/home'
  const paddingClasses = isHome ? '' : 'pt-16 md:pt-20'
  return (
    <main className={`flex-1 ${paddingClasses}`}>
      {children}
    </main>
  )
}


