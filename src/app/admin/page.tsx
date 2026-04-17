import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Sparkles, ArrowLeft, History, Settings2 } from "lucide-react";
import { AdminActions } from "./AdminActions";
import { AdminHistory } from "./AdminHistory";
import { AdminMaintenance } from "./AdminMaintenance";
import { BusinessSettings } from "./BusinessSettings";
import { Calendar } from "lucide-react";

export default async function AdminPage() {
  const supabase = await createClient();

  // 1. Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return redirect("/?error=necesitas-login");

  // 2. Admin check — use SECURITY DEFINER RPC to bypass RLS edge cases
  const { data: isAdminResult } = await supabase.rpc("get_my_is_admin");

  // Fallback: also check profiles table directly
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin, full_name")
    .eq("id", user.id)
    .single();

  const isAdmin = isAdminResult === true || profile?.is_admin === true;
  if (!isAdmin) return redirect("/dashboard");

  // 3. Fetch price data
  const { data: priceData } = await supabase
    .from("rental_prices")
    .select("daily_rate, weekly_rate")
    .eq("equipment_name", "ADSS FG2000B")
    .single();

  // 4. Fetch pending rentals with uploaded receipts
  // Supabase returns an array for relations — we normalize to single object
  type RentalRow = {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    cost: number | null;
    deposit_amount: number | null;
    receipt_url: string | null;
    status: string;
    is_maintenance?: boolean;
    external_professionals: { name: string; phone: string | null; email: string | null } | { name: string; phone: string | null; email: string | null }[] | null;
    locations: { name: string } | { name: string }[] | null;
  };

  const { data: rawRentals } = await supabase
    .from("rentals")
    .select(`
      id, title, start_date, end_date, cost, deposit_amount, receipt_url, status,
      external_professionals ( name, phone, email ),
      locations ( name )
    `)
    .eq("status", "pendiente")
    .not("receipt_url", "is", null)
    .order("created_at", { ascending: true });

  // Normalize external_professionals and resolve signed URLs for receipts securely
  const rentals = await Promise.all(
    (rawRentals as RentalRow[] | null)?.map(async (r) => {
      let finalUrl = r.receipt_url;
      // Si receipt_url es un path plano en lugar de un link (ej. 17132890214-foto.jpg)
      if (finalUrl && !finalUrl.startsWith("http")) {
        const { data: signed } = await supabase.storage
          .from("comprobantes")
          .createSignedUrl(finalUrl, 60 * 60 * 24 * 7); // 7 dias
        if (signed?.signedUrl) {
          finalUrl = signed.signedUrl;
        }
      }

      return {
        ...r,
        receipt_url: finalUrl,
        external_professionals: Array.isArray(r.external_professionals)
          ? r.external_professionals[0] ?? null
          : r.external_professionals,
        locations: Array.isArray(r.locations)
          ? r.locations[0] ?? null
          : r.locations,
      };
    }) ?? []
  );

  // 4. Fetch all history rentals for stats and history table
  const { data: rawHistoryRentals } = await supabase
    .from("rentals")
    .select(`
      id, title, start_date, end_date, cost, deposit_amount, receipt_url, status, created_at, is_maintenance,
      external_professionals ( name, phone, email ),
      locations ( name )
    `)
    .order("created_at", { ascending: false });

  const historyRentals = await Promise.all(
    (rawHistoryRentals as RentalRow[] | null)?.map(async (r) => {
      let finalUrl = r.receipt_url;
      if (finalUrl && !finalUrl.startsWith("http")) {
        const { data: signed } = await supabase.storage
          .from("comprobantes")
          .createSignedUrl(finalUrl, 60 * 60 * 24 * 7);
        if (signed?.signedUrl) {
          finalUrl = signed.signedUrl;
        }
      }

      return {
        ...r,
        receipt_url: finalUrl,
        external_professionals: Array.isArray(r.external_professionals)
          ? r.external_professionals[0] ?? null
          : r.external_professionals,
        locations: Array.isArray(r.locations)
          ? r.locations[0] ?? null
          : r.locations,
      };
    }) ?? []
  );

  const stats = {
    pendiente: historyRentals.filter((r) => r.status === "pendiente").length,
    reservado: historyRentals.filter((r) => r.status === "reservado").length,
    completado: historyRentals.filter((r) => r.status === "completado").length,
    total: historyRentals.length,
  };

  const adminName = profile?.full_name?.split(" ")[0] ?? "Administrador";

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* ── Header ── */}
      <div className="relative overflow-hidden bg-stone-900 pt-28 pb-16 px-4 border-b border-stone-800">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[#D4AF37]/5 blur-[100px]" />
        <div className="mx-auto max-w-6xl relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-300 text-xs font-bold uppercase tracking-widest transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Ver mi panel
            </Link>
          </div>
          <div className="flex items-start justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37]/20 px-4 py-1.5 text-xs font-semibold tracking-widest text-[#D4AF37] uppercase mb-4">
                <ShieldCheck className="h-3.5 w-3.5" />
                Panel de Administración
              </span>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
                Hola, {adminName} 👋
              </h1>
              <p className="text-stone-400 font-light mt-3 text-lg">
                Reservas pendientes de confirmación de pago.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 space-y-12">

        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Pendientes con seña", value: rentals?.length ?? 0, color: "text-amber-600", bg: "bg-amber-50 border-amber-100" },
            { label: "Pendientes totales", value: stats.pendiente, color: "text-stone-600", bg: "bg-stone-50 border-stone-100" },
            { label: "Confirmadas", value: stats.reservado, color: "text-[#B89B72]", bg: "bg-[#FCFAF5] border-[#EAE3D5]" },
            { label: "Total reservas", value: stats.total, color: "text-stone-900", bg: "bg-white border-[#EAE3D5]" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} border rounded-3xl p-6 shadow-sm`}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">{s.label}</p>
              <p className={`font-serif text-5xl font-bold leading-none ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Pending confirmations table ── */}
        <section className="space-y-6">
          <div className="flex items-end justify-between px-2">
            <div>
              <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
                Pendientes de Confirmación
              </h2>
              <div className="h-1 w-12 bg-[#D4AF37] mt-2 rounded-full" />
              <p className="text-sm text-stone-400 font-medium mt-3">
                Reservas con comprobante de seña enviado, esperando tu confirmación.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-[#B89B72] uppercase tracking-[0.15em]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{rentals?.length ?? 0} en cola</span>
            </div>
          </div>

          <AdminActions rentals={rentals ?? []} />
        </section>

        {/* ── Ajustes de Negocio (Precios) ── */}
        <section className="space-y-6">
          <div className="flex items-end justify-between px-2">
            <div>
              <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight flex items-center gap-3">
                <Settings2 className="h-8 w-8 text-[#B89B72]" />
                Gestión de Tarifas
              </h2>
              <div className="h-1 w-12 bg-[#D4AF37] mt-2 rounded-full" />
            </div>
          </div>
          <BusinessSettings 
            initialDailyRate={Number(priceData?.daily_rate || 0)} 
            initialWeeklyRate={Number(priceData?.weekly_rate || 0)} 
          />
        </section>

        {/* ── All active rentals summary ── */}
        <section className="space-y-6">
          <div className="px-2">
            <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight">
              Estado General
            </h2>
            <div className="h-1 w-12 bg-[#D4AF37] mt-2 rounded-full" />
          </div>
          <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white shadow-sm overflow-hidden">
            <div className="px-8 py-5 flex items-center gap-4 flex-wrap">
              {[
                { label: "Pendiente", color: "bg-amber-500", text: "text-amber-700", count: stats.pendiente },
                { label: "Reservado", color: "bg-[#B89B72]", text: "text-[#B89B72]", count: stats.reservado },
                { label: "Completado", color: "bg-stone-400", text: "text-stone-500", count: stats.completado },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                  <span className={`text-xs font-bold uppercase tracking-widest ${s.text}`}>
                    {s.label}: {s.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Calendario de Mantenimiento ── */}
        <section className="space-y-6">
          <div className="flex items-end justify-between px-2">
            <div>
              <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight flex items-center gap-3">
                <Calendar className="h-8 w-8 text-[#B89B72]" />
                Calendario de Mantenimiento / Bloqueos
              </h2>
              <div className="h-1 w-12 bg-[#D4AF37] mt-2 rounded-full" />
            </div>
          </div>
          <AdminMaintenance allRentals={historyRentals} />
        </section>

        {/* ── Historial General ── */}
        <section className="space-y-6">
          <div className="flex items-end justify-between px-2">
            <div>
              <h2 className="font-serif text-3xl font-bold text-stone-900 tracking-tight flex items-center gap-3">
                <History className="h-8 w-8 text-[#B89B72]" />
                Historial de Alquileres
              </h2>
              <div className="h-1 w-12 bg-[#D4AF37] mt-2 rounded-full" />
              <p className="text-sm text-stone-400 font-medium mt-3">
                Explora el registro completo de reservas y filtra por profesional o estado.
              </p>
            </div>
          </div>

          <AdminHistory rentals={historyRentals} />
        </section>
      </div>
    </div>
  );
}
