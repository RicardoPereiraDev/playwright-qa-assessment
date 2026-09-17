import { expect, Locator, Page } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly sortDropdown: Locator;
  readonly cartLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
  }

  async expectInventoryPage(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
  }

  async sortBy(value: string): Promise<void> {
    await this.sortDropdown.selectOption(value);
  }

  async getProductNames(): Promise<string[]> {
    return this.inventoryItems
      .locator('.inventory_item_name')
      .allTextContents()
      .then((names) => names.map((name) => name.trim()));
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.inventoryItems
      .locator('.inventory_item_price')
      .allTextContents();

    return prices.map((price) =>
      Number(price.replace('$', '').trim())
    );
  }

  async addProductToCart(productName: string): Promise<void> {
    const product = this.inventoryItems.filter({
      hasText: productName,
    });

    await product
      .locator('button')
      .click();
  }

  async getCartBadgeCount(): Promise<number> {
    const badge = this.page.locator('[data-test="shopping-cart-badge"]');

    await expect(badge).toBeVisible();

    return Number((await badge.textContent())?.trim());
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}