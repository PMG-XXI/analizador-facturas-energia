export interface BillingPeriod {
  start: string | null;
  end: string | null;
}

export interface ConsumptionByPeriod {
  P1: number | null;
  P2: number | null;
  P3: number | null;
  total: number | null;
}

export interface PowerByPeriod {
  P1: number | null;
  P2: number | null;
  P3: number | null;
}

export interface TermByPeriod {
  P1: number | null;
  P2: number | null;
  P3: number | null;
}

export interface ParsedInvoice {
  provider: string;
  cups: string | null;
  holderId: string | null;
  invoiceDate: string | null;
  billingPeriod: BillingPeriod;
  tariffType: string | null;
  consumptionKwh: ConsumptionByPeriod;
  contractedPowerKw: PowerByPeriod;
  energyTermEurPerKwh: TermByPeriod;
  powerTermEurPerKwDay: TermByPeriod;
  totalAmountEur: number | null;
}
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
