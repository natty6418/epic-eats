"use client";
import React from 'react'
import { usePathname } from 'next/navigation'
import NavBar from '@/components/NavBar'

export default function NavBarWrapper() {
  const pathname = usePathname()
  if (pathname === '/home') return null
  return <NavBar />
}


