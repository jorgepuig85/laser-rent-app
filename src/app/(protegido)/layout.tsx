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
    const { headers } = await import("next/headers");
    const headersList = headers();
    const currentPath = headersList.get("x-url") || "/alquiler";
    redirect(`/?error=necesitas-login&next=${currentPath}`);
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
