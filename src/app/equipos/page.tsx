import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Zap, Sun, CheckCircle2 } from "lucide-react";

const ADSS_IMAGE = "https://aftweonqhxvbcujexyre.supabase.co/storage/v1/object/public/equipos_imagenes/equipo_depilacion.webp";

export const metadata = {
  title: "Equipo ADSS FG2000B | Centro de Belleza",
  description: "Descubre el ADSS FG2000B, la plataforma líder en depilación láser con tecnología trío. Calidad certificada en Santa Rosa y Miguel Riglos."
};

export default function EquiposPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-24 md:py-32 animate-in fade-in duration-700 bg-white">
      <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-serif font-extrabold tracking-tight text-slate-900">
          ADSS FG2000B
        </h1>
        <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed">
          Nuestra plataforma exclusiva de depilación definitiva. Diseñada para resultados excepcionales desde la primera sesión.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Izquierda: Imagen */}
        <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-[700px] w-full rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 bg-slate-50 border border-slate-100">
          <Image
            src={ADSS_IMAGE}
            alt="Máquina de depilación láser ADSS FG2000B"
            fill
            priority
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Derecha: Descripción y Specs */}
        <div className="flex flex-col space-y-12">
          <div className="space-y-6">
            <h2 className="text-3xl font-serif font-bold text-slate-900">El estándar en depilación trío</h2>
            <p className="text-lg text-slate-500 leading-relaxed">
              El modelo FG2000B de ADSS integra tres longitudes de onda (Alexandrita, Diodo y Nd:YAG) en un solo cabezal, maximizando la absorción de energía en cualquier fototipo de piel y grosor de vello.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Zap, label: "Eficacia Clínica", desc: "Resultados visibles rápidamente." },
              { icon: ShieldCheck, label: "Máxima Seguridad", desc: "Apto para todo fototipo (I-VI)." },
              { icon: Sun, label: "Indoloro", desc: "Sistema de enfriamiento avanzado." },
              { icon: CheckCircle2, label: "Alta Frecuencia", desc: "Tratamientos ultra rápidos." }
            ].map((beneficio, i) => (
              <div key={i} className="flex flex-col gap-2 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                <beneficio.icon className="h-8 w-8 text-primary" />
                <h3 className="font-bold text-slate-900 mt-2">{beneficio.label}</h3>
                <p className="text-sm text-slate-500">{beneficio.desc}</p>
              </div>
            ))}
          </div>

          <Separator className="bg-slate-200" />

          {/* Especificaciones Técnicas */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900">Especificaciones Técnicas</h3>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
              <div className="flex justify-between p-4 px-6 hover:bg-slate-50 transition-colors">
                <span className="text-slate-500 font-medium">Longitud de onda</span>
                <span className="font-bold text-slate-900 text-right">755nm + 808nm + 1064nm</span>
              </div>
              <div className="flex justify-between p-4 px-6 hover:bg-slate-50 transition-colors">
                <span className="text-slate-500 font-medium">Potencia de salida</span>
                <span className="font-bold text-slate-900 text-right">1200W</span>
              </div>
              <div className="flex justify-between p-4 px-6 hover:bg-slate-50 transition-colors">
                <span className="text-slate-500 font-medium">Tamaño del spot</span>
                <span className="font-bold text-slate-900 text-right">12 x 20 mm</span>
              </div>
              <div className="flex justify-between p-4 px-6 hover:bg-slate-50 transition-colors">
                <span className="text-slate-500 font-medium">Refrigeración</span>
                <span className="font-bold text-slate-900 text-right">Zafiro - TEC (-5°C)</span>
              </div>
            </div>
          </div>
          
          {/* Compromiso de Calidad */}
          <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 space-y-4">
            <div className="flex items-center gap-3 text-primary">
              <ShieldCheck className="h-6 w-6" />
              <h3 className="text-xl font-bold">Nuestro Compromiso de Calidad</h3>
            </div>
            <p className="text-slate-600 leading-relaxed italic">
              &quot;Cada ADSS FG2000B de nuestra flota es entregado con calibración verificada y desinfectado bajo estrictas normas de bioseguridad, garantizando un entorno de trabajo seguro y profesional para vos y tus pacientes.&quot;
            </p>
          </div>

          <div className="pt-4">
            <Button size="lg" className="w-full sm:w-auto h-14 px-10 rounded-full bg-primary hover:bg-primary/90 text-white font-medium text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]" render={<Link href="/login?next=/dashboard" />}>
              Agendar Alquiler
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
