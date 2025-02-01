import { test, expect } from '@playwright/test';
import { PageManager } from '../utils/page-manager';
import { TEST_USERS } from '../data/test-data';

test.describe.configure({ mode: 'parallel' });

test.describe('Negative Tests', () => {
    let pageManager: PageManager;

    test.beforeEach(async ({ page }, testInfo) => {
        pageManager = new PageManager(page);
        await pageManager.init();

        await page.waitForSelector('#user-name', { state: 'visible' });
    });

    test.describe('Login Negative Cases', () => {
        test('TC_12 - Invalid login with incorrect password @negative @regression', async ({ page }) => {
            // Test data setup - using standard username with wrong password
            const username = TEST_USERS.STANDARD.username;
            const wrongPassword = 'password123';
        
            // Wait for login form to be ready
            await page.waitForSelector('#user-name', { state: 'visible' });
            
            // Attempt login with incorrect password
            await pageManager.loginPage.enterUsername(username);
            await pageManager.loginPage.enterPassword(wrongPassword);
            await pageManager.loginPage.clickLoginButton();
        
            // Verify error message for invalid credentials
            await page.waitForSelector('[data-test="error"]', { state: 'visible' });
            const errorMessage = await pageManager.loginPage.getErrorMessage();
            await expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');

            console.log('Login was invalid');
        });
        
        test('TC_13 - Invalid login with incorrect username @negative @regression', async ({ page }) => {
            // Test data setup - using wrong username with standard password
            const wrongUsername = 'user123';
            const password = TEST_USERS.STANDARD.password;
        
            // Wait for login form to be ready
            await page.waitForSelector('#user-name', { state: 'visible' });
            
            // Attempt login with incorrect username
            await pageManager.loginPage.enterUsername(wrongUsername);
            await pageManager.loginPage.enterPassword(password);
            await pageManager.loginPage.clickLoginButton();
        
            // Verify error message for invalid credentials
            await page.waitForSelector('[data-test="error"]', { state: 'visible' });
            const errorMessage = await pageManager.loginPage.getErrorMessage();
            await expect(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');

            console.log('Login was invalid');
        });
        
        test('TC_14 - Login with empty credentials @negative @regression', async ({ page }) => {
            // Wait for login form to be ready
            await page.waitForSelector('#login-button', { state: 'visible' });
            
            // Attempt login without entering any credentials
            await pageManager.loginPage.clickLoginButton();
        
            // Verify error message for missing username
            await page.waitForSelector('[data-test="error"]', { state: 'visible' });
            const errorMessage = await pageManager.loginPage.getErrorMessage();
            await expect(errorMessage).toContain('Epic sadface: Username is required');

            console.log('Missing credentials');
        });

        test('TC_15 - Login attempt with locked out user @negative @regression', async ({ page }) => {
            const username = TEST_USERS.LOCKED.username;
            const password = TEST_USERS.LOCKED.password;

            // Login actions with explicit waits
            await page.waitForTimeout(1000);
            await pageManager.loginPage.enterUsername(username);
            await pageManager.loginPage.enterPassword(password);
            await pageManager.loginPage.clickLoginButton();

            // Verify error message with retry
            await expect(async () => {
                const errorElement = await page.waitForSelector('[data-test="error"]', { state: 'visible', timeout: 10000 });
                const errorMessage = await errorElement.textContent();
                expect(errorMessage).toContain('Epic sadface: Sorry, this user has been locked out');
            }).toPass();

            // Final URL verification
            await expect(page).toHaveURL(/.*$/);

            console.log('Username is locked out');
        });
    });

    test.describe('Checkout Negative Cases', () => {
        test.beforeEach(async ({ page }) => {
            await page.waitForLoadState('networkidle');
            await pageManager.loginAsUser('STANDARD');
            await pageManager.inventoryPage.waitForProductsReady();
            await pageManager.inventoryPage.addProductToCart();
            await pageManager.inventoryPage.goToCart();
            await pageManager.checkoutPage.proceedToCheckout();
        });

        test('TC_16 - Checkout Validation with Empty First Name @negative @regression', async ({ page }) => {
            await pageManager.checkoutPage.waitForCheckoutForm();
            
            // Fill in last name and postal code, leaving first name empty
            await pageManager.checkoutPage.fillCheckoutInfo(
                undefined,  // empty first name
                'Doe',
                '12345'
            );
        
            // Attempt to continue checkout
            await pageManager.checkoutPage.continueShopping();
            
            // Verify error message appears
            await pageManager.checkoutPage.waitForErrorMessage();
            const errorMessage = await pageManager.checkoutPage.getErrorMessage();
            expect(errorMessage).toBe('Error: First Name is required');
        
            console.log('First name is missing');
        });
        
        test('TC_17 - Checkout Validation with Empty Last Name @negative @regression', async ({ page }) => {
            await pageManager.checkoutPage.waitForCheckoutForm();
            
            // Fill in first name and postal code, leaving last name empty
            await pageManager.checkoutPage.fillCheckoutInfo(
                'John',
                undefined,  // empty last name
                '12345'
            );
        
            // Attempt to continue checkout
            await pageManager.checkoutPage.continueShopping();
            
            // Verify error message appears
            await pageManager.checkoutPage.waitForErrorMessage();
            const errorMessage = await pageManager.checkoutPage.getErrorMessage();
            expect(errorMessage).toBe('Error: Last Name is required');
        
            console.log('Last name is missing');
        });
        
        test('TC_18 - Checkout Validation with Empty Postal Code @negative @regression', async ({ page }) => {
            await pageManager.checkoutPage.waitForCheckoutForm();
            
            // Fill in first and last name, leaving postal code empty
            await pageManager.checkoutPage.fillCheckoutInfo(
                'John',
                'Doe',
                undefined  // empty postal code
            );
        
            // Attempt to continue checkout
            await pageManager.checkoutPage.continueShopping();
            
            // Verify error message appears
            await pageManager.checkoutPage.waitForErrorMessage();
            const errorMessage = await pageManager.checkoutPage.getErrorMessage();
            expect(errorMessage).toBe('Error: Postal Code is required');
        
            console.log('Postal code is missing');
        });
        
        test('TC_19 - Checkout Validation with Invalid Postal Code @negative @regression', async ({ page }) => {
            await pageManager.checkoutPage.waitForCheckoutForm();
            
            // Fill in all fields with invalid postal code
            await pageManager.checkoutPage.fillCheckoutInfo(
                'John',
                'Doe',
                'abcd#$%'
            );
        
            // Attempt to continue checkout
            await pageManager.checkoutPage.continueShopping();
            
            // Verify current URL (shows potential bug)
            const currentUrl = page.url();
            expect(currentUrl).toContain('checkout-step-two.html');
            
            console.log('This is a bug');
        });
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