"use client";

import { useState } from "react";
import { format, differenceInDays } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon, Loader2, AlertCircle } from "lucide-react";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar";
import { createMaintenanceBlock } from "./actions";

interface Props {
  existingMaintenances: { id: string; start_date: string; end_date: string }[];
}

  // existingMaintenances can be used later to show a list of current blocks.
export function AdminMaintenance({}: Props) {
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

  return (
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
  );
}
