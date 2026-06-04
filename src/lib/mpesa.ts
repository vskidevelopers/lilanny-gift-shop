// Generate Daraja OAuth Token
export async function getMpesaToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY!;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET!;
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString(
    "base64",
  );

  const env =
    process.env.MPESA_ENVIRONMENT === "production" ? "api" : "sandbox";
  const url = `https://${env}.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`;

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!res.ok) throw new Error("Failed to get M-Pesa token");
  const data = await res.json();
  return data.access_token;
}

// Generate Base64 Password for STK Push
export function generateMpesaPassword(shortcode: string, passkey: string) {
  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14); // Format: YYYYMMDDHHmmss

  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString(
    "base64",
  );
  return { password, timestamp };
}

// Format phone number to 2547XXXXXXXX
export function formatPhoneNumber(phone: string) {
  const cleaned = phone.replace(/\s/g, "");
  if (cleaned.startsWith("07") || cleaned.startsWith("01")) {
    return "254" + cleaned.substring(1);
  }
  if (cleaned.startsWith("254")) return cleaned;
  if (cleaned.startsWith("+254")) return cleaned.substring(1);
  throw new Error("Invalid phone number format");
}
