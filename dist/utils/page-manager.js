"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageManager = void 0;
const loginPage_1 = require("../pages/loginPage");
const inventoryPage_1 = require("../pages/inventoryPage");
const checkoutPage_1 = require("../pages/checkoutPage");
const test_data_1 = require("../data/test-data");
class PageManager {
    constructor(page) {
        this.page = page;
    }
    // Lazy initialization of page objects
    get loginPage() {
        if (!this._loginPage) {
            this._loginPage = new loginPage_1.LoginPage(this.page);
        }
        return this._loginPage;
    }
    get inventoryPage() {
        if (!this._inventoryPage) {
            this._inventoryPage = new inventoryPage_1.InventoryPage(this.page);
        }
        return this._inventoryPage;
    }
    get checkoutPage() {
        if (!this._checkoutPage) {
            this._checkoutPage = new checkoutPage_1.CheckoutPage(this.page);
        }
        return this._checkoutPage;
    }
    /**
     * Initialize the application with optional user type
     * @param userType - Type of user to login as (optional)
     */
    async init(userType) {
        await this.page.goto('/', { waitUntil: 'networkidle' });
        // Wait for the login form to be visible
        await this.page.waitForSelector('#login-button', { state: 'visible' });
        if (userType) {
            await this.loginAsUser(userType);
        }
    }
    /**
     * Login as a specific user type
     * @param userType - Type of user to login as
     */
    async loginAsUser(userType) {
        const user = test_data_1.TEST_USERS[userType];
        await this.loginPage.login(user.username, user.password);
        this._currentUser = userType;
    }
    /**
     * Get the current logged in user type
     * @returns The current user type or undefined if not logged in
     */
    getCurrentUser() {
        return this._currentUser;
    }
    /**
     * Reset the application state
     */
    async reset() {
        this._currentUser = undefined;
        await this.page.goto('/');
    }
    /**
     * Check if current user is of specific type
     * @param userType - User type to check
     */
    isUserType(userType) {
        return this._currentUser === userType;
    }
}
exports.PageManager = PageManager;
//# sourceMappingURL=page-manager.js.map