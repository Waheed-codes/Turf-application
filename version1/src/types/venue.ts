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

export type AreaSchedule = { blockedHours: number[]; priceByHour?: Record<number, number> };
export type PlayingArea = { id: string; name: string; hourlyPrice: number; priceByHour: Record<number, number>; weeklySchedule: Record<number, AreaSchedule>; dates: Record<string, AreaSchedule> };

export type SportConfiguration = { playingAreas?: PlayingArea[]; dimensions: string; surface: string; count: number; countLabel: "Courts" | "Turfs" | "Grounds"; hourlyPrice: number; blockedHours: number[]; priceByHour: Record<number, number> };
