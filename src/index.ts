import express from "express";
import { parsePdfFactura } from "./parser/pdfParser";
import { compareTarifas } from "./comparator/tarifasComparator";
import { Tarifa, FacturaResultado } from "./types";

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/parse", async (_req, res) => {
  try {
    // Placeholder: implementar carga de archivos y lectura del PDF
    const resultado = await parsePdfFactura(Buffer.from(""));
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: "No se pudo procesar la factura." });
  }
});

app.post("/api/compare", async (req, res) => {
  try {
    const factura = req.body.factura as FacturaResultado;
    const tarifas = req.body.tarifas as Tarifa[];
    const comparacion = compareTarifas(factura, tarifas);
    res.json(comparacion);
  } catch (error) {
    res.status(400).json({ error: "Datos inválidos para comparar tarifas." });
  }
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor escuchando en puerto ${port}`);
});
