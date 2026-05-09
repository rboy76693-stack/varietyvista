import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex');

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === 'payment.captured') {
      const paymentData = event.payload.payment.entity;
      const razorpayOrderId = paymentData.order_id;
      const quantity = parseInt(paymentData.notes.quantity || "1", 10);

      // Check DB State
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('id, status')
        .eq('razorpay_order_id', razorpayOrderId)
        .single();

      if (!order) return NextResponse.json({ error: "Order missing" }, { status: 404 });

      // Idempotency: Ignore duplicate webhooks
      if (order.status === 'paid') {
        return NextResponse.json({ status: "already processed" }, { status: 200 });
      }

      // Execute Atomic Database Stock Reduction
      const { data: stockUpdated } = await supabaseAdmin.rpc('decrement_inventory_atomic', {
        product_id: paymentData.notes.productId,
        quantity: quantity
      });

      if (!stockUpdated) {
         console.error(`[THE HOUR - CRITICAL] Oversell Prevented. Order: ${razorpayOrderId}`);
         return NextResponse.json({ error: "Stock conflict" }, { status: 500 });
      }

      // Finalize Order
      await supabaseAdmin
        .from('orders')
        .update({ status: 'paid', razorpay_payment_id: paymentData.id })
        .eq('razorpay_order_id', razorpayOrderId);
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error) {
    console.error("[THE HOUR - Webhook Fatal Error]:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
