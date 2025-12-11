import * as Sentry from '@sentry/nextjs';

/**
 * Load the Sentry configuration for the current Next.js runtime.
 *
 * Based on `process.env.NEXT_RUNTIME` ('nodejs' or 'edge'), registers the corresponding Sentry configuration module so Sentry is initialized for that runtime.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;