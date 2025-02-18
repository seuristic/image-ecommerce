'use client'

import ProductForm from '@/components/admin/ProductForm'
import PageLoader from '@/components/PageLoader'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import * as React from 'react'

export default function Admin() {
  const { data: session, status } = useSession()
  const router = useRouter()

  React.useEffect(() => {
    if (!session || session.user.role !== 'admin') {
      router.replace('/')
    }
  }, [session, router])

  if (status === 'loading') {
    return <PageLoader />
  }

  if (!session) {
    return null
  }

  return <ProductForm />
}
