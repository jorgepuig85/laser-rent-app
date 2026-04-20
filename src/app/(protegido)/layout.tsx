import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

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
    try {
      const headersList = await headers();
      const currentPath = headersList.get("x-url") || "/dashboard";
      redirect("/?login=true&next=" + encodeURIComponent(currentPath));
    } catch (e) {
      console.error("Redirect error in layout:", e);
      redirect("/?login=true&next=%2Fdashboard");
    }
  }
  // v2.1: Force build cache clean


  // v2.2: Consolidar chequeo en external_professionals (Fuente de Verdad única)
  const [profileResult, proResult] = await Promise.all([
    supabase.from("profiles").select("is_admin").eq("id", user.id).single(),
    supabase.from("external_professionals").select("cuit, phone").eq("auth_id", user.id).single()
  ]);

  if (profileResult.data?.is_admin) return <>{children}</>;

  if (!proResult.data?.cuit || !proResult.data?.phone) {
    redirect("/completar-perfil");
  }

  return <>{children}</>;
}
