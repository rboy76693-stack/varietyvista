import { z } from 'zod';

export const checkoutSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive().min(1).max(5), // Anti-bot: Max 5 items per order
  shippingAddress: z.object({
    fullName: z.string().min(2, "Name is required"),
    phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
    addressLine1: z.string().min(5, "Detailed address required"),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Invalid 6-digit Indian pincode"),
  })
});

export type CheckoutPayload = z.infer<typeof checkoutSchema>;
