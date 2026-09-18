import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { verifyOtp } from "@/lib/auth/otp";
import { createSession } from "@/lib/auth/session";
import { normalizeMobile } from "@/lib/auth/mobile";
import User from "@/models/User";
import OtpVerification from "@/models/OtpVerification";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { mobile, otp, purpose } = body;

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

    if (!otp || typeof otp !== "string" || !/^\d{4}$/.test(otp)) {
      return NextResponse.json(
        {
          success: false,
          message: "A valid 4-digit OTP is required",
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

    await connectToDatabase();

    // Find the latest OTP
    const verification = await OtpVerification.findOne({
      mobile: normalizedMobile,
      purpose,
    }).sort({ createdAt: -1 });

    if (!verification) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP not found. Please request a new OTP.",
        },
        { status: 404 },
      );
    }

    // Check expiry
    if (verification.expiresAt < new Date()) {
      await OtpVerification.deleteOne({
        _id: verification._id,
      });

      return NextResponse.json(
        {
          success: false,
          message: "OTP has expired. Please request a new OTP.",
        },
        { status: 400 },
      );
    }

    // Check attempt limit
    if (verification.attempts >= 5) {
      await OtpVerification.deleteOne({
        _id: verification._id,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Too many incorrect attempts. Please request a new OTP.",
        },
        { status: 429 },
      );
    }

    // Verify OTP
    const isValid = verifyOtp(otp, verification.otpHash);

    if (!isValid) {
      const updated = await OtpVerification.findByIdAndUpdate(
        verification._id,
        { $inc: { attempts: 1 } },
        { new: true },
      );

      const attempts = updated?.attempts ?? (verification.attempts + 1);
      const remainingAttempts = Math.max(0, 5 - attempts);

      if (attempts >= 5) {
        await OtpVerification.deleteOne({ _id: verification._id });
        return NextResponse.json(
          {
            success: false,
            message: "Too many incorrect attempts. Please request a new OTP.",
          },
          { status: 429 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: `Incorrect OTP. ${remainingAttempts} attempt${remainingAttempts === 1 ? "" : "s"} remaining.`,
        },
        { status: 400 },
      );
    }

    // -------------------------
    // SIGNUP
    // -------------------------
    if (purpose === "signup") {
      // Prevent duplicate accounts
      const existingUser = await User.findOne({ mobile: normalizedMobile });

      if (existingUser) {
        await OtpVerification.deleteOne({
          _id: verification._id,
        });

        return NextResponse.json(
          {
            success: false,
            message: "An account already exists with this mobile number.",
          },
          { status: 409 },
        );
      }

      if (!verification.signupData) {
        return NextResponse.json(
          {
            success: false,
            message: "Signup information is missing. Please start again.",
          },
          { status: 400 },
        );
      }

      let user;
      try {
        user = await User.create({
          name: verification.signupData.name,
          mobile: verification.mobile,
          email: verification.signupData.email,
          referralCode: verification.signupData.referralCode,
          role: "user",
          whatsappUpdates: verification.signupData.whatsappUpdates,
          offers: verification.signupData.offers,
        });
      } catch (err: unknown) {
        const mongoError = err as { code?: number };
        if (mongoError?.code === 11000) {
          await OtpVerification.deleteOne({ _id: verification._id });
          return NextResponse.json(
            {
              success: false,
              message: "An account already exists with this mobile number.",
            },
            { status: 409 },
          );
        }
        throw err;
      }

      // OTP can no longer be reused
      await OtpVerification.deleteOne({
        _id: verification._id,
      });

      // Create authenticated session
      await createSession(user._id.toString());

      return NextResponse.json(
        {
          success: true,
          message: "Account created successfully",
        },
        { status: 201 },
      );
    }

    // -------------------------
    // LOGIN
    // -------------------------

    const user = await User.findOne({ mobile: normalizedMobile });

    if (!user) {
      await OtpVerification.deleteOne({
        _id: verification._id,
      });

      return NextResponse.json(
        {
          success: false,
          message: "Account not found. Please create an account.",
        },
        { status: 404 },
      );
    }

    // OTP can no longer be reused
    await OtpVerification.deleteOne({
      _id: verification._id,
    });

    // Create authenticated session
    await createSession(user._id.toString());

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Verify OTP error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}