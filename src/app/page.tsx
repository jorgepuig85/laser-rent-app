import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Zap, TrendingUp, Truck, ShieldCheck, GraduationCap } from "lucide-react";

const HERO_IMAGE = "https://pbvxslvihypfblbfyqle.supabase.co/storage/v1/object/public/equipos_imagenes/hero-profesional.webp";
const BENEFITS_IMAGE = "https://pbvxslvihypfblbfyqle.supabase.co/storage/v1/object/public/equipos_imagenes/beneficios-tech.webp";
const CTA_IMAGE = "https://pbvxslvihypfblbfyqle.supabase.co/storage/v1/object/public/equipos_imagenes/clinica-interior.webp";

import { AutoLoginTrigger } from "@/components/AutoLoginTrigger";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Suspense fallback={null}>
        <AutoLoginTrigger />
      </Suspense>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 md:pt-24 lg:pt-32">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col justify-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
                  Equipos de Última Generación
                </div>
                <h1 className="text-5xl font-serif font-extrabold tracking-tight sm:text-6xl xl:text-7xl text-foreground !leading-tight">
                  Alquiler de Terapia Láser para <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">Profesionales</span>
                </h1>
                <p className="max-w-[600px] text-lg text-slate-500 leading-relaxed">
                  Potencia tus ingresos sin inversión de capital. Alquilamos los equipos de depilación láser más avanzados del mercado con mantenimiento y soporte técnico incluido.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-14 px-8 text-base shadow-lg transition-transform hover:scale-105" render={<Link href="/equipos" />}>
                  Ver Equipos <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="h-14 px-8 text-base border-primary/20 hover:bg-primary/5" render={<Link href="/precios" />}>
                  Consultar Planes
                </Button>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-1000 delay-150">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent z-10 rounded-2xl mix-blend-overlay"></div>
              {/* Image Placeholder */}
              <Image
                src={HERO_IMAGE}
                alt="Máquina de depilación láser profesional"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Brand Authority Trust Bar */}
      <section className="bg-slate-50 border-y border-slate-100 py-12">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="flex items-start gap-4 p-2">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600 shrink-0">
                <Truck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">Logística Propia</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Entrega y retiro bonificado en Santa Rosa y zona de influencia.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600 shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">Equipos Certificados</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Realizamos mantenimiento preventivo exhaustivo antes de cada jornada.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-2">
              <div className="bg-blue-100 p-3 rounded-2xl text-blue-600 shrink-0">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900">Capacitación Inicial</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Te brindamos entrenamiento técnico en tu primera sesión de uso.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-slate-900">¿Por qué elegir Laser Rent?</h2>
            <p className="text-slate-500 text-lg max-w-[700px] mx-auto">
              Maximizamos tu rentabilidad eliminando los costos operativos de mantenimiento y reparaciones con tecnología certificada.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl order-2 lg:order-1">
              <Image 
                src={BENEFITS_IMAGE}
                alt="Tecnología láser avanzada"
                fill
                className="object-cover"
              />
            </div>
            <div className="lg:w-1/2 grid gap-6 sm:grid-cols-2 order-1 lg:order-2">
              {[
                {
                  icon: Zap,
                  title: "Tecnología Punta",
                  desc: "Equipos de última generación con diodo y tres longitudes de onda para todos los fototipos de piel."
                },
                {
                  icon: Shield,
                  title: "Soporte Técnico",
                  desc: "Asistencia rápida y mantenimiento preventivo incluido en todos nuestros planes."
                },
                {
                  icon: TrendingUp,
                  title: "Alta Rentabilidad",
                  desc: "Comienza a generar ingresos desde el primer día sin descapitalizarte."
                },
                {
                  icon: CheckCircle2,
                  title: "Capacitación Incluida",
                  desc: "Te enseñamos a usar el equipo para asegurar los mejores resultados en tus pacientes."
                }
              ].map((benefit, i) => (
                <div key={i} className="group relative overflow-hidden rounded-3xl bg-slate-50 p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900">{benefit.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 md:py-40 relative overflow-hidden text-white">
        <Image 
          src={CTA_IMAGE}
          alt="Interior de clínica estética"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]"></div>
        <div className="mx-auto w-full max-w-4xl px-4 md:px-6 relative text-center space-y-10 animate-in fade-in zoom-in duration-700">
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight leading-tight">Lleva tu centro de estética al siguiente nivel</h2>
          <p className="text-xl text-white/90 font-medium">
            Reserva tu equipo hoy y comienza a ofrecer tratamientos de depilación definitiva de alta eficacia.
          </p>
          <Button size="lg" className="h-16 px-10 text-lg rounded-full shadow-2xl bg-white text-primary hover:bg-white/90 hover:scale-105 transition-transform" render={<Link href="https://wa.me/5492954631456?text=Hola!%20Me%20interesa%20alquilar%20un%20equipo%20de%20depilaci%C3%B3n%20en%20La%20Pampa.%20Me%20poudr%C3%ADas%20dar%20m%C3%A1s%20informaci%C3%B3n%3F" target="_blank" rel="noopener noreferrer" />}>
            Chatea con un Asesor
          </Button>
        </div>
      </section>
    </div>
  );
}
