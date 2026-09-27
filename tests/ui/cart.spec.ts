import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage.ts';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('Cart', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('cart badge shows 2 after adding two products', async () => {
    await expect(productsPage.cartBadge).toBeHidden();

    await productsPage.addToCart('Sauce Labs Backpack');
    await productsPage.addToCart('Sauce Labs Bike Light');

    await expect(productsPage.cartBadge).toHaveText('2');
  });
});