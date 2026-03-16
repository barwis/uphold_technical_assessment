import { QRCodeSVG } from "qrcode.react";
import { SiteLogo } from "../SiteLogo";
import "./Footer.css";

export const Footer = () => {
  return (
    <footer>
      <div>
        <SiteLogo />
      </div>
      <nav aria-label="Footer navigation">
        <ul>
          <li>
            <h3>Products</h3>
          </li>
          <li>
            <a href="/consumers">Consumers</a>
          </li>
          <li>
            <a href="/business">Business</a>
          </li>
          <li>
            <a href="/partners">Partners</a>
          </li>
        </ul>
        <ul>
          <li>
            <h3>Company</h3>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/careers">Careers</a>
          </li>
          <li>
            <a href="/press">Press</a>
          </li>
          <li>
            <a href="/blog">Blog</a>
          </li>
        </ul>
        <ul>
          <li>
            <h3>Help</h3>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/careers">Careers</a>
          </li>
          <li>
            <a href="/press">Press</a>
          </li>
          <li>
            <a href="/blog">Blog</a>
          </li>
        </ul>
        <ul>
          <li>
            <h3>Social</h3>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/careers">Careers</a>
          </li>
          <li>
            <a href="/press">Press</a>
          </li>
          <li>
            <a href="/blog">Blog</a>
          </li>
        </ul>
      </nav>
      <div className="apps-lang">
        <ul>
          <li>
            <a href="/">
              <img
                src={`${process.env.PUBLIC_URL}/assets/appstore.svg`}
                alt="App Store"
              />
            </a>
          </li>
          <li>
            <a href="/">
              <img
                src={`${process.env.PUBLIC_URL}/assets/play_store.svg`}
                alt="Google Play"
              />
            </a>
          </li>
        </ul>
        <select>
          <option value="english">English</option>
          <option value="polish">Polish</option>
        </select>
      </div>

      <div className="copyright">
        Uphold Europe Limited, Reg No. 09281410, Registered Office: Eastcastle
        House, 27/28 Eastcastle Street, London, United Kingdom, W1W 8DH
        <ul>
          <li>© 2026 Uphold Europe Limited. All rights reserved.</li>
          <li>
            <a href="/agreements">Agreements</a>
          </li>
          <li>
            <a href="/privacy-policy">Privacy &amp; Data Policy</a>
          </li>
          <li>
            <a href="/cookie-policy">Cookie policy</a>
          </li>
        </ul>
      </div>
      <div className="qr">
        <QRCodeSVG size={40} value="https://reactjs.org/" />
      </div>
    </footer>
  );
};
