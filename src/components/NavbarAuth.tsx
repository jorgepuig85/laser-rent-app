"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, UserCircle, Loader2, ShieldCheck } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { signOut } from "@/app/auth/actions";
import { User } from "@supabase/supabase-js";

export function NavbarAuth({
  isMobileView,
  isMobileMenu,
  onCloseMenu,
}: {
  isMobileView?: boolean;
  isMobileMenu?: boolean;
  onCloseMenu?: () => void;
} = {}) {
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

    if (isMobileView) {
      return (
        <span className="text-sm font-serif italic text-[--seasonal-primary] whitespace-nowrap mr-2">
          {firstName}
        </span>
      );
    }

    if (isMobileMenu) {
      return (
        <div className="flex flex-col gap-4">
          <Link href="/alquiler" onClick={onCloseMenu} className="text-stone-800 font-medium py-2 border-b border-stone-100">
            Alquilar
          </Link>
          <Link href="/dashboard" onClick={onCloseMenu} className="text-stone-800 font-medium py-2 border-b border-stone-100">
            Mis Reservas
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              onClick={onCloseMenu}
              className="flex items-center gap-2 text-[#D4AF37] font-bold py-2 border-b border-stone-100"
            >
              <ShieldCheck className="h-4 w-4" />
              Panel Admin
            </Link>
          )}
          <form action={signOut} className="mt-2">
            <Button variant="ghost" size="sm" type="submit" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </form>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-4 border-l pl-4 ml-2">
        <div className="flex flex-col items-end mr-2">
          <span className="text-sm font-serif italic text-[--seasonal-primary] whitespace-nowrap">
            Hola, {fullName}
          </span>
        </div>

        <Link href="/alquiler" className="transition-colors font-semibold text-slate-800 hover:text-[--seasonal-primary]">
          Alquilar
        </Link>
        <Link href="/dashboard" className="transition-colors hover:text-[--seasonal-primary]">
          Reservas
        </Link>

        {/* Admin link — only visible when is_admin === true */}
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-full bg-stone-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] transition-all hover:bg-stone-700 hover:scale-105 active:scale-95 shadow-sm"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="inline">Panel Admin</span>
          </Link>
        )}

        <form action={signOut}>
          <Button variant="ghost" size="sm" type="submit" className="text-slate-600 hover:text-red-600 transition-colors">
            <LogOut className="h-4 w-4 mr-2" />
            <span className="inline">Salir</span>
          </Button>
        </form>
      </div>
    );
  }

  // Not logged in
  if (isMobileView || isMobileMenu) {
    return (
      <Link href="/?login=true&next=/alquiler" onClick={() => { setIsLoginLoading(true); onCloseMenu && onCloseMenu(); }}>
        <Button disabled={isLoginLoading} className="w-full bg-primary text-white rounded-full">
          {isLoginLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCircle className="mr-2 h-4 w-4" />}
          Login
        </Button>
      </Link>
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
