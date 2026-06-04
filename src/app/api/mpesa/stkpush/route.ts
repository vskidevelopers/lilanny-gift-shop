/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import {
  getMpesaToken,
  generateMpesaPassword,
  formatPhoneNumber,
} from "@/lib/mpesa";
import { adminDb } from "@/lib/supabase/admin-client";

export async function POST(req: NextRequest) {
  try {
    const { phone, amount, orderId, description } = await req.json();

    if (!phone || !amount || !orderId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const token = await getMpesaToken();
    const formattedPhone = formatPhoneNumber(phone);
    const shortcode = process.env.MPESA_SHORTCODE!;
    const passkey = process.env.MPESA_PASSKEY!;
    const { password, timestamp } = generateMpesaPassword(shortcode, passkey);
    const env =
      process.env.MPESA_ENVIRONMENT === "production" ? "api" : "sandbox";
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

    // 1. Trigger Daraja STK Push
    const stkUrl = `https://${env}.safaricom.co.ke/mpesa/stkpush/v1/processrequest`;
    const callbackUrl = `${baseUrl}/api/mpesa/callback`;
    const safeDesc = (description || "Order")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .substring(0, 20);
    const safeAccRef = orderId.replace(/[^a-zA-Z0-9]/g, "").substring(0, 20);

    const payload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: safeAccRef,
      TransactionDesc: safeDesc,
    };

    const safePayload = { ...payload, Password: "*****" };

    console.log("STK Push request data:", {
      phone,
      amount,
      orderId,
      description,
      formattedPhone,
      shortcode,
      env,
      callbackUrl,
      payload: safePayload,
    });

    const res = await fetch(stkUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await res.text();
    let data: any;

    try {
      data = JSON.parse(responseText);
    } catch (parseError: any) {
      data = {
        parseError: responseText,
        parseErrorMessage: parseError?.message || "Unable to parse response",
      };
    }

    console.log("STK Push response status:", res.status, res.statusText);
    console.log("STK Push response data:", data);

    // 2. Check if STK Push was successful
    if (data.ResponseCode !== "0") {
      return NextResponse.json(
        {
          error: data.errorMessage || "STK Push failed",
          debug: {
            requestPayload: safePayload,
            responseData: data,
            stkUrl,
          },
        },
        { status: 400 },
      );
    }

    // 3. Update the existing order with the Daraja tracking ID (ONLY if STK push succeeded)
    const { error: dbError } = await adminDb
      .from("orders")
      .update({ checkout_request_id: data.CheckoutRequestID })
      .eq("id", orderId);

    if (dbError) {
      console.error("Failed to update order with STK ID:", dbError);
    } else {
      console.log(
        "Order updated with STK ID:",
        data.CheckoutRequestID,
        "for orderId:",
        orderId,
      );
    }

    return NextResponse.json({
      success: true,
      checkoutRequestId: data.CheckoutRequestID,
      message: "STK Push sent successfully. Check your phone.",
      debug: {
        requestPayload: safePayload,
        responseData: data,
      },
    });
  } catch (error: any) {
    console.error("STK Push Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
