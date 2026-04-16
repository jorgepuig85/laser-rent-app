"use server";
import { createClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

// ─── Types ─────────────────────────────────────────────────────────────────
export type ActionResult =
  | { success: true }
  | { success: false; error: string };

// ─── Input Validators ──────────────────────────────────────────────────────
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateDate(value: string): Date | null {
  if (!ISO_DATE_RE.test(value)) return null;
  const d = new Date(value);
  if (isNaN(d.getTime())) return null;
  return d;
}

function validateUUID(value: string): boolean {
  return UUID_RE.test(value);
}

// ─── Server-side reCAPTCHA verification ────────────────────────────────────
async function verifyCaptcha(token: string): Promise<string | null> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.warn("[Security] RECAPTCHA_SECRET_KEY not set. Skipping captcha verification.");
    return null; // null = "skip, no error"
  }
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${secretKey}&response=${token}`,
    });
    const data = await res.json();
    if (!data.success || data.score < 0.5) {
      return "Verificación de seguridad fallida. Intentá nuevamente.";
    }
    return null;
  } catch (e) {
    console.error("[verifyCaptcha] fetch error:", e);
    return "Error al verificar el captcha. Intentá nuevamente.";
  }
}

// ─── createRental ──────────────────────────────────────────────────────────
export async function createRental(
  startDate: string,
  endDate: string,
  professionalId: string,
  professionalName: string,
  cost: number | null,
  captchaToken: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // 1. Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "No autorizado. Por favor iniciá sesión." };
    }

    // 2. Input validation — reCAPTCHA
    if (!captchaToken || typeof captchaToken !== "string") {
      return { success: false, error: "Token de seguridad inválido." };
    }

    // 3. Validate dates
    if (!ISO_DATE_RE.test(startDate) || !ISO_DATE_RE.test(endDate)) {
      return { success: false, error: "Formato de fecha inválido. Se esperaba YYYY-MM-DD." };
    }
    const start = validateDate(startDate);
    const end = validateDate(endDate);
    if (!start) return { success: false, error: "Fecha de inicio inválida." };
    if (!end) return { success: false, error: "Fecha de fin inválida." };

    // Allow same-day (from === to) — normalized: end must be >= start
    if (end < start) {
      return { success: false, error: "La fecha de fin debe ser igual o posterior a la de inicio." };
    }

    // 4. Validate professionalId
    if (!validateUUID(professionalId)) {
      return { success: false, error: "ID de profesional inválido." };
    }

    // 5. Validate professionalName
    if (typeof professionalName !== "string" || professionalName.trim().length === 0) {
      return { success: false, error: "Nombre del profesional inválido." };
    }

    // 6. Validate cost
    if (cost !== null && (typeof cost !== "number" || cost < 0 || cost > 10_000_000)) {
      return { success: false, error: "Monto inválido." };
    }

    // 7. Max 60 days forward
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    if (start > maxDate) {
      return { success: false, error: "No se puede reservar a más de 60 días de anticipación." };
    }

    // 8. Verify reCAPTCHA server-side
    const captchaError = await verifyCaptcha(captchaToken);
    if (captchaError) return { success: false, error: captchaError };

    // 9. Rate-limit: máx 5 reservas activas
    const today = new Date().toISOString().split("T")[0];
    const { count, error: countError } = await supabase
      .from("rentals")
      .select("*", { count: "exact", head: true })
      .eq("external_professional_id", professionalId)
      .gte("start_date", today);

    if (countError) {
      console.error("[createRental] countError:", countError);
      return { success: false, error: "Error al validar el límite de reservas." };
    }
    if (count !== null && count >= 5) {
      return { success: false, error: "Límite de reservas alcanzado. Máximo 5 reservas pendientes." };
    }

    // 10. Insert (RLS enforces ownership at DB level)
    const title = `Reserva Web: ADSS FG2000B - ${professionalName.trim().substring(0, 100)}`;
    const depositAmount = cost !== null ? Math.round(cost * 0.2 * 100) / 100 : null;
    const { error: insertError } = await supabase.from("rentals").insert({
      external_professional_id: professionalId,
      start_date: startDate,
      end_date: endDate,
      title,
      is_maintenance: false,
      cost,
      status: "pendiente",
      deposit_amount: depositAmount,
    });

    if (insertError) {
      console.error("[createRental] insertError:", {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
      });
      // RLS violation gives code "42501"
      if (insertError.code === "42501") {
        return {
          success: false,
          error: "Sin permiso para crear reservas. Verificá que tu perfil esté completo (CUIT cargado).",
        };
      }
      return { success: false, error: `Error de base de datos: ${insertError.message}` };
    }

    revalidatePath("/alquiler");
    revalidatePath("/dashboard");
    return { success: true };

  } catch (unexpectedError) {
    // Safety net — never throw from a Server Action in production
    console.error("[createRental] unexpected error:", unexpectedError);
    return {
      success: false,
      error: "Ocurrió un error inesperado. Por favor intentá nuevamente.",
    };
  }
}

// ─── uploadReceipt ─────────────────────────────────────────────────────────
export async function uploadReceipt(
  rentalId: string,
  receiptUrl: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "No autorizado." };

    if (!validateUUID(rentalId)) return { success: false, error: "ID de reserva inválido." };
    if (typeof receiptUrl !== "string" || receiptUrl.trim() === "") {
      return { success: false, error: "Path de comprobante inválido." };
    }

    // RLS ensures only the owner can update their own pending rental
    const { error } = await supabase
      .from("rentals")
      .update({ receipt_url: receiptUrl })
      .eq("id", rentalId)
      .eq("status", "pendiente");

    if (error) {
      console.error("[uploadReceipt] error:", error);
      if (error.code === "42501") return { success: false, error: "Sin permiso para actualizar esta reserva." };
      return { success: false, error: `Error al guardar comprobante: ${error.message}` };
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    console.error("[uploadReceipt] unexpected:", e);
    return { success: false, error: "Error inesperado al subir comprobante." };
  }
}

// ─── confirmPayment ────────────────────────────────────────────────────────
// Admin-only: change rental status from 'pendiente' → 'reservado'
export async function confirmPayment(rentalId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { success: false, error: "No autorizado." };

    if (!validateUUID(rentalId)) return { success: false, error: "ID de reserva inválido." };

    // Server-side admin check (defence-in-depth on top of RLS)
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return { success: false, error: "Acceso denegado. Solo el administrador puede confirmar pagos." };
    }

    const { error } = await supabase
      .from("rentals")
      .update({ status: "reservado" })
      .eq("id", rentalId)
      .eq("status", "pendiente");

    if (error) {
      console.error("[confirmPayment] error:", error);
      return { success: false, error: `Error al confirmar pago: ${error.message}` };
    }

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e) {
    console.error("[confirmPayment] unexpected:", e);
    return { success: false, error: "Error inesperado al confirmar el pago." };
  }
}


// ─── cancelRental ──────────────────────────────────────────────────────────
export async function cancelRental(rentalId: string): Promise<ActionResult> {
  try {
    const supabase = await createClient();

    // 1. Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: "No autorizado. Por favor iniciá sesión." };
    }

    // 2. Input validation
    if (!validateUUID(rentalId)) {
      return { success: false, error: "ID de reserva inválido." };
    }

    // 3. Verify ownership before deleting (defence-in-depth on top of RLS)
    const { data: rental, error: fetchError } = await supabase
      .from("rentals")
      .select("id, external_professional_id, external_professionals!inner(auth_id)")
      .eq("id", rentalId)
      .single();

    if (fetchError || !rental) {
      return { success: false, error: "Reserva no encontrada o sin acceso." };
    }

    // 4. Delete (RLS "Pros can delete own rentals" policy provides DB-level protection)
    const { error: deleteError } = await supabase.from("rentals").delete().eq("id", rentalId);

    if (deleteError) {
      console.error("[cancelRental] deleteError:", deleteError);
      if (deleteError.code === "42501") {
        return { success: false, error: "Sin permiso para cancelar esta reserva." };
      }
      return { success: false, error: `Error al cancelar: ${deleteError.message}` };
    }

    revalidatePath("/dashboard");
    revalidatePath("/alquiler");
    return { success: true };

  } catch (unexpectedError) {
    console.error("[cancelRental] unexpected error:", unexpectedError);
    return {
      success: false,
      error: "Ocurrió un error inesperado al cancelar la reserva.",
    };
  }
}
