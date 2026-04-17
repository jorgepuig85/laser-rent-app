"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { Loader2 } from "lucide-react";

export default function RefreshSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function refresh() {
      try {
        console.log("Forcing session refresh to stabilize access...");
        const { error } = await supabase.auth.refreshSession();
        if (error) {
          console.error("Refresh session error:", error);
          // If refresh fails, we might need to re-login
          router.push("/?login=true&error=session-expired");
        } else {
          router.push(next);
        }
      } catch (err) {
        console.error("Unexpected error during refresh:", err);
        router.push(next);
      }
    }
    refresh();
  }, [supabase, router, next]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center gap-6">
      <div className="relative">
        <div className="h-20 w-20 rounded-full border-4 border-[#EAE3D5] border-t-[#D4AF37] animate-spin" />
        <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-[#D4AF37]" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="font-serif text-2xl font-bold text-stone-900">Validando sesión...</h1>
        <p className="text-sm text-stone-400 font-medium">Estamos optimizando tu acceso al panel.</p>
      </div>
    </div>
  );
}
