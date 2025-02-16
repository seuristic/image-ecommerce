import { authOptions } from '@/lib/auth'
import connectToDatabase from '@/lib/db'
import Product, { IProduct } from '@/models/Product.model'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectToDatabase()
    const products = await Product.find({}).lean()

    if (!products || products.length === 0) {
      return NextResponse.json([], { status: 200 })
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()

    const body: IProduct = await req.json()

    if (
      !body ||
      !body.name ||
      !body.description ||
      !body.imageUrl ||
      body.variants.length === 0
    ) {
      return NextResponse.json(
        { error: 'Missing request body' },
        { status: 400 }
      )
    }

    const newProduct = await Product.create(body)

    return NextResponse.json({ product: newProduct }, { status: 201 })
  } catch (e) {
    console.error('Database Error:', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
