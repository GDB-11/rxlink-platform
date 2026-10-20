// src/lib/api/api.ts

import { browser } from '$app/environment';
import { PUBLIC_CATALOG_API_BASE_URL } from '$env/static/public';
import { auth } from '$lib/features/auth/stores/auth.svelte';
import type { LoginResponse } from './authApi';

let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

export class ApiError extends Error {
	constructor(
		public readonly status: number,
		message: string,
		/** Seconds until the account unlocks (429 from login / MFA verify). */
		public readonly retryAfterSeconds?: number,
		/** Per-field messages from a 400 validation response, keyed by camelCase field name. */
		public readonly fieldErrors?: Record<string, string>,
		/** Parsed JSON error body, for responses whose shape is not `{message}` (e.g. a 422 import report). */
		public readonly body?: unknown
	) {
		super(message);
		this.name = 'ApiError';
	}
}

async function attemptRefresh(): Promise<string> {
	const refreshToken = auth.getRefreshToken();
	if (!refreshToken) throw new Error('No refresh token');

	const res = await fetch(`${PUBLIC_CATALOG_API_BASE_URL}/api/v1/auth/refresh`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ RefreshToken: refreshToken })
	});

	if (!res.ok) throw new ApiError(res.status, 'Token refresh failed');

	const data = (await res.json()) as LoginResponse;
	auth.updateTokens(data);
	return data.accessToken;
}

function drainQueue(token: string | null) {
	refreshQueue.forEach((cb) => cb(token));
	refreshQueue = [];
}

async function request<T>(
	path: string,
	init: RequestInit = {},
	parse: (res: Response) => Promise<T> = (res) => res.json() as Promise<T>
): Promise<T> {
	const url = `${PUBLIC_CATALOG_API_BASE_URL}${path}`;

	// A FormData body needs the browser to set the multipart Content-Type (with its boundary).
	const headers: Record<string, string> = {
		...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
		...(init.headers as Record<string, string>)
	};

	if (auth.accessToken && !headers['Authorization']) {
		headers['Authorization'] = `Bearer ${auth.accessToken}`;
	}

	let response = await fetch(url, { ...init, headers });

	// Login / MFA verify answer 401 for bad credentials: only refresh when a session exists.
	if (response.status === 401 && auth.getRefreshToken() && headers['Authorization']) {
		let newToken: string | null;

		if (isRefreshing) {
			newToken = await new Promise<string | null>((resolve) => {
				refreshQueue.push(resolve);
			});
		} else {
			isRefreshing = true;
			try {
				newToken = await attemptRefresh();
				drainQueue(newToken);
			} catch {
				drainQueue(null);
				if (browser) {
					auth.logout();
					window.location.href = '/login';
				}
				throw new ApiError(401, 'Session expired');
			} finally {
				isRefreshing = false;
			}
		}

		if (!newToken) throw new ApiError(401, 'Session expired');

		headers['Authorization'] = `Bearer ${newToken}`;
		response = await fetch(url, { ...init, headers });
	}

	if (!response.ok) {
		const body = (await response.json().catch(() => ({}))) as {
			message?: string;
			title?: string;
			retryAfterSeconds?: number;
			errors?: Record<string, string>;
		};
		throw new ApiError(
			response.status,
			body.message ?? body.title ?? response.statusText,
			body.retryAfterSeconds,
			body.errors,
			body
		);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return parse(response);
}

export const api = {
	get<T>(path: string, headers?: HeadersInit): Promise<T> {
		return request<T>(path, { method: 'GET', headers });
	},

	post<T>(path: string, body: unknown, headers?: HeadersInit): Promise<T> {
		return request<T>(path, { method: 'POST', body: JSON.stringify(body), headers });
	},

	postForm<T>(path: string, body: FormData): Promise<T> {
		return request<T>(path, { method: 'POST', body });
	},

	putForm<T>(path: string, body: FormData): Promise<T> {
		return request<T>(path, { method: 'PUT', body });
	},

	/** Authenticated binary download (e.g. a logo, which an `<img src>` could not fetch without the token). */
	getBlob(path: string): Promise<Blob> {
		return request<Blob>(path, { method: 'GET' }, (res) => res.blob());
	},

	put<T>(path: string, body: unknown, headers?: HeadersInit): Promise<T> {
		return request<T>(path, { method: 'PUT', body: JSON.stringify(body), headers });
	},

	delete<T>(path: string, headers?: HeadersInit): Promise<T> {
		return request<T>(path, { method: 'DELETE', headers });
	}
};
