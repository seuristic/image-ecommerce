import { IOrder } from '@/models/Order.model'
import { ImageVariant, IProduct } from '@/models/Product.model'
import { Types } from 'mongoose'

export type ProductFormData = Omit<IProduct, '_id'>

export interface CreateOrderData {
  productId: Types.ObjectId | string
  variant: ImageVariant
}

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  headers?: Record<string, string>
}

class APIClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = 'GET', body, headers = {} } = options

    const defaultHeaders = {
      'Content-Type': 'application/json',
      ...headers
    }

    const response = await fetch(endpoint, {
      method,
      body: JSON.stringify(body),
      headers: defaultHeaders
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return response.json()
  }

  async getProducts() {
    return this.fetch<IProduct[]>('/api/products')
  }

  async getProduct(id: string) {
    return this.fetch<IProduct>(`/api/products/${id}`)
  }

  async createProduct(productData: ProductFormData) {
    return this.fetch<IProduct>('/products', {
      method: 'POST',
      body: productData
    })
  }

  async getUserOrders() {
    return this.fetch<IOrder[]>('/orders/user')
  }

  async createOrder(orderData: CreateOrderData) {
    const sanitizedOrderData = {
      ...orderData,
      productId: orderData.productId.toString()
    }

    return this.fetch<{ orderId: string; amount: number }>('/orders', {
      method: 'POST',
      body: sanitizedOrderData
    })
  }
}

export const apiClient = new APIClient()
