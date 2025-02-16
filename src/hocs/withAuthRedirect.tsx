'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import PageLoader from '@/components/PageLoader'

export function withAuthRedirect<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { status } = useSession()
    const router = useRouter()

    useEffect(() => {
      if (status === 'authenticated') {
        router.replace('/')
      }
    }, [status, router])

    if (status === 'loading') {
      return <PageLoader />
    }

    if (status === 'authenticated') {
      return null // Prevents rendering while redirecting
    }

    return <Component {...props} />
  }
}
