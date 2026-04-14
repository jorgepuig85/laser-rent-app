"use server";
import { createClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

// ─── Input Validators ──────────────────────────────────────────────────────
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function validateDate(value: string, field: string): Date {
  if (!ISO_DATE_RE.test(value)) throw new Error(`${field}: formato de fecha inválido.`);
  const d = new Date(value);
  if (isNaN(d.getTime())) throw new Error(`${field}: fecha inválida.`);
  return d;
}

function validateUUID(value: string, field: string): string {
  if (!UUID_RE.test(value)) throw new Error(`${field}: ID inválido.`);
  return value;
}

// ─── Server-side reCAPTCHA verification ────────────────────────────────────
async function verifyCaptcha(token: string): Promise<void> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Server-only (no NEXT_PUBLIC_)
  if (!secretKey) {
    // Skip in dev if secret not configured
    console.warn("[Security] RECAPTCHA_SECRET_KEY not set. Skipping captcha verification.");
    return;
  }
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secretKey}&response=${token}`,
  });
  const data = await res.json();
  if (!data.success || data.score < 0.5) {
    throw new Error("Verificación de seguridad fallida. Intentá nuevamente.");
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
) {
  const supabase = await createClient();

  // 1. Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado.");

  // 2. Input validation
  if (!captchaToken || typeof captchaToken !== "string") throw new Error("reCAPTCHA inválido.");
  const start = validateDate(startDate, "start_date");
  const end = validateDate(endDate, "end_date");
  const profId = validateUUID(professionalId, "professionalId");
  if (end <= start) throw new Error("La fecha de fin debe ser posterior a la de inicio.");
  if (typeof professionalName !== "string" || professionalName.trim().length === 0) {
    throw new Error("Nombre del profesional inválido.");
  }
  if (cost !== null && (typeof cost !== "number" || cost < 0 || cost > 10_000_000)) {
    throw new Error("Monto inválido.");
  }
  // Max 60 days forward
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 60);
  if (start > maxDate) throw new Error("No se puede reservar a más de 60 días.");

  // 3. Verify reCAPTCHA server-side
  await verifyCaptcha(captchaToken);

  // 4. Rate-limit: máx 5 reservas activas
  const today = new Date().toISOString().split("T")[0];
  const { count, error: countError } = await supabase
    .from("rentals")
    .select("*", { count: "exact", head: true })
    .eq("external_professional_id", profId)
    .gte("start_date", today);

  if (countError) throw new Error("Error al validar límite de reservas.");
  if (count !== null && count >= 5) {
    throw new Error("Límite de reservas alcanzado. Máximo 5 reservas pendientes.");
  }

  // 5. Insert (RLS enforces ownership at DB level)
  const title = `Reserva Web: ADSS FG2000B - ${professionalName.trim().substring(0, 100)}`;
  const { error } = await supabase.from("rentals").insert({
    external_professional_id: profId,
    start_date: startDate,
    end_date: endDate,
    title,
    is_maintenance: false,
    cost,
  });

  if (error) {
    console.error("[createRental]", error);
    throw new Error("No se pudo confirmar la reserva.");
  }

  revalidatePath("/alquiler");
  revalidatePath("/dashboard");
}

// ─── cancelRental ──────────────────────────────────────────────────────────
export async function cancelRental(rentalId: string) {
  const supabase = await createClient();

  // 1. Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado.");

  // 2. Input validation
  const id = validateUUID(rentalId, "rentalId");

  // 3. Verify ownership before deleting (defence-in-depth on top of RLS)
  const { data: rental, error: fetchError } = await supabase
    .from("rentals")
    .select("id, external_professional_id, external_professionals!inner(auth_id)")
    .eq("id", id)
    .single();

  if (fetchError || !rental) throw new Error("Reserva no encontrada.");

  // 4. Delete (RLS "Pros can delete own rentals" policy provides DB-level protection)
  const { error } = await supabase.from("rentals").delete().eq("id", id);

  if (error) {
    console.error("[cancelRental]", error);
    throw new Error("No se pudo cancelar la reserva.");
  }

  revalidatePath("/dashboard");
  revalidatePath("/alquiler");
}
