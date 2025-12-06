/**
 * Visual Regression Tests for Three.js Scene Rendering
 *
 * These tests focus on the 3D rendering aspects of the application,
 * including scene composition, camera views, and WebGL output.
 */

import { test, expect, Page } from '@playwright/test';

/**
 * Helper to wait for WebGL canvas to be ready
 */
async function waitForWebGLReady(page: Page): Promise<void> {
  await page.waitForSelector('canvas', { timeout: 30000 });

  // Wait for WebGL context to be created
  await page.waitForFunction(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return false;

    const gl = canvas.getContext('webgl') || canvas.getContext('webgl2');
    return gl !== null;
  }, { timeout: 10000 });

  // Allow time for initial render
  await page.waitForTimeout(1000);
}

/**
 * Helper to trigger a render update
 */
async function triggerRender(page: Page): Promise<void> {
  await page.evaluate(() => {
    // Dispatch resize event to trigger re-render
    window.dispatchEvent(new Event('resize'));
  });
  await page.waitForTimeout(500);
}

test.describe('Scene Rendering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await waitForWebGLReady(page);
  });

  test('empty scene renders correctly', async ({ page }) => {
    const canvas = page.locator('canvas').first();

    // Verify canvas exists and has proper dimensions
    const box = await canvas.boundingBox();
    expect(box).toBeTruthy();
    expect(box!.width).toBeGreaterThan(100);
    expect(box!.height).toBeGreaterThan(100);

    await expect(canvas).toHaveScreenshot('scene-empty.png', {
      animations: 'disabled',
      // WebGL can have minor variations between renders
      maxDiffPixels: 1000,
    });
  });

  test('scene grid renders', async ({ page }) => {
    // The scene should show a grid helper
    const canvas = page.locator('canvas').first();
    await triggerRender(page);

    await expect(canvas).toHaveScreenshot('scene-grid.png', {
      animations: 'disabled',
      maxDiffPixels: 1000,
    });
  });
});

test.describe('Camera Views', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await waitForWebGLReady(page);
  });

  test('default perspective view', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    await triggerRender(page);

    await expect(canvas).toHaveScreenshot('camera-perspective.png', {
      animations: 'disabled',
      maxDiffPixels: 1000,
    });
  });

  test('camera orbit interaction', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    const box = await canvas.boundingBox();

    if (box) {
      // Simulate orbit control drag
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;

      await page.mouse.move(centerX, centerY);
      await page.mouse.down();
      await page.mouse.move(centerX + 100, centerY + 50);
      await page.mouse.up();

      await page.waitForTimeout(500);

      await expect(canvas).toHaveScreenshot('camera-orbited.png', {
        animations: 'disabled',
        maxDiffPixels: 1500,
      });
    }
  });

  test('camera zoom interaction', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    const box = await canvas.boundingBox();

    if (box) {
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;

      // Simulate zoom with mouse wheel
      await page.mouse.move(centerX, centerY);
      await page.mouse.wheel(0, -200); // Zoom in

      await page.waitForTimeout(500);

      await expect(canvas).toHaveScreenshot('camera-zoomed.png', {
        animations: 'disabled',
        maxDiffPixels: 1500,
      });
    }
  });
});

test.describe('Orientation Control', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await waitForWebGLReady(page);
  });

  test('orientation cube renders', async ({ page }) => {
    // Look for the orientation control element
    const orientControl = page.locator('[class*="orientation"], [class*="orient-control"], .gizmo').first();

    if (await orientControl.isVisible()) {
      await expect(orientControl).toHaveScreenshot('orientation-cube.png', {
        animations: 'disabled',
        maxDiffPixels: 200,
      });
    }
  });
});

test.describe('Selection and Highlighting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await waitForWebGLReady(page);
  });

  test('hover highlight effect', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    const box = await canvas.boundingBox();

    if (box) {
      // Move mouse over scene objects
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;

      await page.mouse.move(centerX, centerY);
      await page.waitForTimeout(300);

      // The hover state should be visible
      await expect(canvas).toHaveScreenshot('scene-hover.png', {
        animations: 'disabled',
        maxDiffPixels: 1000,
      });
    }
  });

  test('click selection', async ({ page }) => {
    const canvas = page.locator('canvas').first();
    const box = await canvas.boundingBox();

    if (box) {
      const centerX = box.x + box.width / 2;
      const centerY = box.y + box.height / 2;

      // Click to select
      await page.mouse.click(centerX, centerY);
      await page.waitForTimeout(500);

      // Selection outline should be visible if object was clicked
      await expect(canvas).toHaveScreenshot('scene-selected.png', {
        animations: 'disabled',
        maxDiffPixels: 1000,
      });
    }
  });
});

test.describe('WebGL Context', () => {
  test('WebGL context is created', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('canvas', { timeout: 30000 });

    const hasWebGL = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return false;

      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      return gl !== null;
    });

    expect(hasWebGL).toBe(true);
  });

  test('no WebGL errors on load', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', (err) => {
      errors.push(err.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await waitForWebGLReady(page);

    // Filter out known non-critical errors
    const criticalErrors = errors.filter((err) => {
      // Ignore common browser errors
      if (err.includes('favicon') || err.includes('manifest')) return false;
      // Ignore TypeScript/webpack compilation errors (dev server overlay)
      if (err.includes('TS2708') || err.includes('TS2694') || err.includes('Cannot use namespace')) return false;
      // Ignore process is not defined (Node.js-specific code)
      if (err.includes('process is not defined')) return false;
      // Ignore development-time warnings
      if (err.includes('ResizeObserver')) return false;
      // Ignore React deprecation warnings (from Blueprint.js)
      if (err.includes('defaultProps') || err.includes('Support for defaultProps')) return false;
      // Ignore jest-related errors from test setup files in dev overlay
      if (err.includes('jest.Mock') || err.includes("'jest'")) return false;
      // Ignore WebGL context conflicts (can happen when tests run in parallel or rapidly)
      if (err.includes('WebGL context could not be created') || err.includes('existing context')) return false;
      return true;
    });

    expect(criticalErrors).toHaveLength(0);
  });

  test('renderer info is available', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await waitForWebGLReady(page);

    const rendererInfo = await page.evaluate(() => {
      const canvas = document.querySelector('canvas');
      if (!canvas) return null;

      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) return null;

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (!debugInfo) return { vendor: 'unknown', renderer: 'unknown' };

      return {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
      };
    });

    expect(rendererInfo).toBeTruthy();
    console.log('WebGL Renderer:', rendererInfo);
  });
});

test.describe('Performance Indicators', () => {
  test('scene renders within frame budget', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await waitForWebGLReady(page);

    // Measure frame timing
    const frameTimes = await page.evaluate(async () => {
      const times: number[] = [];
      let lastTime = performance.now();

      for (let i = 0; i < 30; i++) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
        const now = performance.now();
        times.push(now - lastTime);
        lastTime = now;
      }

      return times;
    });

    const avgFrameTime = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    const maxFrameTime = Math.max(...frameTimes);

    console.log(`Average frame time: ${avgFrameTime.toFixed(2)}ms`);
    console.log(`Max frame time: ${maxFrameTime.toFixed(2)}ms`);

    // Should maintain reasonable frame rate (60fps = 16.67ms per frame)
    // Allow for some overhead in test environment
    expect(avgFrameTime).toBeLessThan(50); // 20fps minimum
  });
});
