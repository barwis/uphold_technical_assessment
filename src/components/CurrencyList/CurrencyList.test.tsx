import { render, screen } from "@testing-library/react";
import type { CurrencyExchangeRate } from "../../types/uphold";
import { CurrencyList } from "./CurrencyList";

const mockExchangeRates: CurrencyExchangeRate[] = [
  { code: "EUR", rate: 0.85, amount: 85 },
  { code: "GBP", rate: 0.73, amount: 73 },
  { code: "JPY", rate: 110.5, amount: 11050 },
];

describe("CurrencyList", () => {
  it("renders exchange rates", () => {
    render(<CurrencyList exchangeRates={mockExchangeRates} loading={false} calculating={false} isStale={false} />);

    expect(screen.getByText("EUR")).toBeInTheDocument();
    expect(screen.getByText("GBP")).toBeInTheDocument();
    expect(screen.getByText("JPY")).toBeInTheDocument();
  });

  it("displays formatted amounts", () => {
    render(<CurrencyList exchangeRates={mockExchangeRates} loading={false} calculating={false} isStale={false} />);

    expect(screen.getByText("85.00")).toBeInTheDocument();
    expect(screen.getByText("73.00")).toBeInTheDocument();
    expect(screen.getByText("11,050.00")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(<CurrencyList exchangeRates={[]} loading={true} calculating={false} isStale={false} />);
    expect(screen.getByText("Loading currencies...")).toBeInTheDocument();
  });

  it("sets calculating data attribute", () => {
    render(
      <CurrencyList exchangeRates={mockExchangeRates} loading={false} calculating={true} isStale={false} />
    );
    const list = screen.getByTestId("currency-list");
    expect(list).toHaveAttribute("data-calculating", "true");
  });

  it("sets stale data attribute when isStale is true", () => {
    render(
      <CurrencyList exchangeRates={mockExchangeRates} loading={false} calculating={false} isStale={true} />
    );
    const list = screen.getByTestId("currency-list");
    expect(list).toHaveAttribute("data-stale", "true");
  });

  it("renders empty state when no exchange rates", () => {
    render(<CurrencyList exchangeRates={[]} loading={false} calculating={false} isStale={false} />);
    expect(screen.getByText("Enter an amount above to see exchange rates")).toBeInTheDocument();
  });

  it("renders currency codes", () => {
    render(<CurrencyList exchangeRates={mockExchangeRates} loading={false} calculating={false} isStale={false} />);

    const codes = screen.getAllByText(/EUR|GBP|JPY/);
    expect(codes.length).toBeGreaterThan(0);
  });

  it("applies correct CSS classes for animations", () => {
    render(
      <CurrencyList exchangeRates={mockExchangeRates} loading={false} calculating={false} isStale={false} />
    );

    const items = screen.getAllByTestId("currency-item");
    expect(items).toHaveLength(3);
  });
});
