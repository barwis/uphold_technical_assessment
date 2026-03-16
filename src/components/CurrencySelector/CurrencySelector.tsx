import { ReactNode, useEffect, useRef, useState } from "react";
import "./CurrencySelector.css";

export interface CurrencySelectorOption<T = string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

export interface CurrencySelectorProps<T = string> {
  options: CurrencySelectorOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  disabled?: boolean;
}

export function CurrencySelector<T = string>({
  options,
  value,
  onChange,
  disabled = false,
}: CurrencySelectorProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<(HTMLLIElement | null)[]>([]);

  const selectedOption = options.find((opt) => opt.value === value);
  const selectedIndex = options.findIndex((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const initialIndex = selectedIndex >= 0 ? selectedIndex : 0;
      setFocusedIndex(initialIndex);
      optionsRef.current[initialIndex]?.focus();
    } else {
      setFocusedIndex(-1);
    }
  }, [isOpen, selectedIndex]);

  const focusCurrencyList = () => {
    const input = document.getElementById("currency-input") as HTMLInputElement;
    const form = document.getElementById("currency-converter-form");

    // If input is empty, focus it to guide user to enter amount
    if (input && (!input.value || input.value === "0" || input.value === "0.00")) {
      input.focus();
      const length = input.value.length;
      input.setSelectionRange(length, length);
    }
    // If input has value, scroll to show results
    else if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "start" });
      form.focus();
    }
  };

  const handleSelect = (option: CurrencySelectorOption<T>) => {
    onChange?.(option.value);
    setIsOpen(false);
    setFocusedIndex(-1);
    focusCurrencyList();
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case "ArrowDown":
        event.preventDefault();
        setIsOpen(true);
        break;
      case "ArrowUp":
        event.preventDefault();
        setIsOpen(true);
        break;
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  const handleOptionKeyDown = (
    event: React.KeyboardEvent,
    option: CurrencySelectorOption<T>,
    index: number,
  ) => {
    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        handleSelect(option);
        break;
      case "ArrowDown":
        event.preventDefault();
        if (index < options.length - 1) {
          setFocusedIndex(index + 1);
          optionsRef.current[index + 1]?.focus();
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (index > 0) {
          setFocusedIndex(index - 1);
          optionsRef.current[index - 1]?.focus();
        }
        break;
      case "Home":
        event.preventDefault();
        setFocusedIndex(0);
        optionsRef.current[0]?.focus();
        break;
      case "End":
        event.preventDefault();
        setFocusedIndex(options.length - 1);
        optionsRef.current[options.length - 1]?.focus();
        break;
      case "Escape":
        event.preventDefault();
        setIsOpen(false);
        focusCurrencyList();
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  const handleFocus = () => {
    if (!disabled && !isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="currency-selector"
      data-open={isOpen}
      data-disabled={disabled}
    >
      <button
        ref={triggerRef}
        id="currency-selector"
        type="button"
        className="currency-selector-trigger"
        onFocus={handleFocus}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby="dropdown-label"
        tabIndex={0}
      >
        <span className="currency-selector-trigger-content">
          {selectedOption?.icon && (
            <span className="currency-selector-trigger-icon">{selectedOption.icon}</span>
          )}
          <span className="currency-selector-trigger-label" id="dropdown-label">
            {selectedOption?.label || "Select currency"}
          </span>
        </span>
        <span className="currency-selector-trigger-arrow" aria-hidden="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {isOpen && (
        <ul className="currency-selector-menu" role="listbox">
          {options.map((option, index) => (
            <li
              key={index}
              ref={(el) => {
                optionsRef.current[index] = el;
              }}
              className={`currency-selector-option ${option.value === value ? "currency-selector-option-selected" : ""} ${
                focusedIndex === index ? "currency-selector-option-focused" : ""
              }`}
              role="option"
              aria-selected={option.value === value}
              onClick={() => handleSelect(option)}
              onKeyDown={(e) => handleOptionKeyDown(e, option, index)}
              tabIndex={0}
            >
              {option.icon && (
                <span className="currency-selector-option-icon">{option.icon}</span>
              )}
              <span className="currency-selector-option-label">{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
