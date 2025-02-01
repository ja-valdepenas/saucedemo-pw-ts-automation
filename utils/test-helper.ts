export class TestHelper {
    static getRandomProduct() {
      const products = ['sauce-labs-backpack', 'sauce-labs-bike-light'];
      return products[Math.floor(Math.random() * products.length)];
    }
  }