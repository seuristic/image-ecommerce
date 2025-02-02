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
import { Loader2, AlertCircle, Check, Image as ImageIcon } from 'lucide-react'
import { useNotification } from '@/app/components/Notification'
import { useSession } from 'next-auth/react'
import { apiClient } from '@/lib/api-client'

export default function ProductPage() {
  const params = useParams()
  const [product, setProduct] = useState<IProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<ImageVariant | null>(
    null
  )
  const { showNotification } = useNotification()
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
      showNotification('Please login to make a purchase', 'error')
      router.push('/login')
      return
    }

    if (!product?._id) {
      showNotification('Invalid product', 'error')
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
          showNotification('Payment successful!', 'success')
          router.push('/orders')
        },
        prefill: {
          email: session.user.email
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error(error)
      showNotification(
        error instanceof Error ? error.message : 'Payment failed',
        'error'
      )
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

  if (loading)
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <Loader2 className="text-primary h-12 w-12 animate-spin" />
      </div>
    )

  if (error || !product)
    return (
      <div className="alert alert-error mx-auto my-8 max-w-md">
        <AlertCircle className="h-6 w-6" />
        <span>{error || 'Product not found'}</span>
      </div>
    )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image Section */}
        <div className="space-y-4">
          <div
            className="relative overflow-hidden rounded-lg"
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
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>

          {/* Image Dimensions Info */}
          {selectedVariant && (
            <div className="text-base-content/70 text-center text-sm">
              Preview: {IMAGE_VARIANTS[selectedVariant.type].dimensions.width} x{' '}
              {IMAGE_VARIANTS[selectedVariant.type].dimensions.height}px
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="mb-2 text-4xl font-bold">{product.name}</h1>
            <p className="text-base-content/80 text-lg">
              {product.description}
            </p>
          </div>

          {/* Variants Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Available Versions</h2>
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
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="h-5 w-5" />
                      <div>
                        <h3 className="font-semibold">
                          {
                            IMAGE_VARIANTS[
                              variant.type.toUpperCase() as keyof typeof IMAGE_VARIANTS
                            ].label
                          }
                        </h3>
                        <p className="text-base-content/70 text-sm">
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
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold">
                        ${variant.price.toFixed(2)}
                      </span>
                      <button
                        className="btn btn-primary btn-sm"
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

          {/* License Information */}
          <div className="card bg-base-200">
            <div className="card-body p-4">
              <h3 className="mb-2 font-semibold">License Information</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="text-success h-4 w-4" />
                  <span>Personal: Use in personal projects</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="text-success h-4 w-4" />
                  <span>Commercial: Use in commercial projects</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
