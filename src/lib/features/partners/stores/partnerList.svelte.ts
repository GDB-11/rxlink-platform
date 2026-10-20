// src/lib/features/partners/stores/partnerList.svelte.ts

import { partnerApi, type Partner, type PartnerStatus } from '$lib/api/partnerApi';

/** List/search/status filter/paging of the partner registry. */
export class PartnerListStore {
	items = $state<Partner[]>([]);
	page = $state(1);
	pageSize = $state(25);
	total = $state(0);
	search = $state('');
	status = $state<PartnerStatus | ''>('');
	loading = $state(false);
	error = $state<string | null>(null);

	totalPages = $derived(Math.max(1, Math.ceil(this.total / this.pageSize)));

	async load(): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			const res = await partnerApi.list({
				search: this.search,
				status: this.status,
				page: this.page,
				pageSize: this.pageSize
			});
			this.items = res.items;
			this.total = res.total;
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al cargar los partners.';
		} finally {
			this.loading = false;
		}
	}

	async setSearch(value: string): Promise<void> {
		this.search = value;
		this.page = 1;
		await this.load();
	}

	async setStatus(value: PartnerStatus | ''): Promise<void> {
		this.status = value;
		this.page = 1;
		await this.load();
	}

	async goToPage(page: number): Promise<void> {
		this.page = Math.min(Math.max(1, page), this.totalPages);
		await this.load();
	}
}
