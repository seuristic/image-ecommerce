import { IKImage } from 'imagekitio-next'
import Link from 'next/link'
import { IProduct, IMAGE_VARIANTS } from '@/models/Product.model'
import { EyeIcon } from '@heroicons/react/24/outline'

export default function ProductCard({ product }: { product: IProduct }) {
  const lowestPrice = product.variants.reduce(
    (min, variant) => (variant.price < min ? variant.price : min),
    product.variants[0]?.price || 0
  )

  return (
    <div className='card bg-base-100 shadow transition-all duration-300 hover:shadow-lg'>
      <figure className='relative px-4 pt-4'>
        <Link
          href={`/products/${product._id}`}
          className='group relative w-full'
        >
          <div
            className='relative w-full overflow-hidden rounded-xl'
            style={{
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
          <div className='absolute inset-0 rounded-xl bg-black/0 transition-colors duration-300 group-hover:bg-black/20' />
        </Link>
      </figure>

      <div className='card-body p-4'>
        <Link
          href={`/products/${product._id}`}
          className='transition-opacity hover:opacity-80'
        >
          <h2 className='card-title text-lg'>{product.name}</h2>
        </Link>

        <p className='text-base-content/70 line-clamp-2 min-h-[2.5rem] text-sm'>
          {product.description}
        </p>

        <div className='card-actions mt-2 items-center justify-between'>
          <div className='flex flex-col'>
            <span className='text-lg font-bold'>
              From ${lowestPrice.toFixed(2)}
            </span>
            <span className='text-base-content/50 text-xs'>
              {product.variants.length} sizes available
            </span>
          </div>

          <Link
            href={`/products/${product._id}`}
            className='btn btn-primary btn-sm gap-2'
          >
            <EyeIcon className='h-4 w-4' />
            View Options
          </Link>
        </div>
      </div>
    </div>
  )
}
