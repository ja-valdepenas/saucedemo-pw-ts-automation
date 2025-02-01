import { BasePage } from './basePage';
import { Page, expect } from '@playwright/test';
import { TEST_USERS } from '../data/test-data';

export class LoginPage extends BasePage {
    private readonly usernameInput = '#user-name';
    private readonly passwordInput = '#password';
    private readonly loginButton = '#login-button';
    private readonly errorMessage = '[data-test="error"]';

    constructor(page: Page) {
        super(page);
    }

     /**
     * Verify that all login form elements are visible
     */
    async verifyLoginFormVisible(): Promise<void> {
        await expect(this.page.locator(this.usernameInput)).toBeVisible();
        await expect(this.page.locator(this.passwordInput)).toBeVisible();
        await expect(this.page.locator(this.loginButton)).toBeVisible();
    }

    /**
     * Enter username in the username field
     * @param username - Username to enter
     */
    async enterUsername(username: string): Promise<void> {
        await this.page.fill(this.usernameInput, username);
    }

    /**
     * Enter password in the password field
     * @param password - Password to enter
     */
    async enterPassword(password: string): Promise<void> {
        await this.page.fill(this.passwordInput, password);
    }

    /**
     * Click the login button
     */
    async clickLoginButton(): Promise<void> {
        await this.page.click(this.loginButton);
    }

    /**
     * Complete login flow with provided credentials
     * @param username - Username to login with
     * @param password - Password to login with
     */
    async login(username: string, password: string): Promise<void> {
        const startTime = Date.now();
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }

    /**
     * Get the error message text if present
     * @returns Promise<string | null> - The error message text or null if not found
     */
    async getErrorMessage(): Promise<string | null> {
        return await this.page.textContent(this.errorMessage);
    }

    /**
     * Check if error message is visible
     * @returns Promise<boolean> - True if error message is visible
     */
    async isErrorMessageVisible(): Promise<boolean> {
        return await this.page.isVisible(this.errorMessage);
    }

    
}