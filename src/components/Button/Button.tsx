import { ButtonHTMLAttributes } from "react";
import "./Button.css";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const Button = ({ children, className = "", ...props }: ButtonProps) => {
  return (
    <button
      {...props}
      type={props.type || "button"}
      className={`button ${className}`.trim()}
    >
      {children}
    </button>
  );
};
