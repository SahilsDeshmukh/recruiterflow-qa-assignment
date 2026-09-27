# Recruiterflow QA Assignment — Playwright + TypeScript

UI and API test suite for the Recruiterflow QA Engineer take-home.

- **UI tests** → [saucedemo.com](https://www.saucedemo.com)
- **API tests** → [reqres.in](https://reqres.in) (using Playwright's `request` fixture, no browser)

## Prerequisites

- Node.js 18+
- npm

## Install

```bash
npm install
npx playwright install chromium
```

## Run

```bash
npx playwright test   # all tests (same as: npm test)
npm test              # all tests
npm run test:ui       # UI tests only
npm run test:api      # API tests only
npm run report        # open the HTML report
```

## Project structure

```
├── pages/                  # Page Objects
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── tests/
│   ├── ui/
│   │   ├── login.spec.ts       # scenarios 1, 2
│   │   ├── cart.spec.ts        # scenario 3
│   │   ├── checkout.spec.ts    # scenario 4
│   │   └── product.spec.ts     # scenario 5
│   └── api/
│       └── users.spec.ts       # scenarios 6, 7, 8 (bonus)
└── playwright.config.ts
```

## What each test covers

| # | Test | File |
|---|------|------|
| 1 | Standard user logs in and lands on the Products page | `login.spec.ts` |
| 2 | Locked-out user sees the error message and stays on the login page | `login.spec.ts` |
| 3 | Adding two products updates the cart badge to 2 | `cart.spec.ts` |
| 4 | Full checkout flow ends with "Thank you for your order!" | `checkout.spec.ts` |
| 5 | Sorting by "Price (low to high)" shows the cheapest product first | `product.spec.ts` |
| 6 | `GET /api/users?page=2` returns 200 and users with id, email, first_name, last_name | `users.spec.ts` |
| 7 | `POST /api/users` returns 201 and echoes name, job, plus id and createdAt | `users.spec.ts` |
| 8 | Bonus: create-then-verify flow structured with `test.step` | `users.spec.ts` |

## Design choices

- **Page Object Model**: locators and actions live in `pages/`, while the specs hold only the flow and the assertions.
- **Locators**: saucedemo exposes `data-test` attributes, so `testIdAttribute` is set to `data-test` in the config and tests use `getByTestId()`. `getByRole()` is used where it reads more naturally (e.g. the Login button).
- **Two Playwright projects**: `ui` (Chromium, saucedemo base URL) and `api` (reqres base URL, no browser), so each can run separately.
- **Independent tests**: each test logs in on its own and runs in parallel (`fullyParallel: true`).

## Notes

- **reqres API key:** reqres now rejects requests without an `x-api-key` header. The config sends the public free key by default. You can override it with:
  ```bash
  REQRES_API_KEY=your-key npm run test:api
  ```
- **reqres doesn't persist data:** the bonus test (scenario 8) asserts on the POST response and comments where a follow-up GET would go against a real backend.

## With more time

- Move the repeated login into a custom Playwright fixture, or reuse a saved `storageState`
- Add negative API cases (404 for an unknown user, 400 for a failed register/login)
- Validate API responses against a schema (e.g. zod)
- Keep test data (users, customer info) in a shared fixtures file
