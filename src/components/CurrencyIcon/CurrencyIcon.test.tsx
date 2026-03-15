import { render, screen } from "@testing-library/react";
import { CurrencyIcon } from "./";

describe("CurrencyIcon", () => {
  it("renders currency icon with correct src", () => {
    render(<CurrencyIcon currencyCode="USD" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/assets/USD.png");
  });

  it("renders with srcset for responsive images", () => {
    render(<CurrencyIcon currencyCode="EUR" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("srcset");
    const srcset = img.getAttribute("srcset") || "";
    expect(srcset).toContain("/assets/EUR.png 1x");
    expect(srcset).toContain("/assets/EUR@2x.png 2x");
    expect(srcset).toContain("/assets/EUR@3x.png 3x");
  });

  it("handles uppercase currency codes", () => {
    render(<CurrencyIcon currencyCode="GBP" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/assets/GBP.png");
  });

  it("handles lowercase currency codes", () => {
    render(<CurrencyIcon currencyCode="jpy" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/assets/JPY.png");
  });

  it("renders with size of 32", () => {
    render(<CurrencyIcon currencyCode="USD" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("width", "32");
    expect(img).toHaveAttribute("height", "32");
  });

  it("renders with default alt text", () => {
    render(<CurrencyIcon currencyCode="EUR" />);
    const img = screen.getByAltText("EUR currency icon");
    expect(img).toBeInTheDocument();
  });

  it("has lazy loading enabled", () => {
    render(<CurrencyIcon currencyCode="USD" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("loading", "lazy");
  });
});
