'use client'

import { apiClient } from '@/lib/api-client'
import { IProduct } from '@/models/Product.model'
import { useEffect, useState } from 'react'
import ImageGallery from '../components/ImageGallery'
import Navbar from '@/components/ui/Navbar'
import PageLoader from '@/components/PageLoader'
import MainLayout from '@/components/layouts/MainLayout'

export default function Home() {
  const [products, setProducts] = useState<IProduct[] | null>(null)

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

  if (products === null) {
    return <PageLoader />
  }

  return (
    <MainLayout>
      <ImageGallery products={products} />
    </MainLayout>
  )
}
