"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2, ShieldCheck } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { signOut } from "@/app/auth/actions";
import { User } from "@supabase/supabase-js";

const getWhatsAppUrl = () => {
  const date = new Date();
  const day = date.getDate();
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const currentMonth = months[date.getMonth()];
  const nextMonth = months[(date.getMonth() + 1) % 12];
  const targetMonth = day <= 20 ? currentMonth : nextMonth;
  const msg = `¡Hola! Quiero consultar disponibilidad para alquilar un equipo en ${targetMonth}. ¿Tienen fechas libres?`;
  return `https://wa.me/5492954631456?text=${encodeURIComponent(msg)}`;
};

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
  const [isMounted, setIsMounted] = useState(false);

  // Singleton Supabase Browser Client
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: false,
      }
    }
  ));

  /** Load user + admin flag from profiles */
  const loadUserAndProfile = async () => {
    try {
      // 2.5s Timeout for the initial load to prevent infinite "Validando..."
      const { data: { user: currentUser } } = await Promise.race([
        supabase.auth.getUser(),
        new Promise<{data: {user: null}}>(resolve => setTimeout(() => resolve({data: {user: null}}), 2500))
      ]);
      
      setUser(currentUser);

      if (currentUser) {
        const { data: profile } = await Promise.race([
          supabase.from("profiles").select("is_admin").eq("id", currentUser.id).maybeSingle(),
          new Promise<{data: null}>(resolve => setTimeout(() => resolve({data: null}), 2000))
        ]).catch(() => ({ data: null }));

        setIsAdmin(profile?.is_admin === true);
      } else {
        setIsAdmin(false);
      }
    } catch (e) {
      console.error("NavbarAuth load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    loadUserAndProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN" || event === "USER_UPDATED") {
          const currentUser = session?.user ?? null;
          setUser(currentUser);

          if (currentUser) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("is_admin")
              .eq("id", currentUser.id)
              .maybeSingle();
            setIsAdmin(profile?.is_admin === true);
          } else {
            setIsAdmin(false);
          }
        }
        
        if (event === "SIGNED_OUT") {
          setUser(null);
          setIsAdmin(false);
        }

        setLoading(false);
      }
    );

    return () => { subscription.unsubscribe(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  // Fallback while loading or during hydration (so the UI doesn't look broken or missing)
  const isPending = !isMounted || loading;

  if (isPending) {
    if (isMobileView) return null; // Avoid empty flashes in tiny views
    if (isMobileMenu) {
      return (
        <div className="flex flex-col gap-4 opacity-50">
          <Button disabled className="w-full bg-primary/50 text-white rounded-full">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Cargando sesión...
          </Button>
        </div>
      );
    }
    return (
      <Button disabled className="opacity-70 bg-primary/80 text-white rounded-full px-6 min-w-[160px]">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Validando...
      </Button>
    );
  }

  if (user) {
    const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Profesional";
    const firstName = fullName.split(" ")[0];

    if (isMobileView) {
      return (
        <Link 
          href="/dashboard"
          className="text-sm font-serif italic text-[--seasonal-primary] whitespace-nowrap mr-2 hover:underline decoration-[--seasonal-primary]/30 underline-offset-4 transition-all"
        >
          {firstName}
        </Link>
      );
    }

    if (isMobileMenu) {
      return (
        <div className="flex flex-col gap-4">
          {!isAdmin && (
            <Link href="/dashboard" onClick={onCloseMenu} className="text-stone-800 font-medium py-2 border-b border-stone-100">
              Mi Dashboard
            </Link>
          )}
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
          <Link 
            href="/dashboard"
            className="text-sm font-serif italic text-[--seasonal-primary] whitespace-nowrap hover:underline decoration-[--seasonal-primary]/30 underline-offset-4 transition-all hover:text-stone-900 cursor-pointer"
          >
            Hola, {fullName}
          </Link>
        </div>

          <>
          </>

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
      <div className="flex flex-col gap-3 w-full">
        <Button 
          className="w-full bg-cyan-500 text-white rounded-full hover:bg-cyan-600 font-bold"
          onClick={() => {
            window.open(getWhatsAppUrl(), '_blank');
            if (onCloseMenu) onCloseMenu();
          }}
        >
          Reservar Equipo Ahora
        </Button>
        <Link 
          href="https://laser-rent-app.vercel.app/login?next=/dashboard" 
          onClick={() => { if (onCloseMenu) onCloseMenu(); }}
          className="text-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors py-2"
        >
          Panel Clientes
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link 
        href="https://laser-rent-app.vercel.app/login?next=/dashboard"
        className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors hidden sm:block"
      >
        Panel Clientes
      </Link>
      <Link href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
        <Button className="bg-cyan-500 text-white rounded-full px-6 hover:bg-cyan-600 font-bold transition-all hover:scale-105 shadow-md">
          Reservar Equipo Ahora
        </Button>
      </Link>
    </div>
  );
}
