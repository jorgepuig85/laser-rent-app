"use client";

import { useState } from "react";
import { ExternalLink, Search, Filter } from "lucide-react";

interface RentalRow {
  id: string;
  title: string;
  start_date: string;
  end_date: string;
  cost: number | null;
  deposit_amount: number | null;
  receipt_url: string | null;
  status: string;
  created_at?: string;
  external_professionals: { name: string; phone: string | null; email: string | null } | null;
}

export function AdminHistory({ rentals }: { rentals: RentalRow[] }) {
  const [filterProf, setFilterProf] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  const filtered = rentals.filter((r) => {
    const profName = r.external_professionals?.name?.toLowerCase() || "";
    if (filterProf && !profName.includes(filterProf.toLowerCase())) return false;
    if (filterStatus !== "ALL" && r.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* ── Filtros ── */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-white/50 backdrop-blur-md rounded-2xl p-4 border border-white shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de profesional..."
            value={filterProf}
            onChange={(e) => setFilterProf(e.target.value)}
            className="w-full bg-white border border-[#EAE3D5] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] transition-colors placeholder:text-stone-300 text-stone-700 font-medium"
          />
        </div>
        <div className="relative w-full md:w-64">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full bg-white border border-[#EAE3D5] rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-[#D4AF37] transition-colors text-stone-700 font-medium appearance-none"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="reservado">Reservado / Confirmado</option>
            <option value="completado">Completado</option>
          </select>
        </div>
      </div>

      {/* ── Tabla de Historial ── */}
      <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#FCFAF5]/50 text-stone-400 font-bold border-b border-[#F3EBE1] uppercase tracking-[0.18em] text-[9px]">
              <tr>
                <th className="px-8 py-5">Profesional</th>
                <th className="px-8 py-5">Período</th>
                <th className="px-8 py-5">Estado</th>
                <th className="px-8 py-5">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3EBE1]/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-stone-400 font-medium">
                    No se encontraron reservas con esos filtros.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="transition-all duration-300 hover:bg-white/80">
                    <td className="px-8 py-5">
                      <p className="font-serif font-bold text-stone-900 text-base">
                        {r.external_professionals?.name ?? "—"}
                      </p>
                      <div className="mt-0.5">
                        {r.external_professionals?.phone ? (
                          <a
                            href={`https://wa.me/${r.external_professionals.phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#B89B72] hover:text-[#D4AF37] hover:underline font-bold tracking-widest break-all"
                          >
                            {r.external_professionals.phone}
                          </a>
                        ) : (
                          <p className="text-[10px] text-stone-400 font-medium">
                            {r.external_professionals?.email ?? ""}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-stone-700 font-medium whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-stone-900">{r.start_date}</span>
                        <span className="text-[11px] text-stone-400">al {r.end_date}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold ${
                        r.status === 'reservado' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        r.status === 'pendiente' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-stone-100 text-stone-600 border border-stone-200'
                      }`}>
                        {r.status}
                      </span>
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
                        <span className="text-[10px] text-stone-300">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
