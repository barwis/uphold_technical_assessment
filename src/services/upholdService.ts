import SDK from '@uphold/uphold-sdk-javascript';
import type { Currency, UpholdTicker } from '../types/uphold';
import { createBrowserStorage } from './BrowserStorage';
import { createFetchClient } from './FetchClient';

const sdk = new SDK({
  baseUrl: 'https://api-sandbox.uphold.com',
  clientId: 'foo',
  clientSecret: 'bar',
});

// Manually provide client and storage for browser environment
type SDKWithClient = typeof sdk & {
  client: ReturnType<typeof createFetchClient>;
  storage: ReturnType<typeof createBrowserStorage>;
};

(sdk as SDKWithClient).client = createFetchClient();
(sdk as SDKWithClient).storage = createBrowserStorage();

// Cache for all tickers to avoid multiple API calls
let tickersCache: UpholdTicker[] | null = null;

async function getAllTickers(): Promise<UpholdTicker[]> {
  if (!tickersCache) {
    tickersCache = await sdk.getTicker();
  }
  return tickersCache;
}

async function getAllCurrencies(): Promise<Currency[]> {
  const tickers = await getAllTickers();

  const currencySet = new Set<string>();

  tickers.forEach((ticker: UpholdTicker) => {
    // Parse pair format: "BTCUSD" with currency="USD" → base="BTC", quote="USD"
    const quote = ticker.currency;
    const base = ticker.pair.slice(0, -quote.length);

    currencySet.add(base);
    currencySet.add(quote);
  });

  const currencies = Array.from(currencySet)
    .sort()
    .map((code) => ({
      code,
    }));

  return currencies;
}

async function getExchangeRate(
  from: string,
  to: string,
): Promise<number> {
  const tickers = await getAllTickers();
  const pair = `${from}${to}`;
  const ticker = tickers.find((t) => t.pair === pair);

  if (!ticker) {
    throw new Error(`Exchange rate not found for pair ${pair}`);
  }

  return parseFloat(ticker.ask);
}

function refreshTickers(): void {
  tickersCache = null;
}

export const upholdService = {
  getAllCurrencies,
  getExchangeRate,
  refreshTickers,
};
