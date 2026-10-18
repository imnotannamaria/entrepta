"use client";

import { EmptyState } from "@entrepta/registry/feedback/empty-state";
import { Button } from "@entrepta/registry/primitives/button";

/** Any page that throws while rendering lands here, with a way to try again. */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" tabIndex={-1} className="flex min-h-dvh flex-col px-4 sm:px-8">
      <EmptyState
        size="page"
        tone="error"
        illustration={
          <img src="/brand/mascot-256.png" width={128} height={128} alt="" aria-hidden="true" />
        }
        title="Something broke."
        description={
          error.digest ? `Reload, or try again. Digest ${error.digest}.` : "Reload, or try again."
        }
        action={
          <Button size="sm" onClick={reset}>
            try again
          </Button>
        }
      />
    </main>
  );
}
