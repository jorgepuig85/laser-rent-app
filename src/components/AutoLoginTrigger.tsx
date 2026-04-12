"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/app/auth/actions";

export function AutoLoginTrigger() {
  const searchParams = useSearchParams();
  const hasTriggered = useRef(false);

  useEffect(() => {
    const shouldLogin = searchParams.get("login") === "true";
    const next = searchParams.get("next") || "/alquiler";

    if (shouldLogin && !hasTriggered.current) {
      hasTriggered.current = true;
      
      // We use a small timeout to ensure the UI is ready
      // and we wrap it in a form data object to match the server action signature
      const formData = new FormData();
      formData.set("next", next);
      
      signIn(formData);
    }
  }, [searchParams]);

  return null;
}
