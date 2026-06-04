/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/supabase/admin-client";

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();

    // Insert the complete order snapshot into Supabase
    const { error } = await adminDb.from("orders").insert({
      id: orderData.id,
      customer_name: orderData.customerName,
      customer_phone: orderData.customerPhone,
      customer_email: orderData.customerEmail || null,
      location: orderData.location,
      notes: orderData.notes || null,
      fulfillment_method: orderData.fulfillment,
      payment_method: orderData.payment,
      subtotal: orderData.subtotal,
      delivery_fee: orderData.deliveryFee || 0,
      total_amount: orderData.totalAmount,

      // ✅ NEW: Use the dual-status columns
      payment_status: "pending",
      fulfillment_status: "pending",

      order_items: orderData.items, // The JSONB cart snapshot from Zustand
    });

    if (error) throw new Error(`Database error: ${error.message}`);

    return NextResponse.json({ success: true, orderId: orderData.id });
  } catch (error: any) {
    console.error("Create Order Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 },
    );
  }
}
