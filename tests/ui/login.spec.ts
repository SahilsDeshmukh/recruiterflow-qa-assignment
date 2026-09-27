import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';

const PASSWORD = 'secret_sauce';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('standard user can log in and lands on products page', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await loginPage.login('standard_user', PASSWORD);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(productsPage.title).toHaveText('Products');
  });

  test('locked out user sees error and stays on login page', async ({ page }) => {
    await loginPage.login('locked_out_user', PASSWORD);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
    await expect(page).not.toHaveURL(/inventory\.html/);
    await expect(loginPage.loginButton).toBeVisible();
  });
});