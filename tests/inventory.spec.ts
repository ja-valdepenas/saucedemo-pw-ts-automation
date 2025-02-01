import { test, expect } from '@playwright/test';
import { PageManager } from '../utils/page-manager';

test.describe.configure({mode: 'parallel'});

test.describe('Inventory Tests', () => {
    let pageManager: PageManager;

    test.beforeEach(async ({ page }) => {
        pageManager = new PageManager(page);
        await pageManager.init();
        await pageManager.loginAsUser('STANDARD');
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test('TC_03 - Sort Products by Name (Z to A) @inventory @regression', async ({ }) => {
        try {
            // Select sort option
            await pageManager.inventoryPage.selectSortOption('za');
            
            // Explicit wait and verification with retry
            await expect(async () => {
                const productNames = await pageManager.inventoryPage.getProductNames();
                console.log('Product names after sorting:', productNames);
                expect(pageManager.inventoryPage.isSortedDescending(productNames),
                    'Products should be sorted in descending order').toBeTruthy();
            }).toPass({ timeout: 10000 }); 
            
        } catch (error) {
            console.error('Failed to sort products by name Z to A:', error);
            throw error;
        }
    });

    test('TC_04 - Sort Products by Price (Low to High) @inventory @regression', async ({ }) => {
        try {
            // Select sort option
            await pageManager.inventoryPage.selectSortOption('lohi');
            
            // Explicit wait and verification
            await expect(async () => {
                const productPrices = await pageManager.inventoryPage.getProductPrices();
                // Log prices for debugging
                console.log('Product prices after sorting:', productPrices);
                expect(pageManager.inventoryPage.isSortedAscending(productPrices),
                    'Products should be sorted by price in ascending order').toBeTruthy();
            }).toPass({ timeout: 10000 });

        } catch (error) {
            console.error('Failed to sort products by price low to high:', error);
            throw error;
        }
    });

    test('TC_05 - Sort Products by Price (High to Low) @inventory @regression', async ({ }) => {
        try {
            await pageManager.inventoryPage.selectSortOption('hilo');
            
            // Add explicit wait and verification
            await expect(async () => {
                const productPrices = await pageManager.inventoryPage.getProductPrices();
                // Log prices for debugging
                console.log('Product prices after sorting:', productPrices);
                expect(pageManager.inventoryPage.isSortedDescending(productPrices),
                    'Products should be sorted by price in descending order').toBeTruthy();
            }).toPass({ timeout: 10000 });

            // Check if first price is indeed highest
            const prices = await pageManager.inventoryPage.getProductPrices();
            expect(Math.max(...prices), 'First product should have highest price').toBe(prices[0]);

        } catch (error) {
            console.error('Failed to sort products by price high to low:', error);
            throw error;
        }
    });

    test('TC_06 - Add Multiple Items from Product Details @inventory @integration', async ({ page }) => {
        // Click on first product
        await pageManager.inventoryPage.clickProductByName('Sauce Labs Backpack');
        await expect(page).toHaveURL(/.*inventory-item.html/);
        
        // Verify the correct product page
        const productTitle = await pageManager.inventoryPage.getProductDetailsName();
        expect(productTitle).toBe('Sauce Labs Backpack');

        // Verify product price
        const backpackPrice = await page.textContent('.inventory_details_price');
        expect(backpackPrice).toBe('$29.99');

        // Add to cart and verify count
        await pageManager.inventoryPage.addProductFromDetails();
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

        // Go back to products
        await page.click('[data-test="back-to-products"]');
        await expect(page).toHaveURL(/.*inventory.html/);

        // Add second product
        await pageManager.inventoryPage.clickProductByName('Sauce Labs Bike Light');
        const bikeLightPrice = await page.textContent('.inventory_details_price');
        expect(bikeLightPrice).toBe('$9.99');
        await pageManager.inventoryPage.addProductFromDetails();
        await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

        // Go to cart
        await pageManager.inventoryPage.goToCart();
        await expect(page).toHaveURL(/.*cart.html/);

        // Verify both products are listed
        const cartItems = await pageManager.checkoutPage.getCartItems();
        expect(cartItems).toHaveLength(2);
        expect(cartItems[0].name).toContain('Backpack');
        expect(cartItems[1].name).toContain('Bike Light');

        // 10. Verify total price
        const total = cartItems.reduce((sum, item) => sum + item.price, 0);
        expect(total).toBe(39.98); // $29.99 + $9.99
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