import { expect, Locator, Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly errorMessage: Locator;

  readonly itemTotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly confirmationMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');

    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');

    this.errorMessage = page.locator('[data-test="error"]');

    this.itemTotal = page.locator('[data-test="subtotal-label"]');
    this.tax = page.locator('[data-test="tax-label"]');
    this.total = page.locator('[data-test="total-label"]');

    this.confirmationMessage = page.locator(
      '[data-test="complete-header"]'
    );
  }

  async fillInformation(
    firstName: string,
    lastName: string,
    postalCode: string
  ): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }

  async finish(): Promise<void> {
    await this.finishButton.click();
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }

  async getItemTotal(): Promise<number> {
    return this.extractAmount(this.itemTotal);
  }

  async getTax(): Promise<number> {
    return this.extractAmount(this.tax);
  }

  async getTotal(): Promise<number> {
    return this.extractAmount(this.total);
  }

  async expectConfirmation(): Promise<void> {
    await expect(this.confirmationMessage).toHaveText(
      'Thank you for your order!'
    );
  }

  private async extractAmount(locator: Locator): Promise<number> {
    const text = await locator.textContent();

    if (!text) {
      throw new Error('Unable to extract monetary amount.');
    }

    const match = text.match(/\$([0-9]+\.[0-9]{2})/);

    if (!match) {
      throw new Error(`Unable to extract amount from: ${text}`);
    }

    return Number(match[1]);
  }
}