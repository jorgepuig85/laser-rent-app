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
    .from('rental_prices')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching rental_prices:", error);
  }

  // Currency formatter for es-AR
  const formatter = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const dailyRate = tarifaData?.daily_rate || 0;
  const weeklyRate = tarifaData?.weekly_rate || (dailyRate * 6);

  const baseDia = dailyRate > 0 ? formatter.format(dailyRate) : "Consultar";
  const baseSemana = weeklyRate > 0 ? formatter.format(weeklyRate) : "Consultar";

  const PRECIO_SESION = 15000;

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
      tag: "Ideal para empezar",
      sessionsEquivalent: dailyRate > 0 ? Math.ceil(dailyRate / PRECIO_SESION) : 0,
      cta: "Reservar este plan"
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
      tag: "Máxima Rentabilidad",
      sessionsEquivalent: weeklyRate > 0 ? Math.ceil(weeklyRate / PRECIO_SESION) : 0,
      cta: "Reservar este plan"
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
      tag: "",
      sessionsEquivalent: 0,
      cta: "Cotizar Mes"
    }
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-16 md:py-24 reveal-up">
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Planes Flexibles para tu Negocio</h1>
        <p className="text-xl text-muted-foreground">
          Sin sorpresas ni contratos ocultos. Pag&aacute;s solo por el tiempo que necesitas el equipo y te dedicas a generar ingresos.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        {plans.map((plan, i) => (
          <Card 
            key={i} 
            className={`group relative flex flex-col h-full border-2 transition-all duration-300 ease-in-out premium-card-glow ${plan.popular ? 'border-primary shadow-xl z-10 scale-105' : 'border-slate-100/50'}`}
          >
            <CardHeader className={`text-center flex-initial space-y-4 pt-10 pb-6 ${plan.popular ? 'bg-primary/5' : ''}`}>
              {plan.tag && (
                <div className="mb-2">
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] py-1.5 px-4 rounded-full shadow-md ${plan.popular ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700'}`}>
                    {plan.tag}
                  </span>
                </div>
              )}
              <CardTitle className="text-2xl font-serif">{plan.name}</CardTitle>
              <CardDescription className="h-10 text-sm px-4">{plan.description}</CardDescription>
              <div className="pt-4 pb-2">
                <span className="text-5xl font-extrabold tracking-tight text-slate-900 font-serif">{plan.price}</span>
                {plan.price !== "Consultar" && <span className="text-slate-500 font-bold ml-2 text-sm uppercase">ARS</span>}
                {plan.sessionsEquivalent > 0 && (
                  <p className="text-xs text-slate-500 mt-3 font-semibold bg-slate-100/50 py-1.5 px-3 rounded-md inline-block">Equivale a solo {plan.sessionsEquivalent} sesiones de tus clientes</p>
                )}
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
              <Link 
                href={`https://wa.me/5492954631456?text=${encodeURIComponent(`Hola! Quiero más info sobre el plan ${plan.name} de ${plan.price}`)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button 
                  size="lg" 
                  className={`w-full h-12 rounded-xl font-bold transition-all hover:scale-[1.02] ${plan.popular ? 'btn-glint' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'} 
                >
                  {plan.cta}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-24 text-center bg-muted/30 p-8 rounded-2xl border border-border/50 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold mb-4">¿Necesitas un paquete a medida?</h3>
        <p className="text-muted-foreground mb-6">
          Ofrecemos descuentos por reservas anticipadas y para clientes frecuentes. Contáctanos para armar un plan que se ajuste a tus horarios de atención.
        </p>
        <Link href="https://wa.me/5492954631456" target="_blank" rel="noopener noreferrer">
          <Button variant="link" className="text-primary text-lg">
            Hablar con ventas →
          </Button>
        </Link>
      </div>
    </div>
  );
}
