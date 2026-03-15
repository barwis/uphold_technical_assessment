import { render, screen, fireEvent } from "@testing-library/react";
import { CurrencyInput } from "./CurrencyInput";

describe("CurrencyInput", () => {
  it("renders with initial value", () => {
    render(<CurrencyInput value="100" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("100");
  });

  it("formats numbers with thousand separators", () => {
    render(<CurrencyInput value="1234.56" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("1,234.56");
  });

  it("shows decimal hint when focused and typing", () => {
    render(<CurrencyInput value="" />);
    const input = screen.getByRole("textbox");

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: "100" } });

    const hint = screen.getByTestId("decimal-hint");
    expect(hint).toBeInTheDocument();
    expect(hint).toHaveTextContent(".00");
  });

  it("limits input to 2 decimal places", () => {
    const handleChange = jest.fn();
    render(<CurrencyInput onValueChange={handleChange} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "10.99" } });
    expect(input).toHaveValue("10.99");

    fireEvent.change(input, { target: { value: "10.999" } });
    expect(input).toHaveValue("10.99");
  });

  it("calls onValueChange with unformatted value", () => {
    const handleChange = jest.fn();
    render(<CurrencyInput onValueChange={handleChange} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "1234.56" } });

    expect(handleChange).toHaveBeenCalledWith("1234.56");
  });

  it("adds .00 on blur for display only", () => {
    const handleChange = jest.fn();
    render(<CurrencyInput value="100" onValueChange={handleChange} />);
    const input = screen.getByRole("textbox");

    fireEvent.blur(input);

    expect(input).toHaveValue("100.00");
  });

  it("handles disabled state", () => {
    render(<CurrencyInput disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("allows only numeric input and decimal point", () => {
    const handleChange = jest.fn();
    render(<CurrencyInput onValueChange={handleChange} />);
    const input = screen.getByRole("textbox");

    fireEvent.change(input, { target: { value: "abc123" } });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("hides decimal hint when not focused", () => {
    render(<CurrencyInput value="100" />);
    const input = screen.getByRole("textbox");

    fireEvent.focus(input);
    fireEvent.blur(input);

    const hint = screen.queryByTestId("decimal-hint");
    expect(hint).not.toBeInTheDocument();
  });
});
