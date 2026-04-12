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

    let cuit = formData.get("cuit") as string;
    const phone = formData.get("phone") as string;

    // Higienizar cuit: dejar solo numeros
    cuit = cuit.replace(/\D/g, "");

    if (cuit.length !== 11) {
      throw new Error("El CUIT debe tener exactamente 11 números válidos.");
    }

    const { error } = await supabaseServer
      .from("external_professionals")
      .update({ cuit, phone })
      .eq("auth_id", sessionUser.id);

    if (!error) {
      revalidatePath("/", "layout");
      redirect("/alquiler");
    } else {
      console.error(error);
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
              type="text"
              required
              placeholder="Ej: 20-12345678-9"
              className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:bg-slate-100 hover:border-slate-300"
            />
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
              placeholder="Ej: 11 5000 0000"
              className="flex h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors hover:bg-slate-100 hover:border-slate-300"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-2 inline-flex items-center justify-center rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] h-12 px-8 shadow-lg shadow-blue-600/20"
          >
            Guardar y Continuar
          </button>
        </form>
      </div>
    </div>
  );
}
