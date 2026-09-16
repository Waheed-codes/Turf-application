import SearchScreen from "./search-screen";
import { readBookingContext, type Query } from "@/lib/booking-context";

export default async function SearchPage({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const context = readBookingContext(query);
  return <SearchScreen key={JSON.stringify(query)} bookingContext={context?.source === "availability" ? context : null} initialQuery={typeof query.q === "string" ? query.q : ""} />;
}
