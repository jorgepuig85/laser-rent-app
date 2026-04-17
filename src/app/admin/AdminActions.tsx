"use client";

import { useState, useTransition } from "react";
import { confirmPayment } from "@/app/(protegido)/dashboard/actions";
import { CheckCircle2, Loader2, ExternalLink } from "lucide-react";

interface Rental {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  cost: number | null;
  deposit_amount: number | null;
  receipt_url: string | null;
  status: string;
  external_professionals: { name: string; phone: string | null; email: string | null } | null;
}

export function AdminActions({ rentals }: { rentals: Rental[] }) {
  const [confirming, setConfirming] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [, startTransition] = useTransition();

  const handleConfirm = (rentalId: string) => {
    setConfirming(rentalId);
    setErrors((prev) => { const n = { ...prev }; delete n[rentalId]; return n; });

    startTransition(async () => {
      const result = await confirmPayment(rentalId);
      if (result.success) {
        setConfirmed((prev) => new Set(prev).add(rentalId));
      } else {
        setErrors((prev) => ({ ...prev, [rentalId]: result.error }));
      }
      setConfirming(null);
    });
  };

  if (rentals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 bg-white/40 rounded-[2.5rem] border-2 border-dashed border-[#EAE3D5] text-center">
        <div className="rounded-3xl bg-white p-6 shadow-xl shadow-stone-200/50">
          <CheckCircle2 className="h-10 w-10 text-[#B89B72]/40" />
        </div>
        <div>
          <p className="font-serif text-2xl font-bold text-stone-800">Todo al día</p>
          <p className="text-sm font-medium text-stone-400 mt-2">
            No hay reservas pendientes de confirmación con comprobante cargado.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-[#FCFAF5]/50 text-stone-400 font-bold border-b border-[#F3EBE1] uppercase tracking-[0.18em] text-[9px]">
          <tr>
            <th className="px-8 py-5">Profesional</th>
            <th className="px-8 py-5">Período</th>
            <th className="px-8 py-5">Monto Total</th>
            <th className="px-8 py-5">Seña (20%)</th>
            <th className="px-8 py-5">Comprobante</th>
            <th className="px-8 py-5 text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F3EBE1]/50">
          {rentals.map((r) => {
            const isConfirmed = confirmed.has(r.id);
            const isLoading = confirming === r.id;
            const errMsg = errors[r.id];

            return (
              <tr key={r.id} className={`transition-all duration-300 ${isConfirmed ? "bg-emerald-50/40" : "hover:bg-white/80"}`}>
                <td className="px-8 py-5">
                  <p className="font-serif font-bold text-stone-900 text-base">
                    {r.external_professionals?.name ?? "—"}
                  </p>
                  <p className="text-[10px] text-stone-400 font-medium mt-0.5">
                    {r.external_professionals?.phone ?? r.external_professionals?.email ?? ""}
                  </p>
                </td>
                <td className="px-8 py-5 text-stone-700 font-medium whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="font-bold text-stone-900">{r.start_date}</span>
                    <span className="text-[11px] text-stone-400">al {r.end_date}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <p className="font-serif font-bold text-stone-900 text-lg">
                    {r.cost != null
                      ? `$${r.cost.toLocaleString("es-AR")}`
                      : "—"}
                  </p>
                </td>
                <td className="px-8 py-5">
                  <p className="font-serif font-bold text-[#B89B72] text-lg">
                    {r.deposit_amount != null
                      ? `$${r.deposit_amount.toLocaleString("es-AR")}`
                      : "—"}
                  </p>
                </td>
                <td className="px-8 py-5">
                  {r.receipt_url ? (
                    <a
                      href={r.receipt_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#B89B72] hover:text-stone-900 transition-colors underline underline-offset-2"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Ver comprobante
                    </a>
                  ) : (
                    <span className="text-[10px] text-stone-300">Sin comprobante</span>
                  )}
                </td>
                <td className="px-8 py-5 text-right">
                  {isConfirmed ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="h-3 w-3" />
                      Confirmado
                    </span>
                  ) : (
                    <div className="flex flex-col items-end gap-1.5">
                      <button
                        onClick={() => handleConfirm(r.id)}
                        disabled={!!isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-400 text-white text-[9px] font-bold uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-95 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        )}
                        {isLoading ? "Confirmando..." : "Confirmar Pago"}
                      </button>
                      {errMsg && (
                        <p className="text-[9px] text-red-500 font-medium">{errMsg}</p>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
