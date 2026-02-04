import {
  BillingPeriod,
  ConsumptionByPeriod,
  ParsedInvoice,
  PowerByPeriod,
  TermByPeriod,
} from "../types";

export abstract class BaseParser {
  abstract parse(text: string): ParsedInvoice;

  protected normalizeText(text: string): string {
    return text
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  protected extractMatch(regex: RegExp, text: string): string | null {
    const match = text.match(regex);
    if (!match) {
      return null;
    }
    return match[1]?.trim() ?? null;
  }

  protected parseNumber(value: string | null): number | null {
    if (!value) {
      return null;
    }
    const normalized = value.replace(/\./g, "").replace(/,/g, ".");
    const numberValue = Number.parseFloat(normalized);
    return Number.isNaN(numberValue) ? null : numberValue;
  }

  protected parseDateRange(value: string | null): BillingPeriod {
    if (!value) {
      return { start: null, end: null };
    }
    const match = value.match(/(\d{2}\/\d{2}\/\d{4})\s*(?:al|a|-)+\s*(\d{2}\/\d{2}\/\d{4})/i);
    if (!match) {
      return { start: null, end: null };
    }
    return { start: match[1], end: match[2] };
  }

  protected buildEmptyPeriods(): ConsumptionByPeriod {
    return { P1: null, P2: null, P3: null, total: null };
  }

  protected buildEmptyPower(): PowerByPeriod {
    return { P1: null, P2: null, P3: null };
  }

  protected buildEmptyTerms(): TermByPeriod {
    return { P1: null, P2: null, P3: null };
  }
}
