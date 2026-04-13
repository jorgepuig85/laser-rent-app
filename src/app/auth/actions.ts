"use server";

import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const nextDestination = formData.get("next") as string || "/alquiler";
  
  const headersList = await headers();
  const host = headersList.get("host") || "centrodebelleza.com.ar";
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;
  
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/api/auth/callback?next=${encodeURIComponent(nextDestination)}`,
    },
  });

  if (data.url) {
    redirect(data.url);
  } else {
    // Fallback if error
    redirect(`/?error=auth_failed&next=${encodeURIComponent(nextDestination)}`);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
