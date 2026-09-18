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
      expires: 0, // MongoDB TTL index: automatically deletes document when expiresAt is reached
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

// Compound index for rapid lookup and atomic updates by mobile & purpose
otpVerificationSchema.index({ mobile: 1, purpose: 1 });

const OtpVerification: Model<IOtpVerification> =
  mongoose.models.OtpVerification ||
  mongoose.model<IOtpVerification>(
    "OtpVerification",
    otpVerificationSchema,
  );

export default OtpVerification;