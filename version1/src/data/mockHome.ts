export type Sport = { id: string; name: string };
export type HomeDate = { id: string; weekday: string; day: number; month: string; label: string };
export type TimeOption = { value: string; label: string };
export type UpcomingGame = { venue: string; countdown: string };

export const sports: Sport[] = [
  { id: "football", name: "Football" },
  { id: "cricket", name: "Cricket" },
  { id: "badminton", name: "Badminton" },
];

// Fixed sample dates; these do not represent venue availability.
export const dates: HomeDate[] = [
  { id: "2026-10-01", weekday: "THU", day: 1, month: "OCT", label: "Thursday, 1 October 2026" },
  { id: "2026-10-02", weekday: "FRI", day: 2, month: "OCT", label: "Friday, 2 October 2026" },
  { id: "2026-10-03", weekday: "SAT", day: 3, month: "OCT", label: "Saturday, 3 October 2026" },
  { id: "2026-10-04", weekday: "SUN", day: 4, month: "OCT", label: "Sunday, 4 October 2026" },
];

export const timeOptions: TimeOption[] = [
  { value: "16:00", label: "04:00 PM" },
  { value: "17:00", label: "05:00 PM" },
  { value: "18:00", label: "06:00 PM" },
  { value: "19:00", label: "07:00 PM" },
  { value: "20:00", label: "08:00 PM" },
  { value: "21:00", label: "09:00 PM" },
  { value: "22:00", label: "10:00 PM" },
  { value: "23:00", label: "11:00 PM" },
];
export const upcomingGame: UpcomingGame = { venue: "ARENA X", countdown: "01:42:35" };
export const mockLocation = "Hyderabad";
