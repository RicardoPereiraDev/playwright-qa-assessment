import { test } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Scenario 1 - Authentication across credential states', () => {
  const validUser = 'standard_user';
  const validPassword = 'secret_sauce';

  test('should authenticate successfully with standard_user', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navegarParaUmaURL();
    await loginPage.login(validUser, validPassword);

    await loginPage.expectSuccessfulLogin();
  });

  test('should reject locked_out_user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navegarParaUmaURL();
    await loginPage.login('locked_out_user', validPassword);

    await loginPage.expectLoginError(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  const invalidCases = [
    {
      name: 'wrong password',
      username: validUser,
      password: 'wrong_password',
      expectedError:
        'Epic sadface: Username and password do not match any user in this service',
    },
    {
      name: 'empty username',
      username: '',
      password: validPassword,
      expectedError: 'Epic sadface: Username is required',
    },
    {
      name: 'empty password',
      username: validUser,
      password: '',
      expectedError: 'Epic sadface: Password is required',
    },
    {
      name: 'empty username and password',
      username: '',
      password: '',
      expectedError: 'Epic sadface: Username is required',
    },
  ];

  for (const testCase of invalidCases) {
    test(`should reject ${testCase.name}`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.navegarParaUmaURL();
      await loginPage.login(
        testCase.username,
        testCase.password
      );

      await loginPage.expectLoginError(testCase.expectedError);
    });
  }
});