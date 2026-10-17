// src/lib/features/mfa/stores/mfa.svelte.ts

import { mfaApi, type MfaEnrollment, type MfaStatus } from '$lib/api/mfaApi';

let _status = $state<MfaStatus | null>(null);
let _enrollment = $state<MfaEnrollment | null>(null);
let _loading = $state(false);
let _submitting = $state(false);
let _error = $state<string | null>(null);

function messageOf(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

export const mfa = {
	get status(): MfaStatus | null {
		return _status;
	},
	get enrollment(): MfaEnrollment | null {
		return _enrollment;
	},
	get loading(): boolean {
		return _loading;
	},
	get submitting(): boolean {
		return _submitting;
	},
	get error(): string | null {
		return _error;
	},

	async load(): Promise<void> {
		_loading = true;
		_error = null;
		try {
			_status = await mfaApi.getStatus();
		} catch (err) {
			_error = messageOf(err, 'Error al cargar el estado de la verificación en dos pasos.');
		} finally {
			_loading = false;
		}
	},

	async startEnrollment(): Promise<void> {
		_submitting = true;
		_error = null;
		try {
			_enrollment = await mfaApi.enroll();
		} catch (err) {
			_error = messageOf(err, 'Error al iniciar el registro.');
		} finally {
			_submitting = false;
		}
	},

	async confirm(code: string): Promise<boolean> {
		_submitting = true;
		_error = null;
		try {
			await mfaApi.confirm(code);
			_enrollment = null;
			_status = { enabled: true, pending: false };
			return true;
		} catch (err) {
			_error = messageOf(err, 'Error al confirmar el código.');
			return false;
		} finally {
			_submitting = false;
		}
	},

	cancelEnrollment(): void {
		_enrollment = null;
		_error = null;
	}
};
