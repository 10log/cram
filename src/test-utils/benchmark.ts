/**
 * Performance benchmarking utilities for testing
 */

export interface BenchmarkResult {
  name: string;
  samples: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
  p95: number;
  p99: number;
  opsPerSecond: number;
}

export interface BenchmarkOptions {
  /** Number of timed samples to collect (default: 100) */
  samples?: number;
  /** Number of warmup iterations before timing (default: 10) */
  warmup?: number;
  /** Timeout in ms - skip if single iteration exceeds this (default: 5000) */
  timeout?: number;
}

/**
 * Calculates a specific percentile from a sorted array of numbers
 */
function percentile(sortedValues: number[], p: number): number {
  const index = Math.ceil((p / 100) * sortedValues.length) - 1;
  return sortedValues[Math.max(0, index)];
}

/**
 * Runs a synchronous function multiple times and collects timing statistics
 */
export function benchmark(
  name: string,
  fn: () => void,
  options: BenchmarkOptions = {}
): BenchmarkResult {
  const { samples = 100, warmup = 10, timeout = 5000 } = options;

  // Warmup runs to allow JIT optimization
  for (let i = 0; i < warmup; i++) {
    const start = performance.now();
    fn();
    const duration = performance.now() - start;
    if (duration > timeout) {
      throw new Error(`Benchmark "${name}" exceeded timeout during warmup (${duration.toFixed(2)}ms > ${timeout}ms)`);
    }
  }

  // Timed runs
  const times: number[] = [];
  for (let i = 0; i < samples; i++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }

  times.sort((a, b) => a - b);

  const sum = times.reduce((a, b) => a + b, 0);
  const mean = sum / times.length;
  const variance = times.reduce((acc, t) => acc + (t - mean) ** 2, 0) / times.length;

  return {
    name,
    samples,
    mean,
    median: times[Math.floor(times.length / 2)],
    min: times[0],
    max: times[times.length - 1],
    stdDev: Math.sqrt(variance),
    p95: percentile(times, 95),
    p99: percentile(times, 99),
    opsPerSecond: 1000 / mean,
  };
}

/**
 * Runs an async function multiple times and collects timing statistics
 */
export async function benchmarkAsync(
  name: string,
  fn: () => Promise<void>,
  options: BenchmarkOptions = {}
): Promise<BenchmarkResult> {
  const { samples = 100, warmup = 10, timeout = 5000 } = options;

  // Warmup runs
  for (let i = 0; i < warmup; i++) {
    const start = performance.now();
    await fn();
    const duration = performance.now() - start;
    if (duration > timeout) {
      throw new Error(`Async benchmark "${name}" exceeded timeout during warmup (${duration.toFixed(2)}ms > ${timeout}ms)`);
    }
  }

  // Timed runs
  const times: number[] = [];
  for (let i = 0; i < samples; i++) {
    const start = performance.now();
    await fn();
    times.push(performance.now() - start);
  }

  times.sort((a, b) => a - b);

  const sum = times.reduce((a, b) => a + b, 0);
  const mean = sum / times.length;
  const variance = times.reduce((acc, t) => acc + (t - mean) ** 2, 0) / times.length;

  return {
    name,
    samples,
    mean,
    median: times[Math.floor(times.length / 2)],
    min: times[0],
    max: times[times.length - 1],
    stdDev: Math.sqrt(variance),
    p95: percentile(times, 95),
    p99: percentile(times, 99),
    opsPerSecond: 1000 / mean,
  };
}

export interface ComparisonResult {
  /** Whether the current benchmark passed (no regression beyond threshold) */
  passed: boolean;
  /** Percentage change from baseline (positive = slower, negative = faster) */
  regression: number;
  /** Absolute difference in mean time (ms) */
  absoluteDiff: number;
}

/**
 * Compares two benchmark results and determines if there's a regression
 */
export function compareBenchmarks(
  baseline: BenchmarkResult,
  current: BenchmarkResult,
  threshold: number = 0.1 // 10% regression threshold
): ComparisonResult {
  const regression = (current.mean - baseline.mean) / baseline.mean;
  const absoluteDiff = current.mean - baseline.mean;

  return {
    passed: regression < threshold,
    regression,
    absoluteDiff,
  };
}

/**
 * Formats a benchmark result for display
 */
export function formatBenchmarkResult(result: BenchmarkResult): string {
  return [
    `Benchmark: ${result.name}`,
    `  Samples: ${result.samples}`,
    `  Mean: ${result.mean.toFixed(3)}ms`,
    `  Median: ${result.median.toFixed(3)}ms`,
    `  Min: ${result.min.toFixed(3)}ms`,
    `  Max: ${result.max.toFixed(3)}ms`,
    `  Std Dev: ${result.stdDev.toFixed(3)}ms`,
    `  P95: ${result.p95.toFixed(3)}ms`,
    `  P99: ${result.p99.toFixed(3)}ms`,
    `  Ops/sec: ${result.opsPerSecond.toFixed(2)}`,
  ].join('\n');
}

/**
 * Measures memory usage before and after running a function
 * Note: Requires Node.js with --expose-gc flag for accurate results
 */
export function measureMemory(fn: () => void): { heapUsedBefore: number; heapUsedAfter: number; heapGrowth: number } {
  // Force garbage collection if available
  if (typeof global !== 'undefined' && typeof (global as any).gc === 'function') {
    (global as any).gc();
  }

  const before = typeof process !== 'undefined' ? process.memoryUsage().heapUsed : 0;

  fn();

  // Force GC again to get accurate "after" measurement
  if (typeof global !== 'undefined' && typeof (global as any).gc === 'function') {
    (global as any).gc();
  }

  const after = typeof process !== 'undefined' ? process.memoryUsage().heapUsed : 0;

  return {
    heapUsedBefore: before,
    heapUsedAfter: after,
    heapGrowth: after - before,
  };
}

/**
 * Creates a simple timer for measuring elapsed time
 */
export function createTimer() {
  const start = performance.now();
  return {
    elapsed: () => performance.now() - start,
    reset: () => createTimer(),
  };
}

/**
 * Waits for the next animation frame (useful for render timing tests)
 */
export function nextFrame(): Promise<number> {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

/**
 * Sleep utility for async tests
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
