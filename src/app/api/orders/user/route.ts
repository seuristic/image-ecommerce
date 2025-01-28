import { authOptions } from '@/lib/auth'
import connectToDatabase from '@/lib/db'
import Order from '@/models/Order.model'
import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectToDatabase()

    const orders = await Order.find({ userId: session.user.id })
      .populate({
        path: 'productId',
        select: 'name imageUrl',
        options: { strictPopulate: true }
      })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ orders }, { status: 200 })
  } catch (e) {
    console.error('Error:', e)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
