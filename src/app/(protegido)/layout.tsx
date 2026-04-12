import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/?error=necesitas-login&next=/alquiler");
  }

  const { data: pro } = await supabase
    .from("external_professionals")
    .select("cuit, phone")
    .eq("auth_id", user.id)
    .single();

  if (!pro || !pro.cuit || !pro.phone) {
    redirect("/completar-perfil");
  }

  return <>{children}</>;
}
