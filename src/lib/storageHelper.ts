import { supabase } from "./supabaseClient";

/**
 * Uploads an image file to the public storage bucket "equipos_imagenes".
 * @returns The public URL of the uploaded image or null if error.
 */
export async function uploadEquipmentImage(file: File, fileName: string): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from("equipos_imagenes")
    .upload(`public/${fileName}`, file, {
      cacheControl: "3600",
      upsert: true,
    });
  
  if (error) {
    console.error("Error uploading image:", error);
    return null;
  }
  
  return getPublicImageUrl(data.path);
}

/**
 * Retrieves the public access URL for a specific file path.
 */
export function getPublicImageUrl(path: string): string {
  const { data } = supabase.storage
    .from("equipos_imagenes")
    .getPublicUrl(path);
    
  return data.publicUrl;
}
