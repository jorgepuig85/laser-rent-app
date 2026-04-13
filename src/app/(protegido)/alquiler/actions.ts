"use server";
import { createClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function createRental(startDate: string, endDate: string, professionalId: string, professionalName: string, cost: number | null, captchaToken: string) {
  const supabase = await createClient();

  // 1. Verificar reCAPTCHA (Simulado - requiere secret key en env)
  if (!captchaToken) {
    throw new Error("reCAPTCHA inválido.");
  }
  // En producción se validaría contra: https://www.google.com/recaptcha/api/siteverify

  // 2. Limitar reservas activas (máximo 5)
  const today = new Date().toISOString().split('T')[0];
  const { count, error: countError } = await supabase
    .from('rentals')
    .select('*', { count: 'exact', head: true })
    .eq('external_professional_id', professionalId)
    .gte('start_date', today);

  if (countError) {
    console.error(countError);
    throw new Error("Error al validar límite de reservas.");
  }

  if (count !== null && count >= 5) {
    throw new Error("Límite de reservas alcanzado. Máximo 5 reservas pendientes.");
  }

  const title = `Reserva Web: ADSS FG2000B - ${professionalName}`;
  
  const { error } = await supabase
    .from('rentals')
    .insert({
      external_professional_id: professionalId,
      start_date: startDate,
      end_date: endDate,
      title: title,
      is_maintenance: false,
      cost: cost, 
    });
    
  if (error) {
    console.error(error);
    throw new Error("No se pudo confirmar la reserva.");
  }
  
  revalidatePath('/alquiler');
  revalidatePath('/dashboard');
}

export async function cancelRental(rentalId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("No autorizado");

  const { error } = await supabase
    .from('rentals')
    .delete()
    .eq('id', rentalId);
    
  if (error) {
    console.error(error);
    throw new Error("No se pudo cancelar la reserva.");
  }
  
  revalidatePath('/dashboard');
  revalidatePath('/alquiler');
}
