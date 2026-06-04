import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/supabase/admin-client";

export async function POST(req: NextRequest) {
  try {
    const { orderId, phone } = await req.json();

    if (!orderId || !phone) {
      return NextResponse.json(
        { error: "Order ID and Phone Number are required" },
        { status: 400 },
      );
    }

    // ✅ Better phone normalization
    const cleanedPhone = phone.replace(/\s/g, "").replace(/^\+/, "");
    const formattedPhone = cleanedPhone.startsWith("0")
      ? "254" + cleanedPhone.substring(1)
      : cleanedPhone.startsWith("254")
        ? cleanedPhone
        : cleanedPhone;

    console.log("Tracking order:", {
      orderId,
      originalPhone: phone,
      formattedPhone,
    });

    // ✅ Select the correct columns (no more 'status' column!)
    const { data: order, error } = await adminDb
      .from("orders")
      .select(
        "id, payment_status, fulfillment_status, fulfillment_method, payment_method, total_amount, amount_paid, created_at, order_items, location, notes, customer_name, customer_phone, customer_email, subtotal, delivery_fee, mpesa_receipt",
      )
      .eq("id", orderId)
      .eq("customer_phone", phone)
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        {
          error:
            "Order not found. Please check your Order ID and Phone Number.",
        },
        { status: 404 },
      );
    }

    if (!order) {
      return NextResponse.json(
        {
          error:
            "Order not found. Please check your Order ID and Phone Number.",
        },
        { status: 404 },
      );
    }

    console.log("Order found:", order.id);

    // Return only safe, non-sensitive data to the client
    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error("Track Order Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
