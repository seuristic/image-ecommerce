import { IKImage } from 'imagekitio-next'
import Link from 'next/link'
import { IProduct, IMAGE_VARIANTS } from '@/models/Product.model'
import { EyeIcon } from '@heroicons/react/24/outline'
import * as React from 'react'

export default function ProductCard({ product }: { product: IProduct }) {
  const lowestPrice = React.useMemo(
    () =>
      product.variants.reduce(
        (min, variant) => (variant.price < min ? variant.price : min),
        product.variants[0]?.price || 0
      ),
    [product.variants]
  )

  return (
    <div className='rounded-2xl border border-gray-100 bg-gray-50 transition-all duration-300 hover:border-gray-300'>
      <figure className='relative p-4'>
        <Link
          href={`/products/${product._id}`}
          className='group relative w-full'
        >
          <div
            className='relative w-full overflow-hidden rounded'
            style={{
              // by default: SQUARE dimensions
              aspectRatio:
                IMAGE_VARIANTS.SQUARE.dimensions.width /
                IMAGE_VARIANTS.SQUARE.dimensions.height
            }}
          >
            <IKImage
              path={product.imageUrl}
              alt={product.name}
              loading='eager'
              transformation={[
                {
                  height: IMAGE_VARIANTS.SQUARE.dimensions.height.toString(),
                  width: IMAGE_VARIANTS.SQUARE.dimensions.width.toString(),
                  cropMode: 'extract',
                  focus: 'center',
                  quality: '80'
                }
              ]}
              className='absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
            />
          </div>
          <div className='absolute inset-0 rounded bg-black/0 transition-colors duration-300 group-hover:bg-black/20' />
        </Link>
      </figure>

      <div className='p-4'>
        <Link
          href={`/products/${product._id}`}
          className='transition-opacity hover:opacity-80'
        >
          <h2 className='text-lg font-bold'>{product.name}</h2>
        </Link>

        <p className='line-clamp-2 min-h-10 text-sm'>{product.description}</p>

        <div className='mt-2 items-center justify-between'>
          <div className='flex flex-col'>
            <span className='text-lg font-semibold'>
              From ₹{lowestPrice.toFixed(2)}
            </span>
            <span className='text-xs'>
              Sizes available: {product.variants.length}
            </span>
          </div>

          <Link
            href={`/products/${product._id}`}
            className='mt-2 flex h-8 items-center justify-center gap-2 rounded-sm bg-white px-2 py-1 text-xs font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50'
          >
            <EyeIcon className='h-4 w-4' />
            View Options
          </Link>
        </div>
      </div>
    </div>
  )
}
