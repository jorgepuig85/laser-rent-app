"use client";

import { useState } from "react";
import { Loader2, UserCog, X, CheckCircle2, AlertCircle } from "lucide-react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { updateProfessionalData } from "./actions";

interface Props {
  currentCuit: string | null;
  currentPhone: string | null;
}

export function MisDatosButton({ currentCuit, currentPhone }: Props) {
  const [open, setOpen] = useState(false);
  const [cuit, setCuit] = useState(currentCuit ?? "");
  const [phone, setPhone] = useState(currentPhone ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setError(null);
    const cleanCuit = cuit.replace(/\D/g, "");

    if (cleanCuit.length !== 11) {
      setError("El CUIT debe tener exactamente 11 dígitos.");
      return;
    }
    if (!phone.trim() || phone.trim().length > 15) {
      setError("El teléfono debe tener entre 1 y 15 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const result = await updateProfessionalData(cleanCuit, phone.trim());
      if (!result.success) {
        setError(result.error ?? "Error desconocido.");
      } else {
        setSuccess(true);
        router.refresh();
        setTimeout(() => {
          setOpen(false);
          setSuccess(false);
        }, 1500);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#EAE3D5] bg-white text-[#B89B72] text-xs font-bold uppercase tracking-widest hover:border-[#D4AF37]/60 hover:bg-[#FCFAF5] transition-all hover:scale-[1.02] active:scale-95 shadow-sm"
      >
        <UserCog className="h-3.5 w-3.5" />
        Mis Datos
      </button>
    );
  }

  const modal = (
    <div
      className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 9999 }}
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-[fadeInScale_0.2s_ease-out_both]">
        {/* Header */}
        <div className="bg-stone-900 px-7 py-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-stone-500 font-bold mb-0.5">Perfil Profesional</p>
            <h2 className="font-serif text-xl font-bold text-white">Editar Mis Datos</h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Cerrar"
            className="rounded-full bg-white/10 border border-white/20 p-2 text-white/60 hover:text-white hover:bg-white/20 transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-7 py-6 space-y-5">
          {/* CUIT */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-500">
              CUIT / CUIL
            </label>
            <input
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={cuit}
              onChange={(e) => setCuit(e.target.value.slice(0, 11))}
              placeholder="20123456789"
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <p className="text-[10px] text-stone-400">Sin guiones · Exactamente 11 dígitos</p>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-500">
              Teléfono Celular
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.slice(0, 15))}
              placeholder="2954631456"
              className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 transition-all"
            />
            <p className="text-[10px] text-stone-400">Máximo 15 dígitos</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
              <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <p className="text-sm text-emerald-700 font-medium">¡Datos actualizados correctamente!</p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleSave}
            disabled={loading || success}
            className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl bg-[#D4AF37] hover:bg-[#B89B72] disabled:bg-stone-200 disabled:text-stone-400 text-stone-900 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:scale-[1.01] active:scale-95 shadow-md shadow-[#D4AF37]/20 disabled:shadow-none"
          >
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Guardando...</>
            ) : success ? (
              <><CheckCircle2 className="h-4 w-4" /> Guardado</>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined" ? createPortal(modal, document.body) : null;
}
