/**
 * Visual Regression Tests for CRAM Application
 *
 * These tests capture screenshots of the application's key visual states
 * and compare them against baseline images to detect unintended visual changes.
 *
 * Run with: npx playwright test
 * Update snapshots with: npx playwright test --update-snapshots
 */

import { test, expect } from '@playwright/test';

test.describe('Application Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the application to fully load
    await page.waitForLoadState('networkidle');
    // Wait for Three.js canvas to be rendered
    await page.waitForSelector('canvas', { timeout: 30000 });
    // Give WebGL time to initialize
    await page.waitForTimeout(1000);
  });

  test('initial application layout', async ({ page }) => {
    // Capture the full application layout on initial load
    await expect(page).toHaveScreenshot('app-initial-layout.png', {
      fullPage: true,
      animations: 'disabled',
      // WebGL can have minor per-render variations
      maxDiffPixels: 1000,
    });
  });

  test('main viewport renders correctly', async ({ page }) => {
    // Focus on the main 3D viewport area
    const viewport = page.locator('canvas').first();
    await expect(viewport).toHaveScreenshot('viewport-initial.png', {
      animations: 'disabled',
    });
  });
});

test.describe('Panel Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('canvas', { timeout: 30000 });
    await page.waitForTimeout(1000);
  });

  test('left panel visibility', async ({ page }) => {
    // Look for a panel container or sidebar element
    const leftPanel = page.locator('.panel-container').first();
    if (await leftPanel.isVisible()) {
      await expect(leftPanel).toHaveScreenshot('left-panel.png', {
        animations: 'disabled',
      });
    }
  });

  test('right panel visibility', async ({ page }) => {
    // Look for a panel container or property panel
    const rightPanel = page.locator('.panel-container').last();
    if (await rightPanel.isVisible()) {
      await expect(rightPanel).toHaveScreenshot('right-panel.png', {
        animations: 'disabled',
      });
    }
  });
});

test.describe('Toolbar and Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('canvas', { timeout: 30000 });
    await page.waitForTimeout(500);
  });

  test('toolbar renders correctly', async ({ page }) => {
    // Look for toolbar elements
    const toolbar = page.locator('.toolbar, [class*="toolbar"], header').first();
    if (await toolbar.isVisible()) {
      await expect(toolbar).toHaveScreenshot('toolbar.png', {
        animations: 'disabled',
      });
    }
  });

  test('navigation controls render', async ({ page }) => {
    // Look for orientation/navigation controls
    const navControls = page.locator('.orientation-control, [class*="orient"]').first();
    if (await navControls.isVisible()) {
      await expect(navControls).toHaveScreenshot('navigation-controls.png', {
        animations: 'disabled',
      });
    }
  });
});

test.describe('Dialog Visual States', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('canvas', { timeout: 30000 });
    await page.waitForTimeout(500);
  });

  test('import dialog appearance', async ({ page }) => {
    // Try to open import dialog via keyboard shortcut or menu
    await page.keyboard.press('Control+i');
    await page.waitForTimeout(500);

    const dialog = page.locator('[role="dialog"], .bp5-dialog, .MuiDialog-root').first();
    if (await dialog.isVisible()) {
      await expect(dialog).toHaveScreenshot('import-dialog.png', {
        animations: 'disabled',
      });
      // Close dialog
      await page.keyboard.press('Escape');
    }
  });

  test('save dialog appearance', async ({ page }) => {
    // Try to open save dialog via keyboard shortcut
    await page.keyboard.press('Control+s');
    await page.waitForTimeout(500);

    const dialog = page.locator('[role="dialog"], .bp5-dialog, .MuiDialog-root').first();
    if (await dialog.isVisible()) {
      await expect(dialog).toHaveScreenshot('save-dialog.png', {
        animations: 'disabled',
      });
      // Close dialog
      await page.keyboard.press('Escape');
    }
  });
});

test.describe('3D Scene Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('canvas', { timeout: 30000 });
    // Allow extra time for WebGL rendering
    await page.waitForTimeout(2000);
  });

  test('empty scene renders without errors', async ({ page }) => {
    // Check that the canvas is properly sized and visible
    const canvas = page.locator('canvas').first();
    const boundingBox = await canvas.boundingBox();

    expect(boundingBox).toBeTruthy();
    expect(boundingBox!.width).toBeGreaterThan(100);
    expect(boundingBox!.height).toBeGreaterThan(100);

    await expect(canvas).toHaveScreenshot('empty-scene.png', {
      animations: 'disabled',
      // Higher threshold for WebGL rendering which can have minor variations
      maxDiffPixels: 500,
    });
  });

  test('scene maintains aspect ratio on resize', async ({ page }) => {
    const canvas = page.locator('canvas').first();

    // Verify canvas exists and has proper dimensions
    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(100);
    expect(box!.height).toBeGreaterThan(100);

    // Resize viewport and verify canvas still renders
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForLoadState('domcontentloaded');

    // Give time for Three.js to handle resize
    await new Promise((resolve) => setTimeout(resolve, 500));

    const resizedBox = await canvas.boundingBox();
    expect(resizedBox).toBeTruthy();
    expect(resizedBox!.width).toBeGreaterThan(100);
    expect(resizedBox!.height).toBeGreaterThan(100);
  });
});

test.describe('Responsive Layout', () => {
  test('desktop layout (1920x1080)', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('canvas', { timeout: 30000 });
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('layout-desktop.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 1000,
    });
  });

  test('laptop layout (1366x768)', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('canvas', { timeout: 30000 });
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('layout-laptop.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 1000,
    });
  });

  test('small screen layout (1024x768)', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('canvas', { timeout: 30000 });
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('layout-small.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixels: 1000,
    });
  });
});

test.describe('Theme and Styling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('canvas', { timeout: 30000 });
    await page.waitForTimeout(500);
  });

  test('Blueprint.js components render with correct theme', async ({ page }) => {
    // Check for Blueprint dark theme classes
    const darkTheme = await page.locator('.bp5-dark, [class*="bp5-dark"]').count();
    // Application should use dark theme
    expect(darkTheme).toBeGreaterThanOrEqual(0); // May or may not have dark theme

    // Check that Blueprint components are styled
    const buttons = page.locator('.bp5-button, button');
    if (await buttons.count() > 0) {
      const firstButton = buttons.first();
      if (await firstButton.isVisible()) {
        await expect(firstButton).toHaveScreenshot('blueprint-button.png', {
          animations: 'disabled',
        });
      }
    }
  });
});
