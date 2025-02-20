import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import connectToDatabase from '@/lib/db'
import Order from '@/models/Order.model'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const event = JSON.parse(body)

    await connectToDatabase()

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity

      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: payment.order_id },
        {
          razorpayOrderId: payment.order_id,
          status: 'completed'
        }
      ).populate([
        { path: 'productId', select: 'name' },
        { path: 'userId', select: 'email' }
      ])

      if (order) {
        const transporter = nodemailer.createTransport({
          service: 'sandbox.smtp.mailtrap.io',
          port: 25,
          auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
          }
        })

        await transporter.sendMail({
          from: 'seuristic@gmail.com',
          to: order.userId.email,
          subject: 'Order Completed',
          text: `Your order ${order.productId.name} has been successfully placed`
        })
      }
    }

    return NextResponse.json({ message: 'success' }, { status: 200 })
  } catch (e) {
    console.error('Error:', e)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
