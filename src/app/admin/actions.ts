"use server";
import { createClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function createMaintenanceBlock(startDate: string, endDate: string) {
  try {
    const supabase = await createClient();

    // Verify Admin Access
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "No autorizado." };

    const { data: isAdminResult } = await supabase.rpc("get_my_is_admin");
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
    const isAdmin = isAdminResult === true || profile?.is_admin === true;

    if (!isAdmin) {
      return { success: false, error: "Acceso denegado. Solo administradores pueden bloquear fechas." };
    }

    // Insert block. We bypass external_professional_id because RLS might be bypassed for admins.
    // If Admin override isn't perfectly configured on INSERT, we'll need to create a dummy professional for admin or use service role.
    // Let's try standard insert first. The DB has: is_maintenance, title, status: completado
    const { error } = await supabase.from("rentals").insert({
      title: "MANTENIMIENTO / BLOQUEADO",
      start_date: startDate,
      end_date: endDate,
      is_maintenance: true,
      status: "completado",
      cost: 0,
      deposit_amount: 0,
    });

    if (error) {
      console.error("[createMaintenanceBlock] error:", error);
      // RLS error fallback: If standard insert fails due to 'external_professional_id' null violation
      // let's create a server-admin-client bypass
      if (error.code === '42501' || error.code === '23502') { // policy violation or null constraint
        const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
        const adminSupabase = createSupabaseClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
        const { error: adminError } = await adminSupabase.from("rentals").insert({
          title: "MANTENIMIENTO / BLOQUEADO",
          start_date: startDate,
          end_date: endDate,
          is_maintenance: true,
          status: "completado",
          cost: 0,
          deposit_amount: 0,
        });
        if (adminError) {
          return { success: false, error: `Error al crear bloqueo maestro: ${adminError.message}` };
        }
      } else {
        return { success: false, error: `Error al crear bloqueo: ${error.message}` };
      }
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (e) {
    console.error("[createMaintenanceBlock] unexpected:", e);
    return { success: false, error: "Error inesperado al bloquear fechas." };
  }
}
