import { useEffect, useState } from "react";
import type { CurrencyExchangeRate } from "../../types/uphold";
import { CurrencyIcon } from "../CurrencyIcon";
import "./CurrencyList.css";

interface CurrencyListProps {
  exchangeRates: CurrencyExchangeRate[];
  loading: boolean;
  calculating: boolean;
  isStale: boolean;
}

export const CurrencyList = ({
  exchangeRates,
  loading,
  calculating,
  isStale,
}: CurrencyListProps) => {
  const [listVersion, setListVersion] = useState(0);

  // Increment version when exchange rates update (to trigger re-animation)
  useEffect(() => {
    if (exchangeRates.length > 0) {
      setListVersion((v) => v + 1);
    }
  }, [exchangeRates]);

  if (loading) {
    return (
      <div className="loading" role="status" aria-live="polite">
        Loading currencies...
      </div>
    );
  }

  if (exchangeRates.length === 0) {
    return (
      <div className="currency-list">
        <p className="empty-state">Enter an amount above to check the rates.</p>
      </div>
    );
  }

  return (
    <div
      id="currency-list"
      className="currency-list"
      data-calculating={calculating}
      data-stale={isStale}
      data-testid="currency-list"
      role="region"
      aria-label="Exchange rates"
      aria-live="polite"
      aria-busy={calculating}
      tabIndex={-1}
    >
      {exchangeRates.map((rate, index) => (
        <div
          key={`${rate.code}-${listVersion}`}
          className="currency-item"
          style={{ animationDelay: `${index * 0.05}s` }}
          data-testid="currency-item"
          role="article"
          aria-label={`${rate.amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
          })} ${rate.code}`}
        >
          <div className="currency-item-amount" aria-hidden="true">
            {rate.amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 6,
            })}
          </div>
          <div className="currency-item-icon" aria-hidden="true">
            <CurrencyIcon currencyCode={rate.code} />
          </div>
          <strong className="currency-code" aria-hidden="true">
            {rate.code}
          </strong>
        </div>
      ))}
    </div>
  );
};
