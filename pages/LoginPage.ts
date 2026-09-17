import { expect, Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }
//Alterei o nome do metodo que estava antes para navegarParaUmaURL
  async navegarParaUmaURL(): Promise<void> {
    await this.page.goto('/'); //goto = metodo nativo do Playwright que abre uma página web.
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    await expect(this.errorMessage).toBeVisible();
    return (await this.errorMessage.textContent())?.trim() ?? '';
  }

  async expectSuccessfulLogin(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
  }

  async expectLoginError(message: string): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }
}