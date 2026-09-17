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
  sportConfigurations?: Partial<Record<VenueSport, SportConfiguration>>;
  amenities: string[];
  description: string;
  dimensions: string;
  surface: string;
  setting: "Indoor" | "Outdoor";
  courts?: number;
  address: string;
};

export type SportConfiguration = { dimensions: string; surface: string; count: number; countLabel: "Courts" | "Turfs" | "Grounds"; hourlyPrice: number; blockedHours: number[]; priceByHour: Record<number, number> };
