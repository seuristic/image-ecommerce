'use client'

import { apiClient } from '@/lib/api-client'
import { IProduct } from '@/models/Product.model'
import { useEffect, useState } from 'react'
import ImageGallery from './components/ImageGallery'

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getProducts()
        setProducts(data)
      } catch (e) {
        console.error('Error:', e)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div>
      <ImageGallery products={products} />
    </div>
  )
}
