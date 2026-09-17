import type { PlayingArea, Schedule, Sport, VenuePhoto } from "@/components/manager/manager-onboarding-provider";
import { mockManagers } from "@/data/admin/mockAdmin";

export type AdminVenueStatus = "LIVE" | "PENDING_APPROVAL" | "REJECTED";
export const venueStatusLabels: Record<AdminVenueStatus, string> = {
  LIVE: "Live",
  PENDING_APPROVAL: "Pending Approval",
  REJECTED: "Rejected",
};
export const VENUES_PER_PAGE = 6;

// Uses the same sports, playing-area, photo, and per-resource schedule shapes as
// Manager onboarding. These fixtures represent future shared Venue records;
// they do not read or change the Manager's separate, in-memory preview session.
export type AdminVenue = {
  id: string;
  name: string;
  manager: { id: string; name: string; email: string; phone: string };
  status: AdminVenueStatus;
  selectedSports: Sport[];
  playingAreas: PlayingArea[];
  schedulesByResource: Record<string, Schedule>;
  location: { area: string; address: string; mapsUrl?: string };
  photos: VenuePhoto[];
  description: string;
  amenities: { id: string; label: string }[];
  // A display projection only: full account numbers never enter Admin data.
  banking?: { accountHolderName: string; bank: string; ifscCode: string; accountLast4: string; upiId?: string };
};

export function formatVenueTime(minutes: number) {
  if (!Number.isFinite(minutes)) return "—";
  const normalized = ((Math.floor(minutes) % 1440) + 1440) % 1440;
  const hour = Math.floor(normalized / 60);
  return `${String(hour % 12 || 12).padStart(2, "0")}:${String(normalized % 60).padStart(2, "0")} ${hour >= 12 ? "PM" : "AM"}`;
}

export function formatDuration(minutes: number) {
  if (!Number.isFinite(minutes) || minutes <= 0) return "Not configured";
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "Minute" : "Minutes"}`;
  const hours = minutes / 60;
  return `${hours} ${hours === 1 ? "Hour" : "Hours"}`;
}

const cricket: Sport = { id: "cricket", label: "Cricket" };
const football: Sport = { id: "football", label: "Football" };
const badminton: Sport = { id: "badminton", label: "Badminton" };
const tennis: Sport = { id: "tennis", label: "Tennis" };
const padel: Sport = { id: "padel", label: "Padel" };
const swimming: Sport = { id: "swimming", label: "Swimming" };
const basketball: Sport = { id: "basketball", label: "Basketball" };
const fitness: Sport = { id: "fitness", label: "Gym / Fitness" };

const amenityLabels: Record<string, string> = {
  washroom: "Washroom", water: "Water", parking: "Parking", "changing-room": "Changing Room",
  "first-aid": "First Aid", floodlights: "Floodlights", "seating-area": "Seating Area", cafeteria: "Cafeteria",
};

function managerFor(venueName: string): AdminVenue["manager"] {
  const manager = mockManagers.find((candidate) => candidate.venueName === venueName);
  if (!manager) throw new Error(`Missing mock manager for ${venueName}.`);
  return { id: manager.id, name: manager.name, email: manager.email, phone: manager.phone };
}

function bankDetails(accountHolderName: string, accountLast4: string, upiId?: string): NonNullable<AdminVenue["banking"]> {
  return { accountHolderName, bank: "HDFC Bank", ifscCode: "HDFC0001234", accountLast4, ...(upiId ? { upiId } : {}) };
}

type ResourceFixture = {
  sportId: string;
  resourceType: PlayingArea["resourceType"];
  name: string;
  configuration?: Pick<Schedule, "openingMinutes" | "closingMinutes" | "durationMinutes">;
  disabledStarts?: number[];
};

function resource(sportId: string, resourceType: PlayingArea["resourceType"], name: string, openingMinutes: number, closingMinutes: number, durationMinutes: number, disabledStarts: number[] = []): ResourceFixture {
  return { sportId, resourceType, name, configuration: { openingMinutes, closingMinutes, durationMinutes }, disabledStarts };
}

function makeVenue({ resources, images, amenityIds, ...venue }: Omit<AdminVenue, "playingAreas" | "schedulesByResource" | "photos" | "amenities"> & {
  resources: ResourceFixture[];
  images: { label: string; src: string }[];
  amenityIds: string[];
}): AdminVenue {
  const counts: Record<string, number> = {};
  const schedulesByResource: Record<string, Schedule> = {};
  const playingAreas = resources.map((item): PlayingArea => {
    counts[item.sportId] = (counts[item.sportId] ?? 0) + 1;
    const id = `${venue.id}-${item.sportId}-${counts[item.sportId]}`;
    const sportLabel = venue.selectedSports.find((sport) => sport.id === item.sportId)?.label ?? item.sportId;
    if (item.configuration) {
      const { openingMinutes, closingMinutes, durationMinutes } = item.configuration;
      const closing = closingMinutes <= openingMinutes ? closingMinutes + 1440 : closingMinutes;
      const slots: Schedule["slots"] = [];
      // Keep continuous minutes across midnight, as Manager onboarding does.
      for (let start = openingMinutes; start + durationMinutes <= closing; start += durationMinutes) {
        const end = start + durationMinutes;
        slots.push({ id: `${id}-${start}-${end}`, startMinutes: start, endMinutes: end, enabled: !item.disabledStarts?.includes(start) });
      }
      schedulesByResource[id] = { ...item.configuration, slots };
    }
    return { id, sportId: item.sportId, sportLabel, resourceType: item.resourceType, name: item.name };
  });
  return {
    ...venue,
    playingAreas,
    schedulesByResource,
    photos: images.map((photo, index) => ({ id: `${venue.id}-photo-${index + 1}`, name: `${venue.name} — ${photo.label}`, previewUrl: photo.src })),
    amenities: amenityIds.map((id) => ({ id, label: amenityLabels[id] })),
  };
}

const cricketImage = { label: "Illustrative cricket pitch", src: "/images/venues/cricket.svg" };
const footballImage = { label: "Illustrative football pitch", src: "/images/venues/football.svg" };
const badmintonImage = { label: "Illustrative indoor sports court", src: "/images/venues/badminton.svg" };

export const mockAdminVenues: AdminVenue[] = [
  makeVenue({
    id: "green-park-turf", name: "Green Park Turf", status: "PENDING_APPROVAL",
    manager: { id: "admin-manager-arjun-mehta", name: "Arjun Mehta", email: "arjun.mehta@example.com", phone: "+91 9000000091" },
    selectedSports: [cricket, football],
    resources: [
      resource("cricket", "pitch", "Pitch 1", 360, 1440, 60),
      resource("cricket", "pitch", "Pitch 2", 480, 1200, 90, [750]),
      resource("football", "pitch", "Pitch 1", 420, 1380, 30),
      resource("football", "pitch", "Pitch 2", 600, 1320, 120),
      resource("football", "pitch", "Pitch 3", 1200, 120, 60),
    ],
    location: { area: "Gachibowli", address: "12 Stadium Road, Gachibowli, Hyderabad, Telangana 500032", mapsUrl: "https://www.google.com/maps/search/?api=1&query=Gachibowli+Hyderabad" },
    images: [cricketImage, footballImage],
    description: "A neighbourhood sports venue with two netted cricket pitches and three football pitches. Each playing area has its own operating hours for coaching, friendly matches, and evening games. Floodlights support late sessions, with a shaded seating area for guests.",
    amenityIds: ["washroom", "water", "parking", "changing-room", "first-aid", "floodlights", "seating-area", "cafeteria"],
    banking: bankDetails("Arjun Mehta", "8901", "greenparkturf@upi"),
  }),
  makeVenue({
    id: "sky-padel-arena", name: "Sky Padel Arena", status: "LIVE", manager: managerFor("Sky Padel Arena"),
    selectedSports: [padel, badminton],
    resources: [resource("padel", "court", "Court 1", 360, 1380, 60), resource("padel", "court", "Court 2", 480, 1320, 90), resource("badminton", "court", "Court 1", 420, 1260, 60)],
    location: { area: "Hitech City", address: "28 Cyber Hills Road, Hitech City, Hyderabad, Telangana 500081" },
    images: [badmintonImage],
    description: "Covered padel and badminton courts with consistent indoor lighting and a reception lounge. Separate courts accommodate casual games and coached sessions throughout the week.",
    amenityIds: ["washroom", "water", "parking", "changing-room", "first-aid", "seating-area"],
    banking: bankDetails("Meera Joshi", "4612", "skypadel@upi"),
  }),
  makeVenue({
    id: "rahuls-turf", name: "Rahul's Turf", status: "LIVE", manager: managerFor("Rahul's Turf"),
    selectedSports: [football, cricket],
    resources: [resource("football", "pitch", "Main Turf", 360, 1440, 60), resource("cricket", "pitch", "Practice Nets", 480, 1200, 30)],
    location: { area: "Gachibowli", address: "8 Sports Avenue, Gachibowli, Hyderabad, Telangana 500032" },
    images: [footballImage, cricketImage],
    description: "A floodlit football turf with an adjoining cricket practice area. The venue provides equipment storage, drinking water, and parking close to the entrance.",
    amenityIds: ["washroom", "water", "parking", "floodlights", "seating-area"],
    banking: bankDetails("Rahul Sharma", "7234", "rahulsturf@upi"),
  }),
  makeVenue({
    id: "aquafit-pool", name: "AquaFit Pool", status: "REJECTED", manager: managerFor("AquaFit Pool"),
    selectedSports: [swimming],
    resources: [resource("swimming", "pool", "Training Pool", 360, 1200, 60), resource("swimming", "pool", "Learner Pool", 480, 1080, 30)],
    location: { area: "Madhapur", address: "14 Lake View Road, Madhapur, Hyderabad, Telangana 500081" },
    images: [],
    description: "A swimming facility with separate training and learner pools. Changing rooms and seating are available beside the pool deck.",
    amenityIds: ["washroom", "water", "changing-room", "first-aid", "seating-area"],
    banking: bankDetails("David Wilson", "5518"),
  }),
  makeVenue({
    id: "kings-cricket-ground", name: "Kings Cricket Ground", status: "LIVE", manager: managerFor("Kings Cricket Ground"),
    selectedSports: [cricket],
    resources: [resource("cricket", "pitch", "Match Pitch", 360, 1080, 120), resource("cricket", "pitch", "Practice Pitch", 420, 1260, 60)],
    location: { area: "Kondapur", address: "41 Botanical Garden Road, Kondapur, Hyderabad, Telangana 500084" },
    images: [cricketImage],
    description: "An outdoor cricket ground with a match pitch and a separate practice pitch. Teams have access to changing rooms, water stations, and sheltered seating.",
    amenityIds: ["washroom", "water", "parking", "changing-room", "first-aid", "seating-area"],
    banking: bankDetails("Kevin Peterson", "6135"),
  }),
  makeVenue({
    id: "urban-tennis-club", name: "Urban Tennis Club", status: "LIVE", manager: managerFor("Urban Tennis Club"),
    selectedSports: [tennis],
    resources: [resource("tennis", "court", "Court 1", 360, 1320, 60), resource("tennis", "court", "Court 2", 480, 1440, 90)],
    location: { area: "Miyapur", address: "6 Metro Park Lane, Miyapur, Hyderabad, Telangana 500049" },
    images: [],
    description: "Two outdoor tennis courts for practice and social matches. Evening lighting, changing rooms, and a small cafeteria serve players and visitors.",
    amenityIds: ["washroom", "water", "changing-room", "floodlights", "cafeteria"],
    banking: bankDetails("Sarah Chen", "4026", "urbantennis@upi"),
  }),
  makeVenue({
    id: "arjuns-sports-arena", name: "Arjun's Sports Arena", status: "LIVE", manager: managerFor("Arjun's Sports Arena"),
    selectedSports: [football],
    resources: [resource("football", "pitch", "Five-a-side Turf", 420, 1380, 60), resource("football", "pitch", "Seven-a-side Turf", 540, 1260, 90)],
    location: { area: "Gachibowli", address: "32 University Road, Gachibowli, Hyderabad, Telangana 500032" },
    images: [footballImage],
    description: "Two football turfs with separate entrances for five-a-side and seven-a-side games. Both areas have perimeter netting and floodlights.",
    amenityIds: ["washroom", "water", "parking", "floodlights"],
    banking: bankDetails("Arjun Reddy", "3379"),
  }),
  makeVenue({
    id: "priyas-sports-arena", name: "Priya's Sports Arena", status: "LIVE", manager: managerFor("Priya's Sports Arena"),
    selectedSports: [badminton, fitness],
    resources: [resource("badminton", "court", "Court 1", 360, 1320, 60), resource("badminton", "court", "Court 2", 420, 1260, 30), resource("fitness", "area", "Fitness Studio", 360, 1200, 60)],
    location: { area: "Hitech City", address: "19 Tech Park Road, Hitech City, Hyderabad, Telangana 500081" },
    images: [badmintonImage],
    description: "Indoor badminton courts and a fitness studio with separate operating schedules. The venue includes changing rooms and a refreshment counter.",
    amenityIds: ["washroom", "water", "changing-room", "first-aid", "cafeteria"],
    banking: bankDetails("Priya Rao", "8450", "priyasports@upi"),
  }),
  makeVenue({
    id: "vikrams-sports-arena", name: "Vikram's Sports Arena", status: "LIVE", manager: managerFor("Vikram's Sports Arena"),
    selectedSports: [cricket, football],
    resources: [resource("cricket", "pitch", "Pitch 1", 480, 1320, 60), resource("football", "pitch", "Pitch 1", 1080, 60, 60)],
    location: { area: "Madhapur", address: "23 Jubilee Garden Lane, Madhapur, Hyderabad, Telangana 500081" },
    images: [cricketImage, footballImage],
    description: "Cricket practice nets and a football turf geared towards evening games. The football pitch stays open past midnight under floodlights.",
    amenityIds: ["washroom", "water", "parking", "floodlights", "seating-area"],
    banking: bankDetails("Vikram Singh", "2098"),
  }),
  makeVenue({
    id: "ananyas-sports-arena", name: "Ananya's Sports Arena", status: "PENDING_APPROVAL", manager: managerFor("Ananya's Sports Arena"),
    selectedSports: [basketball, badminton],
    resources: [resource("basketball", "court", "Main Court", 480, 1200, 60), { sportId: "badminton", resourceType: "court", name: "Court 1" }],
    location: { area: "Kondapur", address: "9 Community Park Road, Kondapur, Hyderabad, Telangana 500084" },
    images: [badmintonImage],
    description: "A community sports hall with a basketball court and an adjoining badminton court. The manager is completing the badminton schedule and banking details before opening.",
    amenityIds: ["washroom", "water", "first-aid"],
  }),
  makeVenue({
    id: "karans-sports-arena", name: "Karan's Sports Arena", status: "LIVE", manager: managerFor("Karan's Sports Arena"),
    selectedSports: [badminton, tennis],
    resources: [resource("badminton", "court", "Court 1", 360, 1260, 90), resource("tennis", "court", "Court 1", 420, 1320, 60)],
    location: { area: "Miyapur", address: "17 Green Meadows Road, Miyapur, Hyderabad, Telangana 500049" },
    images: [badmintonImage],
    description: "A racket sports venue offering badminton and tennis. Each court has its own session length, with seating and water stations near reception.",
    amenityIds: ["washroom", "water", "parking", "seating-area"],
    banking: bankDetails("Karan Mehta", "9702", "karansports@upi"),
  }),
  makeVenue({
    id: "nehas-sports-arena", name: "Neha's Sports Arena", status: "PENDING_APPROVAL", manager: managerFor("Neha's Sports Arena"),
    selectedSports: [football, cricket],
    resources: [resource("football", "pitch", "Main Turf", 360, 1380, 60), resource("cricket", "pitch", "Practice Pitch", 540, 1260, 120)],
    location: { area: "Gachibowli", address: "37 Hill Crest Lane, Gachibowli, Hyderabad, Telangana 500032" },
    images: [footballImage, cricketImage],
    description: "A new football turf with a separate cricket practice pitch. The venue includes parking, changing rooms, and floodlighting for evening sessions.",
    amenityIds: ["washroom", "water", "parking", "changing-room", "floodlights"],
    banking: bankDetails("Neha Kapoor", "1823"),
  }),
];
