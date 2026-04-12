"use server";

import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

function getURL() {
  let url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXT_PUBLIC_VERCEL_URL ??
    "http://localhost:3000";
  url = url.includes("http") ? url : `https://${url}`;
  return url;
}

export async function signIn() {
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://laser-rent-app.vercel.app/api/auth/callback",
    },
  });

  if (data.url) {
    redirect(data.url);
  } else {
    // Fallback if error
    redirect("/?error=auth_failed");
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
