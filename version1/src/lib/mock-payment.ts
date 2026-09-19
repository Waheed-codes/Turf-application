"use client";

import { bookingQuery, mockPrice, resolvedSlots, selectedArea, type BookingContext } from "./booking-context";
import type { Venue } from "@/types/venue";

import type { GamePassReceipt } from "@/types/game-pass";

const memory = new Map<string, string>();
const prefix = "arenax-demo-pass:";
export function readDemoPass(id: string) {
  try { return sessionStorage.getItem(prefix + id) ?? memory.get(id) ?? null; }
  catch { return memory.get(id) ?? null; }
}
function saveDemoPass(receipt: GamePassReceipt) {
  const data = JSON.stringify(receipt);
  memory.set(receipt.id, data);
  try { sessionStorage.setItem(prefix + receipt.id, data); } catch { /* Keep this tab's in-memory receipt. */ }
}
function mockBookingId() { return `MOCK-ARX-${crypto.randomUUID()}`; }
const completed = new Map<string, string>();

// DEVELOPMENT ONLY. This is never proof of payment and does not create a booking.
// TODO: Replace this boundary with a backend availability check + Razorpay order,
// checkout, and server verification. Only a backend-confirmed receipt should then
// be passed to GamePass; never trust a client success flag or browser storage.
export async function simulatePayment(venue: Venue, context: BookingContext): Promise<GamePassReceipt> {
  if (process.env.NODE_ENV !== "development" && process.env.NEXT_PUBLIC_ENABLE_MOCK_PAYMENTS !== "true") {
    throw new Error("Online payments will be available soon.");
  }
  const key = `${venue.id}:${bookingQuery(context)}`;
  let existing = completed.get(key);
  try { existing ??= sessionStorage.getItem(prefix + "selection:" + key) ?? undefined; } catch { /* Use memory. */ }
  if (existing) {
    const saved = readDemoPass(existing);
    if (saved) return JSON.parse(saved) as GamePassReceipt;
  }
  const slots = resolvedSlots(venue, context);
  if (!slots.length) throw new Error("Choose available slots to continue.");
  const receipt: GamePassReceipt = {
    id: mockBookingId(), venue: { id: venue.id, name: venue.name, area: venue.area, city: venue.city },
    context, slots, areaName: selectedArea(venue, context.sport, context.areaId)?.name ?? "",
    amountPaid: mockPrice(venue, context).total, status: "CONFIRMED", mock: true,
  };
  saveDemoPass(receipt);
  completed.set(key, receipt.id);
  try { sessionStorage.setItem(prefix + "selection:" + key, receipt.id); } catch { /* Use memory. */ }
  await new Promise((resolve) => setTimeout(resolve, 350));
  return receipt;
}
