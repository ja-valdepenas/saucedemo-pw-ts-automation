"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginPage = void 0;
const basePage_1 = require("./basePage");
const test_data_1 = require("../data/test-data");
class LoginPage extends basePage_1.BasePage {
    constructor(page) {
        super(page);
        // Selectors
        this.usernameInput = '#user-name';
        this.passwordInput = '#password';
        this.loginButton = '#login-button';
        this.errorMessage = '[data-test="error"]';
    }
    /**
     * Enter username in the username field
     * @param username - Username to enter
     */
    async enterUsername(username) {
        await this.page.fill(this.usernameInput, username);
    }
    /**
     * Enter password in the password field
     * @param password - Password to enter
     */
    async enterPassword(password) {
        await this.page.fill(this.passwordInput, password);
    }
    /**
     * Click the login button
     */
    async clickLoginButton() {
        await this.page.click(this.loginButton);
    }
    /**
     * Complete login flow with provided credentials
     * @param username - Username to login with
     * @param password - Password to login with
     */
    async login(username, password) {
        const startTime = Date.now();
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLoginButton();
    }
    /**
     * Get the error message text if present
     * @returns Promise<string | null> - The error message text or null if not found
     */
    async getErrorMessage() {
        return await this.page.textContent(this.errorMessage);
    }
    /**
     * Check if error message is visible
     * @returns Promise<boolean> - True if error message is visible
     */
    async isErrorMessageVisible() {
        return await this.page.isVisible(this.errorMessage);
    }
}
exports.LoginPage = LoginPage;
//# sourceMappingURL=loginPage.js.map