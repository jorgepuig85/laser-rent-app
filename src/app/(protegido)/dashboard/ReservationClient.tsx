"use client";

import { useState } from "react";
import { format, isWithinInterval, parseISO, startOfDay, differenceInDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { createRental } from "./actions";
import Link from "next/link";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { addDays, isAfter } from "date-fns";

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
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const disabledIntervals = existingRentals.map((rental) => ({
    start: startOfDay(parseISO(rental.start_date)),
    end: startOfDay(parseISO(rental.end_date)),
  }));

  const isDateDisabled = (checkDate: Date) => {
    const today = startOfDay(new Date());
    const sixtyDaysLater = addDays(today, 60);

    // Bloqueo Hoy y pasado: Mínimo 24hs de antelación
    if (startOfDay(checkDate) <= today) return true;

    // Ventana de 60 días
    if (isAfter(startOfDay(checkDate), sixtyDaysLater)) return true;

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
    if (!date?.from || isPromo) return;
    setLoading(true);

    // For single-day selection, from === to
    const startStr = format(date.from, "yyyy-MM-dd");
    const endStr = format(date.to ?? date.from, "yyyy-MM-dd");

    try {
      if (!executeRecaptcha) {
        toast.error("reCAPTCHA no disponible. Inténtalo de nuevo.");
        setLoading(false);
        return;
      }

      const { createBrowserClient } = await import("@supabase/ssr");
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      // Forzar refresco de sesión activa si expiró para evitar error en el Server Action
      await supabase.auth.getSession();
      
      // PRE-FLIGHT CHECK: Calentar conexión y asegurar autenticación persistente a DB
      const { error: preFlightError } = await supabase
        .from("profiles")
        .select("id")
        .limit(1);
        
      if (preFlightError) throw new Error("Error de validación previa: " + preFlightError.message);

      const gReCaptchaToken = await executeRecaptcha("booking");

      const result = await createRental(
        startStr,
        endStr,
        professionalId,
        professionalName,
        totalCost,
        gReCaptchaToken
      );

      if (!result.success) {
        console.error("[ReservationClient] createRental error:", result.error);
        toast.error("Error al procesar la reserva", {
          description: result.error,
        });
        return;
      }

      setDate(undefined);
      toast.success("¡Reserva confirmada con éxito!", {
        description: "Ya puedes revisar los detalles en tu dashboard profesional.",
        icon: <CheckCircle2 className="h-5 w-5 text-[--seasonal-primary]" />,
        duration: 5000,
      });
      
      router.refresh();
      setTimeout(() => window.location.reload(), 1500);

    } catch (err: unknown) {
      // Fallback: network or framework-level error
      console.error("[ReservationClient] unexpected error:", err);
      toast.error("Error al procesar la reserva", {
        description: "Ocurrió un problema de red. Intentá nuevamente.",
      });
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
              className="w-full h-12 rounded-full font-medium shadow-lg shadow-primary/20 bg-primary hover:opacity-100 hover:scale-[1.02] transition-all text-white font-bold"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Quiero Reservar
            </Button>
          </div>
        )}
      </div>
      
      <p className="text-[11px] text-slate-400 italic font-serif text-center w-full">
        * Validez de precios garantizada por 60 días desde la fecha de reserva.
      </p>
    </div>
  );
}
