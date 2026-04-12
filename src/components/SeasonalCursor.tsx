"use client";

import React, { useEffect, useRef } from "react";
import { useSeason } from "@/context/SeasonContext";

export function SeasonalCursor() {
  const { theme } = useSeason();
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999] opacity-30 mix-blend-screen transition-colors duration-500"
      style={{
        backgroundColor: theme.primary,
        boxShadow: `0 0 30px 10px ${theme.glow}`,
        filter: "blur(4px)",
      }}
    />
  );
}
