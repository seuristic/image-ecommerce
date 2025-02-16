import * as React from 'react'
import Navbar from '../ui/Navbar'
import { cn } from '@/lib/utils'

export default function MainLayout({
  className,
  children
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <div className={cn('mx-auto max-w-7xl p-6', className)}>{children}</div>
    </>
  )
}
