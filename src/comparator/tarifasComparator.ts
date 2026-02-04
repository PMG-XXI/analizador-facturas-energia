import { ComparacionTarifa, FacturaResultado, Tarifa } from "../types";

export const compareTarifas = (
  factura: FacturaResultado,
  tarifas: Tarifa[]
): ComparacionTarifa[] => {
  if (!factura || !tarifas) {
    return [];
  }

  return tarifas.map((tarifa) => {
    const costeEstimado = factura.consumoKwh * tarifa.precioKwh + tarifa.costeFijoMensual;
    const ahorroEstimado = factura.importeTotal - costeEstimado;

    return {
      proveedor: tarifa.proveedor,
      nombreTarifa: tarifa.nombre,
      costeEstimado,
      ahorroEstimado
    };
  });
};
