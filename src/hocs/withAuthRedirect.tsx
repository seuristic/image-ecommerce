'use client'

import { JSX, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import PageLoader from '@/components/PageLoader'

export function withAuthRedirect<P extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { status } = useSession()
    const router = useRouter()

    useEffect(() => {
      if (status === 'authenticated') {
        router.push('/')
      }
    }, [status, router])

    if (status !== 'unauthenticated') {
      return <PageLoader />
    }

    return <Component {...props} />
  }
}
