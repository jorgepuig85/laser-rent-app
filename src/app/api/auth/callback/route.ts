import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/alquiler";

  if (code) {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && authData.user) {
      const user = authData.user;
      // Vincular con external_professionals
      const { data: proExists } = await supabase
        .from("external_professionals")
        .select("id, cuit, phone")
        .eq("email", user.email)
        .single();

      if (proExists) {
        // Actualizar auth_id en caso de ser nulo o viejo
        await supabase
          .from("external_professionals")
          .update({ auth_id: user.id })
          .eq("id", proExists.id);
      } else {
        // Crear nuevo registro
        await supabase
          .from("external_professionals")
          .insert({
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Profesional",
            auth_id: user.id,
          });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/?error=auth-failed`);
}
