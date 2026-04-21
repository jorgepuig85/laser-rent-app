"use server";

import { createClient } from "@/lib/supabaseServer";
import { revalidatePath } from "next/cache";

export type ProfileState = {
  success: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function saveProfile(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  try {
    const supabaseServer = await createClient();
    const {
      data: { user: sessionUser },
    } = await supabaseServer.auth.getUser();

    if (!sessionUser) {
      return { success: false, message: "No autorizado. Inicia sesión nuevamente." };
    }

    let cuit = (formData.get("cuit") as string) ?? "";
    let phone = (formData.get("phone") as string) ?? "";

    // 1. Validación de Celular (Solo números)
    phone = phone.trim();
    if (!phone || !/^\d+$/.test(phone)) {
      return { success: false, message: "Por favor, ingresa un número de teléfono válido (solo números)." };
    }
    if (phone.length > 15) {
      return { success: false, message: "El teléfono no puede superar los 15 dígitos." };
    }

    // 2. Validación de CUIT (Exactamente 11 números)
    cuit = cuit.trim();
    if (!/^\d{11}$/.test(cuit)) {
      return { success: false, message: "El CUIT debe contener exactamente 11 números." };
    }

    // ── Verificar unicidad del CUIT (evitar duplicados) ──────────────
    const { data: existing } = await supabaseServer
      .from("external_professionals")
      .select("id")
      .eq("cuit", cuit)
      .neq("auth_id", sessionUser.id)
      .maybeSingle();

    if (existing) {
      return { 
        success: false, 
        message: "El CUIT ingresado ya pertenece a un profesional registrado." 
      };
    }

    // 2. Intento de Update con Try/Catch Robusto
    const { error: proError } = await supabaseServer
      .from("external_professionals")
      .update({ cuit, phone })
      .eq("auth_id", sessionUser.id);

    if (proError) {
      // Código 23505 = Unique Violation en PostgreSQL
      if (proError.code === "23505") {
        return { 
          success: false, 
          message: "El CUIT ingresado ya pertenece a un profesional registrado." 
        };
      }
      
      console.error("[saveProfile] database error:", proError);
      return { success: false, message: "Hubo un error al guardar tu perfil profesional." };
    }

    // Éxito
    revalidatePath("/", "layout");
    return { success: true };

  } catch (error) {
    console.error("[saveProfile] unexpected crash:", error);
    return { 
      success: false, 
      message: "Ocurrió un error inesperado. Por favor intenta de nuevo." 
    };
  }
}
