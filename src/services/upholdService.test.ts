import { upholdService } from "./upholdService";

describe("upholdService", () => {
  describe("getAllCurrencies", () => {
    it("should fetch and parse currencies from tickers", async () => {
      const currencies = await upholdService.getAllCurrencies();

      expect(currencies).toBeDefined();
      expect(Array.isArray(currencies)).toBe(true);
      expect(currencies.length).toBeGreaterThan(0);

      const firstCurrency = currencies[0];
      expect(firstCurrency).toHaveProperty("code");
      expect(typeof firstCurrency.code).toBe("string");
    });

    it("should return unique currencies sorted alphabetically", async () => {
      const currencies = await upholdService.getAllCurrencies();

      const codes = currencies.map((c) => c.code);
      const uniqueCodes = [...new Set(codes)];

      expect(codes).toEqual(uniqueCodes);

      const sortedCodes = [...codes].sort();
      expect(codes).toEqual(sortedCodes);
    });

    it("should include common currencies", async () => {
      const currencies = await upholdService.getAllCurrencies();
      const codes = currencies.map((c) => c.code);

      expect(codes).toContain("USD");
      expect(codes).toContain("EUR");
      expect(codes).toContain("GBP");
    });
  });

  describe("getExchangeRate", () => {
    it("should fetch exchange rate for a currency pair", async () => {
      const rate = await upholdService.getExchangeRate("USD", "EUR");

      expect(typeof rate).toBe("number");
      expect(rate).toBeGreaterThan(0);
    });

    it("should return different rates for different pairs", async () => {
      const usdToEur = await upholdService.getExchangeRate("USD", "EUR");
      const usdToGbp = await upholdService.getExchangeRate("USD", "GBP");

      expect(usdToEur).not.toBe(usdToGbp);
    });
  });
});
