<!-- src/lib/features/rules/components/ClassListView.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { CatalogEntry } from '$lib/api/catalogApi';
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import CatalogTable from '$lib/features/catalogs/components/CatalogTable.svelte';
	import ToggleActiveModal from '$lib/features/catalogs/components/ToggleActiveModal.svelte';
	import type { MedicationClassItem } from '$lib/api/ruleApi';
	import { classMeta } from '../ruleMeta';
	import { ClassListStore } from '../stores/classList.svelte';
	import ClassFormModal from './ClassFormModal.svelte';
	import RuleListToolbar from './RuleListToolbar.svelte';

	const store = new ClassListStore();

	let creating = $state(false);
	let toggling = $state<CatalogEntry | null>(null);

	// CatalogTable reads rows as generic catalog entries.
	const rows = $derived(store.items.map((i) => ({ ...i })));

	onMount(() => store.load());

	function original(entry: CatalogEntry): MedicationClassItem {
		return store.items.find((i) => i.code === entry.code)!;
	}

	async function confirmToggle() {
		if (!toggling) return;
		if (await store.setActive(original(toggling), !toggling.isActive)) toggling = null;
	}
</script>

<div class="space-y-4">
	<div class="flex flex-wrap items-center justify-between gap-3">
		<div>
			<h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-50">
				{classMeta.label}
			</h1>
			<p class="text-sm text-stone-500 dark:text-stone-400">
				Agrupan medicamentos para las alertas de alergia e interacción. Una alergia a un solo
				producto es una clase con un único medicamento.
			</p>
			<a
				href={resolve('/catalogos/interacciones')}
				class="text-sm text-teal-700 hover:underline dark:text-teal-400"
			>
				Ver reglas de interacción
			</a>
		</div>
		<button
			type="button"
			onclick={() => (creating = true)}
			class="cursor-pointer rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white
                   transition-colors hover:bg-teal-700"
		>
			Nueva clase de medicamentos
		</button>
	</div>

	<RuleListToolbar
		loading={store.loading}
		includeInactive={store.includeInactive}
		onsearch={(v) => store.setSearch(v)}
		onincludeinactive={(v) => store.setIncludeInactive(v)}
	/>

	<ErrorAlert message={store.error} />

	<CatalogTable
		meta={classMeta}
		items={rows}
		loading={store.loading}
		busy={store.submitting}
		onEdit={(entry) => goto(resolve(`/catalogos/clases/${entry.code}`))}
		onToggle={(entry) => (toggling = entry)}
	/>

	<Pagination
		page={store.page}
		pageSize={store.pageSize}
		total={store.total}
		totalPages={store.totalPages}
		loading={store.loading}
		onPageChange={(p) => store.goToPage(p)}
	/>
</div>

{#if creating}
	<ClassFormModal
		initial={null}
		submitting={store.submitting}
		onsave={(values) => store.save(null, values)}
		onclose={() => (creating = false)}
	/>
{/if}

{#if toggling}
	<ToggleActiveModal
		meta={classMeta}
		entry={toggling}
		submitting={store.submitting}
		onconfirm={confirmToggle}
		oncancel={() => (toggling = null)}
	/>
{/if}
