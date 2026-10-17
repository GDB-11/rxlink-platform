// src/lib/features/auth/sessionPolicy.ts

/** Inactivity after which the platform session is closed. */
export const IDLE_TIMEOUT_MS = 15 * 60 * 1000;

/** How long before the idle timeout the user is warned and can keep the session alive. */
export const IDLE_WARNING_MS = 60 * 1000;

/**
 * Hard cap on one login, however active the user is. Must not exceed the API's
 * `SessionSecurity:AbsoluteSessionMinutes` (480), which is the authoritative limit.
 */
export const ABSOLUTE_SESSION_MS = 8 * 60 * 60 * 1000;

/** Shared across tabs so activity in one tab keeps the others alive. */
export const LAST_ACTIVITY_KEY = 'rxlink_platform_last_activity';

export type SessionEndReason = 'idle' | 'session';

export const SESSION_END_MESSAGES: Record<SessionEndReason, string> = {
	idle: 'Su sesión se cerró por inactividad. Inicie sesión nuevamente.',
	session: 'Su sesión alcanzó el tiempo máximo permitido. Inicie sesión nuevamente.'
};
