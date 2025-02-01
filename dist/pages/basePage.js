"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasePage = void 0;
class BasePage {
    constructor(page) {
        this.page = page;
    }
    async navigate(path) {
        await this.page.goto(path);
    }
    async waitForElement(selector) {
        await this.page.waitForSelector(selector);
    }
}
exports.BasePage = BasePage;
//# sourceMappingURL=basePage.js.map