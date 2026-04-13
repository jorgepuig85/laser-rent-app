"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogOut, UserCircle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { signOut } from "@/app/auth/actions";
import { User } from "@supabase/supabase-js";

export function NavbarAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (loading) return <div className="w-32 h-10 animate-pulse bg-slate-100 rounded-full" />;

  if (user) {
    return (
      <div className="flex items-center gap-4 border-l pl-4 ml-2">
        <Link href="/alquiler" className="transition-colors font-semibold text-slate-800 hover:text-[--seasonal-primary]">
          Alquilar
        </Link>
        <Link href="/dashboard" className="transition-colors hover:text-[--seasonal-primary] hidden sm:block">
          Reservas
        </Link>
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
    <Link href="/auth/login">
      <Button className="bg-primary text-white rounded-full px-6">
        <UserCircle className="mr-2 h-4 w-4" />
        Login Profesional
      </Button>
    </Link>
  );
}
