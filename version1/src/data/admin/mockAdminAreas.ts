export const areaCities = ["Hyderabad"];

export type AdminArea = {
  id: string;
  name: string;
  city: string;
  pincodes: string[];
  active: boolean;
  venueCount: number;
};
export type AreaValues = Omit<AdminArea, "id" | "venueCount">;

// Stable IDs match existing locality identifiers where available. This dataset
// is an Admin-only preview; future venue records can reference these via areaId.
export const mockAdminAreas: AdminArea[] = [
  { id: "gachibowli", name: "Gachibowli", city: "Hyderabad", pincodes: ["500032"], active: true, venueCount: 18 },
  { id: "hitech-city", name: "Hitech City", city: "Hyderabad", pincodes: ["500081"], active: true, venueCount: 12 },
  { id: "attapur", name: "Attapur", city: "Hyderabad", pincodes: ["500048"], active: true, venueCount: 4 },
  { id: "madhapur", name: "Madhapur", city: "Hyderabad", pincodes: ["500081"], active: true, venueCount: 21 },
  { id: "kondapur", name: "Kondapur", city: "Hyderabad", pincodes: ["500084"], active: true, venueCount: 14 },
  { id: "kukatpally", name: "Kukatpally", city: "Hyderabad", pincodes: ["500072", "500085"], active: true, venueCount: 11 },
  { id: "miyapur", name: "Miyapur", city: "Hyderabad", pincodes: ["500049"], active: true, venueCount: 8 },
  { id: "manikonda", name: "Manikonda", city: "Hyderabad", pincodes: ["500089"], active: true, venueCount: 6 },
  { id: "nallagandla", name: "Nallagandla", city: "Hyderabad", pincodes: ["500019"], active: true, venueCount: 5 },
  { id: "financial-district", name: "Financial District", city: "Hyderabad", pincodes: ["500032"], active: true, venueCount: 7 },
  { id: "jubilee-hills", name: "Jubilee Hills", city: "Hyderabad", pincodes: ["500033"], active: true, venueCount: 9 },
  { id: "banjara-hills", name: "Banjara Hills", city: "Hyderabad", pincodes: ["500034"], active: true, venueCount: 6 },
  { id: "ameerpet", name: "Ameerpet", city: "Hyderabad", pincodes: ["500016", "500038"], active: true, venueCount: 4 },
  { id: "begumpet", name: "Begumpet", city: "Hyderabad", pincodes: ["500016"], active: true, venueCount: 5 },
  { id: "sainikpuri", name: "Sainikpuri", city: "Hyderabad", pincodes: ["500094"], active: true, venueCount: 3 },
  { id: "uppal", name: "Uppal", city: "Hyderabad", pincodes: ["500039"], active: true, venueCount: 8 },
  { id: "lb-nagar", name: "LB Nagar", city: "Hyderabad", pincodes: ["500074"], active: true, venueCount: 4 },
  { id: "dilsukhnagar", name: "Dilsukhnagar", city: "Hyderabad", pincodes: ["500060"], active: false, venueCount: 2 },
  { id: "shamshabad", name: "Shamshabad", city: "Hyderabad", pincodes: ["501218"], active: false, venueCount: 1 },
  { id: "rajendranagar", name: "Rajendranagar", city: "Hyderabad", pincodes: ["500030"], active: false, venueCount: 0 },
];
