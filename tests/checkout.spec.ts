import { test, expect } from '@playwright/test';
import { PageManager } from '../utils/page-manager';
import { PRODUCT_NAMES } from '@pages/inventoryPage';

test.describe.configure({mode: 'parallel'});

test.describe('Checkout Tests', () => {
    let pageManager: PageManager;

    test.beforeEach(async ({ page }) => {
        pageManager = new PageManager(page);
        await pageManager.init();
        await pageManager.loginAsUser('STANDARD');
        await expect(page).toHaveURL(/.*inventory.html/);
    });

    test('TC_07 - Add single product to cart @checkout @smoke', async ({ page }) => {
        // Add random product from inventory page
        const addedProduct = await pageManager.inventoryPage.addProductToCart();
        
        // Verify cart badge on inventory page
        const cartBadgeCount = await pageManager.inventoryPage.getCartBadgeCount();
        expect(cartBadgeCount).toBe(1);
        
        // Go to cart
        await pageManager.inventoryPage.goToCart();
        
        // Verify items in cart
        const cartItems = await pageManager.checkoutPage.getCartItems();
        expect(cartItems.length).toBe(1);

        console.log('One product was added to the cart');
    });
    
    test('TC_08 - Remove product from cart @checkout @smoke', async ({ page }) => {
        // Add random product
        const addedProduct = await pageManager.inventoryPage.addProductToCart();
        expect(await pageManager.inventoryPage.getCartBadgeCount()).toBe(1);
    
        // Remove the same product
        await pageManager.inventoryPage.removeProductFromCart(addedProduct);
        
        // Verify cart badge is not visible on inventory page
        const cartBadgeVisible = await pageManager.inventoryPage.isCartBadgeVisible();
        expect(cartBadgeVisible).toBe(false);
        
        // Go to cart and verify it's empty
        await pageManager.inventoryPage.goToCart();
        const cartItems = await pageManager.checkoutPage.getCartItems();
        expect(cartItems.length).toBe(0);

        console.log('Product was removed from the cart');
    });

    test('TC_09 - Add maximum items to cart @checkout @regression', async ({ page }) => {
        // First count how many "Add to cart" buttons exist 
        const availableProductsCount = await page.$$eval('[data-test^="add-to-cart"]', 
            buttons => buttons.length
        );

        //Add to cart
        const allProducts = Object.values(PRODUCT_NAMES);
        for (const product of allProducts) {
            await pageManager.inventoryPage.addProductToCart(product);
        }
        
        // Navigate to cart
        await pageManager.inventoryPage.goToCart();
        
        // Verify cart items matches the number of products found
        const cartItemsCount = await page.$$eval('[data-test="inventory-item"]', items => items.length);
        expect(cartItemsCount).toBe(availableProductsCount);
    
        // Verify cart badge matches
        const cartBadgeCount = await pageManager.inventoryPage.getCartBadgeCount();
        expect(cartBadgeCount).toBe(availableProductsCount);
        
        // Get all cart items details for price verification
        const cartItems = await page.$$eval('[data-test="inventory-item"]', items => {
            return items.map(item => ({
                name: item.querySelector('[data-test="inventory-item-name"]')?.textContent || '',
                price: parseFloat(item.querySelector('[data-test="inventory-item-price"]')?.textContent?.replace('$', '') || '0')
            }));
        });
    
        // Verify details for all items
        expect(cartItems.length).toBe(availableProductsCount);
        
        // Calculate total price
        const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
        expect(totalPrice).toBeGreaterThan(0);

        console.log('All products were added to the cart');
    });

    test('TC_10 - Add and remove multiple items from cart @checkout @regression', async ({ page }) => {
        // Add three different items to cart
        await pageManager.inventoryPage.addProductToCart(PRODUCT_NAMES.BACKPACK);
        await pageManager.inventoryPage.addProductToCart(PRODUCT_NAMES.BIKE_LIGHT);
        await pageManager.inventoryPage.addProductToCart(PRODUCT_NAMES.BOLT_SHIRT);

        // Verify cart count is 3
        await expect(page.locator('.shopping_cart_badge')).toHaveText('3');

        // Click cart icon
        await pageManager.inventoryPage.goToCart();
        await expect(page).toHaveURL(/.*cart.html/);

        // Verify all products are in cart
        const cartItems = await pageManager.checkoutPage.getCartItems();
        expect(cartItems).toHaveLength(3);
        expect(cartItems.map(item => item.name)).toContain('Sauce Labs Backpack');
        expect(cartItems.map(item => item.name)).toContain('Sauce Labs Bike Light');
        expect(cartItems.map(item => item.name)).toContain('Sauce Labs Bolt T-Shirt');

        // Remove all products one by one
        for (const product of [PRODUCT_NAMES.BACKPACK, PRODUCT_NAMES.BIKE_LIGHT, PRODUCT_NAMES.BOLT_SHIRT]) {
            await page.click(`[data-test="remove-${product}"]`);
        }

        // Verify cart is empty
        await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
        const updatedCartItems = await pageManager.checkoutPage.getCartItems();
        expect(updatedCartItems).toHaveLength(0);

        // Click Continue Shopping and verify redirect
        await page.click('[data-test="continue-shopping"]');
        await expect(page).toHaveURL(/.*inventory.html/);

        console.log('Three products were added to the cart and then removed');
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