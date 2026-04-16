"use client";

import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Loader2, AlertCircle } from "lucide-react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { createMaintenanceBlock, deleteMaintenanceBlock } from "./actions";

interface Props {
  existingMaintenances: { id: string; start_date: string; end_date: string }[];
}

export function AdminMaintenance({ existingMaintenances }: Props) {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const selectedDays = date?.from && date?.to ? differenceInDays(date.to, date.from) + 1 : (date?.from ? 1 : 0);

  const handleBlock = async () => {
    if (!date?.from) return;
    setLoading(true);
    try {
      const startStr = format(date.from, "yyyy-MM-dd");
      const endStr = format(date.to ?? date.from, "yyyy-MM-dd");

      const result = await createMaintenanceBlock(startStr, endStr);
      
      if (!result.success) {
        toast.error("Error al bloquear las fechas", { description: result.error });
        return;
      }

      toast.success("Fechas bloqueadas correctamente.");
      setDate(undefined);
    } catch {
      toast.error("Error inesperado al intentar bloquear las fechas.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este bloqueo?")) return;
    try {
      const res = await deleteMaintenanceBlock(id);
      if (res?.success) toast.success("Bloqueo eliminado.");
      else toast.error(res?.error || "Error al eliminar");
    } catch {
      toast.error("Error inesperado al eliminar.");
    }
  };

  return (
    <div className="space-y-6">
    <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col md:flex-row gap-8">
      <div className="flex-1 space-y-6">
        <div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">Bloqueo por Mantenimiento</h3>
          <p className="text-sm text-stone-500 mt-2 leading-relaxed">
            Selecciona un rango de fechas en el calendario para marcarlas como no disponibles. Estas fechas se mostrarán en gris en el calendario de los clientes, impidiendo cualquier nueva reserva.
          </p>
        </div>

        <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 inline-block">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from || new Date()}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            locale={es}
            className="w-full flex justify-center"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center bg-stone-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-stone-900/20">
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] border border-white/10">
                <AlertCircle className="h-3 w-3 mr-1" /> Configurar service
              </span>
            </div>
            
            {selectedDays > 0 ? (
              <div className="space-y-1">
                <p className="font-serif text-4xl font-bold">{selectedDays} {selectedDays === 1 ? "día" : "días"}</p>
                <p className="text-sm text-stone-400 font-medium">Marcados para inhabilitar</p>
              </div>
            ) : (
              <p className="font-serif text-xl font-medium text-stone-400 italic">No hay fechas seleccionadas</p>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={handleBlock}
              disabled={loading || selectedDays === 0}
              className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] hover:bg-[#B89B72] text-stone-900 disabled:bg-stone-800 disabled:text-stone-500 rounded-xl py-4 font-bold uppercase tracking-widest text-xs transition-all duration-300 disabled:cursor-not-allowed"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Procesando</>
              ) : (
                <><CalendarIcon className="h-4 w-4" /> Bloquear Disponibilidad</>
              )}
            </button>
            <p className="text-[10px] text-stone-500 mt-4 text-center">Al confirmar, el sistema de alquiler rechazará instantáneamente consultas solapadas.</p>
          </div>
        </div>
      </div>
    </div>
    
    {existingMaintenances.length > 0 && (
      <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h4 className="font-serif text-xl font-bold text-stone-900 mb-4">Próximos Mantenimientos</h4>
        <div className="divide-y divide-stone-100">
          {existingMaintenances.map((m) => (
            <div key={m.id} className="py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-stone-800">
                  {format(new Date(m.start_date + "T00:00:00"), "dd MMM yyyy", { locale: es })} — {format(new Date(m.end_date + "T00:00:00"), "dd MMM yyyy", { locale: es })}
                </p>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">Bloqueo Activo</p>
              </div>
              <button
                onClick={() => handleDelete(m.id)}
                className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Eliminar bloqueo"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    )}
    </div>
  );
}
