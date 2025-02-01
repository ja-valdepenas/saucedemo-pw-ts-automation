import { BasePage } from './basePage';
import { Page } from '@playwright/test';

export const PRODUCT_NAMES = {
    BACKPACK: 'sauce-labs-backpack',
    BIKE_LIGHT: 'sauce-labs-bike-light',
    BOLT_SHIRT: 'sauce-labs-bolt-t-shirt',
    FLEECE: 'sauce-labs-fleece-jacket',
    ONESIE: 'sauce-labs-onesie',
    TEST_SHIRT: 'test.allthethings()-t-shirt-(red)'
} as const;

export type ProductName = typeof PRODUCT_NAMES[keyof typeof PRODUCT_NAMES];

export class InventoryPage extends BasePage {
    private readonly productSortContainer = '.product_sort_container';
    private readonly inventoryItemName = '.inventory_item_name';
    private readonly inventoryItemPrice = '.inventory_item_price';
    private readonly addToCartButton = (productName: string) => `[data-test="add-to-cart-${productName}"]`;
    private readonly addToCartDetailsButton = '[data-test="add-to-cart"]';
    private readonly removeButton = (productName: string) => `[data-test="remove-${productName}"]`;
    private readonly cartBadge = '.shopping_cart_badge';
    private readonly cartIcon = '.shopping_cart_link';
    private readonly inventoryItems = '.inventory_item';
    private readonly productDetailsName = '[data-test="inventory-item-name"]';
    private readonly burgerMenu = '#react-burger-menu-btn';
    private readonly logoutLink = '#logout_sidebar_link';

    constructor(page: Page) {
        super(page);
    }

    /**
     * Select sort option from dropdown
     * @param option - Sort option to select
     */
    async selectSortOption(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
        await this.page.selectOption(this.productSortContainer, option);
    }

    /**
     * Get all product names
     * @returns Promise<string[]> Array of product names
     */
    async getProductNames(): Promise<string[]> {
        return await this.page.$$eval(this.inventoryItemName, 
            elements => elements.map(el => el.textContent || ''));
    }

    /**
     * Get all product prices
     * @returns Promise<number[]> Array of product prices
     */
    async getProductPrices(): Promise<number[]> {
        return await this.page.$$eval(this.inventoryItemPrice, 
            elements => elements.map(el => 
                parseFloat(el.textContent?.replace('$', '') || '0')));
    }

    /**
     * Check if array is sorted in ascending order
     */
    isSortedAscending(arr: number[] | string[]): boolean {
        return arr.every((val, idx, a) => !idx || a[idx - 1] <= val);
    }

    /**
     * Check if array is sorted in descending order
     */
    isSortedDescending(arr: number[] | string[]): boolean {
        return arr.every((val, idx, a) => !idx || a[idx - 1] >= val);
    }

    /**
     * Get a random product name
     */
    getRandomProduct(): ProductName {
        const products = Object.values(PRODUCT_NAMES);
        const randomIndex = Math.floor(Math.random() * products.length);
        return products[randomIndex];
    }

    /**
     * Add product to cart by name from inventory page
     * @returns Promise<string> Name of the added product
     */
    async addProductToCart(productName?: ProductName): Promise<string> {
        // If no product name provided, get a random one
        const product = productName || this.getRandomProduct();
        await this.page.click(this.addToCartButton(product));
        return product;
    }

    /**
     * Add product to cart from product details page
     */
    async addProductFromDetails(): Promise<void> {
        await this.page.click(this.addToCartDetailsButton);
    }

    /**
     * Remove product from cart by name
     */
    async removeProductFromCart(productName: string): Promise<void> {
        await this.page.click(this.removeButton(productName));
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
     * Navigate to cart
     */
    async goToCart(): Promise<void> {
        await this.page.click(this.cartIcon);
    }

    /**
     * Get total number of products available
     */
    async getTotalProducts(): Promise<number> {
        return await this.page.$$eval(this.inventoryItems, items => items.length);
    }

    /**
     * Click on a product by its display name
     * @param productName - Display name of the product to click
     */
    async clickProductByName(productName: string): Promise<void> {
        await this.page.locator(this.inventoryItemName).filter({ hasText: productName }).click();
    }

    /**
     * Get product name from details page
     * @returns Promise<string | null> Product name from details page
     */
    async getProductDetailsName(): Promise<string | null> {
        return await this.page.textContent(this.productDetailsName);
    }

    /**
     * Perform logout action through burger menu
     */
    async logout(): Promise<void> {
        await this.page.click(this.burgerMenu);
        await this.page.click(this.logoutLink);
    }

    /**
     * Attempt to access inventory page directly
     */
    async attemptDirectAccess(): Promise<void> {
        await this.page.goto('/inventory.html');
    }

    /**
     * Set a fake session in localStorage for testing purposes
     */
    async setFakeSession(): Promise<void> {
        await this.page.evaluate(() => {
            localStorage.setItem('session-username', 'standard_user');
        });
    }

    /**
     * Wait for products to be loaded and ready
     */
    async waitForProductsReady(): Promise<void> {
        await this.page.waitForSelector('[data-test^="add-to-cart"]', { state: 'visible' });
    }
}