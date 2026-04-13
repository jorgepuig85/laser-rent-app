export default function TerminosPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 pt-32 pb-16 md:pb-24">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 border-b pb-4 border-[--seasonal-primary]/20">
          Términos y Condiciones
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">1. Uso del Equipo</h2>
            <p className="text-slate-600 leading-relaxed">
              El cliente asume la responsabilidad total por el uso adecuado de los equipos de láser rentados. Es obligatorio que el personal operario cuente con la capacitación técnica necesaria para garantizar la seguridad del paciente y la integridad de la tecnología. Cualquier daño derivado de un uso negligente o contrario a las especificaciones técnicas será responsabilidad exclusiva del locatario.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">2. Política de Cancelación</h2>
            <div className="bg-amber-50 border-l-4 border-[--seasonal-primary] p-6 rounded-r-lg">
              <p className="text-amber-900 font-medium italic">
                &quot;Las jornadas de alquiler deben ser confirmadas con antelación. En caso de requerir una cancelación o reprogramación, se solicita un aviso mínimo de 48 horas de anticipación.&quot;
              </p>
              <p className="text-amber-800 text-sm mt-4 leading-relaxed">
                De no cumplir con este plazo, se podrá aplicar un cargo administrativo equivalente a una parte del canon de alquiler pactado, dada la logística y reserva de turno ya comprometida.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">3. Logística y Entrega</h2>
            <p className="text-slate-600 leading-relaxed">
              Centro de Belleza se compromete a entregar los equipos en óptimas condiciones de funcionamiento. El cliente deberá verificar el estado del equipo al momento de la recepción.
            </p>
          </section>

          <section className="pt-8 border-t border-slate-100">
            <p className="text-sm text-slate-400">
              Última actualización: Abril 2026. Al utilizar nuestros servicios, usted acepta estos términos.
            </p>
          </section>
        </div>
      </main>
  );
}
