"use client";

import React, { createContext, useContext, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Season, THEMES, getSeasonForDate, ThemeConfig } from "@/lib/themes";

interface SeasonContextType {
  season: Season;
  setSeason: (season: Season) => void;
  theme: ThemeConfig;
}

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

function SeasonSearchParamsHandler() {
  const searchParams = useSearchParams();
  const { setSeason } = useSeason();

  useEffect(() => {
    const forcedSeason = searchParams.get("season") as Season;
    if (forcedSeason && THEMES[forcedSeason]) {
      setSeason(forcedSeason);
    } else {
      setSeason(getSeasonForDate(new Date()));
    }
  }, [searchParams, setSeason]);

  return null;
}

export function SeasonProvider({ children }: { children: React.ReactNode }) {
  const [season, setSeason] = useState<Season>("autumn");

  useEffect(() => {
    const theme = THEMES[season];
    const root = document.documentElement;
    root.style.setProperty("--seasonal-primary", theme.primary);
    root.style.setProperty("--seasonal-accent", theme.accent);
    root.style.setProperty("--seasonal-background", theme.background);
    root.style.setProperty("--seasonal-glow", theme.glow);
    
    document.body.setAttribute("data-season", season);
  }, [season]);

  return (
    <SeasonContext.Provider value={{ season, theme: THEMES[season], setSeason }}>
      <Suspense fallback={null}>
        <SeasonSearchParamsHandler />
      </Suspense>
      {children}
    </SeasonContext.Provider>
  );
}

export const useSeason = () => {
  const context = useContext(SeasonContext);
  if (context === undefined) {
    throw new Error("useSeason must be used within a SeasonProvider");
  }
  return context;
};
