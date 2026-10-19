"use client";

import { EmptyState } from "@entrepta/registry/feedback/empty-state";
import { Button } from "@entrepta/registry/primitives/button";
import { WarningIcon } from "@phosphor-icons/react";

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
        icon={<WarningIcon />}
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
