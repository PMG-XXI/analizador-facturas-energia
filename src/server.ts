import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NaturgyParser } from "./parser/naturgyParser";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");

app.use(express.json());
app.use(express.static(publicDir));

const detectProvider = (text: string): "Naturgy" | null => {
  if (/\bnaturgy\b/i.test(text)) {
    return "Naturgy";
  }
  if (/CUPS\s*[:\-]?\s*ES\d{16,18}/i.test(text)) {
    return "Naturgy";
  }
  return null;
};

app.post("/api/parse", upload.single("file"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No se ha subido ningún archivo PDF." });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ error: "El archivo debe ser un PDF válido." });
    }

    const pdfData = await pdfParse(req.file.buffer);
    const text = pdfData.text ?? "";
    const provider = detectProvider(text);

    if (!provider) {
      return res.status(422).json({ error: "Proveedor no reconocido en el PDF." });
    }

    if (provider === "Naturgy") {
      const parser = new NaturgyParser();
      const parsed = parser.parse(text);
      return res.json({ provider, parsed });
    }

    return res.status(422).json({ error: "Proveedor no soportado." });
  } catch (error) {
    return next(error);
  }
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ error: "No se ha podido procesar el PDF." });
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
