import { createClient } from "@supabase/supabase-js";

// Ensure environment variables are loaded (automatically configured by Next.js on runtime)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables! Check your .env.local file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
  global: {
    fetch: (...args) => fetch(args[0], { ...args[1], cache: "no-store" }),
  },
});
