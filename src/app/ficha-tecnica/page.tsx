import type { Metadata } from "next";
import Link from "next/link";
import {
  Zap,
  Thermometer,
  Layers,
  Activity,
  Cpu,
  Star,
  ArrowLeft,
  Printer,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Ficha Técnica — ADSS FG2000B | Panel Profesional",
  description:
    "Especificaciones técnicas completas del equipo ADSS FG2000B Trío Láser de diodo para depilación definitiva.",
  robots: "noindex, nofollow",
};

const SPECS = [
  {
    icon: Cpu,
    category: "Tecnología",
    value: "Láser de Diodo Triple Onda",
    detail: "755 nm · 808 nm · 1064 nm — Alexandrita, Diodo e Nd:YAG simultáneos",
  },
  {
    icon: Zap,
    category: "Potencia de Salida",
    value: "1200 W (pico)",
    detail: "Pieza de mano de alta densidad energética con cobertura uniforme del spot",
  },
  {
    icon: Thermometer,
    category: "Sistema de Enfriamiento",
    value: "TEC + Cristal de Zafiro",
    detail: "Temperatura de contacto: -5 °C a +5 °C. Enfriamiento continuo durante el pulso",
  },
  {
    icon: Layers,
    category: "Fototipos Compatibles",
    value: "Tipo I al VI (Fitzpatrick)",
    detail:
      "Apto para piel clara, morena u oscura. Incluye bronceados recientes con ajuste de parámetros",
  },
  {
    icon: Activity,
    category: "Fluencia (Densidad de Energía)",
    value: "Hasta 120 J/cm²",
    detail: "Regulable según zona corporal, fototipo y sensibilidad del paciente",
  },
  {
    icon: Star,
    category: "Modo de Disparo",
    value: "Continuo (In-Motion) / Estático",
    detail:
      "Modo In-Motion ideal para zonas grandes. Modo estático para zonas sensibles y precisas",
  },
];

const INDICATIONS = [
  "Depilación definitiva en rostro y cuerpo",
  "Todos los fototipos de piel (I–VI según Fitzpatrick)",
  "Piel con vello rubio, castaño, rojizo u oscuro",
  "Zonas delicadas: labio, axilas, bikini, ingles, lomo y zona perianal",
  "Pieles bronceadas con precaución y ajuste de parámetros",
];

const CONTRAINDICATIONS = [
  "Embarazo o lactancia",
  "Epilepsia fotosensible",
  "Marcapasos u otros implantes electrónicos activos",
  "Uso de isotretinoína en los últimos 6 meses",
  "Herpes activo o infección en la zona a tratar",
  "Tatuajes o micropigmentación en la zona de trabajo",
  "Queloides o cicatrices activas",
];

export default function FichaTecnicaPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] print:bg-white">
      {/* Top nav — hidden when printing */}
      <div className="print:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#EAE3D5] px-6 py-4 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[#B89B72] hover:text-stone-800 text-xs font-bold uppercase tracking-widest transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al Panel
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-[#D4AF37] text-xs font-bold uppercase tracking-widest px-5 py-2.5 hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-md"
        >
          <Printer className="h-4 w-4" />
          Imprimir / PDF
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 print:py-8 print:px-8 space-y-14">

        {/* ── Header ── */}
        <div className="text-center space-y-4 pb-10 border-b border-[#EAE3D5] print:pb-6">
          <span className="inline-block text-[10px] font-bold tracking-[0.3em] text-[#B89B72] uppercase mb-2">
            Documento Técnico Oficial
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-none">
            Ficha Técnica Profesional
          </h1>
          <p className="font-serif text-2xl text-[#B89B72] font-semibold tracking-wide">
            ADSS FG2000B — Trío Láser
          </p>
          <p className="text-sm text-stone-400 font-medium max-w-lg mx-auto leading-relaxed">
            Equipo de depilación láser de diodo de triple longitud de onda,
            apto para todos los fototipos de piel según la escala de Fitzpatrick.
          </p>
          <div className="flex justify-center gap-6 pt-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            <span>Rev. 2024</span>
            <span className="text-[#D4AF37]">·</span>
            <span>Centro de Belleza — MPA Alquiler</span>
          </div>
        </div>

        {/* ── Especificaciones ── */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
            Especificaciones Técnicas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SPECS.map((spec) => {
              const Icon = spec.icon;
              return (
                <div
                  key={spec.category}
                  className="bg-white border border-[#EAE3D5] rounded-3xl p-6 space-y-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)] print:shadow-none print:border-stone-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-[#FCFAF5] border border-[#F3EBE1] p-2.5">
                      <Icon className="h-4 w-4 text-[#B89B72]" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                      {spec.category}
                    </span>
                  </div>
                  <p className="font-serif text-xl font-bold text-stone-900 leading-tight">
                    {spec.value}
                  </p>
                  <p className="text-xs text-stone-500 leading-relaxed font-medium">
                    {spec.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Indicaciones / Contraindicaciones ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              Indicaciones
            </h2>
            <ul className="space-y-2.5">
              {INDICATIONS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-stone-600 font-medium leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[#B89B72] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
          <section className="space-y-4">
            <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
              Contraindicaciones
            </h2>
            <ul className="space-y-2.5">
              {CONTRAINDICATIONS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-stone-600 font-medium leading-relaxed">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-stone-300 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ── Protocolo de Uso ── */}
        <section className="space-y-4 bg-stone-900 rounded-[2rem] p-8 text-white print:bg-white print:text-stone-900 print:border print:border-stone-200">
          <h2 className="font-serif text-2xl font-bold text-white print:text-stone-900 tracking-tight">
            Protocolo de Aplicación Recomendado
          </h2>
          <ol className="space-y-3 list-decimal list-inside">
            {[
              "Realizar anamnesis completa e historial del paciente.",
              "Limpiar y rasurar la zona a tratar el día de la sesión.",
              "Aplicar gel conductor o utilizar modo In-Motion sin gel según protocolo elegido.",
              "Configurar parámetros según fototipo y zona (ver tabla de parámetros adjunta).",
              "Realizar pulso de prueba y esperar reacción 5 minutos.",
              "Proceder con el tratamiento, solapando un 20% para cobertura total.",
              "Al finalizar, aplicar aloe vera o crema calmante. Protector solar FPS 50+ obligatorio.",
            ].map((step, i) => (
              <li key={i} className="text-sm text-stone-300 print:text-stone-600 font-medium leading-relaxed">
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* ── Footer legal ── */}
        <footer className="text-center text-[10px] text-stone-400 font-medium pt-4 border-t border-[#EAE3D5] space-y-1">
          <p>
            Este documento es de uso exclusivo para profesionales habilitados que alquilan el equipo a través de MPA Alquiler.
          </p>
          <p className="text-[#B89B72] font-bold uppercase tracking-widest">
            Centro de Belleza · centrodebelleza.com.ar
          </p>
        </footer>
      </div>
    </div>
  );
}
