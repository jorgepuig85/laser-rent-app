import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabaseClient";

const PLACEHOLDER_EQUIPMENT = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f8fafc'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%2394a3b8'%3EImagen Equipo%3C/text%3E%3C/svg%3E";

interface EquipoEspecificaciones {
  potencia?: string;
  frecuencia?: string;
  peso?: string;
  features?: string[];
  availability?: string;
}

interface Equipo {
  id: string;
  nombre: string;
  descripcion: string;
  especificaciones?: EquipoEspecificaciones;
  imagen_url?: string;
}

export const metadata = {
  title: "Equipos de Depilación Láser | LaserRent Pro",
  description: "Conoce nuestro catálogo de equipos de depilación láser de diodo disponibles para alquiler. Tecnología avanzada."
};

export default async function EquiposPage() {
  const { data: equipos, error } = await supabase.from('equipos').select('*');
  
  if (error) {
    console.error("Error fetching equipos:", error);
  }
  
  const equiposData = equipos || [];
  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-12 md:py-20 animate-in fade-in duration-500">
      <div className="mb-12 md:mb-20 text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Equipos Disponibles</h1>
        <p className="text-xl text-muted-foreground">
          Contamos con tecnología de vanguardia comprobada clínicamente. Todos los equipos se entregan calibrados y con mantenimiento al día.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {equiposData.map((equipo: Equipo) => (
          <Card key={equipo.id} className="overflow-hidden border-2 transition-all hover:border-primary/20 hover:shadow-xl flex flex-col">
            <div className="grid sm:grid-cols-2 h-full">
              <div className="relative aspect-square sm:aspect-auto bg-muted">
                <Image
                  src={PLACEHOLDER_EQUIPMENT}
                  alt={equipo.nombre}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant={equipo.especificaciones?.availability === "Disponible" ? "default" : "secondary"}>
                    {equipo.especificaciones?.availability || "Consultar"}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col p-6 sm:p-8">
                <div className="flex-1 space-y-4">
                  <h2 className="text-2xl font-bold">{equipo.nombre}</h2>
                  <p className="text-sm text-muted-foreground">{equipo.descripcion}</p>
                  
                  <Separator />
                  
                  <ul className="space-y-2 text-sm text-foreground/80">
                    {(equipo.especificaciones?.features || []).map((feature: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 text-primary">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t text-center">
                     <div>
                      <p className="text-xs text-muted-foreground">Potencia</p>
                      <p className="font-semibold text-sm">{equipo.especificaciones?.potencia}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Hz</p>
                      <p className="font-semibold text-sm">{equipo.especificaciones?.frecuencia}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Peso</p>
                      <p className="font-semibold text-sm">{equipo.especificaciones?.peso}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Button className="w-full" render={<Link href="/precios" />}>Ver Planes de Alquiler</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
