import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import {
  CurrencyIcon,
  CurrencyInput,
  CurrencyList,
  CurrencySelector,
  Footer,
  Header,
} from "./components";
import type { CurrencySelectorOption } from "./components";
import { useDebounce } from "./hooks";
import { upholdService } from "./services/upholdService";
import type { Currency, CurrencyExchangeRate } from "./types/uphold";

function App() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("USD");
  const [inputAmount, setInputAmount] = useState<string>("0");
  const [exchangeRates, setExchangeRates] = useState<CurrencyExchangeRate[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const isInitialMount = useRef(true);

  // Debounce input amount to avoid excessive calculations while typing
  const debouncedInputAmount = useDebounce(inputAmount, 500);

  // Fetch all currencies on mount
  useEffect(() => {
    upholdService
      .getAllCurrencies()
      .then((data) => {
        setCurrencies(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load currencies:", error);
        setLoading(false);
      });
  }, []);

  // Calculate exchange rates
  const calculateExchangeRates = useCallback(
    async (amount: number, fromCurrency: string) => {
      if (!amount || amount <= 0 || currencies.length === 0) {
        setExchangeRates([]);
        return;
      }

      setCalculating(true);

      try {
        const rates = await Promise.all(
          currencies
            .filter((currency) => currency.code !== fromCurrency)
            .map(async (currency) => {
              try {
                const rate = await upholdService.getExchangeRate(
                  fromCurrency,
                  currency.code,
                );
                return {
                  code: currency.code,
                  rate,
                  amount: amount * rate,
                };
              } catch (error) {
                console.warn(
                  `Failed to get rate for ${fromCurrency} to ${currency.code}`,
                );
                return null;
              }
            }),
        );

        setExchangeRates(
          rates.filter((r): r is CurrencyExchangeRate => r !== null),
        );
      } catch (error) {
        console.error("Failed to calculate exchange rates:", error);
      } finally {
        setCalculating(false);
      }
    },
    [currencies],
  );

  // Calculate rates when debounced input amount or selected currency changes
  useEffect(() => {
    const amount = parseFloat(debouncedInputAmount);
    if (!isNaN(amount) && selectedCurrency) {
      calculateExchangeRates(amount, selectedCurrency);
    }
  }, [debouncedInputAmount, selectedCurrency, calculateExchangeRates]);

  // Refetch tickers in background when currency changes
  useEffect(() => {
    // Skip on initial mount, only refresh when user changes currency
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (selectedCurrency && currencies.length > 0) {
      // Clear cache and refetch fresh ticker data
      upholdService.refreshTickers();
      upholdService.getAllCurrencies().catch(() => {
        // Ignore errors on background refresh
      });
    }
  }, [selectedCurrency, currencies.length]);

  const handleValueChange = (value: string | undefined) => {
    setInputAmount(value || "0");
  };

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
  };

  const currencyOptions: CurrencySelectorOption[] = currencies.map(
    (currency) => ({
      value: currency.code,
      label: `${currency.code}`,
      icon: <CurrencyIcon currencyCode={currency.code} />,
    }),
  );

  const isFormDisabled = loading || currencies.length === 0;
  const isStale = inputAmount !== debouncedInputAmount;

  return (
    <div className="App">
      <Header />
      <main>
        <h1>Currency Converter</h1>
        <p className="cta">
          Receive competitive and transparent pricing with no hidden spreads.
          See how we compare.
        </p>
        <div id="currency-converter-form" className="currency-converter-form" tabIndex={-1}>
          <label htmlFor="currency-input" className="visually-hidden">
            Amount to convert
          </label>
          <CurrencyInput
            value={inputAmount}
            onValueChange={handleValueChange}
            disabled={isFormDisabled}
          />
          <label htmlFor="currency-selector" className="visually-hidden">
            Select currency
          </label>
          <CurrencySelector
            options={currencyOptions}
            value={selectedCurrency}
            onChange={handleCurrencyChange}
            disabled={isFormDisabled}
          />
        </div>

        <CurrencyList
          exchangeRates={exchangeRates}
          loading={loading}
          calculating={calculating}
          isStale={isStale}
        />
      </main>
      <Footer />
    </div>
  );
}

export default App;
