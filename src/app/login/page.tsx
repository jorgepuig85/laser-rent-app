"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { signIn } from "@/app/auth/actions";
import { Calendar, UserCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 reveal-up">
        <div className="text-center space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8F754F]/10 text-[#8F754F] mb-2">
            <Calendar className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-slate-900 leading-tight">
            Acceso Profesional
          </h1>
          <p className="text-slate-500 font-medium">
            Inicia sesión para gestionar tus reservas y equipos.
          </p>
        </div>

        <div className="space-y-4">
          <form action={signIn}>
            <input type="hidden" name="next" value={next} />
            <Button 
              type="submit"
              size="lg" 
              className="w-full h-16 rounded-full bg-[#8F754F] text-white font-bold text-lg shadow-xl shadow-[#8F754F]/20 hover:bg-[#8F754F]/90 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 btn-glint"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                />
              </svg>
              Continuar con Google
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 pt-4 leading-relaxed">
            Al continuar, aceptas nuestros{" "}
            <Link href="/terminos" className="underline hover:text-[#8F754F]">Términos y Condiciones</Link> y nuestra{" "}
            <Link href="/privacidad" className="underline hover:text-[#8F754F]">Política de Privacidad</Link>.
          </p>
        </div>

        <div className="pt-6 border-t border-slate-100">
          <Link 
            href="/" 
            className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-16 w-16 bg-slate-100 rounded-2xl"></div>
          <div className="h-8 w-48 bg-slate-100 rounded-full"></div>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
