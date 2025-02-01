import { test, expect } from '@playwright/test';
import { PageManager } from '../utils/page-manager';
import { PRODUCT_NAMES } from '../pages/inventoryPage';

test.describe.configure({mode: 'parallel'});

test.describe('E2E Happy Path Tests', () => {
    let pageManager: PageManager;

    test.beforeEach(async ({ page }) => {
        pageManager = new PageManager(page);
        await pageManager.init();
        await pageManager.loginAsUser('STANDARD');
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test('TC_11 - Complete checkout process with multiple items @happyPath @e2e @smoke', async ({ page }) => {
        // Add items for cart
        await pageManager.inventoryPage.addProductToCart(PRODUCT_NAMES.BACKPACK);
        await pageManager.inventoryPage.addProductToCart(PRODUCT_NAMES.BIKE_LIGHT);
        await pageManager.inventoryPage.addProductToCart(PRODUCT_NAMES.BOLT_SHIRT);
        await pageManager.inventoryPage.addProductToCart(PRODUCT_NAMES.FLEECE);

        // Click on the cart icon
        await pageManager.inventoryPage.goToCart();
        await expect(page).toHaveURL(/.*cart.html/);

        // Click the Checkout button
        await pageManager.checkoutPage.proceedToCheckout();
        await expect(page).toHaveURL(/.*checkout-step-one.html/);

        // Enter checkout information
        const firstName = 'John';
        const lastName = 'Doe';
        const postalCode = '12345';
        await page.fill('[data-test="firstName"]', firstName);
        await page.fill('[data-test="lastName"]', lastName);
        await page.fill('[data-test="postalCode"]', postalCode);

        // Click the Continue button
        await pageManager.checkoutPage.continueShopping();
        await expect(page).toHaveURL(/.*checkout-step-two.html/);

        // Get all item prices and calculate total
        const itemPrices = await page.$$eval('[data-test="inventory-item-price"]', 
            elements => elements.map(el => el.textContent?.replace('$', '').trim() || '0')
        );
        
        // Convert prices to cents to avoid floating point issues
        const pricesInCents = itemPrices.map(price => Math.round(parseFloat(price) * 100));
        const totalInCents = pricesInCents.reduce((sum, price) => sum + price, 0);
        const calculatedTotal = totalInCents / 100;
        
        // Get the displayed subtotal using the same cents conversion
        const subtotalText = await page.textContent('[data-test="subtotal-label"]');
        const displayedTotalStr = subtotalText?.replace('Item total: $', '').trim() || '0';
        const displayedTotalInCents = Math.round(parseFloat(displayedTotalStr) * 100);
        const displayedTotal = displayedTotalInCents / 100;
        
        // Verify totals match
        expect(calculatedTotal).toBe(displayedTotal);

        // Additional verification: log the prices for debugging
        console.log('Individual prices:', itemPrices);
        console.log('Calculated total:', calculatedTotal);
        console.log('Displayed total:', displayedTotal);

        // Click the "Finish" button
        await pageManager.checkoutPage.finishCheckout();
        await expect(page).toHaveURL(/.*checkout-complete.html/);

        // Verify order confirmation
        const thankYouMessage = await page.textContent('.complete-header');
        expect(thankYouMessage).toBe('Thank you for your order!');
    });

    test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status !== testInfo.expectedStatus) {
            const screenshot = await page.screenshot();
            await testInfo.attach('screenshot-on-failure', {
                body: screenshot,
                contentType: 'image/png'
            });
        }
    });
});