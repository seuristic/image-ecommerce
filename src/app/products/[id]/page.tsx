'use client'

import { IKImage } from 'imagekitio-next'
import {
  IProduct,
  ImageVariant,
  IMAGE_VARIANTS,
  ImageVariantType
} from '@/models/Product.model'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { apiClient } from '@/lib/api-client'
import {
  CheckIcon,
  ExclamationCircleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import Navbar from '@/components/ui/Navbar'
import MainLayout from '@/components/layouts/MainLayout'
import PageLoader from '@/components/PageLoader'

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<IProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ImageVariant | null>(
    null
  )

  const router = useRouter()
  const { data: session } = useSession()

  useEffect(() => {
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
            className='relative overflow-hidden rounded-lg'
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
            <div className='text-base-content/70 text-center text-sm'>
              Preview: {IMAGE_VARIANTS[selectedVariant.type].dimensions.width} x{' '}
              {IMAGE_VARIANTS[selectedVariant.type].dimensions.height}px
            </div>
          )}
        </div>

        <div className='space-y-6'>
          <div>
            <h1 className='mb-2 text-4xl font-bold'>{product.name}</h1>
            <p className='text-base-content/80 text-lg'>
              {product.description}
            </p>
          </div>

          <div className='space-y-4'>
            <h2 className='text-xl font-semibold'>Available Versions</h2>
            {product.variants.map((variant: any) => (
              <div
                key={variant.type}
                className={`card bg-base-200 hover:bg-base-300 cursor-pointer transition-colors ${
                  selectedVariant?.type === variant.type
                    ? 'ring-primary ring-2'
                    : ''
                }`}
                onClick={() => setSelectedVariant(variant)}
              >
                <div className='card-body p-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <PhotoIcon className='h-5 w-5' />
                      <div>
                        <h3 className='font-semibold'>
                          {
                            IMAGE_VARIANTS[
                              variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
                            ].label
                          }
                        </h3>
                        <p className='text-base-content/70 text-sm'>
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
                          px • {variant.license} license
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center gap-4'>
                      <span className='text-xl font-bold'>
                        ${variant.price.toFixed(2)}
                      </span>
                      <button
                        className='btn btn-primary btn-sm'
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePurchase(variant)
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='card bg-base-200'>
            <div className='card-body p-4'>
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
