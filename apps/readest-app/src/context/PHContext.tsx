'use client';

import { ReactNode } from 'react';

// PostHog removed — OneRead is a pure local reader, no telemetry.
export const CSPostHogProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};
