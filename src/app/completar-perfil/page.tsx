import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function CompletarPerfil() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/?error=necesitas-login");

  async function saveProfile(formData: FormData) {
    "use server";
    const supabaseServer = await createClient();
    const {
      data: { user: sessionUser },
    } = await supabaseServer.auth.getUser();

    if (!sessionUser) return;

    let cuit = (formData.get("cuit") as string) ?? "";
    const phone = ((formData.get("phone") as string) ?? "").trim();

    // Higienizar CUIT: dejar solo números
    cuit = cuit.replace(/\D/g, "");

    // Validar longitud CUIT exacta
    if (cuit.length !== 11) {
      throw new Error("El CUIT debe tener exactamente 11 dígitos.");
    }

    // Validar longitud celular
    if (phone.length === 0 || phone.length > 15) {
      throw new Error("El teléfono debe tener entre 1 y 15 caracteres.");
    }

    // ── Verificar unicidad del CUIT (evitar duplicados) ──────────────
    const { data: existing } = await supabaseServer
      .from("external_professionals")
      .select("id")
      .eq("cuit", cuit)
      .neq("auth_id", sessionUser.id) // excluir al propio usuario
      .maybeSingle();

    if (existing) {
      throw new Error("Este CUIT ya está registrado en la plataforma.");
    }

    const { error } = await supabaseServer
      .from("external_professionals")
      .update({ cuit, phone })
      .eq("auth_id", sessionUser.id);

    if (!error) {
      // Revalidate to update layouts and middleware checks
      revalidatePath("/", "layout");
      redirect("/dashboard");
    } else {
      console.error("[saveProfile] update error:", error);
      throw new Error("Hubo un error al guardar tu perfil.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4">
      <div className="w-full max-w-md bg-white p-10 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-8">
        <div className="space-y-3 text-center">
          <h1 className="text-4xl font-serif font-bold tracking-tight text-slate-900">
            Comienza tu perfil
          </h1>
          <p className="text-slate-500">
            Para realizar alquileres necesitamos tus datos de facturación y
            contacto.
          </p>
        </div>
        <form action={saveProfile} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="cuit" className="text-sm font-medium leading-none">
              CUIT / CUIL
            </label>
            <input
              id="cuit"
              name="cuit"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              maxLength={11}
              placeholder="Ej: 20123456789"
              className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:bg-slate-100 hover:border-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <p className="text-[11px] text-slate-400 font-medium">
              Solo números · Exactamente 11 dígitos (sin guiones ni puntos)
            </p>
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium leading-none">
              Teléfono Celular
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              maxLength={15}
              placeholder="Ej: 2954631456"
              className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:bg-slate-100 hover:border-slate-300"
            />
            <p className="text-[11px] text-slate-400 font-medium">
              Máximo 15 dígitos
            </p>
          </div>
          <button
            type="submit"
            className="w-full mt-2 inline-flex items-center justify-center rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-white hover:opacity-90 hover:scale-[1.02] h-12 px-8 shadow-lg shadow-primary/20"
          >
            Guardar y Continuar
          </button>
        </form>
      </div>
    </div>
  );
}
