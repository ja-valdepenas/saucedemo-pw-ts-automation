# SauceDemo E2E Test Automation Framework

A comprehensive end-to-end testing suite for the SauceDemo web application using Playwright with TypeScript. This framework implements the Page Object Model pattern and includes detailed reporting via Allure.

## 🔍 Features

- **TypeScript Implementation**: Strong typing and better maintainability
- **Page Object Model**: Modular and reusable page components
- **Parallel Execution**: Optimized test execution with worker threads
- **Comprehensive Reporting**: Detailed Allure reports with screenshots and videos
- **Cross-browser Testing**: Support for Chromium, Firefox, and WebKit
- **CI/CD Ready**: Configured for continuous integration
- **Test Categories**: Organized test suites (Smoke, Regression, E2E, etc.)

## 🏗️ Project Structure

```
project/
├── tests/            # Test suites
├── pages/            # Page Object Models
├── utils/            # Helper functions
├── data/             # Test data
├── allure-report/    # Test reports
└── config files      # TypeScript and Playwright configs
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm (Node Package Manager)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ja-valdepenas/saucedemo-pw-ts-automation.git
cd saucedemo-pw-ts-automation
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers:
```bash
npx playwright install
```

## 🎯 Running Tests

### Test Execution Commands

```bash
# Run all tests
npm run test

# Run with UI mode
npm run test:headed

# Run specific test categories
npm run test:smoke         # Smoke tests
npm run test:regression    # Regression tests
npm run test:e2e          # End-to-end tests
npm run test:integration  # Integration tests
npm run test:negative     # Negative test cases

# Run specific features
npm run test:login        # Login tests
npm run test:checkout     # Checkout tests
npm run test:inventory    # Inventory tests

# Run with Allure reporting
npm run test:allure       # Run tests with Allure reporter
npm run allure:report     # Generate and open Allure report
```

## 📊 Test Coverage

### Key Test Scenarios

1. **Login/Authentication** (TC_01, TC_02)
   - Valid login flows
   - Session management
   - Logout verification

2. **Inventory Management** (TC_03 - TC_06)
   - Product sorting
   - Product details
   - Inventory interactions

3. **Shopping Cart** (TC_07 - TC_10)
   - Add/remove items
   - Cart updates
   - Quantity management

4. **Checkout Process** (TC_11)
   - Complete purchase flow
   - Order confirmation
   - Price calculations

5. **Negative Test Cases** (TC_12 - TC_19)
   - Invalid login attempts
   - Form validations
   - Error handling

## 📝 Test Plan Overview

### Scope
- Login functionality
- Product inventory management
- Shopping cart operations
- Checkout process
- User session handling
- Field validations
- Sorting and filtering capabilities

### Test Types
- Smoke Tests: Critical path verification
- Regression Tests: Comprehensive coverage
- Integration Tests: Cross-functional flows
- E2E Tests: Complete user journeys
- Negative Tests: Error handling and validation

## 📈 Reporting

The framework uses Allure Reporter for detailed test reporting:

- Test execution results
- Screenshots on failure
- Video recordings
- Step-by-step execution logs
- Test duration and trends

To view the report:
```bash
npm run allure:report
```

## 🛠️ Framework Components

### Page Objects
- `LoginPage`: Authentication flows
- `InventoryPage`: Product listing and management
- `CheckoutPage`: Purchase process
- `BasePage`: Common functionality

### Utilities
- `PageManager`: Page object initialization and management
- `TestHelper`: Common test utilities
- `ReportHelper`: Reporting utilities

## 📽️ YouTube Video (Demo)

[SauceDemo Test Automation Framework with Test Cases, Test Plan and Github Repository](https://youtu.be/UG1QiB_FfRk)

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support and queries, please open an issue in the repository.
