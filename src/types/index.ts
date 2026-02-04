export type FacturaResultado = {
  proveedor: string;
  numeroFactura: string;
  fechaEmision: string;
  consumoKwh: number;
  importeTotal: number;
  rawText: string;
};

export type Tarifa = {
  proveedor: string;
  nombre: string;
  precioKwh: number;
  costeFijoMensual: number;
};

export type ComparacionTarifa = {
  proveedor: string;
  nombreTarifa: string;
  costeEstimado: number;
  ahorroEstimado: number;
};
