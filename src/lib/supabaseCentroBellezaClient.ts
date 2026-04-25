import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_CENTRO_BELLEZA_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_CENTRO_BELLEZA_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables for Centro Belleza!");
}

export const supabaseCentroBelleza = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
  global: {
    fetch: (...args) => fetch(args[0], { ...args[1], cache: "no-store" }),
  },
});
