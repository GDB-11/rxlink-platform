// src/lib/api/mfaApi.ts

import { api } from './api';

export interface MfaStatus {
	enabled: boolean;
	pending: boolean;
}

export interface MfaEnrollment {
	secret: string;
	otpauthUri: string;
}

export const mfaApi = {
	/** GET /api/v1/mfa/status */
	getStatus(): Promise<MfaStatus> {
		return api.get<MfaStatus>('/api/v1/mfa/status');
	},

	/** POST /api/v1/mfa/enroll — 200 | 409 when MFA is already enabled */
	enroll(): Promise<MfaEnrollment> {
		return api.post<MfaEnrollment>('/api/v1/mfa/enroll', {});
	},

	/** POST /api/v1/mfa/confirm — 204 | 400 wrong code or nothing pending */
	confirm(code: string): Promise<void> {
		return api.post<void>('/api/v1/mfa/confirm', { Code: code });
	}
};
