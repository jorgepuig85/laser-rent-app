export const COSTO_ALQUILER_DIARIO = 75000;
export const PRECIO_SESION_ESTIMADO = 15000;

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(amount);
};
