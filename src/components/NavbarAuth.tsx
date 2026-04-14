"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, UserCircle, Loader2, ShieldCheck } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { signOut } from "@/app/auth/actions";
import { User } from "@supabase/supabase-js";

export function NavbarAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  /** Load user + admin flag from profiles */
  const loadUserAndProfile = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setUser(currentUser);

    if (currentUser) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", currentUser.id)
        .single();
      setIsAdmin(profile?.is_admin === true);
    } else {
      setIsAdmin(false);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadUserAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", currentUser.id)
            .single();
          setIsAdmin(profile?.is_admin === true);
        } else {
          setIsAdmin(false);
        }

        setLoading(false);
      }
    );

    return () => { subscription.unsubscribe(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="w-32 h-10 animate-pulse bg-slate-100 rounded-full" />;

  if (user) {
    const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Profesional";
    const firstName = fullName.split(" ")[0];

    return (
      <div className="flex items-center gap-4 border-l pl-4 ml-2">
        <div className="flex flex-col items-end mr-2">
          <span className="text-sm font-serif italic text-[--seasonal-primary] hidden md:inline whitespace-nowrap">
            Hola, {fullName}
          </span>
          <span className="text-sm font-serif italic text-[--seasonal-primary] md:hidden whitespace-nowrap">
            {firstName}
          </span>
        </div>

        <Link href="/alquiler" className="transition-colors font-semibold text-slate-800 hover:text-[--seasonal-primary] hidden lg:block">
          Alquilar
        </Link>
        <Link href="/dashboard" className="transition-colors hover:text-[--seasonal-primary] hidden sm:block">
          Reservas
        </Link>

        {/* Admin link — only visible when is_admin === true */}
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-full bg-stone-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] transition-all hover:bg-stone-700 hover:scale-105 active:scale-95 shadow-sm"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Panel Admin</span>
            <span className="sm:hidden font-bold">ADMIN</span>
          </Link>
        )}

        <form action={signOut}>
          <Button variant="ghost" size="sm" type="submit" className="text-slate-600 hover:text-red-600 transition-colors">
            <LogOut className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Salir</span>
          </Button>
        </form>
      </div>
    );
  }

  return (
    <Link href="/?login=true&next=/alquiler" onClick={() => setIsLoginLoading(true)}>
      <Button disabled={isLoginLoading} className="bg-primary text-white rounded-full px-6 min-w-[160px]">
        {isLoginLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <UserCircle className="mr-2 h-4 w-4" />
        )}
        {isLoginLoading ? "Cargando..." : "Login Profesional"}
      </Button>
    </Link>
  );
}
