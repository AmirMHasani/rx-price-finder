/**
 * Logger Utility
 * Provides conditional logging that only outputs in development mode
 * Prevents console.log statements from appearing in production builds
 */

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV;
  }

  /**
   * Log general information (only in development)
   */
  log(...args: any[]): void {
    if (this.isDevelopment) {
      console.log('[LOG]', ...args);
    }
  }

  /**
   * Log informational messages (only in development)
   */
  info(...args: any[]): void {
    if (this.isDevelopment) {
      console.info('[INFO]', ...args);
    }
  }

  /**
   * Log warnings (only in development)
   */
  warn(...args: any[]): void {
    if (this.isDevelopment) {
      console.warn('[WARN]', ...args);
    }
  }

  /**
   * Log errors (always logged, even in production)
   */
  error(...args: any[]): void {
    console.error('[ERROR]', ...args);
  }

  /**
   * Log debug information (only in development)
   */
  debug(...args: any[]): void {
    if (this.isDevelopment) {
      console.debug('[DEBUG]', ...args);
    }
  }

  /**
   * Log API requests (only in development)
   */
  api(method: string, url: string, data?: any): void {
    if (this.isDevelopment) {
      console.log(`[API] ${method} ${url}`, data || '');
    }
  }

  /**
   * Log performance metrics (only in development)
   */
  perf(label: string, duration: number): void {
    if (this.isDevelopment) {
      console.log(`[PERF] ${label}: ${duration.toFixed(2)}ms`);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export default for convenience
export default logger;
