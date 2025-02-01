"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
const page_manager_1 = require("../utils/page-manager");
const test_data_1 = require("../data/test-data");
test_1.test.describe('Login Functionality Tests', () => {
    let pageManager;
    test_1.test.beforeEach(async ({ page }, testInfo) => {
        // Initialize page manager
        pageManager = new page_manager_1.PageManager(page);
        await pageManager.init();
        // Add test metadata
        testInfo.annotations.push({
            type: 'description',
            description: `
                Test ID: ${testInfo.title.split(' - ')[0]}
                Description: ${testInfo.title.split(' - ')[1]}
                Browser: ${testInfo.project.name}
                Date: ${new Date().toISOString()}
            `
        });
    });
    test_1.test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status !== testInfo.expectedStatus) {
            const screenshot = await page.screenshot();
            await testInfo.attach('screenshot-on-failure', {
                body: screenshot,
                contentType: 'image/png'
            });
        }
    });
    (0, test_1.test)('TC_01 - Valid login with standard user credentials @smoke @regression @login', async ({ page }) => {
        const username = test_data_1.TEST_USERS.STANDARD.username;
        const password = test_data_1.TEST_USERS.STANDARD.password;
        test_1.test.info().annotations.push({
            type: 'step',
            description: 'Navigate to login page'
        });
        await (0, test_1.expect)(page).toHaveURL(/.*$/);
        test_1.test.info().annotations.push({
            type: 'step',
            description: 'Enter valid username'
        });
        await pageManager.loginPage.enterUsername(username);
        test_1.test.info().annotations.push({
            type: 'step',
            description: 'Enter valid password'
        });
        await pageManager.loginPage.enterPassword(password);
        test_1.test.info().annotations.push({
            type: 'step',
            description: 'Click login button'
        });
        await pageManager.loginPage.clickLoginButton();
        test_1.test.info().annotations.push({
            type: 'step',
            description: 'Verify successful login'
        });
        await (0, test_1.expect)(page).toHaveURL(/.*inventory.html/);
    });
    (0, test_1.test)('TC_02 - Invalid login with incorrect password @regression @login @negative', async ({ page }) => {
        const username = test_data_1.TEST_USERS.STANDARD.username;
        const wrongPassword = 'password123';
        test_1.test.info().annotations.push({
            type: 'step',
            description: 'Enter valid username'
        });
        await pageManager.loginPage.enterUsername(username);
        test_1.test.info().annotations.push({
            type: 'step',
            description: 'Enter incorrect password'
        });
        await pageManager.loginPage.enterPassword(wrongPassword);
        test_1.test.info().annotations.push({
            type: 'step',
            description: 'Click login button'
        });
        await pageManager.loginPage.clickLoginButton();
        test_1.test.info().annotations.push({
            type: 'step',
            description: 'Verify error message'
        });
        const errorMessage = await pageManager.loginPage.getErrorMessage();
        await (0, test_1.expect)(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
    });
    (0, test_1.test)('TC_03 - Invalid login with incorrect username @regression @login @negative', async ({ page }) => {
        const wrongUsername = 'user123';
        const password = test_data_1.TEST_USERS.STANDARD.password;
        test_1.test.info().annotations.push({
            type: 'step',
            description: 'Enter incorrect username'
        });
        await pageManager.loginPage.enterUsername(wrongUsername);
        test_1.test.info().annotations.push({
            type: 'step',
            description: 'Enter valid password'
        });
        await pageManager.loginPage.enterPassword(password);
        test_1.test.info().annotations.push({
            type: 'step',
            description: 'Click login button'
        });
        await pageManager.loginPage.clickLoginButton();
        test_1.test.info().annotations.push({
            type: 'step',
            description: 'Verify error message'
        });
        const errorMessage = await pageManager.loginPage.getErrorMessage();
        await (0, test_1.expect)(errorMessage).toContain('Epic sadface: Username and password do not match any user in this service');
    });
    (0, test_1.test)('TC_04 - Login with empty credentials @regression @login @negative', async ({ page }) => {
        test_1.test.info().annotations.push({
            type: 'step',
            description: 'Leave username and password fields empty'
        });
        // Fields are empty by default
        test_1.test.info().annotations.push({
            type: 'step',
            description: 'Click login button'
        });
        await pageManager.loginPage.clickLoginButton();
        test_1.test.info().annotations.push({
            type: 'step',
            description: 'Verify error message'
        });
        const errorMessage = await pageManager.loginPage.getErrorMessage();
        await (0, test_1.expect)(errorMessage).toContain('Epic sadface: Username is required');
    });
});
//# sourceMappingURL=login.spec.js.map