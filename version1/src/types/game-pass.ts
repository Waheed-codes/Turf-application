import type { BookingContext, VenueSlot } from "@/lib/booking-context";
import type { Venue } from "./venue";

export type GamePassReceipt = {
  id: string;
  venue: Pick<Venue, "id" | "name" | "area" | "city">;
  context: BookingContext;
  slots: VenueSlot[];
  areaName: string;
  amountPaid: number;
  status: "CONFIRMED";
  mock?: boolean;
};
