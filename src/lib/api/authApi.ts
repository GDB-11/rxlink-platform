// src/lib/api/authApi.ts

import { api, ApiError } from './api';

export interface PlatformUserInfo {
	userCode: string;
	username: string;
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	expiresAt: string;
	user: PlatformUserInfo;
}

/** 202 from login: password accepted, an authenticator code is required to finish. */
export interface MfaChallenge {
	mfaRequired: true;
	mfaToken: string;
	expiresAt: string;
}

export function isMfaChallenge(data: LoginResponse | MfaChallenge): data is MfaChallenge {
	return 'mfaRequired' in data && data.mfaRequired === true;
}

export const authApi = {
	/** POST /api/v1/auth/login — 200 LoginResponse | 202 MfaChallenge | 401 | 429 (locked) */
	login(username: string, password: string): Promise<LoginResponse | MfaChallenge> {
		return api.post<LoginResponse | MfaChallenge>('/api/v1/auth/login', {
			Username: username,
			Password: password
		});
	},

	/** POST /api/v1/auth/mfa/verify — 200 LoginResponse | 401 | 429 (locked) */
	verifyMfa(mfaToken: string, code: string): Promise<LoginResponse> {
		return api.post<LoginResponse>('/api/v1/auth/mfa/verify', { MfaToken: mfaToken, Code: code });
	},

	/** POST /api/v1/auth/logout — 204 | 401 */
	logout(refreshToken: string, accessToken: string): Promise<void> {
		return api.post<void>(
			'/api/v1/auth/logout',
			{ RefreshToken: refreshToken },
			{ Authorization: `Bearer ${accessToken}` }
		);
	}
};

export { ApiError };
