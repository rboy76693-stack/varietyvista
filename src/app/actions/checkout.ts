'use server'

import { createClient } from '@supabase/supabase-js';
import Razorpay from 'razorpay';
import { checkoutSchema, CheckoutPayload } from '@/lib/validations/order';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Admin client bypasses RLS strictly for secure server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function createCheckoutSession(payload: CheckoutPayload, userId: string) {
  try {
    const validData = checkoutSchema.parse(payload);

    // Verify stock exists BEFORE creating the Razorpay order
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('price_inr, stock_count')
      .eq('id', validData.productId)
      .single();

    if (productError || !product) throw new Error("Product unavailable");
    if (product.stock_count < validData.quantity) throw new Error("Insufficient stock");

    const amountInPaise = Math.round(product.price_inr * validData.quantity * 100);

    const rpOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `THE_HOUR_${Date.now()}`,
      notes: { userId, productId: validData.productId, quantity: validData.quantity }
    });

    const { data: dbOrder, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: userId,
        razorpay_order_id: rpOrder.id,
        total_amount_inr: amountInPaise / 100,
        status: 'pending',
        pincode: validData.shippingAddress.pincode,
        shipping_address: validData.shippingAddress as any
      })
      .select('id')
      .single();

    if (orderError) throw new Error("Database transaction failed");

    return { success: true, orderId: rpOrder.id, dbOrderId: dbOrder.id, amount: rpOrder.amount };

  } catch (error: any) {
    console.error("[THE HOUR - Checkout Action Error]:", error);
    return { success: false, error: error.message || "Failed to initiate checkout" };
  }
}
