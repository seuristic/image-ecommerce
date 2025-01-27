import connectToDatabase from '@/lib/db'
import Product from '@/models/Product.model'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params
    await connectToDatabase()
    const product = await Product.findById(id).lean()

    if (!product) {
      return NextResponse.json({ error: 'No product found' }, { status: 404 })
    }

    return NextResponse.json({ product }, { status: 200 })
  } catch (e) {
    console.error('Error:', e)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
