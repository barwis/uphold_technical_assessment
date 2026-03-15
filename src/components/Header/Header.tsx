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
      <div style={{ flex: "0 0 auto", height: 40 }}>
        <SiteLogo />
      </div>
      <div style={{ flex: "1", display: "flex", justifyContent: "flex-end" }}>
        <Button className="login-button">Log in</Button>
      </div>
    </header>
  );
};
