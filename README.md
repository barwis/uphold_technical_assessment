# Currency Converter

A real-time currency converter built with React 19 and TypeScript for the Uphold Frontend Engineer (Senior) technical assessment.

## Overview

This application displays an input amount converted to multiple currencies using live exchange rates from Uphold's API. The interface features a currency input field, a dropdown selector to change the base currency, and a dynamic list showing conversions to all available currencies.

## Architecture Decisions / Assumptions

1. Since no strict technical specification was provided (especially when it comes to UI), I took the liberty to make some educated guesses based on JPEG images provided and also inspecting existing https://uphold.com/ website to determine some visual styles (especially colour palette). I also determined that the font used in designs is Proxima Nova. Since I don't have access to this font - I've used CSS import from Typekit to load the font - same as the one being used on https://uphold.com/

2. Even though Uphold Javascript SDK is being used, because I don't have an Uphold (dev) account, I decided to use MSW to mock API responses. This eliminates any potential CORS issues, and is also a good approach for future improvements - e.g., implementing E2E testing, albeit due to time constraints, I did not manage to include it.

3. The UI is not as pixel-perfect and responsive as I would aim it to be. Again - due to time constraints - my main focus was proper functionality and user flow, making the UX as good as possible. Therefore visuals - colours, spacings, sizes etc are not 100% aligned with provided UI images.

4. I added some comments in the code to explain bits and pieces where I thought it would be helpful.

5. I used one external package - qrcode.react, for generating qr code in the footer - url should match the one included in design jpegs. The rest of the code is written by me.

**SDK Browser Adapter Pattern**

- Uphold SDK is environment-agnostic and requires manual injection of HTTP client and storage adapters
- Created `FetchClient` and `BrowserStorage` adapters for browser compatibility
- Pattern: `sdk.client = createFetchClient(); sdk.storage = createBrowserStorage();`

### Testing Strategy

**MSW (Mock Service Worker)**

- API mocking in both development and tests
- Realistic responses without hitting real API
- Test isolation and deterministic results

**TODO:**

- implement E2E testing
- adjust styling to match designs
- improve responsive, mobile-first styling

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Visit [http://localhost:3000](http://localhost:3000)
