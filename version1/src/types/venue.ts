export type VenueSport = "Badminton" | "Box Cricket" | "Football";

export type Venue = {
  id: string;
  name: string;
  sport: VenueSport;
  area: string;
  city: string;
  rating: number;
  mockDistanceKm: number;
  startingPricePerHour: number;
  image: string;
  imageDescription: string;
  sports: VenueSport[];
  amenities: string[];
  description: string;
  dimensions: string;
  surface: string;
  setting: "Indoor" | "Outdoor";
  courts?: number;
  address: string;
};
