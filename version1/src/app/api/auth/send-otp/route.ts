import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { generateOtp, hashOtp } from "@/lib/auth/otp";
import User from "@/models/User";
import OtpVerification from "@/models/OtpVerification";
import { normalizeMobile, isValidMobile } from "@/lib/auth/mobile";
import { sendOtpSms } from "@/lib/sms/provider";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { mobile, purpose, signupData } = body;

    // Basic validation
    if (!mobile || typeof mobile !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Mobile number is required",
        },
        { status: 400 },
      );
    }

    const normalizedMobile = normalizeMobile(mobile);
    if (!isValidMobile(mobile)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid 10-digit mobile number",
        },
        { status: 400 },
      );
    }

    if (purpose !== "login" && purpose !== "signup") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP purpose",
        },
        { status: 400 },
      );
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Check whether the mobile already exists
    const existingUser = await User.findOne({ mobile: normalizedMobile });

    // Login: account must already exist
    if (purpose === "login" && !existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Account not found. Please create an account.",
        },
        { status: 404 },
      );
    }

    // Signup: mobile must not already exist
    if (purpose === "signup" && existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account already exists with this mobile number.",
        },
        { status: 409 },
      );
    }

    // Generate OTP
    const otp = generateOtp();

    // Hash OTP before storing it
    const otpHash = hashOtp(otp);

    // Remove previous OTP for this mobile + purpose
    await OtpVerification.deleteMany({
      mobile: normalizedMobile,
      purpose,
    });

    // Save new OTP verification
    await OtpVerification.create({
      mobile: normalizedMobile,
      otpHash,
      purpose,
      signupData: purpose === "signup" ? signupData : undefined,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      attempts: 0,
    });

    // Dispatch OTP via SMS provider (or dev console fallback if no key)
    const smsResult = await sendOtpSms(normalizedMobile, otp);

    if (!smsResult.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            smsResult.message || "Failed to deliver OTP SMS. Please try again.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "OTP sent successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Send OTP error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}