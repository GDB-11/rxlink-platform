// src/lib/features/rules/stores/ruleList.svelte.ts

import { ApiError } from '$lib/api/api';
import type { ListQuery, RulePage } from '$lib/api/ruleApi';

export interface SaveResult {
	ok: boolean;
	fieldErrors?: Record<string, string>;
	/** Non-field failure (e.g. 409 duplicate), shown inside the dialog. */
	message?: string;
}

export function messageOf(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

/**
 * List/search/paging + save/toggle plumbing shared by the two rule lists. Subclasses say how to fetch a page,
 * how to save and how to flip the active flag; this class owns the state and the error handling.
 */
export abstract class RuleListStore<TItem extends { code: string; isActive: boolean }, TValues> {
	items = $state<TItem[]>([]);
	page = $state(1);
	pageSize = $state(25);
	total = $state(0);
	search = $state('');
	includeInactive = $state(true);
	loading = $state(false);
	submitting = $state(false);
	error = $state<string | null>(null);

	totalPages = $derived(Math.max(1, Math.ceil(this.total / this.pageSize)));

	protected abstract fetchPage(query: ListQuery): Promise<RulePage<TItem>>;
	protected abstract saveItem(code: string | null, values: TValues): Promise<unknown>;
	protected abstract toggleItem(item: TItem, active: boolean): Promise<unknown>;

	async load(): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			const res = await this.fetchPage({
				search: this.search,
				includeInactive: this.includeInactive,
				page: this.page,
				pageSize: this.pageSize
			});
			this.items = res.items;
			this.total = res.total;
		} catch (err) {
			this.error = messageOf(err, 'Error al cargar los datos.');
		} finally {
			this.loading = false;
		}
	}

	async setSearch(value: string): Promise<void> {
		this.search = value;
		this.page = 1;
		await this.load();
	}

	async setIncludeInactive(value: boolean): Promise<void> {
		this.includeInactive = value;
		this.page = 1;
		await this.load();
	}

	async goToPage(page: number): Promise<void> {
		this.page = Math.min(Math.max(1, page), this.totalPages);
		await this.load();
	}

	/** Creates (no `code`) or updates, then reloads the list. */
	async save(code: string | null, values: TValues): Promise<SaveResult> {
		this.submitting = true;
		try {
			await this.saveItem(code, values);
		} catch (err) {
			if (err instanceof ApiError && err.fieldErrors) {
				return { ok: false, fieldErrors: err.fieldErrors };
			}
			return { ok: false, message: messageOf(err, 'No se pudo guardar.') };
		} finally {
			this.submitting = false;
		}
		await this.load();
		return { ok: true };
	}

	async setActive(item: TItem, active: boolean): Promise<boolean> {
		this.submitting = true;
		this.error = null;
		try {
			await this.toggleItem(item, active);
		} catch (err) {
			this.error = messageOf(err, 'No se pudo cambiar el estado.');
			return false;
		} finally {
			this.submitting = false;
		}
		await this.load();
		return true;
	}
}
