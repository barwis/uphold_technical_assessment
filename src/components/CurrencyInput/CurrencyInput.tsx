import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "./CurrencyInput.css";

export interface CurrencyInputProps {
  value?: string;
  onValueChange?: (value: string | undefined) => void;
  disabled?: boolean;
}

export function CurrencyInput({
  value = "",
  onValueChange,
  disabled = false,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [hintOffset, setHintOffset] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Format value for display (add commas and decimals)
  const formatValue = (val: string): string => {
    if (!val || val === "0") return "";

    // Remove all non-numeric except decimal point
    const cleaned = val.replace(/[^0-9.]/g, "");
    if (!cleaned) return "";

    // Split into integer and decimal parts
    const parts = cleaned.split(".");
    const integerPart = parts[0] || "0";
    const decimalPart = parts[1];

    // Add thousand separators to integer part
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Return with decimal if present
    if (decimalPart !== undefined) {
      const limitedDecimal = decimalPart.slice(0, 2);
      return `${formattedInteger}.${limitedDecimal}`;
    }

    return formattedInteger;
  };

  // Update display when external value changes
  useEffect(() => {
    const formatted = formatValue(value || "");
    setDisplayValue(formatted);
  }, [value]);

  // Measure text width and update hint position
  useLayoutEffect(() => {
    if (measureRef.current && inputRef.current) {
      const width = measureRef.current.offsetWidth;
      setHintOffset(width);
    }
  }, [displayValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Remove commas for processing
    const withoutCommas = input.replace(/,/g, "");

    // Allow only numbers and one decimal point
    const validInput = withoutCommas.match(/^\d*\.?\d{0,2}$/);
    if (!validInput && input !== "") return;

    // Update display
    const formatted = formatValue(withoutCommas);
    setDisplayValue(formatted);

    // Notify parent with unformatted value
    onValueChange?.(withoutCommas || undefined);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // On blur, solidify the decimals in the display only (don't notify parent)
    if (displayValue) {
      const unformatted = displayValue.replace(/,/g, "");
      const parts = unformatted.split(".");
      const decimalPart = parts[1] || "";

      // Ensure we have exactly 2 decimal places for display
      const paddedDecimal = decimalPart.padEnd(2, "0");
      const withDecimals = `${parts[0]}.${paddedDecimal}`;

      const formatted = formatValue(withDecimals);
      setDisplayValue(formatted);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const currencySelector = document.getElementById("currency-selector");
      if (currencySelector) {
        currencySelector.focus();
      } else {
        e.currentTarget.blur();
      }
    }
  };

  // Calculate the decimal hint to show (only when focused)
  const getDecimalHint = (): string => {
    if (!displayValue || !isFocused) return "";

    const unformatted = displayValue.replace(/,/g, "");
    const parts = unformatted.split(".");

    if (parts.length === 1) {
      // No decimal point entered
      return ".00";
    } else {
      // Has decimal point, show missing zeros
      const decimalPart = parts[1] || "";
      if (decimalPart.length === 0) return "00";
      if (decimalPart.length === 1) return "0";
      return "";
    }
  };

  const decimalHint = getDecimalHint();

  return (
    <div className="currency-input-wrapper">
      <input
        ref={inputRef}
        id="currency-input"
        name="amount"
        type="text"
        inputMode="decimal"
        enterKeyHint="next"
        className="currency-input"
        value={displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="0.00"
        autoComplete="off"
        aria-label="Amount to convert"
      />
      {/* Hidden span to measure text width */}
      <span ref={measureRef} className="currency-input-measure" aria-hidden="true">
        {displayValue || "0.00"}
      </span>
      {decimalHint && (
        <span
          className="currency-input-decimal-hint"
          style={{ left: `${hintOffset}px` }}
          data-testid="decimal-hint"
          aria-hidden="true"
        >
          {decimalHint}
        </span>
      )}
    </div>
  );
}
