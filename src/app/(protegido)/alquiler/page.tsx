import { createClient } from "@/lib/supabaseServer";
import { ReservationClient } from "./ReservationClient";
import { redirect } from "next/navigation";

export default async function AlquilerPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/?error=necesitas-login");

  // Obtener el perfil profesional asociado
  const { data: pro } = await supabase
    .from("external_professionals")
    .select("id, name")
    .eq("auth_id", user.id)
    .single();

  if (!pro) return redirect("/completar-perfil");

  // Obtener todas las reservas existentes (no de mantenimiento) para inhabilitar fechas
  const { data: rentals } = await supabase
    .from("rentals")
    .select("start_date, end_date")
    .eq("is_maintenance", false);

  return (
    <div className="max-w-4xl mx-auto py-24 px-4">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-slate-900 mb-4">
          Reservar Cabina
        </h1>
        <p className="text-lg text-slate-500">
          Selecciona un rango de fechas para bloquear tu alquiler. Las fechas en gris ya están ocupadas.
        </p>
      </div>
      <ReservationClient
        professionalId={pro.id}
        professionalName={pro.name}
        existingRentals={rentals || []}
      />
    </div>
  );
}
