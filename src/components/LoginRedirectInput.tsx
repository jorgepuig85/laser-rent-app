"use client";

import { useSearchParams } from "next/navigation";

export function LoginRedirectInput() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/alquiler";

  return <input type="hidden" name="next" value={next} />;
}
