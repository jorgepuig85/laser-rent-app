import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Image from "next/image";

const ADSS_IMAGE = "https://pbvxslvihypfblbfyqle.supabase.co/storage/v1/object/public/equipos_imagenes/equipo_depilacion.webp";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/?error=necesitas-login");

  const { data: pro } = await supabase
    .from("external_professionals")
    .select("id")
    .eq("auth_id", user.id)
    .single();

  if (!pro) return redirect("/completar-perfil");

  const { data: rentals } = await supabase
    .from("rentals")
    .select("*")
    .eq("external_professional_id", pro.id)
    .order("start_date", { ascending: true });

  return (
    <div className="max-w-4xl mx-auto py-24 px-4">
      <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-slate-900 mb-12">
        Mis Reservas
      </h1>

      {rentals && rentals.length > 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-700 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Reserva</th>
                <th className="px-6 py-4">Período</th>
                <th className="px-6 py-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rentals.map((r: { id: string, title: string, start_date: string, end_date: string }) => (
                <tr
                  key={r.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                        <Image src={ADSS_IMAGE} alt="ADSS FG2000B" fill className="object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">ADSS FG2000B</p>
                        <p className="text-xs text-slate-500">Categoría: Trío Láser</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {format(parseISO(r.start_date), "dd MMM yyyy", { locale: es })}{" "}
                    - {format(parseISO(r.end_date), "dd MMM yyyy", { locale: es })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Confirmada
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-100 shadow-sm">
          <p className="text-slate-500">Aún no tienes reservas.</p>
        </div>
      )}
    </div>
  );
}
