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


## Known Issues Found During Exploratory Testing

### Bug 1 - Product added from detail page is not displayed in cart

**User:** `problem_user`

**Steps to Reproduce:**

1. Login with `problem_user`.
2. Open the Inventory page (`/inventory.html`).
3. Attempt to add a product using the **Add to Cart** button.
4. If the product cannot be added, click the product name to open the product detail page (`/inventory-item.html?id=6`).
5. Click **Add to Cart** from the product detail page.
6. Observe that the cart badge is incremented.
7. Open the Cart page (`/cart.html`).

**Expected Result:**

* The product should be added to the cart.
* The cart badge and cart contents should be consistent.

**Actual Result:**

* The cart badge indicates that an item has been added.
* The product is not displayed in the Cart page.
* The cart state appears inconsistent with the badge count.

---

### Bug 2 - Product price differs between Inventory and Product Detail pages

**User:** `problem_user`

**Steps to Reproduce:**

1. Login with `problem_user`.
2. Open the Inventory page (`/inventory.html`).
3. Note the price of a product.
4. Add the product to the cart.
5. Open the Cart page (`/cart.html`).
6. Click the product name link to navigate to the Product Detail page (`/inventory-item.html?id=X`).
7. Compare the product price displayed on both pages.

**Expected Result:**

* The product price should be consistent across Inventory, Cart and Product Detail pages.

**Actual Result:**

* The price shown on the Product Detail page differs from the price displayed in the Inventory and Cart pages.
* Product information is inconsistent across the application.
