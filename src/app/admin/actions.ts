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

    // Checking for collisions in rentals
    const { data: rentalsOverlap } = await supabase
      .from("rentals")
      .select("id")
      .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);

    // Checking for collisions in maintenance_blocks
    const { data: maintenanceOverlap } = await supabase
      .from("maintenance_blocks")
      .select("id")
      .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);

    if ((rentalsOverlap && rentalsOverlap.length > 0) || (maintenanceOverlap && maintenanceOverlap.length > 0)) {
      return { success: false, error: "Esta fecha ya se encuentra bloqueada o reservada." };
    }

    const { error } = await supabase.from("maintenance_blocks").insert({
      start_date: startDate,
      end_date: endDate,
      reason: "MANTENIMIENTO",
    });

    if (error) {
      console.error("[createMaintenanceBlock] error:", error);
      return { success: false, error: `Error al crear bloqueo: ${error.message}` };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (e) {
    console.error("[createMaintenanceBlock] unexpected:", e);
    return { success: false, error: "Error inesperado al bloquear fechas." };
  }
}

export async function deleteMaintenanceBlock(blockId: string) {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "No autorizado." };

    const { data: isAdminResult } = await supabase.rpc("get_my_is_admin");
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
    const isAdmin = isAdminResult === true || profile?.is_admin === true;

    if (!isAdmin) {
      return { success: false, error: "Acceso denegado." };
    }

    const { error } = await supabase.from("maintenance_blocks").delete().eq("id", blockId);
    if (error) {
      return { success: false, error: `Error al eliminar bloqueo: ${error.message}` };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (e) {
    console.error("[deleteMaintenanceBlock] unexpected:", e);
    return { success: false, error: "Error inesperado al eliminar bloqueo." };
  }
}
