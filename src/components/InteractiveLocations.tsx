"use client";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";

interface Location {
  name: string;
  id?: string;
}

interface InteractiveLocationsProps {
  locations: Location[];
  variant: "pills" | "list";
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export function InteractiveLocations({ locations, variant }: InteractiveLocationsProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const getWhatsAppUrl = (locationName: string) => {
    return `https://wa.me/5492954631456?text=${encodeURIComponent(`Hola! Quiero solicitar un equipo para la localidad de ${locationName}`)}`;
  };

  return (
    <>
      {variant === "pills" ? (
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {locations.map((loc, i) => (
            <button
              key={loc.id || i}
              onClick={() => setSelectedLocation(loc)}
              className="bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-full text-sm font-bold shadow-sm hover:shadow-md transition-all hover:border-primary/50 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              {loc.name}
            </button>
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-y-3 gap-x-4 mb-8 flex-1">
          {locations.map((loc, i) => (
            <li 
              key={loc.id || i} 
              className="flex items-start text-sm sm:text-base text-slate-700 font-medium cursor-pointer group hover:bg-slate-100/50 p-2 -mx-2 rounded-lg transition-colors"
              onClick={() => setSelectedLocation(loc)}
            >
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500 mr-3 mt-1.5 shadow-sm shadow-green-500/50 shrink-0 group-hover:scale-110 transition-transform"></div>
              <span className="flex-1 break-words leading-tight group-hover:text-primary transition-colors">{loc.name}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Modal Headless UI */}
      <Transition appear show={!!selectedLocation} as={Fragment}>
        <Dialog as="div" className="relative z-[100]" onClose={() => setSelectedLocation(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-[2rem] bg-white p-6 sm:p-8 text-left align-middle shadow-2xl transition-all border border-slate-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <Dialog.Title
                        as="h3"
                        className="text-xl font-serif font-bold leading-6 text-slate-900"
                      >
                        {selectedLocation?.name}
                      </Dialog.Title>
                      <p className="text-xs text-green-600 font-semibold mt-1">Cobertura Activa</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 mb-8">
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      Contamos con logística propia y entrega garantizada en esta zona.
                    </p>
                  </div>

                  <div className="mt-4 flex flex-col gap-3">
                    <Button
                      type="button"
                      className="w-full rounded-xl h-12 font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-[#25D366]/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
                      onClick={() => {
                        if (selectedLocation) {
                          window.open(getWhatsAppUrl(selectedLocation.name), '_blank');
                        }
                        // Close modal after a tiny delay to ensure window.open fires reliably
                        setTimeout(() => setSelectedLocation(null), 150);
                      }}
                    >
                      <WhatsAppIcon className="h-5 w-5" />
                      Solicitar envío aquí
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full rounded-xl h-12 font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                      onClick={() => setSelectedLocation(null)}
                    >
                      Cerrar
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
