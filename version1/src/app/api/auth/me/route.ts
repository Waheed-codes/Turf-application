import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getSessionUserId } from "@/lib/auth/session";
import User from "@/models/User";

export async function GET() {
  try {
    const userId = await getSessionUserId();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated",
        },
        { status: 401 },
      );
    }

    await connectToDatabase();

    const user = await User.findById(userId).select(
      "_id name mobile email role venueId whatsappUpdates offers",
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}