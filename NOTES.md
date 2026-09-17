# QA Automation Assessment — Notes

## 1. Design patterns and architecture

The UI automation uses the Page Object Model (POM).

Page objects encapsulate page-specific locators and actions, keeping test scenarios focused on behaviour rather than implementation details. This reduces locator duplication and improves maintainability when the application changes.

The API automation follows the same separation principle through service objects:

* `AuthService` encapsulates authentication requests.
* `BookingService` encapsulates booking API operations.

This provides an API equivalent to the Page Object approach used by the UI tests.

The main trade-off is the additional abstraction layer, but it keeps the test scenarios readable and avoids duplicated request and locator logic.

---

## 2. Coverage strategy

The scenarios were designed around the meaningful behaviour requested by the assessment while avoiding unnecessary duplication.

### Scenario 1 — Authentication

Credential states are data-driven and cover:

* valid login;
* locked-out user;
* wrong password;
* empty username;
* empty password;
* both fields empty.

This provides coverage of the relevant equivalence classes without creating separate duplicated test implementations.

### Scenario 2 — Product sorting

All four available sorting options are exercised:

* Name A → Z;
* Name Z → A;
* Price low → high;
* Price high → low.

The assertions validate the resulting order rather than relying on a manually duplicated expected product list.

### Scenario 3 — Checkout

The scenario contains:

* one complete end-to-end purchase flow;
* parametrised checkout validation for the required fields.

The validation cases cover missing first name, missing last name, missing postal code, and the valid case.

### Scenario 4 — User personas

The same reusable flow is executed against both:

* `standard_user`;
* `problem_user`.

Persona-specific data is used rather than duplicating the complete test flow.

The flow verifies cart product names and prices and evaluates image behaviour.

### Scenario 5 — Authentication and token handling

The API tests cover:

* valid credentials;
* invalid credentials;
* protected DELETE without authentication;
* protected DELETE with a valid token.

### Scenario 6 — CRUD and contract validation

The API lifecycle is chained using the booking ID returned by creation:

POST → GET → PUT → GET → DELETE → GET (404)

AJV is used to validate the response contract and data types instead of only checking that fields exist.

---

## 3. Assumptions and known limitations

The assessment targets public demo applications, so the behaviour and data are not controlled by the test suite.

The Restful Booker API periodically resets its sample data. The tests therefore create their own booking and use the returned booking ID for the lifecycle validation.

The tests use the credentials supplied by the assessment for the demo applications.

No production data or real transactions are involved.

---

## 4. Observed UI behaviour / Scenario 4

During execution against the current public SauceDemo application, the cart contained the expected product name and price, but no `<img>` element was rendered inside the cart item for either tested persona.

The observed result was:

* `standard_user`: product name and price present; no cart image element observed.
* `problem_user`: product name and price present; no cart image element observed.

This behaviour was captured as an observed divergence rather than making the test artificially pass through an incorrect image assertion.

The assessment states that `standard_user` should behave correctly while `problem_user` is known to exhibit defects. Therefore, the absence of the expected cart image for `standard_user` is treated as an observed application discrepancy / potential reportable bug rather than an expected persona difference.

The test report contains the execution result and the test annotations documenting this observation.

---

## 5. API contract observation

Restful Booker returns HTTP `201` for a successful DELETE operation.

Although this is a successful 2xx response, `204 No Content` would be a more conventional response for a successful deletion.

The test therefore asserts the observed API contract rather than assuming a different status code, and this behaviour is documented as a contract smell.

---

## 6. What I would improve with more time

With additional time, I would consider:

* adding CI execution through GitHub Actions;
* publishing the Playwright HTML report as a CI artifact;
* adding linting and formatting with ESLint/Prettier;
* adding additional browser projects where useful;
* introducing reusable fixtures for common authentication/setup flows;
* adding accessibility checks to selected UI pages.

These were intentionally not prioritised because they are outside the minimum assessment requirements.
