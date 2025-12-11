"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

/**
 * Client-side global error boundary that reports the error to Sentry and renders a generic Next.js error page.
 *
 * Reports the provided `error` to Sentry when mounted or when the `error` changes, and renders NextError with
 * `statusCode` set to 0 (App Router does not expose error status codes).
 *
 * @param error - The caught error to report; may include an optional `digest` property used by error tracking.
 * @returns A React element that displays a generic Next.js error page.
 */
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}