export interface SendOtpResult {
  success: boolean;
  message?: string;
  mode: "sms" | "dev_log";
}

/**
 * Sends a 4-digit OTP to the user's mobile number.
 * 
 * Behavior:
 * - In development or when no SMS API key is configured in .env.local:
 *   Prints the OTP to the console, allowing offline / free local development.
 * - In production or when SMS_API_KEY is provided:
 *   Calls the configured SMS provider API (e.g. Fast2SMS).
 */
export async function sendOtpSms(
  mobile: string,
  otp: string,
): Promise<SendOtpResult> {
  const apiKey = process.env.SMS_API_KEY;

  // Extract pure 10-digit Indian number for SMS gateways (stripping 91 or +91)
  const tenDigit = mobile.replace(/\D/g, "").slice(-10);

  // 1. Fallback mode: If no API key is configured, log to terminal
  if (!apiKey) {
    console.log(`[DEV OTP] ${mobile} (10-digit: ${tenDigit}): ${otp}`);
    return {
      success: true,
      mode: "dev_log",
    };
  }

  // 2. Real Provider Mode: Fast2SMS Quick OTP Route
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "otp",
        variables_values: otp,
        numbers: tenDigit,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const data = await response.json();

    if (!response.ok || !data.return) {
      console.error("[SMS Gateway Error]", data);
      return {
        success: false,
        message: data.message || "Failed to deliver OTP via SMS provider",
        mode: "sms",
      };
    }

    return {
      success: true,
      mode: "sms",
    };
  } catch (error) {
    console.error("[SMS Provider Network Exception]", error);
    return {
      success: false,
      message: "Network error communicating with SMS provider",
      mode: "sms",
    };
  }
}
