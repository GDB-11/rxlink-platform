// src/lib/features/rules/stores/classDetail.svelte.ts

import { catalogApi } from '$lib/api/catalogApi';
import {
	ruleApi,
	type ClassValues,
	type LinkKind,
	type MedicationClassDetail
} from '$lib/api/ruleApi';
import { messageOf, type SaveResult } from './ruleList.svelte';
import { ApiError } from '$lib/api/api';

export interface LinkCandidate {
	code: string;
	label: string;
}

/** One medication class with its linked medications and allergies, plus the pickers' candidate search. */
export class ClassDetailStore {
	readonly code: string;

	detail = $state<MedicationClassDetail | null>(null);
	loading = $state(false);
	submitting = $state(false);
	error = $state<string | null>(null);

	/** Search results per picker, so searching medications does not fill the allergies list. */
	candidates = $state<Record<LinkKind, LinkCandidate[]>>({ medications: [], allergies: [] });
	searching = $state<LinkKind | null>(null);

	constructor(code: string) {
		this.code = code;
	}

	async load(): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			this.detail = await ruleApi.getClass(this.code);
		} catch (err) {
			this.error = messageOf(err, 'No se pudo cargar la clase.');
		} finally {
			this.loading = false;
		}
	}

	async saveDetails(values: ClassValues): Promise<SaveResult> {
		this.submitting = true;
		try {
			this.detail = await ruleApi.updateClass(this.code, values);
			return { ok: true };
		} catch (err) {
			if (err instanceof ApiError && err.fieldErrors)
				return { ok: false, fieldErrors: err.fieldErrors };
			return { ok: false, message: messageOf(err, 'No se pudo guardar.') };
		} finally {
			this.submitting = false;
		}
	}

	async setActive(active: boolean): Promise<boolean> {
		return this.mutate(
			() => ruleApi.setClassActive(this.code, active),
			'No se pudo cambiar el estado.'
		);
	}

	async addLink(kind: LinkKind, itemCode: string): Promise<boolean> {
		const ok = await this.mutate(
			() => ruleApi.addLink(this.code, kind, itemCode),
			'No se pudo agregar.'
		);
		if (ok) this.candidates[kind] = this.candidates[kind].filter((c) => c.code !== itemCode);
		return ok;
	}

	removeLink(kind: LinkKind, itemCode: string): Promise<boolean> {
		return this.mutate(() => ruleApi.removeLink(this.code, kind, itemCode), 'No se pudo quitar.');
	}

	/** Active medications/allergies matching `search`, minus the ones already linked. */
	async searchCandidates(kind: LinkKind, search: string): Promise<void> {
		this.searching = kind;
		try {
			const linked = (kind === 'medications' ? this.detail?.members : this.detail?.allergies) ?? [];
			const page = await catalogApi.list(kind, { search, includeInactive: false, pageSize: 20 });
			this.candidates[kind] = page.items
				.filter((i) => !linked.some((l) => l.code === i.code))
				.map((i) => ({ code: i.code, label: candidateLabel(kind, i) }));
		} catch (err) {
			this.error = messageOf(err, 'No se pudo buscar.');
		} finally {
			this.searching = null;
		}
	}

	private async mutate(
		action: () => Promise<MedicationClassDetail>,
		fallback: string
	): Promise<boolean> {
		this.submitting = true;
		this.error = null;
		try {
			this.detail = await action();
			return true;
		} catch (err) {
			this.error = messageOf(err, fallback);
			return false;
		} finally {
			this.submitting = false;
		}
	}
}

function candidateLabel(kind: LinkKind, item: Record<string, unknown>): string {
	if (kind === 'allergies') return String(item.name);
	return `${item.genericName} ${item.concentration} · ${item.pharmaceuticalFormName}`;
}
