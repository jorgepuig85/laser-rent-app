import { MessageCircle } from "lucide-react";
import Link from "next/link";

export function WhatsAppButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
      <div className="bg-white text-slate-800 px-4 py-2 rounded-2xl shadow-xl font-bold text-sm border border-slate-100 relative animate-pulse">
        ¿Dudas? ¡Consultame aquí!
        <div className="absolute top-1/2 -right-2 -translate-y-1/2 border-[6px] border-transparent border-l-white"></div>
      </div>
      <Link
        href="https://wa.me/5492954631456?text=Hola!%20Me%20interesa%20alquilar%20un%20equipo%20de%20depilaci%C3%B3n%20en%20La%20Pampa.%20Me%20podr%C3%ADas%20dar%20m%C3%A1s%20informaci%C3%B3n%3F"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chatear por WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 duration-300 relative z-10"
      >
        <MessageCircle className="h-8 w-8" />
      </Link>
    </div>
  );
}
