export type Sport = { id: string; name: string };
export type HomeDate = { id: string; weekday: string; day: number; month: string; label: string; isToday?: boolean };
export type TimeOption = { value: string; label: string };
export type UpcomingGame = { venue: string; countdown: string };

export const sports: Sport[] = [
  { id: "football", name: "Football" },
  { id: "cricket", name: "Cricket" },
  { id: "badminton", name: "Badminton" },
  { id: "pickleball", name: "Pickleball" },
  { id: "table-tennis", name: "Table Tennis" },
];

export function generateUpcomingDates(days: number = 7): HomeDate[] {
  const upcomingDates: HomeDate[] = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    
    const id = d.toISOString().split("T")[0];
    const weekday = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
    const day = d.getDate();
    const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    const label = d.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    
    upcomingDates.push({
      id,
      weekday,
      day,
      month,
      label,
      isToday: i === 0,
    });
  }
  return upcomingDates;
}

export const timeOptions: TimeOption[] = Array.from({ length: 30 }, (_, i) => {
  const hour = i;
  const value = `${hour.toString().padStart(2, '0')}:00`;
  const displayHour = hour % 24;
  const labelHour = displayHour === 0 ? 12 : displayHour > 12 ? displayHour - 12 : displayHour;
  const ampm = displayHour < 12 ? 'AM' : 'PM';
  const label = `${labelHour.toString().padStart(2, '0')}:00 ${ampm}${hour >= 24 ? ' (Next Day)' : ''}`;
  return { value, label };
});
export const upcomingGame: UpcomingGame = { venue: "ARENA X", countdown: "01:42:35" };
export const mockLocation = "Hyderabad";
