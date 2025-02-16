import React from 'react'

export default function Loader({
  className = 'size-6'
}: {
  className?: string
}) {
  return (
    <div className='animate-spin'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className={className}
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M21 12a9 9 0 1 1-6.219-8.56' />
      </svg>
    </div>
  )
}
