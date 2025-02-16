'use client'

import { cn } from '@/lib/utils'
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from '@headlessui/react'
import {
  ArrowRightEndOnRectangleIcon,
  Bars3Icon,
  UserCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'

export const LOGO_HEIGHT = 42

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navRoutes = useCallback(() => {
    return [
      { name: 'Home', path: '/' },
      ...(session
        ? [{ name: 'Orders', path: '/orders', protected: true }]
        : [
            { name: 'Login', path: '/login' },
            { name: 'Register', path: '/register' }
          ])
    ]
  }, [session])

  const navItems = navRoutes()

  return (
    <Disclosure as='nav' className='bg-white shadow-sm'>
      <div className='mx-auto max-w-7xl px-2 sm:px-6 lg:px-8'>
        <div className='relative flex h-16 justify-between'>
          <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
            <DisclosureButton className='group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden focus:ring-inset'>
              <span className='absolute -inset-0.5' />
              <span className='sr-only'>Open main menu</span>
              <Bars3Icon
                aria-hidden='true'
                className='block size-6 group-data-open:hidden'
              />
              <XMarkIcon
                aria-hidden='true'
                className='hidden size-6 group-data-open:block'
              />
            </DisclosureButton>
          </div>
          <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
            <div className='flex shrink-0 items-center'>
              <Link href='/' className='-m-1.5 p-1.5'>
                <span className='sr-only'>Image Ecommerce App</span>
                <Image
                  src='/imagec.png'
                  alt='imagec logo'
                  width={2 * LOGO_HEIGHT}
                  height={LOGO_HEIGHT}
                />
              </Link>
            </div>
            {/* <div className='hidden sm:ml-6 sm:flex sm:space-x-8'>
              <a
                href='#'
                className='inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-900'
              >
                Dashboard
              </a>
              <a
                href='#'
                className='inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
              >
                Team
              </a>
              <a
                href='#'
                className='inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
              >
                Projects
              </a>
              <a
                href='#'
                className='inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700'
              >
                Calendar
              </a>
            </div> */}
          </div>
          <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
            {session ? (
              <Menu as='div' className='relative ml-3'>
                <div>
                  <MenuButton className='relative flex rounded-full bg-white text-sm focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden'>
                    <span className='absolute -inset-1.5' />
                    <span className='sr-only'>Open user menu</span>
                    <UserCircleIcon className='size-6' />
                  </MenuButton>
                </div>
                <MenuItems
                  transition
                  className='absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white p-1 font-medium ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-75 data-leave:ease-in'
                >
                  <div className='block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden'>
                    {session.user.email}
                  </div>
                  <MenuItem>
                    <Link
                      href='/orders'
                      className='block w-full rounded px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden'
                    >
                      Orders
                    </Link>
                  </MenuItem>
                  {session.user.role === 'admin' && (
                    <MenuItem>
                      <Link
                        href='/admin'
                        className='block w-full rounded px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden'
                      >
                        Add Product
                      </Link>
                    </MenuItem>
                  )}
                  <MenuItem>
                    <button
                      onClick={() => signOut()}
                      className='block w-full rounded px-4 py-2 text-left text-sm text-gray-700 data-focus:bg-red-600 data-focus:text-white data-focus:outline-hidden'
                    >
                      Logout
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            ) : (
              <div className='flex flex-1 items-center justify-end gap-x-6'>
                <Link
                  href='/login'
                  className='text-sm/6 font-semibold text-gray-900 hover:text-gray-600 sm:flex sm:gap-2'
                >
                  <span className='hidden sm:block'>Login</span>
                  <ArrowRightEndOnRectangleIcon className='size-6' />
                </Link>
                {/* <Link
                  href='/register'
                  className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                >
                  Register
                </Link> */}
              </div>
            )}
          </div>
        </div>
      </div>

      <DisclosurePanel className='sm:hidden'>
        <div className='space-y-1 pt-2 pb-4'>
          {navItems.map((page, i) => (
            <DisclosureButton
              key={i}
              className={cn(
                'block w-full border-l-4 py-2 pr-4 pl-3 text-left text-base font-medium',
                pathname === page.path
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
              )}
            >
              <Link href={page.path} className='block w-full'>
                {page.name}
              </Link>
            </DisclosureButton>
          ))}
          {/* <DisclosureButton
            as='a'
            href='/login'
            className='block border-l-4 border-indigo-500 bg-indigo-50 py-2 pr-4 pl-3 text-base font-medium text-indigo-700'
          >
            Login
          </DisclosureButton>
          <DisclosureButton
            as='a'
            href='/register'
            className='block border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
          >
            Register
          </DisclosureButton> */}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
