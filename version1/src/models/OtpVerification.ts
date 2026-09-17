import mongoose, { Schema, type Model } from "mongoose";

export type OtpPurpose = "login" | "signup";

export interface IOtpVerification {
  mobile: string;
  otpHash: string;
  purpose: OtpPurpose;

  signupData?: {
    name: string;
    email?: string;
    referralCode?: string;
    whatsappUpdates: boolean;
    offers: boolean;
  };

  expiresAt: Date;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const otpVerificationSchema = new Schema<IOtpVerification>(
  {
    mobile: {
      type: String,
      required: true,
      index: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: ["login", "signup"],
      required: true,
    },

    signupData: {
      name: {
        type: String,
        trim: true,
      },
      email: {
        type: String,
        lowercase: true,
        trim: true,
      },
      referralCode: {
        type: String,
        trim: true,
      },
      whatsappUpdates: {
        type: Boolean,
        default: true,
      },
      offers: {
        type: Boolean,
        default: true,
      },
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const OtpVerification: Model<IOtpVerification> =
  mongoose.models.OtpVerification ||
  mongoose.model<IOtpVerification>(
    "OtpVerification",
    otpVerificationSchema,
  );

export default OtpVerification;