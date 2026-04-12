"use client";

import { useState } from "react";
import { format, isWithinInterval, parseISO, startOfDay, differenceInDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import { es } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { createRental } from "./actions";
import Link from "next/link";

interface ReservationClientProps {
  professionalId: string;
  professionalName: string;
  existingRentals: { start_date: string; end_date: string }[];
  dailyRate: number;
}

export function ReservationClient({
  professionalId,
  professionalName,
  existingRentals,
  dailyRate,
}: ReservationClientProps) {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const disabledIntervals = existingRentals.map((rental) => ({
    start: startOfDay(parseISO(rental.start_date)),
    end: startOfDay(parseISO(rental.end_date)),
  }));

  const isDateDisabled = (checkDate: Date) => {
    if (startOfDay(checkDate) < startOfDay(new Date())) return true;

    return disabledIntervals.some((interval) =>
      isWithinInterval(startOfDay(checkDate), {
        start: interval.start,
        end: interval.end,
      })
    );
  };

  const selectedDays = date?.from && date?.to ? differenceInDays(date.to, date.from) + 1 : (date?.from ? 1 : 0);
  const isPromo = selectedDays >= 3;
  const totalCost = selectedDays > 0 ? selectedDays * dailyRate : 0;

  const handleBooking = async () => {
    if (!date?.from || !date?.to || isPromo) return;
    setLoading(true);

    const startStr = format(date.from, "yyyy-MM-dd");
    const endStr = format(date.to, "yyyy-MM-dd");

    try {
      await createRental(startStr, endStr, professionalId, professionalName, totalCost);
      setDate(undefined);
      alert("Reserva confirmada con éxito. Ya puedes verla en tu dashboard.");
    } catch (err: unknown) {
      alert((err as Error).message || "Error al procesar la reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 bg-white p-6 md:p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col items-center sm:items-start text-center sm:text-left">
      <div className="w-full grid gap-3">
        <label className="text-sm font-medium text-slate-700">
          Selecciona los días de alquiler en el calendario
        </label>
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 flex justify-center p-4">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from || new Date()}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            locale={es}
            disabled={isDateDisabled}
            className="w-full flex justify-center"
          />
        </div>
      </div>

      <div className="w-full bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-4">
        {selectedDays === 0 ? (
          <p className="text-slate-500 text-center">Selecciona fechas para ver el presupuesto.</p>
        ) : isPromo ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-sm">
              Contamos con bonificaciones especiales para jornadas de 3 o más días. Consultanos por la promoción vigente.
            </div>
            <Button
              className="w-full h-12 rounded-full font-medium shadow-lg shadow-green-600/20 bg-green-600 hover:bg-green-700 transition-all text-white"
              render={<Link href={`https://wa.me/5492954631456?text=${encodeURIComponent(`Hola! Quiero consultar por la promoción de alquiler del ADSS FG2000B por ${selectedDays} días.`)}`} target="_blank" />}
            >
              Consultar Promoción
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-slate-600">Días seleccionados:</span>
              <span className="font-bold text-slate-900">{selectedDays} {selectedDays === 1 ? 'días' : 'días'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">Total estimado:</span>
              <span className="text-2xl font-bold text-slate-900">${totalCost.toLocaleString('es-AR')}</span>
            </div>
            <Button
              onClick={handleBooking}
              disabled={loading}
              className="w-full h-12 rounded-full font-medium shadow-lg shadow-blue-600/20 bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] transition-all text-white"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirmar Reserva
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
