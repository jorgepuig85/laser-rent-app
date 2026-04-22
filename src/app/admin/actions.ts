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

    // Checking for collisions strictly in rentals (both maintenance and normal rentals)
    const { data: rentalsOverlap } = await supabase
      .from("rentals")
      .select("id")
      .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);

    if (rentalsOverlap && rentalsOverlap.length > 0) {
      return { success: false, error: "Esta fecha ya se encuentra bloqueada o reservada." };
    }

    const { error } = await supabase.from("rentals").insert({
      title: "MANTENIMIENTO / BLOQUEADO",
      start_date: startDate,
      end_date: endDate,
      is_maintenance: true,
      status: "reservado",
      cost: 0,
      deposit_amount: 0,
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

export async function deleteReservation(reservationId: string) {
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

    const { error } = await supabase
      .from("rentals")
      .delete()
      .eq("id", reservationId);

    if (error) {
      console.error("[deleteReservation] error:", error);
      return { success: false, error: `Error al eliminar reserva: ${error.message}` };
    }

    revalidatePath("/admin", "page");
    revalidatePath("/dashboard", "page");
    return { success: true };
  } catch (e) {
    console.error("[deleteReservation] unexpected:", e);
    return { success: false, error: "Error inesperado al eliminar reserva." };
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

    const { error } = await supabase
      .from("rentals")
      .delete()
      .eq("id", blockId)
      .eq("is_maintenance", true);

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

export async function updateRentalPrices(dailyRate: number, weeklyRate: number) {
  try {
    const supabase = await createClient();

    // Verify Admin Access
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "No autorizado." };

    const { data: isAdminResult } = await supabase.rpc("get_my_is_admin");
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
    const isAdmin = isAdminResult === true || profile?.is_admin === true;

    if (!isAdmin) {
      return { success: false, error: "Acceso denegado." };
    }

    const { error } = await supabase
      .from("rental_prices")
      .update({ daily_rate: dailyRate, weekly_rate: weeklyRate })
      .eq("equipment_name", "ADSS FG2000B");

    if (error) {
      console.error("[updateRentalPrices] error:", error);
      return { success: false, error: `Error al actualizar precios: ${error.message}` };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (e) {
    console.error("[updateRentalPrices] unexpected:", e);
    return { success: false, error: "Error inesperado al actualizar precios." };
  }
}
