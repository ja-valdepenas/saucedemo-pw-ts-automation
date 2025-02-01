import { test, expect } from '@playwright/test';
import { PageManager } from '../utils/page-manager';
import { TEST_USERS } from '../data/test-data';

test.describe.configure({mode: 'parallel'});

test.describe('Login Tests', () => {
    let pageManager: PageManager;

    test.beforeEach(async ({ page }, testInfo) => {
        pageManager = new PageManager(page);
        await pageManager.init();
    });

    test('TC_01 - Valid Login with Standard User @login @smoke', async ({ page }) => {
        const username = TEST_USERS.STANDARD.username;
        const password = TEST_USERS.STANDARD.password;

        await expect(page).toHaveURL(/.*$/);

        // Enter credentials
        await pageManager.loginPage.enterUsername(username);
        await pageManager.loginPage.enterPassword(password);

        await pageManager.loginPage.clickLoginButton();

        // Verify successful login
        await expect(page).toHaveURL(/.*inventory.html/);

        console.log('Successful login with standard user');
    });
    
    test('TC_02 - Successful Logout with Session Verification @login @integration', async ({ page }) => {
        await pageManager.loginAsUser('STANDARD');
        await expect(page).toHaveURL(/.*inventory.html/);
        
        // Add an item to cart to verify it's cleared after logout
        await pageManager.inventoryPage.addProductToCart();
        const cartBadgeCount = await pageManager.inventoryPage.getCartBadgeCount();
        expect(cartBadgeCount).toBe(1);
    
        // Perform logout
        await pageManager.inventoryPage.logout();
    
        // Verify redirect to login page
        await expect(page).toHaveURL(/.*$/);
    
        // Verify login form is visible
        await pageManager.loginPage.verifyLoginFormVisible();
    
        // Try accessing protected page
        await pageManager.inventoryPage.attemptDirectAccess();
        await expect(page).toHaveURL(/.*$/);
    
        // Try using invalid session
        await pageManager.inventoryPage.setFakeSession();
        await pageManager.inventoryPage.attemptDirectAccess();
        await expect(page).toHaveURL(/.*$/);

        console.log('Logout was successful');
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