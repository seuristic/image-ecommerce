'use client'

import { SessionProvider } from 'next-auth/react'
import * as React from 'react'
import { ImageKitProvider, IKImage } from 'imagekitio-next'
import { NotificationProvider } from './Notification'

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY

export default function Providers({ children }: { children: React.ReactNode }) {
  const authenticator = async () => {
    try {
      const response = await fetch('/api/imagekit-auth')

      if (!response.ok) {
        throw new Error('Failed to authenticate')
      }

      const data = await response.json()
      const { signature, expire, token } = data

      return { signature, expire, token }
    } catch (error) {
      throw error
    }
  }

  return (
    <SessionProvider refetchInterval={5 * 60}>
      <NotificationProvider>
        <ImageKitProvider
          urlEndpoint={urlEndpoint}
          publicKey={publicKey}
          authenticator={authenticator}
        >
          {children}
        </ImageKitProvider>
      </NotificationProvider>
    </SessionProvider>
  )
}
