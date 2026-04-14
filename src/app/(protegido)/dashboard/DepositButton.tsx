"use client";

import { useState } from "react";
import { DepositModal } from "./DepositModal";
import { Banknote, CheckCircle2 } from "lucide-react";

interface Props {
  rentalId: string;
  depositAmount: number | null;
  startDate: string;
}

export function DepositButton({ rentalId, depositAmount, startDate }: Props) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold uppercase tracking-widest">
        <CheckCircle2 className="h-3 w-3" />
        Comprobante enviado
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#B89B72] text-stone-900 text-[9px] font-bold uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-95 shadow-sm shadow-[#D4AF37]/20"
      >
        <Banknote className="h-3.5 w-3.5" />
        Confirmar con Seña
      </button>
      {open && (
        <DepositModal
          rentalId={rentalId}
          depositAmount={depositAmount}
          startDate={startDate}
          onClose={() => setOpen(false)}
          onSuccess={() => { setOpen(false); setDone(true); }}
        />
      )}
    </>
  );
}
