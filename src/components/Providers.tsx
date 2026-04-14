"use client";

import React from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { SeasonProvider } from "@/context/SeasonContext";
import { Toaster } from "sonner";
import { SeasonalCursor } from "./SeasonalCursor";
import { WhatsAppButton } from "./WhatsAppButton";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "dummy-key"}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
      }}
    >
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
    </GoogleReCaptchaProvider>
  );
}
