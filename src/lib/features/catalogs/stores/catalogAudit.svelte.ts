// src/lib/features/catalogs/stores/catalogAudit.svelte.ts

import { catalogApi, type CatalogAuditEntry } from '$lib/api/catalogApi';

/** Paged change history of one catalog. */
export class CatalogAuditStore {
	readonly slug: string;

	items = $state<CatalogAuditEntry[]>([]);
	page = $state(1);
	pageSize = $state(25);
	total = $state(0);
	loading = $state(false);
	error = $state<string | null>(null);

	totalPages = $derived(Math.max(1, Math.ceil(this.total / this.pageSize)));

	constructor(slug: string) {
		this.slug = slug;
	}

	async load(): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			const res = await catalogApi.audit(this.slug, this.page, this.pageSize);
			this.items = res.items;
			this.total = res.total;
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al cargar el historial.';
		} finally {
			this.loading = false;
		}
	}

	async goToPage(page: number): Promise<void> {
		this.page = Math.min(Math.max(1, page), this.totalPages);
		await this.load();
	}
}
