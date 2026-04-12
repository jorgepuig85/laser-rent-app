export type Season = "summer" | "autumn" | "winter" | "spring";

export interface ThemeConfig {
  primary: string;
  accent: string;
  background: string;
  glow: string;
  animation: "leaves" | "snow" | "petals" | "waves";
  label: string;
}

export const THEMES: Record<Season, ThemeConfig> = {
  autumn: {
    primary: "#D4AF37", // Gold
    accent: "#92400E",  // Amber
    background: "#FFFAF0", // Warm White
    glow: "rgba(212, 175, 55, 0.3)",
    animation: "leaves",
    label: "Otoño",
  },
  winter: {
    primary: "#3B82F6", // Blue
    accent: "#1E3A8A",  // Navy
    background: "#F8FAFC", // Ice White
    glow: "rgba(59, 130, 246, 0.2)",
    animation: "snow",
    label: "Invierno",
  },
  spring: {
    primary: "#F472B6", // Pink
    accent: "#BE185D",  // Rose
    background: "#FFF5F7", // Soft Pink
    glow: "rgba(244, 114, 182, 0.2)",
    animation: "petals",
    label: "Primavera",
  },
  summer: {
    primary: "#0EA5E9", // Cyan
    accent: "#0369A1",  // Deep Blue
    background: "#F0F9FF", // Sky White
    glow: "rgba(14, 165, 233, 0.2)",
    animation: "waves",
    label: "Verano",
  },
};

export const getSeasonForDate = (date: Date): Season => {
  const month = date.getMonth(); // 0-11
  const day = date.getDate();

  // Southern Hemisphere Seasons
  // Summer: Dec 21 - Mar 20
  // Autumn: Mar 21 - Jun 20
  // Winter: Jun 21 - Sep 20
  // Spring: Sep 21 - Dec 20

  if ((month === 11 && day >= 21) || month === 0 || month === 1 || (month === 2 && day <= 20)) {
    return "summer";
  }
  if ((month === 2 && day >= 21) || month === 3 || month === 4 || (month === 5 && day <= 20)) {
    return "autumn";
  }
  if ((month === 5 && day >= 21) || month === 6 || month === 7 || (month === 8 && day <= 20)) {
    return "winter";
  }
  return "spring";
};
