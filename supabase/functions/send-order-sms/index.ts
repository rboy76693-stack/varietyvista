import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const FAST2SMS_API_KEY = Deno.env.get("FAST2SMS_API_KEY");

serve(async (req) => {
  try {
    // 1. Parse the incoming Database Webhook Payload
    const payload = await req.json();
    
    // Safety check: Ensure this is an UPDATE event and status changed to 'paid'
    if (payload.type !== 'UPDATE' || payload.record.status !== 'paid' || payload.old_record.status === 'paid') {
      return new Response(JSON.stringify({ message: "Ignored: Not a new paid order" }), { status: 200 });
    }

    const order = payload.record;
    
    // 2. Extract phone number and order ID
    // Note: In production, you might need to query the user table if the phone isn't in shipping_address
    const phone = order.shipping_address?.phone;
    const orderId = order.razorpay_order_id || order.id;
    
    if (!phone) {
      console.error("No phone number found for order:", orderId);
      return new Response(JSON.stringify({ error: "Missing phone number" }), { status: 400 });
    }

    // 3. Format the SMS Message
    const message = `Hey from THE HOUR! Your order ${orderId} is confirmed and getting packed. You'll get another text when it ships. Stay drippy.`;

    // 4. Call Fast2SMS API
    if (FAST2SMS_API_KEY) {
      const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          "authorization": FAST2SMS_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          route: "q",
          message: message,
          language: "english",
          flash: 0,
          numbers: phone.replace(/[^0-9]/g, '').slice(-10), // Ensure exactly 10 digits
        })
      });

      const data = await response.json();
      
      if (!response.ok || !data.return) {
        throw new Error(`Fast2SMS Error: ${JSON.stringify(data)}`);
      }
      
      console.log(`SMS Sent successfully to ${phone} for order ${orderId}`);
    } else {
      console.warn("FAST2SMS_API_KEY is not set. Simulating SMS send:");
      console.log(`[SIMULATED SMS to ${phone}]: ${message}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "SMS dispatched" }),
      { headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("SMS Edge Function Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
