"use client";

import { useState } from "react";
import { Settings, CheckCircle2, Loader2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateRentalPrices } from "./actions";
import { toast } from "sonner";

interface BusinessSettingsProps {
  initialDailyRate: number;
  initialWeeklyRate: number;
}

export function BusinessSettings({ initialDailyRate, initialWeeklyRate }: BusinessSettingsProps) {
  const [dailyRate, setDailyRate] = useState(initialDailyRate);
  const [weeklyRate, setWeeklyRate] = useState(initialWeeklyRate);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await updateRentalPrices(dailyRate, weeklyRate);
      if (res.success) {
        toast.success("Precio actualizado correctamente", {
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
        });
      } else {
        toast.error("Error al actualizar: " + res.error);
      }
    } catch {
      toast.error("Error inesperado al actualizar precios.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white shadow-[0_8px_40px_rgba(0,0,0,0.03)] overflow-hidden p-8 md:p-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-[#FCFAF5] rounded-2xl border border-[#EAE3D5]">
          <Settings className="h-6 w-6 text-[#B89B72]" />
        </div>
        <div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">Ajustes de Negocio</h3>
          <p className="text-sm text-stone-400 font-medium tracking-tight">Gestiona las tarifas de alquiler de equipos.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 ml-1">Precio Diario (ARS)</label>
          <div className="relative group">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300 group-focus-within:text-[#D4AF37] transition-colors" />
            <input
              type="number"
              value={dailyRate}
              onChange={(e) => setDailyRate(Number(e.target.value))}
              className="w-full bg-white border border-[#EAE3D5] rounded-2xl pl-12 pr-4 py-4 text-lg font-bold outline-none focus:border-[#D4AF37] transition-all text-stone-900 shadow-sm"
              placeholder="0.00"
            />
          </div>
          <p className="text-[10px] text-stone-400 italic font-medium">* Tarifa base por jornada de 24hs.</p>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 ml-1">Precio Semanal (ARS)</label>
          <div className="relative group">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-stone-300 group-focus-within:text-[#D4AF37] transition-colors" />
            <input
              type="number"
              value={weeklyRate}
              onChange={(e) => setWeeklyRate(Number(e.target.value))}
              className="w-full bg-white border border-[#EAE3D5] rounded-2xl pl-12 pr-4 py-4 text-lg font-bold outline-none focus:border-[#D4AF37] transition-all text-stone-900 shadow-sm"
              placeholder="0.00"
            />
          </div>
          <p className="text-[10px] text-stone-400 italic font-medium">* Descuento aplicado automáticamente para reservas ≥ 7 días.</p>
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="h-14 px-10 rounded-full bg-stone-900 hover:bg-black text-white font-bold shadow-xl shadow-stone-200 transition-all hover:scale-[1.02] flex items-center gap-2"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
          Actualizar Tarifas
        </Button>
      </div>
    </div>
  );
}
