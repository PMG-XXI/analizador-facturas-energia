import { NaturgyParser } from "../../src/parser/naturgyParser";

describe("NaturgyParser", () => {
  it("parses 2.0TD invoice with period breakdown", () => {
    const text = `
      NATURGY
      CUPS: ES0021000001234567AB
      NIF: B12345678
      Fecha de factura: 15/02/2024
      Periodo de facturación: 01/01/2024 al 31/01/2024
      Tarifa de acceso: 2.0TD
      Consumo P1: 120,5 kWh
      Consumo P2: 98,4 kWh
      Consumo P3: 45,1 kWh
      Potencia contratada P1: 3,45 kW
      Potencia contratada P2: 3,45 kW
      Término de energía P1 0,144321 €/kWh
      Término de energía P2 0,099876 €/kWh
      Término de energía P3 0,082100 €/kWh
      Término de potencia P1 0,104229 €/kW día
      Término de potencia P2 0,009853 €/kW día
      Importe total: 86,54 €
    `;

    const parser = new NaturgyParser();
    const result = parser.parse(text);

    expect(result.provider).toBe("Naturgy");
    expect(result.cups).toBe("ES0021000001234567AB");
    expect(result.holderId).toBe("B12345678");
    expect(result.invoiceDate).toBe("15/02/2024");
    expect(result.billingPeriod).toEqual({ start: "01/01/2024", end: "31/01/2024" });
    expect(result.tariffType).toBe("2.0TD");
    expect(result.consumptionKwh).toEqual({
      P1: 120.5,
      P2: 98.4,
      P3: 45.1,
      total: 264.0,
    });
    expect(result.contractedPowerKw).toEqual({ P1: 3.45, P2: 3.45, P3: null });
    expect(result.energyTermEurPerKwh).toEqual({
      P1: 0.144321,
      P2: 0.099876,
      P3: 0.0821,
    });
    expect(result.powerTermEurPerKwDay).toEqual({
      P1: 0.104229,
      P2: 0.009853,
      P3: null,
    });
    expect(result.totalAmountEur).toBe(86.54);
  });

  it("parses invoice with single power and energy terms", () => {
    const text = `
      NATURGY
      CUPS ES0031401234567890CD
      CIF: A12345678
      Fecha de factura 05/03/2024
      Periodo de facturación 01/02/2024-29/02/2024
      Peaje de acceso: 3.0TD
      Consumo total: 1.234,0 kWh
      Potencia contratada: 15,0 kW
      Término de energía: 0,112345 €/kWh
      Término de potencia: 0,056789 €/kW día
      Total a pagar: 245,67 €
    `;

    const parser = new NaturgyParser();
    const result = parser.parse(text);

    expect(result.cups).toBe("ES0031401234567890CD");
    expect(result.holderId).toBe("A12345678");
    expect(result.tariffType).toBe("3.0TD");
    expect(result.consumptionKwh.total).toBe(1234.0);
    expect(result.contractedPowerKw.P1).toBe(15.0);
    expect(result.energyTermEurPerKwh.P1).toBe(0.112345);
    expect(result.powerTermEurPerKwDay.P1).toBe(0.056789);
    expect(result.totalAmountEur).toBe(245.67);
  });
});
