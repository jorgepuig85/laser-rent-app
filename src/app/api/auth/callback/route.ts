import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && authData.user) {
      const user = authData.user;
      // 1. Obtener datos del profesional en una sola pasada
      const { data: pro } = await supabase
        .from("external_professionals")
        .select("id, cuit, phone, auth_id")
        .eq("email", user.email)
        .maybeSingle();

      if (pro) {
        // 2. Si existe, asegurar vinculación (auth_id) si no la tiene
        if (!pro.auth_id) {
          await supabase
            .from("external_professionals")
            .update({ auth_id: user.id })
            .eq("id", pro.id);
        }
        
        // 3. Redirigir según completitud (CUIT/Phone son obligatorios)
        if (!pro.cuit || !pro.phone) {
          return NextResponse.redirect(`${origin}/completar-perfil?next=${encodeURIComponent(next)}`);
        }
      } else {
        // 4. Nuevo registro (perfil incompleto)
        await supabase
          .from("external_professionals")
          .insert({
            email: user.email,
            name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Profesional",
            auth_id: user.id,
          });
        
        return NextResponse.redirect(`${origin}/completar-perfil?next=${encodeURIComponent(next)}`);
      }

      // 5. Redirección final directa
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/?error=auth-failed`);
}
