"use client";

import { ChromeMessage } from "@entrepta/registry/feedback/chrome-message";
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
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-3xl px-4 pt-32 pb-24 sm:px-8">
      <ChromeMessage
        accent="error"
        command="next render"
        title="Something broke."
        note={error.digest ? `digest ${error.digest}` : "reload, or try again"}
        action={
          <Button size="sm" onClick={reset}>
            try again
          </Button>
        }
      />
    </main>
  );
}
