import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

export const metadata = {
  title: "Planes y Precios de Alquiler | Centro de Belleza",
  description: "Conoce nuestros precios de alquiler de equipos de depilación láser por día, semana o mes. Rentabilidad asegurada."
};

export const dynamic = 'force-dynamic'; // Desactivar cache estático de Vercel

export default async function PreciosPage() {
  // Fetch popular pricing dynamically from Supabase
  const { data: tarifaData, error } = await supabase
    .from('tarifas')
    .select('*')
    .order('es_popular', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching tarifas:", error);
  }

  const baseDia = tarifaData?.precio_dia ? `$${tarifaData.precio_dia.toLocaleString('es-AR')}` : "Consultar";
  const baseSemana = tarifaData?.precio_semana ? `$${tarifaData.precio_semana.toLocaleString('es-AR')}` : "Consultar";

  const plans = [
    {
      name: "Jornada Diaria",
      price: baseDia,
      description: "Ideal para centros que agendan a sus pacientes una vez por semana o quincena.",
      features: [
        "Alquiler por 12 y 24 horas",
        "Traslado incluido (zona centro)",
        "Capacitación inicial rápida",
        "Soporte técnico telefónico",
        "Geles y descartables opcionales"
      ],
      popular: false,
      cta: "Reservar Día"
    },
    {
      name: "Semanal",
      price: baseSemana,
      description: "La opción más elegida para máxima rentabilidad y agendas completas.",
      features: [
        "Alquiler continuo por 7 días",
        "Traslado de entrega y retiro bonificado",
        "Capacitación técnica extendida",
        "Revisión preventiva antes de entrega",
        "Pack de descartables de regalo",
        "Soporte técnico local presencial si es necesario"
      ],
      popular: true,
      cta: "Reservar Semana"
    },
    {
      name: "Mensual",
      price: "Consultar",
      description: "Para clínicas consolidadas con flujo diario de pacientes.",
      features: [
        "Equipo exclusivo temporalmente",
        "Mantenimiento preventivo mensual en tu local",
        "Rentabilidad máxima a largo plazo",
        "Flexibilidad de cambio de equipo"
      ],
      popular: false,
      cta: "Cotizar Mes"
    }
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-16 md:py-24 reveal-up">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Planes Flexibles para tu Negocio</h1>
        <p className="text-xl text-muted-foreground">
          Sin sorpresas ni contratos ocultos. Pagás solo por el tiempo que necesitas el equipo y te dedicas a generar ingresos.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        {plans.map((plan, i) => (
          <Card 
            key={i} 
            className={`group relative flex flex-col h-full border-2 transition-all duration-300 ease-in-out premium-card-glow ${plan.popular ? 'border-primary shadow-xl z-10 scale-105' : 'border-slate-100/50'}`}
          >
            <CardHeader className={`text-center flex-initial space-y-4 pt-10 pb-6 ${plan.popular ? 'bg-primary/5' : ''}`}>
              {plan.popular && (
                <div className="mb-2">
                  <span className="bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] py-1.5 px-4 rounded-full shadow-md">
                    Opción Más Elegida
                  </span>
                </div>
              )}
              <CardTitle className="text-2xl font-serif">{plan.name}</CardTitle>
              <CardDescription className="h-10 text-sm px-4">{plan.description}</CardDescription>
              <div className="pt-4 pb-2">
                <span className="text-5xl font-extrabold tracking-tight text-slate-900">{plan.price}</span>
                {plan.price !== "Consultar" && <span className="text-slate-500 font-bold ml-2 text-sm uppercase">ARS</span>}
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-8">
              <Button 
                size="lg" 
                className={`w-full h-12 rounded-xl font-bold transition-all hover:scale-[1.02] ${plan.popular ? 'btn-glint' : ''}`}
                variant={plan.popular ? 'default' : 'outline'} 
                render={
                  plan.name === "Mensual" ? (
                    <Link href={`https://wa.me/5492954631456?text=${encodeURIComponent("Hola! Me interesa consultar por el alquiler mensual del ADSS FG2000B.")}`} target="_blank" rel="noopener noreferrer" />
                  ) : (
                    <Link href="/alquiler" />
                  )
                }
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-24 text-center bg-muted/30 p-8 rounded-2xl border border-border/50 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">¿Necesitas un paquete a medida?</h3>
        <p className="text-muted-foreground mb-6">
          Ofrecemos descuentos por reservas anticipadas y para clientes frecuentes. Contáctanos para armar un plan que se ajuste a tus horarios de atención.
        </p>
        <Button variant="link" className="text-primary text-lg" render={<Link href="https://wa.me/5492954631456" target="_blank" rel="noopener noreferrer" />}>
          Hablar con ventas →
        </Button>
      </div>
    </div>
  );
}
