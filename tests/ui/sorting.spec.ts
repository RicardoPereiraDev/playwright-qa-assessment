import { expect, test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { InventoryPage } from '../../pages/InventoryPage';

test.describe('Scenario 2 - Product sorting', () => {
  const sortingCases = [
    {
      name: 'Name A to Z',
      value: 'az',
      expected: 'string-asc',
    },
    {
      name: 'Name Z to A',
      value: 'za',
      expected: 'string-desc',
    },
    {
      name: 'Price low to high',
      value: 'lohi',
      expected: 'number-asc',
    },
    {
      name: 'Price high to low',
      value: 'hilo',
      expected: 'number-desc',
    },
  ];

  for (const sortingCase of sortingCases) {
    test(`should sort products by ${sortingCase.name}`, async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);
      const inventoryPage = new InventoryPage(page);

      await loginPage.navegarParaUmaURL();
      await loginPage.login('standard_user', 'secret_sauce');

      await inventoryPage.expectInventoryPage();
      await inventoryPage.sortBy(sortingCase.value);

      if (sortingCase.expected === 'string-asc') {
        const names = await inventoryPage.getProductNames();
        const expected = [...names].sort((a, b) =>
          a.localeCompare(b)
        );

        expect(names).toEqual(expected);
      }

      if (sortingCase.expected === 'string-desc') {
        const names = await inventoryPage.getProductNames();
        const expected = [...names].sort((a, b) =>
          b.localeCompare(a)
        );

        expect(names).toEqual(expected);
      }

      if (sortingCase.expected === 'number-asc') {
        const prices = await inventoryPage.getProductPrices();
        const expected = [...prices].sort((a, b) => a - b);

        expect(prices).toEqual(expected);
      }

      if (sortingCase.expected === 'number-desc') {
        const prices = await inventoryPage.getProductPrices();
        const expected = [...prices].sort((a, b) => b - a);

        expect(prices).toEqual(expected);
      }
    });
  }
});