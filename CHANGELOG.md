# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2026-03-16

### Added

#### E2E Testing (Playwright)

- Added Playwright testing framework for end-to-end tests
- Created comprehensive E2E test suite in `e2e/currency-converter.spec.ts`:
  - App loading and basic rendering
  - Currency input and selector visibility
  - Dynamic currency list updates with debounce
  - Currency selector functionality
  - Input formatting with thousand separators
  - Decimal hint display
  - Full keyboard navigation (Tab, Arrow keys, Enter)
  - Focus management and accessibility
- Added Playwright configuration (`playwright.config.ts`) with Chromium, Firefox, and WebKit support
- Added npm scripts: `test:e2e`, `test:e2e:ui`, `test:e2e:headed`, `test:e2e:report`
- Updated `.gitignore` to exclude Playwright artifacts (`/playwright-report`, `/test-results`, `/playwright/.cache`)

#### Documentation

- Added `.env` file for local network access configuration (`HOST=0.0.0.0`)

#### Mobile UX Improvements

- Added `enterKeyHint="next"` to currency input for better mobile keyboard behavior
- Added Enter key handler to focus currency selector when pressing "next" on mobile keyboard
- Added automatic dropdown opening when currency selector receives focus (via Tab or programmatic focus)
- Added focus return to input with cursor positioned at end (not selected text) when closing dropdown
- Added `-webkit-tap-highlight-color: transparent` to remove tap highlight flash on mobile

### Changed

#### GitHub Pages Deployment Fixes

- Changed API base URL from `http://api-sandbox.uphold.com` to `https://api-sandbox.uphold.com` to fix mixed content blocking on HTTPS GitHub Pages
- Updated MSW handlers to match HTTPS API endpoint
- Fixed MSW service worker registration path to use relative URL (`"./mockServiceWorker.js"`)
- Enabled MSW in production (not just development) to handle CORS issues on GitHub Pages

#### Component Improvements

- **CurrencyInput**:
  - All input elements now use `--input-font-size` CSS variable for consistency
  - Added keyboard navigation support (Enter key to focus selector)
- **CurrencySelector**:
  - Added `id="currency-selector"` for focus targeting
  - Removed `onClick` handler (was causing instant open/close on mobile)
  - Added `onFocus` handler to auto-open dropdown on Tab navigation
  - Improved focus management with `focusInputAtEnd()` helper
  - Changed dropdown `overflow-y` from `auto` to `scroll` to prevent animation glitch
- **CurrencyList**: Fixed selector class name from `.currency-list-item` to `.currency-item` for consistency

#### Styling & Design

- Added `--input-font-size` CSS variable: `clamp(2.25rem, calc(1.575rem + 1.167vw), 2.63rem)` (max ~42px)
- Updated component styles to use CSS variables for better consistency
- Improved mobile responsiveness and touch interactions
- Style tweaks to more closely match design mockups

#### Configuration & Dependencies

- Updated ESLint configuration with override to disable testing-library rules for E2E files (`e2e/**/*.ts`)
- Added `@playwright/test` dev dependency (v1.58.2)
- Updated `README.md` with testing documentation:
  - E2E testing setup and commands
  - Test coverage details

#### Asset Cleanup

- Removed references to deleted logo files (`logo192.png`, `logo512.png`) from:
  - `public/manifest.json`
  - `public/index.html`

### Fixed

- Fixed mixed content blocking errors when deployed to GitHub Pages (HTTP API calls from HTTPS page)
- Fixed MSW service worker 404 errors on GitHub Pages deployment
- Fixed mobile keyboard "next" button scrolling to page bottom instead of focusing next input
- Fixed decimal hint misalignment after font size changes
- Fixed currency selector opening and immediately closing on click/tap (removed conflicting handlers)
- Fixed dropdown animation glitch where items shifted slightly at the end of open animation
- Fixed focus management to place cursor at end of input instead of selecting all text
- Fixed ESLint warnings for Playwright test files (testing-library rules no longer apply to E2E tests)

### Technical Details

#### Keyboard Navigation Flow

1. User enters amount in currency input
2. Pressing Enter or mobile keyboard "next" focuses currency selector
3. Currency selector auto-opens on focus
4. Arrow keys navigate options, Enter selects

#### MSW Production Setup

- MSW now runs in production to avoid CORS issues
- Service worker properly registered with relative path for GitHub Pages subdirectory
- API responses mocked for both development and production environments

#### Testing Infrastructure

- Unit tests: Jest + React Testing Library with MSW
- E2E tests: Playwright with Chromium, Firefox, WebKit
- Both test suites use MSW for API mocking
- ESLint configured to handle both testing frameworks appropriately
