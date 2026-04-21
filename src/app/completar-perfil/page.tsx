import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { ProfileForm } from "./ProfileForm";

export default async function CompletarPerfil() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/?error=necesitas-login");

  // Verificar si ya tiene el perfil completo para no mostrar el formulario innecesariamente
  const { data: pro } = await supabase
    .from("external_professionals")
    .select("cuit, phone")
    .eq("auth_id", user.id)
    .single();

  if (pro?.cuit && pro?.phone) {
    return redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/30 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
        <ProfileForm />
      </div>
    </div>
  );
}
