'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { IOrder } from '@/models/Order.model'
import { IKImage } from 'imagekitio-next'
import { IMAGE_VARIANTS } from '@/models/Product.model'
import { apiClient } from '@/lib/api-client'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import PageLoader from '@/components/PageLoader'
import Link from 'next/link'
import MainLayout from '@/components/layouts/MainLayout'
import { capitalize, cn } from '@/lib/utils'

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)

  const { data: session, status } = useSession()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiClient.getUserOrders()
        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    if (status !== 'loading') fetchOrders()
  }, [status])

  if (loading) {
    return <PageLoader />
  }

  if (status === 'unauthenticated') {
    return (
      <div className='flex h-svh items-center justify-center'>
        <span className='text-lg'>
          <Link href='/login' className='text-indigo-600'>
            Login
          </Link>{' '}
          to view your orders
        </span>
      </div>
    )
  }

  return (
    <MainLayout>
      <h1 className='text-3xl font-bold'>My Orders</h1>
      <div className='mt-6 space-y-6'>
        {orders.map((order) => {
          const variantDimensions =
            IMAGE_VARIANTS[
              order.variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
            ].dimensions

          const product = order.productId as any

          return (
            <div
              key={order._id?.toString()}
              className='rounded-2xl border border-gray-100 bg-gray-50'
            >
              <figure className='relative p-4'>
                <div className='flex flex-col gap-6 md:flex-row'>
                  <div
                    className='relative overflow-hidden rounded'
                    style={{
                      width: '200px',
                      aspectRatio: `${variantDimensions.width} / ${variantDimensions.height}`
                    }}
                  >
                    <IKImage
                      urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                      path={product.imageUrl}
                      alt={`Order ${order._id?.toString().slice(-6)}`}
                      transformation={[
                        {
                          quality: '60',
                          width: variantDimensions.width.toString(),
                          height: variantDimensions.height.toString(),
                          cropMode: 'extract',
                          focus: 'center'
                        }
                      ]}
                      className='h-full w-full object-cover'
                      loading='lazy'
                    />
                  </div>

                  {/* Order Details */}
                  <div className='flex-grow'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h2 className='mb-2 text-xl font-bold'>
                          Order #{order._id?.toString().slice(-6)}
                        </h2>
                        <div className='text-gray-content/70 space-y-1'>
                          <p>
                            Resolution: {variantDimensions.width} x{' '}
                            {variantDimensions.height}px
                          </p>
                          <p>
                            License Type:{' '}
                            <span className='capitalize'>
                              {order.variant.license}
                            </span>
                          </p>
                          <p>
                            Status:{' '}
                            <span
                              className={cn(
                                'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
                                order.status === 'pending'
                                  ? 'bg-gray-50 text-gray-600 ring-gray-500/10'
                                  : order.status === 'completed'
                                    ? 'bg-green-50 text-green-600 ring-green-500/10'
                                    : order.status === 'failed'
                                      ? 'bg-red-50 text-red-600 ring-red-500/10'
                                      : 'bg-yellow-50 text-yellow-600 ring-yellow-500/10'
                              )}
                            >
                              {capitalize(order.status)}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className='flex flex-col items-end justify-between gap-4 text-right'>
                        <p className='text-2xl font-bold'>
                          ₹{(order.amount / 100).toFixed(2)}
                        </p>
                        {order.status === 'completed' && (
                          <a
                            href={`${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}/tr:q-100,w-${variantDimensions.width},h-${variantDimensions.height},cm-extract,fo-center${product.imageUrl}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            download={`image-${order._id
                              ?.toString()
                              .slice(-6)}.jpg`}
                          >
                            <ArrowDownTrayIcon className='-ml-0.5 size-5' />
                            Download High Quality
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </figure>
            </div>
          )
        })}

        {orders.length === 0 && (
          <div className='py-12 text-center'>
            <div className='text-gray-content/70 text-lg'>No orders found</div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
