"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestHelper = void 0;
class TestHelper {
    static generateRandomEmail() {
        return `test${Math.random().toString(36).substring(7)}@example.com`;
    }
    static getRandomProduct() {
        const products = ['sauce-labs-backpack', 'sauce-labs-bike-light'];
        return products[Math.floor(Math.random() * products.length)];
    }
}
exports.TestHelper = TestHelper;
//# sourceMappingURL=test-helper.js.map