import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Printer, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Consentimiento Informado — Depilación Láser | Panel Profesional",
  description:
    "Documento de consentimiento informado para tratamiento de depilación láser con equipo ADSS FG2000B.",
  robots: "noindex, nofollow",
};

export default function ConsentimientoPacientePage() {
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

      <div className="max-w-3xl mx-auto px-6 py-16 print:py-8 print:px-8 space-y-10">

        {/* ── Header ── */}
        <div className="text-center space-y-4 pb-10 border-b border-[#EAE3D5] print:pb-6">
          <div className="flex justify-center mb-4">
            <div className="rounded-2xl bg-[#FCFAF5] border border-[#F3EBE1] p-4">
              <ShieldCheck className="h-8 w-8 text-[#B89B72]" />
            </div>
          </div>
          <span className="inline-block text-[10px] font-bold tracking-[0.3em] text-[#B89B72] uppercase mb-2">
            Documento Legal Oficial
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-none">
            Consentimiento Informado
          </h1>
          <p className="font-serif text-xl text-stone-500 font-medium">
            Tratamiento de Depilación Láser — ADSS FG2000B
          </p>
          <div className="flex justify-center gap-6 pt-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
            <span>Rev. 2024</span>
            <span className="text-[#D4AF37]">·</span>
            <span>MPA Alquiler — Centro de Belleza</span>
          </div>
        </div>

        {/* ── Datos del Paciente ── */}
        <section className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
            I. Datos del Paciente
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {[
              { label: "Apellido y Nombre", cols: 2 },
              { label: "DNI / Pasaporte" },
              { label: "Fecha de Nacimiento" },
              { label: "Teléfono de Contacto" },
              { label: "Correo Electrónico", cols: 2 },
            ].map((field) => (
              <div
                key={field.label}
                className={`border-b border-[#EAE3D5] pb-1 ${field.cols === 2 ? "md:col-span-2" : ""}`}
              >
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400 mb-2">
                  {field.label}
                </span>
                <div className="h-6" />
              </div>
            ))}
          </div>
        </section>

        {/* ── Declaración Jurada de Salud ── */}
        <section className="space-y-5 bg-white border border-[#EAE3D5] rounded-3xl p-8 print:rounded-none print:border-stone-200">
          <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
            II. Declaración Jurada de Estado de Salud
          </h2>
          <p className="text-sm text-stone-500 font-medium leading-relaxed">
            A continuación, el paciente declara sobre su estado de salud actual.
            Marque <strong className="text-stone-800">SÍ</strong> o <strong className="text-stone-800">NO</strong>{" "}
            según corresponda. Ante cualquier duda, consulte con el profesional antes de proceder.
          </p>
          <div className="space-y-4">
            {[
              "¿Se encuentra embarazada o en período de lactancia?",
              "¿Presenta alguna enfermedad autoinmune o fotosensibilidad diagnosticada?",
              "¿Está tomando o tomó isotretinoína en los últimos 6 meses?",
              "¿Usa fotosensibilizantes (antibióticos, diuréticos, ansiolíticos)?",
              "¿Posee marcapasos u otros implantes electrónicos activos?",
              "¿Tiene antecedentes de queloides o cicatrización queloide?",
              "¿Ha tenido herpes labial o genital activo en los últimos 30 días?",
              "¿Presentó bronceado solar o artificial en las últimas 4 semanas?",
              "¿Posee tatuajes o micropigmentación en la zona a tratar?",
              "¿Padece diabetes, epilepsia u otras enfermedades crónicas?",
            ].map((question, i) => (
              <div key={i} className="flex items-start gap-4 pb-3 border-b border-[#F3EBE1] last:border-0">
                <span className="text-[11px] font-bold text-[#B89B72] shrink-0 mt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="flex-1 text-sm text-stone-700 font-medium leading-relaxed">
                  {question}
                </p>
                <div className="flex gap-4 shrink-0 text-xs font-bold uppercase tracking-widest">
                  <label className="flex items-center gap-1.5 text-stone-500 cursor-pointer">
                    <span className="h-4 w-4 border border-stone-300 rounded inline-block" />
                    Sí
                  </label>
                  <label className="flex items-center gap-1.5 text-stone-500 cursor-pointer">
                    <span className="h-4 w-4 border border-stone-300 rounded inline-block" />
                    No
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Descripción del Tratamiento ── */}
        <section className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
            III. Descripción del Tratamiento y Riesgos
          </h2>
          <div className="prose prose-sm prose-stone max-w-none text-stone-600 space-y-4 text-sm font-medium leading-relaxed">
            <p>
              El tratamiento consiste en la aplicación de luz láser de diodo de triple longitud de onda
              (755 nm, 808 nm y 1064 nm) mediante el equipo ADSS FG2000B. La energía del láser es absorbida
              por la melanina del vello, destruyendo el folículo piloso de forma selectiva y sin dañar
              el tejido circundante.
            </p>
            <p>
              <strong className="text-stone-800">Efectos esperados y normales:</strong> El paciente puede
              presentar eritema (enrojecimiento) temporal, sensación de calor local y leve edema folicular
              durante las primeras 24–48 horas post-sesión. Estos efectos son completamente normales y
              se resuelven de manera espontánea.
            </p>
            <p>
              <strong className="text-stone-800">Riesgos poco frecuentes:</strong> En casos excepcionales y
              ante el incumplimiento de las indicaciones post-tratamiento, puede producirse hiperpigmentación
              o hipopigmentación transitoria, costras superficiales o, muy raramente, ampollas.
              La exposición solar sin protección FPS 50+ aumenta significativamente estos riesgos.
            </p>
            <p>
              <strong className="text-stone-800">Número de sesiones:</strong> La efectividad del tratamiento
              depende del fototipo, zona corporal, grosor y color del vello. Se recomienda entre 6 y 10
              sesiones separadas por intervalos de 4 a 8 semanas, según la zona a tratar.
            </p>
          </div>
        </section>

        {/* ── Autorización ── */}
        <section className="space-y-4 bg-stone-900 rounded-[2rem] p-8 text-white print:bg-white print:text-stone-900 print:border print:border-stone-200">
          <h2 className="font-serif text-2xl font-bold text-white print:text-stone-900 tracking-tight">
            IV. Autorización y Conformidad
          </h2>
          <p className="text-sm text-stone-300 print:text-stone-600 font-light leading-relaxed">
            Yo, el/la abajo firmante, declaro que he sido informado/a de manera clara y comprensible
            sobre el procedimiento, sus beneficios, posibles efectos secundarios y riesgos asociados.
            Otorgo mi conformidad para que el/la profesional habilitado/a realice el tratamiento
            de depilación láser utilizando el equipo ADSS FG2000B, bajo los estándares y protocolos
            vigentes de MPA Alquiler — Centro de Belleza.
          </p>
          <p className="text-sm text-stone-300 print:text-stone-600 font-light leading-relaxed">
            Declaro que toda la información proporcionada en esta declaración jurada es veraz y completa.
            Comprendo que omitir datos relevantes puede afectar la seguridad del tratamiento y que
            libero de responsabilidad al profesional actuante ante situaciones derivadas de información
            incorrecta o incompleta.
          </p>
        </section>

        {/* ── Firma ── */}
        <section className="space-y-8">
          <h2 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
            V. Firmas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Paciente */}
            <div className="space-y-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                Paciente
              </span>
              <div className="border-b border-stone-300 mt-10 mb-1" />
              <div className="space-y-3">
                <div className="border-b border-[#EAE3D5] pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400">Firma</span>
                  <div className="h-5" />
                </div>
                <div className="border-b border-[#EAE3D5] pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400">Aclaración</span>
                  <div className="h-5" />
                </div>
                <div className="border-b border-[#EAE3D5] pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400">DNI N°</span>
                  <div className="h-5" />
                </div>
                <div className="border-b border-[#EAE3D5] pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400">Fecha</span>
                  <div className="h-5" />
                </div>
              </div>
            </div>

            {/* Profesional */}
            <div className="space-y-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">
                Profesional Habilitado/a
              </span>
              <div className="border-b border-stone-300 mt-10 mb-1" />
              <div className="space-y-3">
                <div className="border-b border-[#EAE3D5] pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400">Firma</span>
                  <div className="h-5" />
                </div>
                <div className="border-b border-[#EAE3D5] pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400">Aclaración</span>
                  <div className="h-5" />
                </div>
                <div className="border-b border-[#EAE3D5] pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400">Matrícula / CUIT</span>
                  <div className="h-5" />
                </div>
                <div className="border-b border-[#EAE3D5] pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-400">Fecha</span>
                  <div className="h-5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="text-center text-[10px] text-stone-400 font-medium pt-6 border-t border-[#EAE3D5] space-y-1">
          <p>
            Documento válido solo con firma original de ambas partes. Se emite en dos (2) ejemplares,
            uno para el paciente y otro para el profesional actuante.
          </p>
          <p className="text-[#B89B72] font-bold uppercase tracking-widest">
            MPA Alquiler · Centro de Belleza · centrodebelleza.com.ar
          </p>
        </footer>
      </div>
    </div>
  );
}
