import { rest } from "msw";

const UPHOLD_SANDBOX_URL = "https://api-sandbox.uphold.com";

// Base exchange rates from USD
const baseRates: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CNY: 7.24,
  ARS: 1020.5,
  BRL: 5.67,
  DKK: 6.88,
  HKD: 7.83,
  INR: 83.25,
  MXN: 17.15,
  CHF: 0.88,
  BTC: 0.000014,
  ETH: 0.00042,
};

// Generate all currency pairs dynamically
function generateTickers() {
  const tickers = [];
  const currencies = Object.keys(baseRates);

  for (const from of currencies) {
    for (const to of currencies) {
      if (from !== to) {
        const fromToUsd = 1 / baseRates[from];
        const rate = fromToUsd * baseRates[to];
        const spread = rate * 0.001; // 0.1% spread

        tickers.push({
          pair: `${from}${to}`,
          ask: (rate + spread).toString(),
          bid: (rate - spread).toString(),
          currency: to,
        });
      }
    }
  }

  return tickers;
}

const mockTickers = generateTickers();

export const handlers = [
  // Get all tickers
  rest.get(`${UPHOLD_SANDBOX_URL}/v0/ticker`, (req, res, ctx) => {
    return res(ctx.json(mockTickers));
  }),

  // Get specific ticker pair
  rest.get(`${UPHOLD_SANDBOX_URL}/v0/ticker/:pair`, (req, res, ctx) => {
    const { pair } = req.params;
    const ticker = mockTickers.find((t) => t.pair === pair);

    if (!ticker) {
      // If not found, try to calculate it on the fly
      const pairStr = pair as string;

      // Try to parse the pair (find where quote currency starts)
      for (const currency of Object.keys(baseRates)) {
        if (pairStr.endsWith(currency) && pairStr !== currency) {
          const from = pairStr.slice(0, -currency.length);
          const to = currency;

          if (baseRates[from] && baseRates[to]) {
            const fromToUsd = 1 / baseRates[from];
            const rate = fromToUsd * baseRates[to];
            const spread = rate * 0.001;

            return res(
              ctx.json({
                pair: pairStr,
                ask: (rate + spread).toString(),
                bid: (rate - spread).toString(),
                currency: to,
              }),
            );
          }
        }
      }

      return res(ctx.status(404), ctx.json({ error: "Ticker not found" }));
    }

    return res(ctx.json(ticker));
  }),
];
