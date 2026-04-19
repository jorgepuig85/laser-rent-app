"use client";

import { useState } from "react";
import { format, isWithinInterval, parseISO, startOfDay, differenceInDays } from "date-fns";
import { Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import { es } from "date-fns/locale";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { createRental } from "./actions";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { addDays, isAfter } from "date-fns";

interface ReservationClientProps {
  professionalId: string;
  professionalName: string;
  existingRentals: { start_date: string; end_date: string }[];
  dailyRate: number;
  weeklyRate: number;
  locations: { id: string; name: string }[];
}

export function ReservationClient({
  professionalId,
  professionalName,
  existingRentals,
  dailyRate,
  weeklyRate,
  locations,
}: ReservationClientProps) {
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [locationId, setLocationId] = useState<string>("");
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
  
  // Nueva Lógica Comercial:
  // 1-2 días: Precio Total Directo
  // 3+ días: WhatsApp (Mensaje personalizado)
  const isConsult = selectedDays >= 3;
  
  const totalCost = selectedDays > 0 ? selectedDays * dailyRate : 0;

  const selectedLocation = locations.find(l => l.id === locationId);
  const locationName = selectedLocation?.name || "mi localidad";

  const whatsappLink = `https://wa.me/5492954631456?text=${encodeURIComponent(`Hola Jorge, soy ${professionalName}, quiero cotizar un alquiler de la ADSS FG2000B por ${selectedDays} días en ${locationName}`)}`;

  const handleBooking = async () => {
    if (!date?.from || !locationId || isConsult) return;
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
        gReCaptchaToken,
        locationId
      );

      if (!result.success) {
        console.error("[ReservationClient] createRental error:", result.error);
        toast.error("Error al procesar la reserva", {
          description: result.error,
        });
        return;
      }

      setDate(undefined);
      setLocationId(""); // Reset location select
      toast.success("¡Reserva confirmada con éxito!", {
        description: "Ya puedes revisar los detalles en tu dashboard profesional.",
        icon: <CheckCircle2 className="h-5 w-5 text-[--seasonal-primary]" />,
        duration: 3000,
      });
      
      // Reload is the most robust way to ensure all server data is fresh and UI is unfrozen
      router.refresh();
      setTimeout(() => window.location.reload(), 1000);

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
          1. Selecciona los días de alquiler en el calendario
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

      <div className="w-full grid gap-3">
        <label className="text-sm font-medium text-slate-700">
          2. Selecciona la Localidad
        </label>
        <div className="relative">
          <select
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            className="w-full h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none focus:border-primary transition-all appearance-none"
          >
            <option value="" disabled>Seleccionar localidad...</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-600">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      <div className="w-full bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-4">
        {selectedDays === 0 ? (
          <p className="text-slate-600 font-medium text-center">Selecciona fechas para ver el presupuesto.</p>
        ) : isConsult ? (
          <div className="space-y-6">
            <div className="bg-white border-2 border-[#8F754F]/20 p-6 rounded-2xl shadow-sm">
              <p className="text-stone-800 text-sm font-medium leading-relaxed">
                Para jornadas de <span className="font-bold text-[#8F754F]">3 o más días</span>, ofrecemos descuentos especiales. Consúltanos por WhatsApp para obtener tu cotización personalizada. El costo de traslado se acordará por ese medio.
              </p>
              
              <div className="mt-4 pt-4 border-t border-stone-100">
                <p className="text-[11px] text-stone-700 uppercase tracking-widest font-bold mb-1">Incentivo Premium</p>
                <p className="text-stone-900 font-serif font-bold text-lg">
                  Semana completa: <span className="text-[#8F754F] text-xl">${weeklyRate.toLocaleString('es-AR')}</span>
                </p>
              </div>
            </div>

            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "default" }),
                "w-full h-14 rounded-full font-bold shadow-lg shadow-green-600/20 bg-green-600 hover:bg-green-700 transition-all text-white text-base hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2",
                !locationId && "pointer-events-none opacity-50"
              )}
            >
              {!locationId ? "Selecciona Localidad primero" : "Consultar por WhatsApp"}
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-200">
              <span className="text-slate-700 font-medium">Días seleccionados:</span>
              <span className="font-bold text-slate-900">{selectedDays} {selectedDays === 1 ? 'día' : 'días'}</span>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-700 font-medium">Costo de Alquiler:</span>
                <span className="text-2xl font-bold text-slate-900">
                  ${totalCost.toLocaleString('es-AR')}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed flex items-start gap-2 pt-2 border-t border-slate-100">
                <span className="text-sm shrink-0">🚚</span>
                <span>El valor indicado corresponde únicamente al alquiler del equipo. Se podrá adicionar un costo de envío/traslado según la localidad seleccionada.</span>
              </p>
            </div>
            <Button
              onClick={handleBooking}
              disabled={loading || !locationId}
              className="w-full h-12 rounded-full font-medium shadow-lg shadow-primary/20 bg-primary hover:opacity-100 hover:scale-[1.02] transition-all text-white font-bold disabled:bg-slate-300 disabled:shadow-none"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!locationId ? "Selecciona Localidad" : "Quiero Reservar"}
            </Button>
          </div>
        )}
      </div>
      
      <p className="text-[11px] text-slate-600 font-medium italic font-serif text-center w-full">
        * Validez de precios garantizada por 60 días desde la fecha de reserva.
      </p>
    </div>
  );
}
