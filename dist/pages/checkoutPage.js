"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutPage = void 0;
const basePage_1 = require("./basePage");
class CheckoutPage extends basePage_1.BasePage {
    constructor(page) {
        super(page);
        // Selectors
        this.cartItem = '.cart_item';
        this.cartItemName = '.inventory_item_name';
        this.cartItemPrice = '.inventory_item_price';
        this.checkoutButton = '[data-test="checkout"]';
        this.continueButton = '[data-test="continue"]';
        this.finishButton = '[data-test="finish"]';
        this.totalPrice = '.summary_subtotal_label';
        this.cartBadge = '.shopping_cart_badge';
        this.cartIcon = '.shopping_cart_link';
        this.inventoryItems = '.inventory_item';
        this.addToCartButton = (index) => `[data-test="add-to-cart-sauce-labs-${index}"]`;
        this.removeButton = (index) => `[data-test="remove-sauce-labs-${index}"]`;
    }
    /**
     * Add product to cart by index
     */
    async addProductToCart(index) {
        await this.page.click(this.addToCartButton(index));
    }
    /**
     * Remove product from cart by index
     */
    async removeProductFromCart(index) {
        await this.page.click(this.removeButton(index));
    }
    /**
     * Get cart badge count
     */
    async getCartBadgeCount() {
        const badge = await this.page.$(this.cartBadge);
        if (!badge)
            return 0;
        const text = await badge.textContent();
        return parseInt(text || '0');
    }
    /**
     * Check if cart badge is visible
     */
    async isCartBadgeVisible() {
        return await this.page.isVisible(this.cartBadge);
    }
    /**
     * Click cart icon to view cart
     */
    async clickCartIcon() {
        await this.page.click(this.cartIcon);
    }
    /**
     * Get total available products
     */
    async getTotalProducts() {
        return await this.page.$$eval(this.inventoryItems, items => items.length);
    }
    /**
     * Get all items in cart
     */
    async getCartItems() {
        const items = await this.page.$$(this.cartItem);
        const cartItems = [];
        for (const item of items) {
            const name = await item.$(this.cartItemName);
            const price = await item.$(this.cartItemPrice);
            cartItems.push({
                name: (await name?.textContent()) || '',
                price: parseFloat((await price?.textContent())?.replace('$', '') || '0')
            });
        }
        return cartItems;
    }
    /**
     * Get total price from cart
     */
    async getTotalPrice() {
        const priceElement = await this.page.$(this.totalPrice);
        const priceText = await priceElement?.textContent();
        return parseFloat(priceText?.replace('Item total: $', '') || '0');
    }
    /**
     * Calculate expected total from cart items
     */
    calculateExpectedTotal(items) {
        return Number(items.reduce((total, item) => total + item.price, 0).toFixed(2));
    }
    /**
     * Proceed to checkout
     */
    async proceedToCheckout() {
        await this.page.click(this.checkoutButton);
    }
    /**
     * Continue to next step
     */
    async continueShopping() {
        await this.page.click(this.continueButton);
    }
    /**
     * Complete checkout
     */
    async finishCheckout() {
        await this.page.click(this.finishButton);
    }
}
exports.CheckoutPage = CheckoutPage;
//# sourceMappingURL=checkoutPage.js.map