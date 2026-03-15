import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("renders with button class", () => {
    render(<Button>Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("button");
  });

  it("handles onClick events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("handles disabled state", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Disabled</Button>);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("button");
    expect(button).toHaveClass("custom-class");
  });

  it("defaults to type button", () => {
    render(<Button>Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "button");
  });

  it("allows custom type attribute", () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("type", "submit");
  });

  it("passes through other HTML button attributes", () => {
    render(<Button aria-label="Custom label" data-testid="custom-button">Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-label", "Custom label");
    expect(button).toHaveAttribute("data-testid", "custom-button");
  });
});
