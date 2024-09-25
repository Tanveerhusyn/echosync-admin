"use client";

import React, { useState, useEffect } from "react";
import ThemeProvider from "./ThemeToggle/theme-provider";
import {
  SessionProvider,
  SessionProviderProps,
  useSession,
} from "next-auth/react";
import { ErrorBoundary } from "react-error-boundary";

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert">
      <p>Something went wrong!!!!:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

function SessionCheck({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status !== "loading") {
      setIsLoading(false);
    }
  }, [status]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}

export default function Providers({
  session,
  children,
}: {
  session: SessionProviderProps["session"];
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <SessionProvider session={session} refetchInterval={5 * 60}>
          <SessionCheck>{children}</SessionCheck>
        </SessionProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
