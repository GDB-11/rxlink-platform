// src/lib/features/catalogs/stores/catalogList.svelte.ts

import { ApiError } from '$lib/api/api';
import {
	catalogApi,
	type CatalogEntry,
	type CatalogFieldInfo,
	type EntryValues
} from '$lib/api/catalogApi';

export interface SaveResult {
	ok: boolean;
	fieldErrors?: Record<string, string>;
	/** Non-field failure (e.g. 409 identity locked), shown inside the dialog. */
	message?: string;
}

function messageOf(err: unknown, fallback: string): string {
	return err instanceof Error ? err.message : fallback;
}

/** List/search/paging + write operations for one catalog; one instance per catalog page. */
export class CatalogListStore {
	readonly slug: string;

	items = $state<CatalogEntry[]>([]);
	fields = $state<CatalogFieldInfo[]>([]);
	page = $state(1);
	pageSize = $state(25);
	total = $state(0);
	search = $state('');
	includeInactive = $state(true);
	loading = $state(false);
	submitting = $state(false);
	error = $state<string | null>(null);

	totalPages = $derived(Math.max(1, Math.ceil(this.total / this.pageSize)));

	constructor(slug: string) {
		this.slug = slug;
	}

	/** Field constraints for the simple catalogs (medications have a fixed form). */
	async loadFields(): Promise<void> {
		try {
			const catalogs = await catalogApi.listCatalogs();
			this.fields = catalogs.find((c) => c.slug === this.slug)?.fields ?? [];
		} catch (err) {
			this.error = messageOf(err, 'Error al cargar la definición del catálogo.');
		}
	}

	async load(): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			const res = await catalogApi.list(this.slug, {
				search: this.search,
				includeInactive: this.includeInactive,
				page: this.page,
				pageSize: this.pageSize
			});
			this.items = res.items;
			this.total = res.total;
		} catch (err) {
			this.error = messageOf(err, 'Error al cargar el catálogo.');
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

	/** Creates (no `code`) or updates an entry, then reloads the list. */
	async save(code: string | null, values: EntryValues): Promise<SaveResult> {
		this.submitting = true;
		try {
			if (code) await catalogApi.update(this.slug, code, values);
			else await catalogApi.create(this.slug, values);
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

	async setActive(entry: CatalogEntry, active: boolean): Promise<boolean> {
		this.submitting = true;
		this.error = null;
		try {
			if (active) await catalogApi.activate(this.slug, entry.code);
			else await catalogApi.deactivate(this.slug, entry.code);
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
