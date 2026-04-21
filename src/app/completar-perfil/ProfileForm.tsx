"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { saveProfile, type ProfileState } from "./actions";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

const initialState: ProfileState = {
  success: false,
};

export function ProfileForm() {
  const [state, formAction] = useFormState(saveProfile, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.push("/dashboard");
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-3 text-center">
        <h1 className="text-4xl font-serif font-bold tracking-tight text-slate-900">
          Comienza tu perfil
        </h1>
        <p className="text-slate-500">
          Para realizar alquileres necesitamos tus datos de facturación y
          contacto.
        </p>
      </div>

      <form action={formAction} className="space-y-6">
        {/* Error Banner */}
        {state.message && !state.success && (
          <div className="flex items-center gap-3 rounded-2xl bg-red-50 border border-red-100 p-4 text-red-800 animate-in zoom-in-95 duration-200">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-sm font-medium">{state.message}</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="cuit" className="text-sm font-semibold tracking-tight text-slate-700 ml-1">
              CUIT / CUIL
            </label>
            <input
              id="cuit"
              name="cuit"
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              required
              maxLength={11}
              placeholder="Ej: 20123456789"
              className="flex h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-2 text-base ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-slate-100/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-sm"
            />
            <p className="text-[11px] text-slate-400 font-medium ml-1">
              Solo números · Exactamente 11 dígitos (sin guiones ni puntos)
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-semibold tracking-tight text-slate-700 ml-1">
              Teléfono Celular
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              maxLength={15}
              placeholder="Ej: 2954631456"
              className="flex h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-2 text-base ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all hover:bg-slate-100/50 shadow-sm"
            />
            <p className="text-[11px] text-slate-400 font-medium ml-1">
              Máximo 15 dígitos
            </p>
          </div>
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full relative overflow-hidden group inline-flex items-center justify-center rounded-2xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/20 disabled:pointer-events-none disabled:opacity-70 bg-slate-900 text-white hover:bg-slate-800 h-14 px-8 shadow-xl shadow-slate-200"
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Verificando...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span>Guardar y Continuar</span>
          <CheckCircle2 className="h-5 w-5 opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </button>
  );
}
