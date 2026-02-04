import {
  ParsedInvoice,
  ConsumptionByPeriod,
  PowerByPeriod,
  TermByPeriod,
} from "../types";
import { BaseParser } from "./baseParser";

export class NaturgyParser extends BaseParser {
  parse(text: string): ParsedInvoice {
    const normalized = this.normalizeText(text);

    const cups = this.extractMatch(/CUPS\s*[:\-]?\s*([A-Z0-9]{20,22})/i, normalized);
    const holderId = this.extractMatch(/(?:NIF|CIF|NIE)\s*[:\-]?\s*([A-Z0-9]{8,9})/i, normalized);
    const invoiceDate = this.extractMatch(
      /Fecha\s+de\s+factura\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4})/i,
      normalized,
    );

    const billingPeriodRaw = this.extractMatch(
      /Periodo\s+de\s+facturaci[oó]n\s*[:\-]?\s*(\d{2}\/\d{2}\/\d{4}\s*(?:al|a|-)\s*\d{2}\/\d{2}\/\d{4})/i,
      normalized,
    );
    const billingPeriod = this.parseDateRange(billingPeriodRaw);

    const tariffType = this.extractMatch(
      /(?:Tarifa|Peaje\s+de\s+acceso)\s*(?:de\s*acceso)?\s*[:\-]?\s*([0-9.]{1,4}[A-Z]{0,2})/i,
      normalized,
    );

    const consumptionKwh = this.parseConsumption(normalized);
    const contractedPowerKw = this.parseContractedPower(normalized);
    const energyTermEurPerKwh = this.parseEnergyTerm(normalized);
    const powerTermEurPerKwDay = this.parsePowerTerm(normalized);

    const totalAmountEur = this.parseNumber(
      this.extractMatch(/Importe\s+total\s*[:\-]?\s*([\d.,]+)\s*€?/i, normalized) ||
        this.extractMatch(/Total\s+a\s+pagar\s*[:\-]?\s*([\d.,]+)\s*€?/i, normalized),
    );

    return {
      provider: "Naturgy",
      cups,
      holderId,
      invoiceDate,
      billingPeriod,
      tariffType,
      consumptionKwh,
      contractedPowerKw,
      energyTermEurPerKwh,
      powerTermEurPerKwDay,
      totalAmountEur,
    };
  }

  private parseConsumption(text: string): ConsumptionByPeriod {
    const consumption = this.buildEmptyPeriods();

    consumption.P1 = this.parseNumber(
      this.extractMatch(/P1\s*[:\-]?\s*([\d.,]+)\s*kWh/i, text),
    );
    consumption.P2 = this.parseNumber(
      this.extractMatch(/P2\s*[:\-]?\s*([\d.,]+)\s*kWh/i, text),
    );
    consumption.P3 = this.parseNumber(
      this.extractMatch(/P3\s*[:\-]?\s*([\d.,]+)\s*kWh/i, text),
    );
    consumption.total = this.parseNumber(
      this.extractMatch(/Consumo\s+total\s*[:\-]?\s*([\d.,]+)\s*kWh/i, text),
    );

    if (!consumption.total) {
      const sum = [consumption.P1, consumption.P2, consumption.P3]
        .filter((value): value is number => value !== null)
        .reduce((acc, value) => acc + value, 0);
      consumption.total = sum > 0 ? sum : null;
    }

    return consumption;
  }

  private parseContractedPower(text: string): PowerByPeriod {
    const power = this.buildEmptyPower();

    power.P1 = this.parseNumber(
      this.extractMatch(/Potencia\s+contratada\s*P1\s*[:\-]?\s*([\d.,]+)\s*kW/i, text),
    );
    power.P2 = this.parseNumber(
      this.extractMatch(/Potencia\s+contratada\s*P2\s*[:\-]?\s*([\d.,]+)\s*kW/i, text),
    );
    power.P3 = this.parseNumber(
      this.extractMatch(/Potencia\s+contratada\s*P3\s*[:\-]?\s*([\d.,]+)\s*kW/i, text),
    );

    if (!power.P1 && !power.P2 && !power.P3) {
      const single = this.parseNumber(
        this.extractMatch(/Potencia\s+contratada\s*[:\-]?\s*([\d.,]+)\s*kW/i, text),
      );
      power.P1 = single;
    }

    return power;
  }

  private parseEnergyTerm(text: string): TermByPeriod {
    const term = this.buildEmptyTerms();

    term.P1 = this.parseNumber(
      this.extractMatch(/P1[^\d]*(?:energ[íi]a)?[^\d]*([\d.,]+)\s*€\s*\/\s*kWh/i, text),
    );
    term.P2 = this.parseNumber(
      this.extractMatch(/P2[^\d]*(?:energ[íi]a)?[^\d]*([\d.,]+)\s*€\s*\/\s*kWh/i, text),
    );
    term.P3 = this.parseNumber(
      this.extractMatch(/P3[^\d]*(?:energ[íi]a)?[^\d]*([\d.,]+)\s*€\s*\/\s*kWh/i, text),
    );

    if (!term.P1 && !term.P2 && !term.P3) {
      const single = this.parseNumber(
        this.extractMatch(/T[ée]rmino\s+de\s+energ[íi]a[^\d]*([\d.,]+)\s*€\s*\/\s*kWh/i, text),
      );
      term.P1 = single;
    }

    return term;
  }

  private parsePowerTerm(text: string): TermByPeriod {
    const term = this.buildEmptyTerms();

    term.P1 = this.parseNumber(
      this.extractMatch(/P1[^\d]*([\d.,]+)\s*€\s*\/\s*kW\s*d[ií]a/i, text),
    );
    term.P2 = this.parseNumber(
      this.extractMatch(/P2[^\d]*([\d.,]+)\s*€\s*\/\s*kW\s*d[ií]a/i, text),
    );
    term.P3 = this.parseNumber(
      this.extractMatch(/P3[^\d]*([\d.,]+)\s*€\s*\/\s*kW\s*d[ií]a/i, text),
    );

    if (!term.P1 && !term.P2 && !term.P3) {
      const single = this.parseNumber(
        this.extractMatch(/T[ée]rmino\s+de\s+potencia[^\d]*([\d.,]+)\s*€\s*\/\s*kW\s*d[ií]a/i, text),
      );
      term.P1 = single;
    }

    return term;
  }
}
