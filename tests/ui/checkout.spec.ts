import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';
import { CartPage } from '../../pages/CartPage';
import { CheckoutPage } from '../../pages/CheckoutPage';

test.describe('Scenario 3 - Checkout', () => {
  test('should complete a purchase and validate order totals', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.navegarParaUmaURL();
    await loginPage.login('standard_user', 'secret_sauce');

    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.addProductToCart('Sauce Labs Bike Light');

    expect(await inventoryPage.getCartBadgeCount()).toBe(2);

    await inventoryPage.openCart();
    await cartPage.expectCartPage();

    await cartPage.checkout();

    await checkoutPage.fillInformation(
      'Jacinto',
      'QA',
      '2800-000'
    );

    await checkoutPage.continue();

    const itemTotal = await checkoutPage.getItemTotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();

    expect(itemTotal + tax).toBeCloseTo(total, 2);

    await checkoutPage.finish();

    await checkoutPage.expectConfirmation();
  });

  const validationCases = [
    {
      name: 'missing first name',
      firstName: '',
      lastName: 'QA',
      postalCode: '2800-000',
      expectedError: 'Error: First Name is required',
    },
    {
      name: 'missing last name',
      firstName: 'Jacinto',
      lastName: '',
      postalCode: '2800-000',
      expectedError: 'Error: Last Name is required',
    },
    {
      name: 'missing postal code',
      firstName: 'Jacinto',
      lastName: 'QA',
      postalCode: '',
      expectedError: 'Error: Postal Code is required',
    },
    {
      name: 'all fields present',
      firstName: 'Jacinto',
      lastName: 'QA',
      postalCode: '2800-000',
      expectedError: null,
    },
  ];

  for (const validationCase of validationCases) {
    test(`should validate checkout fields - ${validationCase.name}`, async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);
      const cartPage = new CartPage(page);
      const checkoutPage = new CheckoutPage(page);

      await loginPage.navegarParaUmaURL();
      await loginPage.login('standard_user', 'secret_sauce');

      await inventoryPage.addProductToCart(
        'Sauce Labs Backpack'
      );

      await inventoryPage.openCart();
      await cartPage.checkout();

      await checkoutPage.fillInformation(
        validationCase.firstName,
        validationCase.lastName,
        validationCase.postalCode
      );

      await checkoutPage.continue();

      if (validationCase.expectedError) {
        await checkoutPage.expectError(
          validationCase.expectedError
        );
      } else {
        await expect(page).toHaveURL(/checkout-step-two\.html/);
      }
    });
  }
});