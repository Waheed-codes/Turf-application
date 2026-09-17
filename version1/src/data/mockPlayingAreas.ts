import type { PlayingArea, SportConfiguration } from "@/types/venue";

// Repeatable weekly fixtures with optional exact-date overrides for frontend tests.
export function withPlayingAreas(config: SportConfiguration): SportConfiguration {
  const label = config.countLabel.slice(0, -1);
  const patterns = [[8, 13], [6, 14], [7, 9], [10, 15]];
  return {
    ...config,
    playingAreas: Array.from({ length: config.count }, (_, index): PlayingArea => ({
      id: `${label.toLowerCase()}-${index + 1}`,
      name: `${label} ${index + 1}`,
      hourlyPrice: config.hourlyPrice,
      priceByHour: { ...config.priceByHour },
      weeklySchedule: Object.fromEntries(Array.from({ length: 7 }, (_, day) => [day, {
        blockedHours: patterns[index % patterns.length].map((hour) => hour + day % 2),
        priceByHour: {},
      }])),
      dates: {},
    })),
  };
}
