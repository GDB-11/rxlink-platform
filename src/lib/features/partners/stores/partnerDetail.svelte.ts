// src/lib/features/partners/stores/partnerDetail.svelte.ts

import { ApiError } from '$lib/api/api';
import {
	partnerApi,
	type Partner,
	type PartnerApiKey,
	type PartnerStatus,
	type PartnerValues
} from '$lib/api/partnerApi';
import { missingLabels } from '../partnerMeta';

export interface SaveResult {
	ok: boolean;
	fieldErrors?: Record<string, string>;
	message?: string;
}

function messageOf(err: unknown, fallback: string): string {
	if (err instanceof ApiError) {
		if (err.fieldErrors) return Object.values(err.fieldErrors).join(' ');
		const body = err.body as { missing?: string[] } | undefined;
		if (body?.missing?.length) {
			const names = body.missing.map((m) => missingLabels[m] ?? m).join(', ');
			return `${err.message} Falta: ${names}.`;
		}
	}
	return err instanceof Error ? err.message : fallback;
}

/** One partner and every operation that changes it; the API always answers with the fresh row. */
export class PartnerDetailStore {
	readonly code: string;

	partner = $state<Partner | null>(null);
	loading = $state(false);
	submitting = $state(false);
	/** Page-level failure (load, visibility, key, logo). */
	error = $state<string | null>(null);
	/** Plain API key, kept in memory only until the admin dismisses it. */
	issuedKey = $state<PartnerApiKey | null>(null);
	/** Bumps when the logo changes so the preview refetches. */
	logoVersion = $state(0);

	constructor(code: string) {
		this.code = code;
	}

	async load(): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			this.partner = await partnerApi.get(this.code);
		} catch (err) {
			this.error = messageOf(err, 'Error al cargar el partner.');
		} finally {
			this.loading = false;
		}
	}

	async save(values: PartnerValues): Promise<SaveResult> {
		this.submitting = true;
		try {
			this.partner = await partnerApi.update(this.code, values);
			return { ok: true };
		} catch (err) {
			if (err instanceof ApiError && err.fieldErrors) {
				return { ok: false, fieldErrors: err.fieldErrors };
			}
			return { ok: false, message: messageOf(err, 'No se pudo guardar.') };
		} finally {
			this.submitting = false;
		}
	}

	/** Returns an error message to show inside the status dialog, or `null` on success. */
	async changeStatus(status: PartnerStatus, reason?: string): Promise<string | null> {
		this.submitting = true;
		try {
			this.partner = await partnerApi.changeStatus(this.code, status, reason);
			return null;
		} catch (err) {
			return messageOf(err, 'No se pudo cambiar el estado.');
		} finally {
			this.submitting = false;
		}
	}

	async setDirectoryVisible(visible: boolean): Promise<void> {
		await this.run(async () => {
			this.partner = await partnerApi.setDirectoryVisibility(this.code, visible);
		}, 'No se pudo cambiar la visibilidad.');
	}

	async issueApiKey(): Promise<void> {
		await this.run(async () => {
			this.issuedKey = await partnerApi.issueApiKey(this.code);
			this.partner = await partnerApi.get(this.code);
		}, 'No se pudo emitir la clave.');
	}

	dismissKey(): void {
		this.issuedKey = null;
	}

	async uploadLogo(file: File): Promise<void> {
		await this.run(async () => {
			await partnerApi.uploadLogo(this.code, file);
			this.partner = await partnerApi.get(this.code);
			this.logoVersion += 1;
		}, 'No se pudo subir el logo.');
	}

	private async run(action: () => Promise<void>, fallback: string): Promise<void> {
		this.submitting = true;
		this.error = null;
		try {
			await action();
		} catch (err) {
			this.error = messageOf(err, fallback);
		} finally {
			this.submitting = false;
		}
	}
}
