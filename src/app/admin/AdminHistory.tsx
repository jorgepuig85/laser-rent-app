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
  is_maintenance?: boolean;
  external_professionals: { name: string; phone: string | null; email: string | null } | null;
  locations: { name: string } | null;
}

import { toast } from "sonner";
import { deleteMaintenanceBlock } from "./actions";

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
                <th className="px-8 py-5">Localidad</th>
                <th className="px-8 py-5">Período</th>
                <th className="px-8 py-5">Estado</th>
                <th className="px-8 py-5">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3EBE1]/50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-stone-400 font-medium">
                    No se encontraron reservas con esos filtros.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className={`transition-all duration-300 ${r.is_maintenance ? "bg-red-50/50 hover:bg-red-50" : "hover:bg-white/80"}`}>
                    <td className="px-8 py-5">
                      {r.is_maintenance ? (
                        <div>
                          <p className="font-serif font-bold text-red-900 text-base flex items-center gap-2">
                             MANTENIMIENTO
                          </p>
                          <p className="text-[10px] text-red-500 font-medium uppercase tracking-widest mt-1">
                            Bloqueo Activo
                          </p>
                        </div>
                      ) : (
                        <>
                          <p className="font-serif font-bold text-stone-900 text-base">
                            {r.external_professionals?.name ?? "—"}
                          </p>
                          <div className="mt-0.5">
                            {r.external_professionals?.phone ? (
                              (() => {
                                const cleanPhone = r.external_professionals.phone.replace(/\D/g, "");
                                const formattedPhone = cleanPhone.startsWith("54") ? cleanPhone : `549${cleanPhone}`;
                                return (
                                  <a
                                    href={`https://wa.me/${formattedPhone}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[10px] text-[#B89B72] hover:text-[#D4AF37] hover:underline font-bold tracking-widest break-all"
                                  >
                                    <svg
                                      className="h-3 w-3 fill-current"
                                      viewBox="0 0 24 24"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.002 22A10.003 10.003 10.003 0 1 2 12C2 6.477 6.477 2 12.002 2 17.527 2 22 6.477 22 12c0 5.522-4.473 10-9.998 10zm-5.114-1.95L8 18.002C9.28 18.665 10.638 19.001 12.002 19.001 15.867 19.001 19 15.869 19 12.003 19 8.138 15.867 5.006 12.002 5.006 8.138 5.006 5 8.138 5 12.003c0 1.602.483 3.125 1.353 4.394L5 20.952l1.888-1.002z" />
                                    </svg>
                                    {r.external_professionals.phone}
                                  </a>
                                );
                              })()
                            ) : (
                              <p className="text-[10px] text-stone-400 font-medium">
                                {r.external_professionals?.email ?? ""}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-stone-900 leading-none">
                        {r.locations?.name ?? (r.is_maintenance ? "N/A" : "—")}
                      </p>
                    </td>
                    <td className="px-8 py-5 text-stone-700 font-medium whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-bold text-stone-900">{r.start_date}</span>
                        <span className="text-[11px] text-stone-400">al {r.end_date}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      {r.is_maintenance ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold bg-red-100 text-red-700 border border-red-200">
                          MANTENIMIENTO
                        </span>
                      ) : (
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-bold ${
                          r.status === 'reservado' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          r.status === 'pendiente' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-stone-100 text-stone-600 border border-stone-200'
                        }`}>
                          {r.status}
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 flex items-center justify-between">
                      {r.is_maintenance ? (
                        <button
                          onClick={async () => {
                            if (!confirm("¿Eliminar este bloqueo de mantenimiento?")) return;
                            try {
                              const res = await deleteMaintenanceBlock(r.id);
                              if (res?.success) toast.success("Bloqueo eliminado.");
                              else toast.error(res?.error || "Error al eliminar");
                            } catch {
                              toast.error("Error inesperado al eliminar.");
                            }
                          }}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded flex items-center gap-2 text-xs font-bold transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      ) : (
                        r.receipt_url ? (
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
                        )
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
