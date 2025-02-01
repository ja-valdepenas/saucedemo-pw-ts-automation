"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryPage = void 0;
const basePage_1 = require("./basePage");
class InventoryPage extends basePage_1.BasePage {
    constructor(page) {
        super(page);
        // Selectors
        this.productSortContainer = '.product_sort_container';
        this.inventoryItemName = '.inventory_item_name';
        this.inventoryItemPrice = '.inventory_item_price';
    }
    /**
     * Select sort option from dropdown
     * @param option - Sort option to select
     */
    async selectSortOption(option) {
        await this.page.selectOption(this.productSortContainer, option);
    }
    /**
     * Get all product names
     * @returns Promise<string[]> Array of product names
     */
    async getProductNames() {
        return await this.page.$$eval(this.inventoryItemName, elements => elements.map(el => el.textContent || ''));
    }
    /**
     * Get all product prices
     * @returns Promise<number[]> Array of product prices
     */
    async getProductPrices() {
        return await this.page.$$eval(this.inventoryItemPrice, elements => elements.map(el => parseFloat(el.textContent?.replace('$', '') || '0')));
    }
    /**
     * Check if array is sorted in ascending order
     */
    isSortedAscending(arr) {
        return arr.every((val, idx, a) => !idx || a[idx - 1] <= val);
    }
    /**
     * Check if array is sorted in descending order
     */
    isSortedDescending(arr) {
        return arr.every((val, idx, a) => !idx || a[idx - 1] >= val);
    }
}
exports.InventoryPage = InventoryPage;
//# sourceMappingURL=inventoryPage.js.map