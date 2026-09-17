import { expect, Locator, Page } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
  }

  async expectCartPage(): Promise<void> {
    await expect(this.page).toHaveURL(/cart\.html/);
  }

  async getProductNames(): Promise<string[]> {
    return this.cartItems
      .locator('.inventory_item_name')
      .allTextContents()
      .then((names) => names.map((name) => name.trim()));
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.cartItems
      .locator('.inventory_item_price')
      .allTextContents();

    return prices.map((price) =>
      Number(price.replace('$', '').trim())
    );
  }
/*
  async getProductImageSources(): Promise<string[]> {
    return this.cartItems
      .locator('.inventory_item_img img')
      .evaluateAll((images) =>
        images.map((image) => (image as HTMLImageElement).src)
      );
  }


//"Dentro do item do carrinho, encontra a imagem."
async getProductImageSources(): Promise<string[]> {
  return this.cartItems
    .locator('img')
    .evaluateAll((images) =>
      images.map((image) => (image as HTMLImageElement).src)
    );
}
*/

async getProductImageSources(): Promise<string[]> {
  return this.cartItems
    .locator('img')
    .evaluateAll((images) =>
      images.map((image) => (image as HTMLImageElement).src)
    );
}

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}