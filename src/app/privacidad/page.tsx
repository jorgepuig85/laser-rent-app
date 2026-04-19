export default function PrivacidadPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 pt-32 pb-16 md:pb-24">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 border-b pb-4 border-[--seasonal-primary]/20">
          Política de Privacidad
        </h1>
        
        <div className="prose prose-slate max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Protección de Datos Personales</h2>
            <p className="text-slate-600 leading-relaxed">
              En cumplimiento con la <strong>Ley 25.326 de Protección de Datos Personales</strong>, Centro de Belleza garantiza que la información proporcionada por los profesionales (incluyendo datos de contacto y CUIT) es tratada con absoluta confidencialidad.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-slate-800 mb-4">Finalidad de la Información</h2>
            <p className="text-slate-600 leading-relaxed">
              Los datos recolectados tienen como única finalidad la gestión administrativa de los contratos de alquiler, la facturación legal y la optimización de los servicios logísticos en las zonas de Santa Rosa y Miguel Riglos. No compartimos información con terceros sin consentimiento previo.
            </p>
          </section>

          <section className="bg-slate-50 p-6 rounded-lg border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Confidencialidad Profesional</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Entendemos el valor estratégico de su base de clientes y su información comercial. Mantenemos políticas estrictas para asegurar que su relación con nosotros sea segura y privada.
            </p>
          </section>

          <section className="pt-8 border-t border-slate-100">
            <p className="text-sm text-slate-400">
              Para consultas sobre sus datos, puede contactarnos a: <a href="mailto:notificaciones@laserrent.com.ar" className="text-[--seasonal-primary] hover:underline">notificaciones@laserrent.com.ar</a>
            </p>
            <p className="text-sm text-slate-400 mt-2">
              Última actualización: Abril 2026.
            </p>
          </section>
        </div>
      </main>
  );
}
