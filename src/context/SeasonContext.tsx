"use client";

import React, { createContext, useContext, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Season, THEMES, getSeasonForDate, ThemeConfig } from "@/lib/themes";

interface SeasonContextType {
  season: Season;
  theme: ThemeConfig;
}

const SeasonContext = createContext<SeasonContextType | undefined>(undefined);

function SeasonInnerProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [season, setSeason] = useState<Season>("autumn");

  useEffect(() => {
    const forcedSeason = searchParams.get("season") as Season;
    if (forcedSeason && THEMES[forcedSeason]) {
      setSeason(forcedSeason);
    } else {
      setSeason(getSeasonForDate(new Date()));
    }
  }, [searchParams]);

  useEffect(() => {
    const theme = THEMES[season];
    const root = document.documentElement;
    root.style.setProperty("--seasonal-primary", theme.primary);
    root.style.setProperty("--seasonal-accent", theme.accent);
    root.style.setProperty("--seasonal-background", theme.background);
    root.style.setProperty("--seasonal-glow", theme.glow);
    
    // Update body data attribute for conditional styling if needed
    document.body.setAttribute("data-season", season);
  }, [season]);

  return (
    <SeasonContext.Provider value={{ season, theme: THEMES[season] }}>
      {children}
    </SeasonContext.Provider>
  );
}

export function SeasonProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <SeasonInnerProvider>{children}</SeasonInnerProvider>
    </Suspense>
  );
}

export const useSeason = () => {
  const context = useContext(SeasonContext);
  if (context === undefined) {
    throw new Error("useSeason must be used within a SeasonProvider");
  }
  return context;
};
