import { Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { InventoryPage } from '../pages/inventoryPage';
import { CheckoutPage } from '../pages/checkoutPage';
import { TEST_USERS, UserType } from '../data/test-data';

export class PageManager {
    private readonly page: Page;
    private _loginPage?: LoginPage;
    private _inventoryPage?: InventoryPage;
    private _checkoutPage?: CheckoutPage;
    private _currentUser?: UserType;

    constructor(page: Page) {
        this.page = page;
    }

    // Lazy initialization of page objects
    get loginPage(): LoginPage {
        if (!this._loginPage) {
            this._loginPage = new LoginPage(this.page);
        }
        return this._loginPage;
    }

    get inventoryPage(): InventoryPage {
        if (!this._inventoryPage) {
            this._inventoryPage = new InventoryPage(this.page);
        }
        return this._inventoryPage;
    }

    get checkoutPage(): CheckoutPage {
        if (!this._checkoutPage) {
            this._checkoutPage = new CheckoutPage(this.page);
        }
        return this._checkoutPage;
    }

    /**
     * Initialize with optional user type
     * @param userType - Type of user to login as (optional)
     */
    async init(userType?: UserType) {
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
    async loginAsUser(userType: UserType) {
        const user = TEST_USERS[userType];
        await this.loginPage.login(user.username, user.password);
        this._currentUser = userType;
    }

    /**
     * Get the current logged in user type
     * @returns The current user type or undefined if not logged in
     */
    getCurrentUser(): UserType | undefined {
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
    isUserType(userType: UserType): boolean {
        return this._currentUser === userType;
    }

}