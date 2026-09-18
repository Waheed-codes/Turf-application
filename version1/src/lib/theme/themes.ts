import type { CSSProperties } from "react";

export type ThemeId =
  | "moss-bone"
  | "graphite-sand"
  | "forest-ink"
  | "clay-linen"
  | "stone-merlot"
  | "obsidian-olive";

export interface ThemeTokens {
  background: string;
  surface: string;
  surfaceSecondary: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryHover: string;
  accent: string;
  buttonText: string;
}

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  tagline: string;
  personality: string;
  isDark?: boolean;
  tokens: ThemeTokens;
}

export const themes: Record<ThemeId, ThemeDefinition> = {
  "moss-bone": {
    id: "moss-bone",
    name: "Moss & Bone",
    tagline: "Earthy, calm, premium, outdoor/sport lifestyle",
    personality:
      "Earthy, calm, premium, outdoor/sport lifestyle. Clear sports application aesthetic without looking eco/organic.",
    tokens: {
      background: "#F3F0E6",
      surface: "#FAF9F3",
      surfaceSecondary: "#E8E5DA",
      textPrimary: "#20221C",
      textSecondary: "#6D7065",
      border: "#D8D5C8",
      primary: "#4F5D3A",
      primaryHover: "#374329",
      accent: "#A59A68",
      buttonText: "#FAF9F3",
    },
  },
  "graphite-sand": {
    id: "graphite-sand",
    name: "Graphite & Sand",
    tagline: "Luxury, editorial, confident, timeless",
    personality:
      "Luxury, editorial, confident, timeless. Similar to a premium fashion/editorial brand while remaining sporty.",
    tokens: {
      background: "#E9E2D5",
      surface: "#F5F1E8",
      surfaceSecondary: "#DED6C7",
      textPrimary: "#171717",
      textSecondary: "#68645C",
      border: "#D2C9BA",
      primary: "#252525",
      primaryHover: "#3A3A38",
      accent: "#B49A70",
      buttonText: "#F5F1E8",
    },
  },
  "forest-ink": {
    id: "forest-ink",
    name: "Forest Ink",
    tagline: "Sophisticated, quiet, premium",
    personality:
      "Sophisticated, quiet, premium. Deep natural tones without looking like banking or finance.",
    tokens: {
      background: "#F1F2EA",
      surface: "#FAFAF6",
      surfaceSecondary: "#E3E6DC",
      textPrimary: "#17201C",
      textSecondary: "#66706A",
      border: "#D4D9D2",
      primary: "#193C32",
      primaryHover: "#102C25",
      accent: "#7C8C72",
      buttonText: "#FAFAF6",
    },
  },
  "clay-linen": {
    id: "clay-linen",
    name: "Clay & Linen",
    tagline: "Warm, human, handcrafted, distinctive",
    personality:
      "Warm, human, handcrafted, distinctive. The clay color is focused on key actions without overwhelming the screen.",
    tokens: {
      background: "#F4EDE2",
      surface: "#FBF7F0",
      surfaceSecondary: "#E9DDD0",
      textPrimary: "#29221E",
      textSecondary: "#75675E",
      border: "#DED1C2",
      primary: "#A85F45",
      primaryHover: "#804533",
      accent: "#C49573",
      buttonText: "#FBF7F0",
    },
  },
  "stone-merlot": {
    id: "stone-merlot",
    name: "Stone & Merlot",
    tagline: "Bold, sophisticated, uncommon",
    personality:
      "Bold, sophisticated, uncommon. Merlot acts as an authoritative primary action tone on balanced stone surfaces.",
    tokens: {
      background: "#ECE9E4",
      surface: "#F8F6F2",
      surfaceSecondary: "#DFD9D3",
      textPrimary: "#242021",
      textSecondary: "#70696A",
      border: "#D5D0CC",
      primary: "#5B2630",
      primaryHover: "#421B23",
      accent: "#8B6A69",
      buttonText: "#F8F6F2",
    },
  },
  "obsidian-olive": {
    id: "obsidian-olive",
    name: "Obsidian & Olive",
    tagline: "Dark, athletic, premium",
    personality:
      "Dark, athletic, premium. Built for athletic focus and high contrast readability without looking like gaming software.",
    isDark: true,
    tokens: {
      background: "#111210",
      surface: "#1A1B18",
      surfaceSecondary: "#22231F",
      textPrimary: "#F2F1EA",
      textSecondary: "#A8AAA1",
      border: "#33342F",
      primary: "#A0A36A",
      primaryHover: "#777A48",
      accent: "#C4C882",
      buttonText: "#111210",
    },
  },
};

export const themeList: ThemeDefinition[] = Object.values(themes);

export function getThemeVariables(theme: ThemeDefinition): CSSProperties {
  return {
    "--background": theme.tokens.background,
    "--surface": theme.tokens.surface,
    "--surface-secondary": theme.tokens.surfaceSecondary,
    "--text-primary": theme.tokens.textPrimary,
    "--text-secondary": theme.tokens.textSecondary,
    "--border": theme.tokens.border,
    "--primary": theme.tokens.primary,
    "--primary-hover": theme.tokens.primaryHover,
    "--accent": theme.tokens.accent,
    "--button-text": theme.tokens.buttonText,
  } as CSSProperties;
}
