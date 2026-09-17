import SearchScreen from "./search-screen";
import type { Query } from "@/lib/booking-context";

export default async function SearchPage({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  return <SearchScreen key={JSON.stringify(query)} initialQuery={typeof query.q === "string" ? query.q : ""} />;
}
