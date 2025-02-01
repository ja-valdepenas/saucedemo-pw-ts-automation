import { TestInfo } from '@playwright/test';
import AllureStep  from 'allure-playwright';

export class ReportHelper {
    /**
     * Attach a screenshot to the Allure report
     */
    static async attachScreenshot(testInfo: TestInfo, name: string = 'screenshot'): Promise<void> {
        const screenshot = await testInfo.attach(name, {
            body: await testInfo.page?.screenshot(),
            contentType: 'image/png'
        });
    }

    /**
     * Add custom metadata to the Allure report
     */
    static addTestMetadata(testInfo: TestInfo, metadata: Record<string, string>): void {
        Object.entries(metadata).forEach(([key, value]) => {
            testInfo.annotations.push({ type: key, description: value });
        });
    }

    /**
     * Log test steps with status in Allure report
     */
    static async logTestStep(step: AllureStep, description: string, action: () => Promise<void>): Promise<void> {
        try {
            await step.step(description, async () => {
                await action();
            });
        } catch (error) {
            console.error(`Step failed: ${description}`, error);
            throw error;
        }
    }

    /**
     * Add environment information to the report
     */
    static addEnvironmentInfo(testInfo: TestInfo, environment: Record<string, string>): void {
        testInfo.annotations.push({
            type: 'environment',
            description: JSON.stringify(environment)
        });
    }

    /**
     * Create a custom report category
     */
    static addTestCategory(testInfo: TestInfo, category: string): void {
        testInfo.annotations.push({ type: 'category', description: category });
    }

    /**
     * Add error details to the report
     */
    static logError(testInfo: TestInfo, error: Error): void {
        testInfo.annotations.push({
            type: 'error',
            description: `${error.name}: ${error.message}\n${error.stack}`
        });
    }

    /**
     * Add performance metrics to the report
     */
    static addPerformanceMetrics(testInfo: TestInfo, metrics: Record<string, number>): void {
        testInfo.annotations.push({
            type: 'performance',
            description: JSON.stringify(metrics)
        });
    }

    /**
     * Format test duration for reporting
     */
    static formatDuration(durationMs: number): string {
        const seconds = Math.floor(durationMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    }
}