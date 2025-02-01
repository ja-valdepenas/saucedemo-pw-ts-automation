"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const page_manager_1 = require("../utils/page-manager");
test_1.test.describe('Inventory', () => {
    let pageManager;
    test_1.test.beforeEach(async ({ page }) => {
        pageManager = new page_manager_1.PageManager(page);
        await pageManager.init();
        await pageManager.loginAsUser('STANDARD');
        await (0, test_1.expect)(page).toHaveURL(/.*inventory.html/);
    });
    (0, test_1.test)('sorting by name Z to A', async () => {
        await pageManager.inventoryPage.selectSortOption('za');
        const productNames = await pageManager.inventoryPage.getProductNames();
        (0, test_1.expect)(pageManager.inventoryPage.isSortedDescending(productNames)).toBeTruthy();
    });
    (0, test_1.test)('sorting by price low to high', async () => {
        await pageManager.inventoryPage.selectSortOption('lohi');
        const productPrices = await pageManager.inventoryPage.getProductPrices();
        (0, test_1.expect)(pageManager.inventoryPage.isSortedAscending(productPrices)).toBeTruthy();
    });
    (0, test_1.test)('sorting by price high to low', async () => {
        await pageManager.inventoryPage.selectSortOption('hilo');
        const productPrices = await pageManager.inventoryPage.getProductPrices();
        (0, test_1.expect)(pageManager.inventoryPage.isSortedDescending(productPrices)).toBeTruthy();
    });
});
//# sourceMappingURL=inventory.spec.js.map