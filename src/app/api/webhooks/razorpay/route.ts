import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('x-razorpay-signature');

  // SECRET should be stored in env
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_secret_here';

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const payload = JSON.parse(body);
  const event = payload.event;

  const supabase = await createClient();

  if (event === 'payment.captured') {
    const paymentId = payload.payload.payment.entity.id;
    const orderId = payload.payload.payment.entity.order_id;

    // Update order status in DB
    const { error } = await supabase
      .from('orders')
      .update({ 
        status: 'paid',
        razorpay_payment_id: paymentId 
      })
      .eq('razorpay_order_id', orderId);

    if (error) {
      console.error('Webhook Error:', error);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }
  }

  return NextResponse.json({ status: 'ok' });
}
