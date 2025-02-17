'use client'

import { IKImage } from 'imagekitio-next'
import {
  IProduct,
  ImageVariant,
  IMAGE_VARIANTS,
  ImageVariantType
} from '@/models/Product.model'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { apiClient } from '@/lib/api-client'
import {
  CheckIcon,
  ExclamationCircleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import MainLayout from '@/components/layouts/MainLayout'
import PageLoader from '@/components/PageLoader'
import * as React from 'react'
import { capitalize, cn } from '@/lib/utils'
import Spinner from '@/components/ui/Spinner'

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = React.useState<IProduct | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [purchasing, setPurchasing] = React.useState<{
    variant: ImageVariant
  } | null>(null)
  const [selectedVariant, setSelectedVariant] =
    React.useState<ImageVariant | null>(null)

  const router = useRouter()
  const { data: session } = useSession()

  React.useEffect(() => {
    const fetchProduct = async () => {
      const id = params?.id

      if (!id) {
        setError('Product ID is missing')
        setLoading(false)
        return
      }

      try {
        const data = await apiClient.getProduct(id.toString())
        setProduct(data)
        setSelectedVariant(data.variants[0])
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err instanceof Error ? err.message : 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params?.id])

  const handlePurchase = async (variant: ImageVariant) => {
    if (!session) {
      toast.error('Please login to make a purchase')
      router.push('/login')
      return
    }

    if (!product?._id) {
      toast.error('Invalid product')
      return
    }

    try {
      setPurchasing({ variant })

      const { orderId, amount } = await apiClient.createOrder({
        productId: product._id,
        variant
      })

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: 'USD',
        name: 'ImageKit Shop',
        description: `${product.name} - ${variant.type} Version`,
        order_id: orderId,
        handler: function () {
          toast.success('Payment successful!')
          router.push('/orders')
        },
        prefill: {
          email: session.user.email
        }
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.error(error)
      toast(error instanceof Error ? error.message : 'Payment failed')
    } finally {
      setPurchasing(null)
    }
  }

  const getTransformation = (variantType: ImageVariantType) => {
    const variant = IMAGE_VARIANTS[variantType]
    return [
      {
        width: variant.dimensions.width.toString(),
        height: variant.dimensions.height.toString(),
        cropMode: 'extract',
        focus: 'center',
        quality: '60'
      }
    ]
  }

  if (loading) return <PageLoader />

  if (error || !product)
    return (
      <div className='alert alert-error mx-auto my-8 max-w-md'>
        <ExclamationCircleIcon className='size-6' />
        <span>{error || 'Product not found'}</span>
      </div>
    )

  return (
    <MainLayout>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        <div className='space-y-4'>
          <div
            className='relative overflow-hidden rounded'
            style={{
              aspectRatio: selectedVariant
                ? `${IMAGE_VARIANTS[selectedVariant.type].dimensions.width} / ${
                    IMAGE_VARIANTS[selectedVariant.type].dimensions.height
                  }`
                : '1 / 1'
            }}
          >
            <IKImage
              urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
              path={product.imageUrl}
              alt={product.name}
              transformation={
                selectedVariant
                  ? getTransformation(selectedVariant.type)
                  : getTransformation('SQUARE')
              }
              className='h-full w-full object-cover'
              loading='eager'
            />
          </div>

          {selectedVariant && (
            <div className='text-center text-sm'>
              Preview: {IMAGE_VARIANTS[selectedVariant.type].dimensions.width} x{' '}
              {IMAGE_VARIANTS[selectedVariant.type].dimensions.height}px
            </div>
          )}
        </div>

        <div className='space-y-6 py-4'>
          <div className='space-y-4'>
            <h1 className='text-4xl font-bold'>{product.name}</h1>
            <p className='text-lg'>{product.description}</p>
          </div>

          <div className='space-y-4'>
            <h2 className='text-xl font-semibold'>Available Size Variants</h2>
            {product.variants.map((variant: any) => (
              <div
                key={variant.type}
                className={`cursor-pointer rounded-2xl border-2 bg-gray-50 transition-colors hover:bg-gray-200 ${
                  selectedVariant?.type === variant.type
                    ? 'border-gray-600'
                    : 'border-gray-100 hover:border-gray-300'
                }`}
                onClick={() => setSelectedVariant(variant)}
              >
                <div className='flex items-center justify-between p-4'>
                  <div className='flex items-center gap-4'>
                    <PhotoIcon className='size-6' />
                    <div>
                      <h3 className='font-semibold'>
                        {
                          IMAGE_VARIANTS[
                            variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
                          ].label
                        }
                      </h3>
                      <p className='text-sm'>
                        {
                          IMAGE_VARIANTS[
                            variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
                          ].dimensions.width
                        }{' '}
                        x{' '}
                        {
                          IMAGE_VARIANTS[
                            variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
                          ].dimensions.height
                        }
                        px • {capitalize(variant.license)} License
                      </p>
                    </div>
                  </div>
                  <div className='flex items-center gap-4 sm:gap-6'>
                    <span className='text-xl font-bold'>
                      ₹{variant.price.toFixed(2)}
                    </span>
                    <button
                      className={cn(
                        'rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs',
                        purchasing && purchasing.variant.type === variant.type
                          ? 'bg-indigo-300'
                          : 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePurchase(variant)
                      }}
                      disabled={purchasing !== null}
                    >
                      {purchasing &&
                      purchasing.variant.type === variant.type ? (
                        <Spinner className='size-5' />
                      ) : (
                        'Buy Now'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='bg-base-200'>
            <div className='p-4'>
              <h3 className='mb-2 font-semibold'>License Information</h3>
              <ul className='space-y-2'>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='text-success h-4 w-4' />
                  <span>Personal: Use in personal projects</span>
                </li>
                <li className='flex items-center gap-2'>
                  <CheckIcon className='text-success h-4 w-4' />
                  <span>Commercial: Use in commercial projects</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
