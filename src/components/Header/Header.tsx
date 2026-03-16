import { useState } from "react";
import { Button } from "../Button";
import { SiteLogo } from "../SiteLogo";
import "./Header.css";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header>
      <div className="hamburger-menu-wrapper">
        <button
          type="button"
          className="hamburger-menu"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <div className={`hamburger-icon ${isMobileMenuOpen ? "open" : ""}`}>
            <span />
            <span />
            <span />
          </div>
        </button>
      </div>

      <nav className={`header-nav ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        <ul>
          <li>
            <a href="/" onClick={closeMobileMenu}>
              Personal
            </a>
          </li>
          <li>
            <a href="/" onClick={closeMobileMenu}>
              Business
            </a>
          </li>
          <li>
            <a href="/" onClick={closeMobileMenu}>
              Partners
            </a>
          </li>
        </ul>
      </nav>
      <div className="header-logo">
        <SiteLogo />
      </div>
      <div className="login-button-container">
        <Button className="login-button">Log in</Button>
      </div>
    </header>
  );
};
