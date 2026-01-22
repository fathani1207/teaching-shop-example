/**
 * E2E Tests - SOLUTION
 *
 * Complete E2E tests with all assertions filled in.
 */

import { test, expect } from '@playwright/test';

const uniqueId = Date.now();
const testUser = {
  username: `testuser_${uniqueId}`,
  email: `test_${uniqueId}@example.com`,
  password: 'testpassword123',
};

test.describe('User Registration and Login', () => {
  test('user can register a new account', async ({ page }) => {
    await page.goto('/register');

    await page.fill('#username', testUser.username);
    await page.fill('#email', testUser.email);
    await page.fill('#password', testUser.password);
    await page.fill('#confirm-password', testUser.password);

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/');
    await expect(page.locator(`text=Hello, ${testUser.username}`)).toBeVisible();
  });

  test('user can login with existing account', async ({ page }) => {
    // First register a user
    await page.goto('/register');
    await page.fill('#username', testUser.username + '_login');
    await page.fill('#email', 'login_' + testUser.email);
    await page.fill('#password', testUser.password);
    await page.fill('#confirm-password', testUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');

    // Logout
    await page.click('button:has-text("Logout")');

    // Login
    await page.goto('/login');
    await page.fill('#username', testUser.username + '_login');
    await page.fill('#password', testUser.password);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/');
    await expect(page.locator(`text=Hello, ${testUser.username}_login`)).toBeVisible();
  });
});

test.describe('Product Browsing', () => {
  test('home page displays products', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('button:has-text("Buy Now")').first()).toBeVisible();
    await expect(page.locator('.grid')).toBeVisible();
  });
});

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
    const uniqueUser = `buyer_${Date.now()}`;
    await page.fill('#username', uniqueUser);
    await page.fill('#email', `${uniqueUser}@example.com`);
    await page.fill('#password', 'buyerpass123');
    await page.fill('#confirm-password', 'buyerpass123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');
  });

  test('user can complete a purchase with valid card', async ({ page }) => {
    // Click on first product
    await page.locator('button:has-text("Buy Now")').first().click();

    // Should be on checkout page
    await expect(page).toHaveURL(/\/checkout\//);

    // Fill card number
    await page.fill('#cardNumber', '1234567890123456');

    // Click pay button
    await page.locator('button:has-text("Pay")').click();

    // Should redirect to order confirmation
    await expect(page).toHaveURL(/\/order\//);
    await expect(page.locator('text=Order Confirmed!')).toBeVisible();
  });

  test('checkout fails with declined card', async ({ page }) => {
    await page.locator('button:has-text("Buy Now")').first().click();

    await page.fill('#cardNumber', '0000123456789012');
    await page.locator('button:has-text("Pay")').click();

    // Should stay on checkout page
    await expect(page).toHaveURL(/\/checkout\//);
  });
});

test.describe('Order History', () => {
  test('user can view their orders after purchase', async ({ page }) => {
    // Register
    const uniqueUser = `orderviewer_${Date.now()}`;
    await page.goto('/register');
    await page.fill('#username', uniqueUser);
    await page.fill('#email', `${uniqueUser}@example.com`);
    await page.fill('#password', 'viewerpass123');
    await page.fill('#confirm-password', 'viewerpass123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');

    // Make a purchase
    await page.locator('button:has-text("Buy Now")').first().click();
    await page.fill('#cardNumber', '1111222233334444');
    await page.locator('button:has-text("Pay")').click();
    await page.waitForURL('**/order/**');

    // Navigate to orders
    await page.click('a:has-text("My Orders")');

    await expect(page).toHaveURL('/orders');
    await expect(page.locator('text=/Order #\\d+/')).toBeVisible();
  });
});
