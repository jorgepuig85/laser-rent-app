"use client";

import React from "react";
import { LazyreCaptchaProvider } from "./LazyreCaptchaProvider";
import { SeasonProvider } from "@/context/SeasonContext";
import { Toaster } from "sonner";
import { SeasonalCursor } from "./SeasonalCursor";
import { WhatsAppButton } from "./WhatsAppButton";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LazyreCaptchaProvider>
      <SeasonProvider>
        <SeasonalCursor />
        <Toaster
          position="top-right"
          toastOptions={{
            className: "font-serif border-[--seasonal-primary] bg-white text-slate-900 border",
          }}
        />
        {children}
        <WhatsAppButton />
      </SeasonProvider>
    </LazyreCaptchaProvider>
  );
}
