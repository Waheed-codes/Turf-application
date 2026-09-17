import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

const OTP_HASH_SECRET = process.env.OTP_HASH_SECRET;

if (!OTP_HASH_SECRET) {
  throw new Error("Please define OTP_HASH_SECRET in .env.local");
}

export function generateOtp(): string {
  return randomInt(1000, 10000).toString();
}

export function hashOtp(otp: string): string {
  return createHmac("sha256", OTP_HASH_SECRET!).update(otp).digest("hex");
}

export function verifyOtp(otp: string, otpHash: string): boolean {
  const calculatedHash = hashOtp(otp);

  const calculatedBuffer = Buffer.from(calculatedHash, "hex");
  const storedBuffer = Buffer.from(otpHash, "hex");

  if (calculatedBuffer.length !== storedBuffer.length) {
    return false;
  }

  return timingSafeEqual(calculatedBuffer, storedBuffer);
}