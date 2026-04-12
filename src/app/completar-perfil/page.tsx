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
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tighter text-slate-900">
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-900 text-slate-50 hover:bg-slate-900/90 h-10 px-4 py-2"
          >
            Guardar y Continuar
          </button>
        </form>
      </div>
    </div>
  );
}
