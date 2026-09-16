import { mockBookings } from "@/data/mockBookings";
import BookingsScreen from "./bookings-screen";

export default function BookingsPage() {
  return <BookingsScreen bookings={mockBookings} />;
}
