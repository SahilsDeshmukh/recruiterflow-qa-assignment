import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('Products', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    productsPage = new ProductsPage(page);

    await loginPage.goto();
    await loginPage.login('standard_user', 'secret_sauce');
  });

  test('sorting by price low to high shows cheapest product first', async () => {
    await productsPage.sortBy('lohi');

    const prices = await productsPage.getAllPrices();
    expect(prices.length).toBeGreaterThan(0);
    expect(prices[0]).toBe(Math.min(...prices));
  });
});