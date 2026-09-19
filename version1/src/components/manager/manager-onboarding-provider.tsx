"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode, type SetStateAction } from "react";

export const services = [
  { id: "cricket", label: "Cricket", icon: <><circle cx="16" cy="16" r="12" /><path d="M14 4c-4 8 8 16 4 24" strokeDasharray="2 3" /></> },
  { id: "football", label: "Football", icon: <><circle cx="16" cy="16" r="12" /><path d="m16 10 6 4-2 7h-8l-2-7 6-4Z" fill="currentColor" /><path d="m16 4 0 6M5 12l5 2m2 7-4 4m12-4 4 4m-2-11 5-2" /></> },
  { id: "badminton", label: "Badminton", icon: <><path d="m11 20-7-15 8 2 4-3 4 3 8-2-7 15M12 7l3 13m5-13-3 13M11 20h10v3a5 5 0 0 1-10 0v-3Z" /></> },
  { id: "tennis", label: "Tennis", icon: <><ellipse cx="19" cy="12" rx="8" ry="10" transform="rotate(40 19 12)" /><path d="m12 19-8 10m5-13 7 6m0-17 12 10M12 9l12 10M22 4 12 16m14-9L16 20" /><circle cx="25" cy="26" r="4" fill="currentColor" /></> },
  { id: "swimming", label: "Swimming", icon: <><circle cx="8" cy="10" r="3" fill="currentColor" stroke="none" /><path d="m11 20 6-7 7 5m-7-5 4-5h6M3 23q3-3 6 0t6 0 6 0 6 0M3 28q3-3 6 0t6 0 6 0 6 0" /></> },
  { id: "basketball", label: "Basketball", icon: <><circle cx="16" cy="16" r="12" /><path d="m7.5 7.5 17 17m0-17-17 17M4 16c7 3 15-5 12-12m0 24c-3-7 5-15 12-12" /></> },
  { id: "volleyball", label: "Volleyball", icon: <><circle cx="16" cy="16" r="12" /><path d="m16 16 11 5m-11-5-9 8m9-8L13 4M19 5c4 4 5 8 4 14M7 8c5 0 8 3 9 8M5 20c1-6 4-10 8-11m-2 18c2-5 6-7 10-7" /></> },
  { id: "fitness", label: "Gym / Fitness", icon: <><path d="M10 16h12M3 16h3m20 0h3" /><rect x="6" y="6" width="4" height="20" rx="1" fill="currentColor" /><rect x="22" y="6" width="4" height="20" rx="1" fill="currentColor" /></> },
] satisfies { id: string; label: string; icon: ReactNode }[];

export const DAY_MINUTES = 1440;
export const durations = [
  { minutes: 30, label: "30 Minutes" },
  { minutes: 60, label: "1 Hour" },
  { minutes: 90, label: "1.5 Hours" },
  { minutes: 120, label: "2 Hours" },
  { minutes: 180, label: "3 Hours" },
];
type BaseSlot = { id: string; startMinutes: number; endMinutes: number; enabled: boolean };
export type Configuration = { openingMinutes: number; closingMinutes: number; durationMinutes: number; slotPrice?: number | null };
export type Schedule = Configuration & { slots: BaseSlot[] };

function generateSlots(config: Configuration, previous: BaseSlot[] = []): BaseSlot[] {
  const opening = config.openingMinutes;
  const closing = config.closingMinutes;
  if (!Number.isInteger(opening) || !Number.isInteger(closing) || opening < 0 || opening >= DAY_MINUTES || closing < 0 || closing > DAY_MINUTES || opening === closing % DAY_MINUTES || !durations.some((duration) => duration.minutes === config.durationMinutes)) return [];
  const end = closing < opening ? closing + DAY_MINUTES : closing;
  const previousStates = new Map(previous.map((slot) => [slot.id, slot.enabled]));
  const slots: BaseSlot[] = [];
  // Half-open [start, end) base intervals. Future range bookings must reserve
  // every consecutive interval atomically in the backend; this is configuration only.
  for (let start = opening; start + config.durationMinutes <= end; start += config.durationMinutes) {
    const endMinutes = start + config.durationMinutes;
    const id = `${start}-${endMinutes}`;
    slots.push({ id, startMinutes: start, endMinutes, enabled: previousStates.get(id) ?? true });
  }
  return slots;
}

export const customSportIcon = <><circle cx="16" cy="16" r="12" /><path d="M6 17h6l3-7 4 13 3-6h4" /></>;
export type Sport = { id: string; label: string };
export type ResourceType = "pitch" | "court" | "pool" | "area";
export type PlayingArea = { id: string; sportId: string; sportLabel: string; resourceType: ResourceType; name: string };
export const resourceTypes: Record<string, ResourceType> = {
  cricket: "pitch", football: "pitch", badminton: "court", tennis: "court",
  basketball: "court", volleyball: "court", swimming: "pool", fitness: "area",
};
export const terminology: Record<ResourceType, { name: string; label: string }> = {
  pitch: { name: "Pitch", label: "PITCH/TURF" }, court: { name: "Court", label: "COURT" },
  pool: { name: "Pool", label: "POOL" }, area: { name: "Area", label: "AREA" },
};

export type VenueDimensions = { length: number | null; width: number | null; height: number | null; unit: "ft" };

export function formatVenueDimensions({ length, width, height, unit }: VenueDimensions): string {
  if (length == null || width == null) return "";
  return [length, width, height].filter((value) => value != null).map((value) => `${value} ${unit}`).join(" × ");
}

export type VenuePhoto = { id: string; name: string; previewUrl: string };
type Amenity = { id: string; label: string; icon: ReactNode };

type OnboardingState = {
  selectedSports: Sport[];
  customSports: Sport[];
  playingAreas: PlayingArea[];
  schedulesByResource: Record<string, Schedule>;
};
export type BookingSource = "ONLINE" | "OFFLINE";
export type BookingStatus = "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type MockBooking = {
  id: string;
  resourceId: string;
  sportId: string;
  sportName: string;
  playingAreaName: string;
  date: string;
  startMinutes: number;
  endMinutes: number;
  bookingType: BookingSource;
  status: BookingStatus;
  amount: number | null;
  customerName?: string;
  phoneNumber?: string;
};
type OfflineBookingInput = Pick<MockBooking, "resourceId" | "date" | "startMinutes" | "endMinutes" | "customerName" | "phoneNumber">;
type DashboardSelection = { sportId: string; resourceId: string; date: string };
type OnboardingContext = OnboardingState & {
  mapsUrl: string;
  setMapsUrl: (update: SetStateAction<string>) => void;
  selectedArea: string;
  setSelectedArea: (update: SetStateAction<string>) => void;
  mockDetected: boolean;
  setMockDetected: (update: SetStateAction<boolean>) => void;
  dimensions: VenueDimensions;
  setDimensions: (update: SetStateAction<VenueDimensions>) => void;
  description: string;
  setDescription: (update: SetStateAction<string>) => void;
  photos: VenuePhoto[];
  setPhotos: (update: SetStateAction<VenuePhoto[]>) => void;
  selectedAmenityIds: string[];
  setSelectedAmenityIds: (update: SetStateAction<string[]>) => void;
  customAmenities: Amenity[];
  setCustomAmenities: (update: SetStateAction<Amenity[]>) => void;
  notificationPreferences: Record<string, boolean>;
  setNotificationPreferences: (update: SetStateAction<Record<string, boolean>>) => void;
  dashboardSelection: DashboardSelection;
  setDashboardSelection: (update: SetStateAction<DashboardSelection>) => void;
  mockBookings: MockBooking[];
  markSlotBooked: (booking: OfflineBookingInput) => void;
  seedMockBookings: (resourceId: string, date: string, slots: Schedule["slots"]) => void;
  toggleSport: (sport: Sport) => void;
  addCustomSport: (sport: Sport) => void;
  setPlayingAreas: (update: SetStateAction<PlayingArea[]>) => void;
  updateConfiguration: (resourceId: string, update: Partial<Configuration>) => void;
  toggleSlot: (resourceId: string, slotId: string) => void;
};
const ManagerOnboardingContext = createContext<OnboardingContext | null>(null);

function defaultSchedule(): Schedule {
  const config = { openingMinutes: 360, closingMinutes: DAY_MINUTES, durationMinutes: 60, slotPrice: null };
  return { ...config, slots: generateSlots(config) };
}

// Keep resources grouped in selected-sport order, preserve surviving schedules,
// and prune schedules in the same state update as removed sports/resources.
function reconcileAreas(state: OnboardingState, areas: PlayingArea[]): OnboardingState {
  const playingAreas = state.selectedSports.flatMap((sport) => areas.filter((area) => area.sportId === sport.id));
  return {
    ...state,
    playingAreas,
    schedulesByResource: Object.fromEntries(playingAreas.map((area) => [area.id, state.schedulesByResource[area.id] ?? defaultSchedule()])),
  };
}

function selectSport(state: OnboardingState, sport: Sport): OnboardingState {
  const resourceType = resourceTypes[sport.id] ?? "area";
  const area: PlayingArea = {
    id: `${sport.id}-resource-${crypto.randomUUID()}`, sportId: sport.id, sportLabel: sport.label,
    resourceType, name: `${terminology[resourceType].name} 1`,
  };
  return reconcileAreas({ ...state, selectedSports: [...state.selectedSports, sport] }, [...state.playingAreas, area]);
}

export function ManagerOnboardingProvider({ children }: { children: ReactNode }) {
  // Deliberately memory-only. Banking details never enter this state.
  const [state, setState] = useState<OnboardingState>({ selectedSports: [], customSports: [], playingAreas: [], schedulesByResource: {} });

  const [mapsUrl, setMapsUrl] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [mockDetected, setMockDetected] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<VenueDimensions>({ length: null, width: null, height: null, unit: "ft" });
  const [description, setDescription] = useState<string>("");
  const [photos, setPhotos] = useState<VenuePhoto[]>([]);
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>(["washroom", "water", "floodlights"]);
  const [customAmenities, setCustomAmenities] = useState<Amenity[]>([]);
  const [notificationPreferences, setNotificationPreferences] = useState<Record<string, boolean>>({ Booking: true, Cancellation: true, Payment: true });
  const photoUrls = useRef(new Set<string>());
  useEffect(() => {
    const currentUrls = new Set(photos.map((photo) => photo.previewUrl));
    photoUrls.current.forEach((url) => { if (!currentUrls.has(url)) URL.revokeObjectURL(url); });
    photoUrls.current = currentUrls;
  }, [photos]);
  useEffect(() => () => { photoUrls.current.forEach((url) => URL.revokeObjectURL(url)); }, []);

  const [dashboardSelection, setDashboardSelection] = useState<DashboardSelection>({ sportId: "", resourceId: "", date: "" });
  const [mockState, setMockState] = useState<{ seeded: string[]; bookings: MockBooking[] }>({ seeded: [], bookings: [] });
  const seedMockBookings = useCallback((resourceId: string, date: string, slots: Schedule["slots"]) => {
    const area = state.playingAreas.find((area) => area.id === resourceId);
    if (!area) return;
    const key = JSON.stringify([resourceId, date]);
    setMockState((current) => {
      if (current.seeded.includes(key) || slots.length === 0) return current;
      const bookings = slots.filter((slot) => slot.enabled).filter((_, index) => index === 0 || index === 4)
        .map(({ startMinutes, endMinutes }, index): MockBooking => ({
          id: JSON.stringify(["demo", resourceId, date, startMinutes, endMinutes]),
          resourceId, sportId: area.sportId, sportName: area.sportLabel, playingAreaName: area.name,
          date, startMinutes, endMinutes, bookingType: "ONLINE", status: "CONFIRMED",
          customerName: index === 0 ? "Rahul Sharma" : "Amit Patel", amount: index === 0 ? 1200 : 1500,
        }));
      return { seeded: [...current.seeded, key], bookings: [...current.bookings, ...bookings] };
    });
  }, [state.playingAreas]);

  function markSlotBooked(booking: OfflineBookingInput) {
    const slot = state.schedulesByResource[booking.resourceId]?.slots.find((slot) => slot.enabled && slot.startMinutes === booking.startMinutes && slot.endMinutes === booking.endMinutes);
    const area = state.playingAreas.find((area) => area.id === booking.resourceId);
    if (!slot || !area) return;
    const id = crypto.randomUUID();
    setMockState((current) => {
      if (current.bookings.some((existing) => existing.status !== "CANCELLED" && existing.resourceId === booking.resourceId && existing.date === booking.date && existing.startMinutes < booking.endMinutes && existing.endMinutes > booking.startMinutes)) return current;
      return { ...current, bookings: [...current.bookings, { ...booking, id, sportId: area.sportId, sportName: area.sportLabel, playingAreaName: area.name, bookingType: "OFFLINE", status: "CONFIRMED", amount: null, customerName: booking.customerName?.trim() || undefined, phoneNumber: booking.phoneNumber?.trim() || undefined }] };
    });
  }

  function toggleSport(sport: Sport) {
    setState((current) => current.selectedSports.some((selected) => selected.id === sport.id)
      ? reconcileAreas({ ...current, selectedSports: current.selectedSports.filter((selected) => selected.id !== sport.id) }, current.playingAreas)
      : selectSport(current, sport));
  }

  function addCustomSport(sport: Sport) {
    setState((current) => selectSport({ ...current, customSports: [...current.customSports, sport] }, sport));
  }

  function setPlayingAreas(update: SetStateAction<PlayingArea[]>) {
    setState((current) => reconcileAreas(current, typeof update === "function" ? update(current.playingAreas) : update));
  }

  function updateConfiguration(resourceId: string, update: Partial<Configuration>) {
    setState((current) => {
      const existing = current.schedulesByResource[resourceId];
      if (!existing) return current;
      const config = { openingMinutes: existing.openingMinutes, closingMinutes: existing.closingMinutes, durationMinutes: existing.durationMinutes, slotPrice: existing.slotPrice, ...update };
      return { ...current, schedulesByResource: { ...current.schedulesByResource, [resourceId]: { ...config, slots: generateSlots(config, existing.slots) } } };
    });
  }

  function toggleSlot(resourceId: string, slotId: string) {
    setState((current) => {
      const existing = current.schedulesByResource[resourceId];
      if (!existing) return current;
      return { ...current, schedulesByResource: { ...current.schedulesByResource, [resourceId]: {
        ...existing, slots: existing.slots.map((slot) => slot.id === slotId ? { ...slot, enabled: !slot.enabled } : slot),
      } } };
    });
  }

  return <ManagerOnboardingContext.Provider value={{ ...state, mapsUrl, setMapsUrl, selectedArea, setSelectedArea, mockDetected, setMockDetected, dimensions, setDimensions, description, setDescription, photos, setPhotos, selectedAmenityIds, setSelectedAmenityIds, customAmenities, setCustomAmenities, notificationPreferences, setNotificationPreferences, dashboardSelection, setDashboardSelection, mockBookings: mockState.bookings.map((booking) => { const area = state.playingAreas.find((area) => area.id === booking.resourceId); return area ? { ...booking, playingAreaName: area.name, sportName: area.sportLabel } : booking; }), markSlotBooked, seedMockBookings, toggleSport, addCustomSport, setPlayingAreas, updateConfiguration, toggleSlot }}>{children}</ManagerOnboardingContext.Provider>;
}

export function useManagerOnboarding() {
  const context = useContext(ManagerOnboardingContext);
  if (!context) throw new Error("Manager onboarding must be used within its provider.");
  return context;
}
