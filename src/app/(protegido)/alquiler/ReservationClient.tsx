"use client";

import { useState } from "react";
import { format, isWithinInterval, parseISO, startOfDay } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { DateRange } from "react-day-picker";
import { es } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createRental } from "./actions";

interface ReservationClientProps {
  professionalId: string;
  professionalName: string;
  existingRentals: { start_date: string; end_date: string }[];
}

export function ReservationClient({
  professionalId,
  professionalName,
  existingRentals,
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

  const handleBooking = async () => {
    if (!date?.from || !date?.to) return;
    setLoading(true);

    const startStr = format(date.from, "yyyy-MM-dd");
    const endStr = format(date.to, "yyyy-MM-dd");

    try {
      await createRental(startStr, endStr, professionalId, professionalName);
      setDate(undefined);
      alert("Reserva confirmada con éxito. Ya puedes verla en tu dashboard.");
    } catch (err: unknown) {
      alert((err as Error).message || "Error al procesar la reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div className="grid gap-2">
        <label className="text-sm font-medium text-slate-700">
          Selecciona los días de alquiler
        </label>
        <Popover>
          <PopoverTrigger className={cn(
            "inline-flex w-full sm:w-[400px] items-center justify-start whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2",
            !date && "text-muted-foreground"
          )}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y", { locale: es })} -{" "}
                  {format(date.to, "LLL dd, y", { locale: es })}
                </>
              ) : (
                format(date.from, "LLL dd, y", { locale: es })
              )
            ) : (
              <span>Elegir un rango de fechas</span>
            )}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
              locale={es}
              disabled={isDateDisabled}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button
        onClick={handleBooking}
        disabled={!date?.from || !date?.to || loading}
        className="w-full sm:w-auto mt-4 px-8 bg-slate-900 hover:bg-slate-800 text-white"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Confirmar Reserva
      </Button>
    </div>
  );
}
