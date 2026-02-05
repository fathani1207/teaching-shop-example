/**
 * E2E Tests - Test the complete user experience in a real browser
 *
 * These tests simulate real user interactions:
 * - Navigating pages
 * - Clicking buttons
 * - Filling forms
 * - Verifying visual outcomes
 *
 * Copy this file to frontend/e2e/checkout.spec.ts
 *
 * Before running:
 * 1. Start backend: cd backend/core && uv run python manage.py runserver
 * 2. Start frontend: cd frontend && npm run dev -- --port 8080
 * 3. Run tests: cd frontend && npx playwright test
 */

import { test, expect } from '@playwright/test';

// Generate unique username for each test run to avoid conflicts
const uniqueId = Date.now();
const testUser = {
  username: `testuser_${uniqueId}`,
  email: `test_${uniqueId}@example.com`,
  password: 'testpassword123',
};

test.describe('User Registration and Login', () => {
  test('user can register a new account', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register');

    // TODO: Fill in the registration form
    // Hint: Use page.fill('#elementId', 'value')
    // Fields: #username, #email, #password, #confirm-password

    // TODO: Click the submit button
    // Hint: Use page.click('button[type="submit"]')

    // TODO: Assert that user is redirected to home page after registration
    // Hint: Use await expect(page).toHaveURL('/')
    // Hint: Or check that "Hello, {username}" appears in the header
  });

  test('user can login with existing account', async ({ page }) => {
    // First register a user (setup)
    await page.goto('/register');
    await page.fill('#username', testUser.username);
    await page.fill('#email', testUser.email);
    await page.fill('#password', testUser.password);
    await page.fill('#confirm-password', testUser.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/');

    // Logout first
    await page.click('button:has-text("Logout")');

    // Now test login
    await page.goto('/login');

    // TODO: Fill in login form (username and password)

    // TODO: Click sign in button

    // TODO: Assert user is logged in (redirected to home, username visible)
  });
});

test.describe('Product Browsing', () => {
  test('home page displays products', async ({ page }) => {
    await page.goto('/');

    // TODO: Assert that at least one product is visible
    // Hint: Products have "Buy Now" buttons
    // Hint: Use await expect(page.locator('button:has-text("Buy Now")')).toBeVisible()

    // TODO: Assert that product names are visible
    // Hint: Look for product name text in the page
  });
});

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Register and login before each checkout test
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
    // Step 1: Click on "Buy Now" for the first product
    await page.locator('button:has-text("Buy Now")').first().click();

    // TODO: Assert that we're on the checkout page
    // Hint: URL should contain '/checkout/'

    // Step 2: Fill in card number
    // TODO: Fill the card number field with a valid 16-digit number
    // Hint: Use page.fill('#cardNumber', '1234567890123456')

    // Step 3: Click Pay button
    // TODO: Click the pay button
    // Hint: The button text includes "Pay $"

    // Step 4: Verify success
    // TODO: Assert that we're redirected to order confirmation page
    // Hint: URL should contain '/order/'
    // TODO: Assert "Order Confirmed!" text is visible
  });

  test('checkout fails with declined card', async ({ page }) => {
    // Click on first product
    await page.locator('button:has-text("Buy Now")').first().click();

    // TODO: Fill in a declined card number (starts with 0000)
    // Example: '0000123456789012'

    // TODO: Click pay button

    // TODO: Assert that we stay on checkout page (payment failed)
    // Hint: URL should still contain '/checkout/'

    // TODO: Assert that error message appears
    // Hint: Look for text containing "declined" or error message
  });
});

test.describe('Order History', () => {
  test('user can view their orders after purchase', async ({ page }) => {
    // Register, login, and make a purchase
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

    // Navigate to orders page
    // TODO: Click on "My Orders" link in header

    // TODO: Assert that we're on the orders page
    // Hint: URL should be '/orders'

    // TODO: Assert that at least one order is displayed
    // Hint: Look for "Order #" text

    // TODO: Assert the order shows "paid" status
    // Hint: StatusBadge shows status text
  });
});
