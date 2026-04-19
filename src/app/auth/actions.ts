"use server";

import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const nextDestination = formData.get("next") as string || "/dashboard";
  
  const headersList = await headers();
  // Priority: explicit env var → request host header → safe empty string (Supabase handles redirect)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  let origin: string;
  if (siteUrl) {
    origin = siteUrl.replace(/\/$/, ""); // strip trailing slash
  } else {
    const host = headersList.get("host") || "";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    origin = host ? `${protocol}://${host}` : "";
  }
  
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
