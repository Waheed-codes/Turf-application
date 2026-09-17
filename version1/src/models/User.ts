import mongoose, { Schema, type Model } from "mongoose";

export type UserRole = "user" | "manager" | "admin";

export interface IUser {
  name: string;
  mobile: string;
  email?: string;
  referralCode?: string;
  role: UserRole;
  venueId?: mongoose.Types.ObjectId;
  whatsappUpdates: boolean;
  offers: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      index: true,
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

    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
      required: true,
    },

    venueId: {
      type: Schema.Types.ObjectId,
      ref: "Venue",
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
  {
    timestamps: true,
  },
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
