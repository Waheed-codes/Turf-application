import HomeScreen from "./home-screen";
import { readAvailabilityContext, type Query } from "@/lib/booking-context";

export default async function HomePage({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  return <HomeScreen key={JSON.stringify(query)} initialContext={readAvailabilityContext(query)} initialQuery={typeof query.q === "string" ? query.q : ""} />;
}
