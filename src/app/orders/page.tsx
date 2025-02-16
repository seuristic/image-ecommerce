'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { IOrder } from '@/models/Order.model'
import { IKImage } from 'imagekitio-next'
import { IMAGE_VARIANTS } from '@/models/Product.model'
import { apiClient } from '@/lib/api-client'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

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

    if (session) fetchOrders()
  }, [session])

  if (loading) {
    return (
      <div className='flex min-h-[70vh] items-center justify-center'>
        <span>Loading...</span>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='mb-8 text-3xl font-bold'>My Orders</h1>
      <div className='space-y-6'>
        {orders.map((order) => {
          const variantDimensions =
            IMAGE_VARIANTS[
              order.variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
            ].dimensions

          const product = order.productId as any

          return (
            <div
              key={order._id?.toString()}
              className='card bg-base-100 shadow-xl'
            >
              <div className='card-body'>
                <div className='flex flex-col gap-6 md:flex-row'>
                  {/* Preview Image - Low Quality */}
                  <div
                    className='bg-base-200 relative overflow-hidden rounded-lg'
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
                        <div className='text-base-content/70 space-y-1'>
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
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                order.status === 'completed'
                                  ? 'bg-success/20 text-success'
                                  : order.status === 'failed'
                                    ? 'bg-error/20 text-error'
                                    : 'bg-warning/20 text-warning'
                              }`}
                            >
                              {order.status}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className='text-right'>
                        <p className='mb-4 text-2xl font-bold'>
                          ${order.amount.toFixed(2)}
                        </p>
                        {order.status === 'completed' && (
                          <a
                            href={`${process.env.NEXT_PUBLIC_URL_ENDPOINT}/tr:q-100,w-${variantDimensions.width},h-${variantDimensions.height},cm-extract,fo-center/${product.imageUrl}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='btn btn-primary gap-2'
                            download={`image-${order._id
                              ?.toString()
                              .slice(-6)}.jpg`}
                          >
                            <ArrowDownTrayIcon className='size-4' />
                            Download High Quality
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {orders.length === 0 && (
          <div className='py-12 text-center'>
            <div className='text-base-content/70 text-lg'>No orders found</div>
          </div>
        )}
      </div>
    </div>
  )
}
