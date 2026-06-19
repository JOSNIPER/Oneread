// PostHog removed — OneRead is a pure local reader, no telemetry.

export const TELEMETRY_OPT_OUT_KEY = 'oneread-telemetry-opt-out';
export const TELEMETRY_DECISION_KEY = 'oneread-telemetry-decision';

export type TelemetryDecision = 'opt-in' | 'opt-out' | 'pending';

export const TELEMETRY_PROMPT_BUCKET_RATE = 0;

export const hasOptedOutTelemetry = () => true;

export const getTelemetryDecision = (): TelemetryDecision | null => 'opt-out';

export const setTelemetryDecision = (_decision: TelemetryDecision) => {};

export const rollIntoTelemetryPromptBucket = (_rng: () => number = Math.random) => false;

export const captureEvent = (_event: string, _properties?: Record<string, unknown>) => {};

export const optInTelemetry = () => {};
export const optOutTelemetry = () => {};
