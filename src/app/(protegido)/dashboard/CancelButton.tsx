"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cancelRental } from "../alquiler/actions";
import { Loader2, XCircle, Info } from "lucide-react";
import { differenceInHours, parseISO } from "date-fns";

interface CancelButtonProps {
  rentalId: string;
  startDate: string;
}

export function CancelButton({ rentalId, startDate }: CancelButtonProps) {
  const [loading, setLoading] = useState(false);
  
  const hoursLeft = differenceInHours(parseISO(startDate), new Date());
  const canCancel = hoursLeft >= 48;

  if (!canCancel) {
    return (
      <div className="flex items-center gap-1.5 text-slate-400">
        <Info className="h-3 w-3" />
        <span className="text-[11px] font-medium italic">
          Fuera de término (48hs)
        </span>
      </div>
    );
  }

  const handleCancel = async () => {
    // Custom confirm via toast or simple window.confirm for now
    if (!window.confirm("¿Confirmas la cancelación de esta reserva? Sanación de 48hs aplicada.")) return;
    
    setLoading(true);
    try {
      await cancelRental(rentalId);
      toast.success("Reserva cancelada con éxito", {
        description: "El espacio ha sido liberado en el calendario.",
      });
    } catch (err: unknown) {
      toast.error("No se pudo completar la cancelación", {
        description: (err as Error).message || "Contacta con soporte si el problema persiste.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={handleCancel}
      disabled={loading}
      className="text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all group h-8 px-3 rounded-lg"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
      ) : (
        <XCircle className="h-3.5 w-3.5 mr-2 group-hover:scale-110 transition-transform" />
      )}
      <span className="text-xs font-semibold">Cancelar Reserva</span>
    </Button>
  );
}
