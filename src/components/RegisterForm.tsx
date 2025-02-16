import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import * as React from 'react'
import { toast } from 'sonner'
import Spinner from '@/components/ui/Spinner'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const LOGO_HEIGHT = 64

export default function RegisterForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState<boolean>(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    try {
      setSubmitting(true)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      toast.success('Registration successful! Please log in.')
      router.push('/login')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Registration failed'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
        <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
          <Link href='/' className='block'>
            <span className='sr-only'>Image Ecommerce App</span>
            <Image
              src='/imagec.png'
              alt='imagec logo'
              width={2 * LOGO_HEIGHT}
              height={LOGO_HEIGHT}
              className='mx-auto'
            />
          </Link>
          <h2 className='mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900'>
            Register a new account
          </h2>
        </div>

        <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm/6 font-medium text-gray-900'
              >
                Email address
              </label>
              <div className='mt-2'>
                <input
                  id='email'
                  name='email'
                  type='email'
                  required
                  autoComplete='email'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='password'
                className='block text-sm/6 font-medium text-gray-900'
              >
                Password
              </label>
              <div className='mt-2'>
                <input
                  id='password'
                  name='password'
                  type='password'
                  required
                  autoComplete='current-password'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor='confirm-password'
                className='block text-sm/6 font-medium text-gray-900'
              >
                Confirm Password
              </label>
              <div className='mt-2'>
                <input
                  id='confirm-password'
                  name='password'
                  type='password'
                  required
                  autoComplete='new-password'
                  className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type='submit'
                className={cn(
                  'flex h-10 w-full items-center justify-center rounded-md px-3 text-sm/6 font-semibold text-white shadow-xs',
                  submitting
                    ? 'bg-indigo-300'
                    : 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                )}
                disabled={submitting}
              >
                {submitting ? <Spinner className='size-5' /> : 'Register'}
              </button>
            </div>
          </form>

          <p className='mt-10 text-center text-sm/6 text-gray-500'>
            Already have an account?{' '}
            <Link
              href='/login'
              className='font-semibold text-indigo-600 hover:text-indigo-500'
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
