import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Zap, TrendingUp, Truck, ShieldCheck, GraduationCap } from "lucide-react";
import { SeasonalHeroEffects } from "@/components/SeasonalHeroEffects";

const HERO_IMAGE = "https://pbvxslvihypfblbfyqle.supabase.co/storage/v1/object/public/equipos_imagenes/hero-profesional.webp";
const BENEFITS_IMAGE = "https://pbvxslvihypfblbfyqle.supabase.co/storage/v1/object/public/equipos_imagenes/beneficios-tech.webp";
const CTA_IMAGE = "https://pbvxslvihypfblbfyqle.supabase.co/storage/v1/object/public/equipos_imagenes/clinica-interior.webp";

import { createClient } from "@/lib/supabaseServer";
import { AutoLoginTrigger } from "@/components/AutoLoginTrigger";
import { Suspense } from "react";
import { Calendar } from "lucide-react";

export default async function Home() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const ctaHref = session ? "/dashboard" : "/login?next=/dashboard";

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <Suspense fallback={null}>
        <AutoLoginTrigger />
      </Suspense>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 min-h-[85vh] flex items-center">
        <SeasonalHeroEffects />
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="flex flex-col justify-center space-y-8 reveal-up">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                  Equipos de Última Generación
                </div>
                <h1 className="text-5xl font-serif font-black tracking-tighter sm:text-7xl xl:text-8xl text-foreground !leading-[1.1]">
                  Alquiler de Terapia Láser para <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">Profesionales</span>
                </h1>
                <p className="max-w-[600px] text-xl text-slate-500 leading-relaxed tracking-wide font-medium">
                  Potencia tus ingresos sin inversión de capital. Alquilamos los equipos de depilación láser más avanzados del mercado con mantenimiento y soporte técnico incluido.
                </p>
              </div>
              <div className="flex flex-col gap-8 items-center sm:items-start">
                <Button 
                  size="lg" 
                  className="h-16 px-14 text-xl shadow-2xl transition-all hover:scale-105 btn-glint rounded-full bg-[#8F754F] text-white font-bold border-none" 
                  render={<Link href={ctaHref} />}
                >
                  Quiero Alquilar <Calendar className="ml-3 h-6 w-6" />
                </Button>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                  <Link href="/equipos" className="group flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors px-4 py-2">
                    Ver Equipos
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <div className="h-4 w-[1px] bg-slate-200 hidden sm:block"></div>
                  <Link href="/precios" className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors px-4 py-2">
                    Consultar Planes
                  </Link>
                </div>
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
              <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0">
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
              <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0">
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
              <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0">
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
          <div className="text-center space-y-4 mb-20 reveal-up">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-slate-900">¿Por qué elegir Centro de Belleza?</h2>
            <p className="text-slate-500 text-lg max-w-[700px] mx-auto tracking-wide">
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
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/70 backdrop-blur-[1px]"></div>
        <div className="mx-auto w-full max-w-4xl px-4 md:px-6 relative text-center space-y-10 animate-in fade-in zoom-in duration-700">
          <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tight leading-tight">Lleva tu centro de estética al siguiente nivel</h2>
          <p className="text-xl text-white/90 font-medium">
            Reserva tu equipo hoy y comienza a ofrecer tratamientos de depilación definitiva de alta eficacia.
          </p>
          <Button size="lg" className="h-16 px-10 text-lg rounded-full shadow-2xl bg-[#8F754F] text-white hover:bg-[#8F754F]/90 hover:scale-105 transition-all btn-glint border-none font-bold" render={<Link href="https://wa.me/5492954631456?text=Hola!%20Me%20interesa%20alquilar%20un%20equipo%20de%20depilaci%C3%B3n%20en%20La%20Pampa.%20Me%20podr%C3%ADas%20dar%20m%C3%A1s%20informaci%C3%B3n%3F" target="_blank" rel="noopener noreferrer" />}>
            Chatea con un Asesor
          </Button>
        </div>
      </section>
    </div>
  );
}
