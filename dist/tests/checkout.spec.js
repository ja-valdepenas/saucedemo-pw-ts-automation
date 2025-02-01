"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const page_manager_1 = require("../utils/page-manager");
test_1.test.describe('Shopping Cart Functionality', () => {
    let pageManager;
    test_1.test.beforeEach(async ({ page }) => {
        pageManager = new page_manager_1.PageManager(page);
        await pageManager.init();
        await pageManager.loginAsUser('STANDARD');
        await (0, test_1.expect)(page).toHaveURL(/.*inventory.html/);
    });
    (0, test_1.test)('TC_05 - Add single product to cart @tc05 @smoke @cart', async ({ page }) => {
        await pageManager.checkoutPage.addProductToCart(0);
        const cartBadgeCount = await pageManager.checkoutPage.getCartBadgeCount();
        (0, test_1.expect)(cartBadgeCount).toBe(1);
        await pageManager.checkoutPage.clickCartIcon();
        const cartItems = await pageManager.checkoutPage.getCartItems();
        (0, test_1.expect)(cartItems.length).toBe(1);
    });
    (0, test_1.test)('TC_06 - Remove product from cart @regression @cart', async ({ page }) => {
        await pageManager.checkoutPage.addProductToCart(0);
        (0, test_1.expect)(await pageManager.checkoutPage.getCartBadgeCount()).toBe(1);
        await pageManager.checkoutPage.removeProductFromCart(0);
        const cartBadgeVisible = await pageManager.checkoutPage.isCartBadgeVisible();
        (0, test_1.expect)(cartBadgeVisible).toBe(false);
        await pageManager.checkoutPage.clickCartIcon();
        const cartItems = await pageManager.checkoutPage.getCartItems();
        (0, test_1.expect)(cartItems.length).toBe(0);
    });
    (0, test_1.test)('TC_07 - Add maximum items to cart @regression @cart', async ({ page }) => {
        // Get all available products
        const totalProducts = await pageManager.checkoutPage.getTotalProducts();
        // Add all products to cart
        for (let i = 0; i < totalProducts; i++) {
            await pageManager.checkoutPage.addProductToCart(i);
        }
        // Verify cart badge shows correct count
        const cartBadgeCount = await pageManager.checkoutPage.getCartBadgeCount();
        (0, test_1.expect)(cartBadgeCount).toBe(totalProducts);
        // Navigate to cart and verify all products are present
        await pageManager.checkoutPage.clickCartIcon();
        const cartItems = await pageManager.checkoutPage.getCartItems();
        (0, test_1.expect)(cartItems.length).toBe(totalProducts);
        // Verify total price calculation is correct
        const totalPrice = await pageManager.checkoutPage.getTotalPrice();
        const expectedTotal = await pageManager.checkoutPage.calculateExpectedTotal(cartItems);
        (0, test_1.expect)(totalPrice).toBe(expectedTotal);
    });
});
//# sourceMappingURL=checkout.spec.js.map