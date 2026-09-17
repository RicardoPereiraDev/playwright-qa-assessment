# Playwright QA Assessment

## Overview

Technical Assessment implemented with:

- Playwright 1.63.0
- TypeScript
- Page Object Model (UI)
- Service Object Pattern (API)
- AJV schema validation

Applications under test:

### UI

SauceDemo

https://www.saucedemo.com

### API

Restful Booker

https://restful-booker.herokuapp.com

---

## Minimum Supported Versions

- Node.js >= 20
- npm >= 10
- Playwright >= 1.63.0

Tested with:

- Node.js v24.21.0
- npm 10.2.4
- Playwright 1.63.0

---

## Installation

Install dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

---

## Run All Tests

```bash
npm test
```

---

## Run UI Tests

```bash
npm run test:ui
```

---

## Run API Tests

```bash
npm run test:api
```

---

## Run Tests in Headed Mode

```bash
npm run test:headed
```

---

## Open HTML Report

```bash
npm run report
```

or

```bash
npx playwright show-report
```

---

## Project Structure

```text
pages/
├── LoginPage.ts
├── InventoryPage.ts
├── CartPage.ts
└── CheckoutPage.ts

services/
├── AuthService.ts
└── BookingService.ts

tests/
├── ui/
│   ├── login.spec.ts
│   ├── sorting.spec.ts
│   └── checkout.spec.ts
└── api/
    ├── auth.spec.ts
    └── booking.spec.ts
```

## Design Pattern

### UI

Page Object Model (POM)

- LoginPage
- InventoryPage
- CartPage
- CheckoutPage

### API

Service Object Pattern

- AuthService
- BookingService

---

## Coverage Strategy

### UI

Scenario 1 – Authentication

Scenario 2 – Product Sorting

Scenario 3 – Checkout

Scenario 4 – Behavioural Consistency Across Personas

### API

Scenario 5 – Authentication & Token Handling

Scenario 6 – CRUD Lifecycle + Contract Validation

---

## Notes

Authentication and validation scenarios are implemented using data-driven testing.

API responses are validated using AJV schema validation.

Scenario 4 documents persona-specific behaviour through test annotations.

Restful Booker returns HTTP 201 on successful DELETE operations. The suite validates the observed API contract rather than assuming HTTP 204.