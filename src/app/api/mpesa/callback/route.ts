/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/supabase/admin-client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("M-Pesa Callback Received:", JSON.stringify(body, null, 2));

    const stkCallback = body.Body?.stkCallback;
    if (!stkCallback) {
      return NextResponse.json({ status: "ignored" });
    }

    const { CheckoutRequestID, ResultCode, ResultDesc } = stkCallback;

    // ✅ FIX: Find the order using the CheckoutRequestID we saved during the STK Push
    const { data: order } = await adminDb
      .from("orders")
      .select("id, fulfillment_method")
      .eq("checkout_request_id", CheckoutRequestID)
      .single();

    if (!order) {
      console.error(
        "Could not find order for CheckoutRequestID:",
        CheckoutRequestID,
      );
      return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" }); // Still return 200 to Safaricom
    }

    const orderId = order.id;

    if (ResultCode === 0) {
      // ✅ Payment Successful
      const amount = stkCallback.CallbackMetadata?.Item?.find(
        (i: any) => i.Name === "Amount",
      )?.Value;
      const mpesaReceipt = stkCallback.CallbackMetadata?.Item?.find(
        (i: any) => i.Name === "MpesaReceiptNumber",
      )?.Value;

      // Determine the correct "Paid" status based on how they want the order
      const newStatus =
        order.fulfillment_method === "pickup"
          ? "Paid - Awaiting Pickup"
          : "Paid - Awaiting Delivery";

      await adminDb
        .from("orders")
        .update({
          status: newStatus,
          mpesa_receipt: mpesaReceipt,
          amount_paid: amount,
        })
        .eq("id", orderId);

      console.log(
        `✅ Order ${orderId} marked as PAID. Receipt: ${mpesaReceipt}`,
      );
    } else {
      // ❌ Payment Failed or Cancelled
      console.log(`❌ Payment failed for ${orderId}: ${ResultDesc}`);
      await adminDb
        .from("orders")
        .update({ status: "Cancelled" })
        .eq("id", orderId);
    }

    // Safaricom expects a 200 OK response to stop retrying
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    console.error("Callback Error:", error);
    return NextResponse.json(
      { ResultCode: 1, ResultDesc: "Internal Error" },
      { status: 500 },
    );
  }
}
