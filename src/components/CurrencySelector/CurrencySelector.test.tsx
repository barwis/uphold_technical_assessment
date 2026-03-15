import { render, screen, fireEvent } from "@testing-library/react";
import { CurrencySelector } from "./CurrencySelector";

const mockOptions = [
  { value: "USD", label: "US Dollar" },
  { value: "EUR", label: "Euro" },
  { value: "GBP", label: "British Pound" },
];

describe("CurrencySelector", () => {
  it("renders with placeholder when no value selected", () => {
    render(<CurrencySelector options={mockOptions} />);
    expect(screen.getByText("Select currency")).toBeInTheDocument();
  });

  it("renders with selected value", () => {
    render(<CurrencySelector options={mockOptions} value="USD" />);
    expect(screen.getByText("US Dollar")).toBeInTheDocument();
  });

  it("opens dropdown on click", () => {
    render(<CurrencySelector options={mockOptions} />);

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getByText("Euro")).toBeInTheDocument();
  });

  it("closes dropdown when clicking outside", () => {
    render(
      <div>
        <CurrencySelector options={mockOptions} />
        <div data-testid="outside">Outside</div>
      </div>,
    );

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId("outside"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("calls onChange when option is selected", () => {
    const handleChange = jest.fn();
    render(<CurrencySelector options={mockOptions} onChange={handleChange} />);

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByText("Euro"));

    expect(handleChange).toHaveBeenCalledWith("EUR");
  });

  it("closes dropdown after selection", () => {
    render(<CurrencySelector options={mockOptions} />);

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByText("Euro"));

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens on Enter key", () => {
    render(<CurrencySelector options={mockOptions} />);

    const trigger = screen.getByRole("button");
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "Enter" });

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("opens on Space key", () => {
    render(<CurrencySelector options={mockOptions} />);

    const trigger = screen.getByRole("button");
    trigger.focus();
    fireEvent.keyDown(trigger, { key: " " });

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("closes on Escape key", () => {
    render(<CurrencySelector options={mockOptions} />);

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("navigates options with Arrow Down key", () => {
    render(<CurrencySelector options={mockOptions} />);

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    const options = screen.getAllByRole("option");
    fireEvent.keyDown(options[0], { key: "ArrowDown" });

    expect(options[1]).toHaveFocus();
  });

  it("navigates options with Arrow Up key", () => {
    render(<CurrencySelector options={mockOptions} />);

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    const options = screen.getAllByRole("option");
    fireEvent.keyDown(options[1], { key: "ArrowUp" });

    expect(options[0]).toHaveFocus();
  });

  it("handles disabled state", () => {
    render(<CurrencySelector options={mockOptions} disabled />);
    const trigger = screen.getByRole("button");
    expect(trigger).toBeDisabled();
  });

  it("renders with icons when provided", () => {
    const optionsWithIcons = [
      {
        value: "USD",
        label: "US Dollar",
        icon: <span data-testid="usd-icon">$</span>,
      },
    ];
    render(<CurrencySelector options={optionsWithIcons} value="USD" />);
    expect(screen.getByTestId("usd-icon")).toBeInTheDocument();
  });

  it("has correct ARIA attributes", () => {
    render(<CurrencySelector options={mockOptions} />);
    const trigger = screen.getByRole("button");

    expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("updates ARIA expanded when opened", () => {
    render(<CurrencySelector options={mockOptions} />);

    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);

    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });
});
