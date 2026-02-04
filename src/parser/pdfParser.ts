import pdf from "pdf-parse";
import { FacturaResultado } from "../types";

export const parsePdfFactura = async (buffer: Buffer): Promise<FacturaResultado> => {
  if (!buffer || buffer.length === 0) {
    return {
      proveedor: "desconocido",
      numeroFactura: "",
      fechaEmision: "",
      consumoKwh: 0,
      importeTotal: 0,
      rawText: ""
    };
  }

  const data = await pdf(buffer);

  return {
    proveedor: "pendiente",
    numeroFactura: "",
    fechaEmision: "",
    consumoKwh: 0,
    importeTotal: 0,
    rawText: data.text
  };
};
