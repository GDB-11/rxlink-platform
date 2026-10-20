<!-- src/lib/features/partners/components/PartnerListView.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import type { PartnerStatus } from '$lib/api/partnerApi';
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import { statusOptions } from '../partnerMeta';
	import { PartnerListStore } from '../stores/partnerList.svelte';
	import PartnerTable from './PartnerTable.svelte';

	const store = new PartnerListStore();

	onMount(() => {
		store.load();
	});
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-50">Partners</h1>
		<a
			href={resolve('/partners/nuevo')}
			class="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors
			       hover:bg-teal-700"
		>
			Nuevo partner
		</a>
	</div>

	<div class="flex flex-wrap items-center gap-4">
		<div class="w-full max-w-sm">
			<SearchBar
				placeholder="Buscar por nombre, slug o RUC…"
				disabled={store.loading}
				onsearch={(v) => store.setSearch(v)}
			/>
		</div>
		<select
			aria-label="Filtrar por estado"
			value={store.status}
			onchange={(e) => store.setStatus(e.currentTarget.value as PartnerStatus | '')}
			class="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-700
			       dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
		>
			<option value="">Todos los estados</option>
			{#each statusOptions as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</select>
	</div>

	<ErrorAlert message={store.error} />

	<PartnerTable items={store.items} loading={store.loading} />

	<Pagination
		page={store.page}
		pageSize={store.pageSize}
		total={store.total}
		totalPages={store.totalPages}
		loading={store.loading}
		onPageChange={(p) => store.goToPage(p)}
	/>
</div>
