"use server";
import { createClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export async function createRental(startDate: string, endDate: string, professionalId: string, professionalName: string) {
  const supabase = await createClient();
  const title = `Reserva Web: ${professionalName}`;
  
  const { error } = await supabase
    .from('rentals')
    .insert({
      external_professional_id: professionalId,
      start_date: startDate,
      end_date: endDate,
      title: title,
      is_maintenance: false,
      cost: null, 
    });
    
  if (error) {
    console.error(error);
    throw new Error("No se pudo confirmar la reserva.");
  }
  
  revalidatePath('/alquiler');
  revalidatePath('/dashboard');
}
