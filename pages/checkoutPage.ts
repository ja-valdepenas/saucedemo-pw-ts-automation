import { BasePage } from './basePage';
import { Page } from '@playwright/test';

export interface CartItem {
    name: string;
    price: number;
}

export class CheckoutPage extends BasePage {
    private readonly cartItem = '.cart_item';
    private readonly cartItemName = '.inventory_item_name';
    private readonly cartItemPrice = '.inventory_item_price';
    private readonly checkoutButton = '[data-test="checkout"]';
    private readonly continueButton = '[data-test="continue"]';
    private readonly finishButton = '[data-test="finish"]';
    private readonly totalPrice = '.summary_subtotal_label';
    private readonly cartBadge = '.shopping_cart_badge';
    private readonly cartIcon = '.shopping_cart_link';
    private readonly inventoryItems = '.inventory_item';
    private readonly addToCartButton = (index: number) => `[data-test="add-to-cart-sauce-labs-${index}"]`;
    private readonly removeButton = (index: number) => `[data-test="remove-sauce-labs-${index}"]`;
    private readonly firstNameInput = '[data-test="firstName"]';
    private readonly lastNameInput = '[data-test="lastName"]';
    private readonly postalCodeInput = '[data-test="postalCode"]';
    private readonly errorMessage = '[data-test="error"]';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Add product to cart by index
     */
    async addProductToCart(index: number): Promise<void> {
        await this.page.click(this.addToCartButton(index));
    }

    /**
     * Remove product from cart by index
     */
    async removeProductFromCart(index: number): Promise<void> {
        await this.page.click(this.removeButton(index));
    }

    /**
     * Get cart badge count
     */
    async getCartBadgeCount(): Promise<number> {
        const badge = await this.page.$(this.cartBadge);
        if (!badge) return 0;
        const text = await badge.textContent();
        return parseInt(text || '0');
    }

    /**
     * Check if cart badge is visible
     */
    async isCartBadgeVisible(): Promise<boolean> {
        return await this.page.isVisible(this.cartBadge);
    }

    /**
     * Click cart icon to view cart
     */
    async clickCartIcon(): Promise<void> {
        await this.page.click(this.cartIcon);
    }

    /**
     * Get total available products
     */
    async getTotalProducts(): Promise<number> {
        return await this.page.$$eval(this.inventoryItems, items => items.length);
    }

    /**
     * Get all items in cart
     */
    async getCartItems(): Promise<CartItem[]> {
        const items = await this.page.$$(this.cartItem);
        const cartItems: CartItem[] = [];

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
    async getTotalPrice(): Promise<number> {
        const priceElement = await this.page.$(this.totalPrice);
        const priceText = await priceElement?.textContent();
        return parseFloat(priceText?.replace('Item total: $', '') || '0');
    }

    /**
     * Calculate expected total from cart items
     */
    calculateExpectedTotal(items: CartItem[]): number {
        return Number(items.reduce((total, item) => total + item.price, 0).toFixed(2));
    }

    /**
     * Proceed to checkout
     */
    async proceedToCheckout(): Promise<void> {
        await this.page.click(this.checkoutButton);
    }

    /**
     * Continue to next step
     */
    async continueShopping(): Promise<void> {
        await this.page.click(this.continueButton);
    }

    /**
     * Complete checkout
     */
    async finishCheckout(): Promise<void> {
        await this.page.click(this.finishButton);
    }

    /**
     * Fill checkout information
     */
    async fillCheckoutInfo(firstName?: string, lastName?: string, postalCode?: string): Promise<void> {
        if (firstName) {
            await this.page.fill(this.firstNameInput, firstName);
        }
        if (lastName) {
            await this.page.fill(this.lastNameInput, lastName);
        }
        if (postalCode) {
            await this.page.fill(this.postalCodeInput, postalCode);
        }
    }

    /**
     * Get error message text
     */
    async getErrorMessage(): Promise<string | null> {
        return await this.page.textContent(this.errorMessage);
    }

    /**
     * Wait for form to be ready
     */
    async waitForCheckoutForm(): Promise<void> {
        await this.page.waitForSelector(this.firstNameInput, { state: 'visible' });
    }

    /**
     * Wait for error message
     */
    async waitForErrorMessage(): Promise<void> {
        await this.page.waitForSelector(this.errorMessage, { state: 'visible' });
    }
}