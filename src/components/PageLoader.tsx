import React from 'react'
import Loader from './ui/Loader'

export default function PageLoader() {
  return (
    <div className='flex min-h-svh items-center justify-center'>
      <Loader className='size-8' />
    </div>
  )
}
