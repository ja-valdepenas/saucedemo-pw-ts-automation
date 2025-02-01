"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    testDir: './tests',
    timeout: 30000,
    retries: 1,
    workers: 3,
    reporter: [
        ['line'],
        ['allure-playwright', {
                detail: true,
                outputFolder: 'allure-results',
                suiteTitle: false,
            }],
        ['html', { outputFolder: 'html-report' }]
    ],
    use: {
        baseURL: 'https://www.saucedemo.com',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
    },
};
exports.default = config;
//# sourceMappingURL=playwright.config.js.map