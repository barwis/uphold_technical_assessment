export interface UpholdTicker {
  ask: string;
  bid: string;
  currency: string;
  pair: string;
}

export interface Currency {
  code: string;
}

export interface CurrencyExchangeRate {
  code: string;
  rate: number;
  amount: number;
}
