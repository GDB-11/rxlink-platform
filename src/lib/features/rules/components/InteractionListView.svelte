<!-- src/lib/features/rules/components/InteractionListView.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import type { CatalogEntry } from '$lib/api/catalogApi';
	import type { InteractionItem } from '$lib/api/ruleApi';
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import CatalogTable from '$lib/features/catalogs/components/CatalogTable.svelte';
	import ToggleActiveModal from '$lib/features/catalogs/components/ToggleActiveModal.svelte';
	import { interactionMeta } from '../ruleMeta';
	import { InteractionListStore } from '../stores/interactionList.svelte';
	import InteractionFormModal from './InteractionFormModal.svelte';
	import RuleListToolbar from './RuleListToolbar.svelte';

	const store = new InteractionListStore();

	let editing = $state<{ interaction: InteractionItem | null } | null>(null);
	let toggling = $state<CatalogEntry | null>(null);

	// CatalogTable reads rows as generic catalog entries; `name` names the rule in the dialogs.
	const rows = $derived(
		store.items.map((i) => ({ ...i, name: `${i.classAName} ↔ ${i.classBName}` }))
	);

	onMount(() => store.load());

	function original(entry: CatalogEntry): InteractionItem {
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
				{interactionMeta.label}
			</h1>
			<p class="text-sm text-stone-500 dark:text-stone-400">
				Pares de clases que no deben combinarse. Los partners ven estas alertas al firmar una
				receta.
			</p>
			<a
				href={resolve('/catalogos/clases')}
				class="text-sm text-teal-700 hover:underline dark:text-teal-400"
			>
				Ver clases de medicamentos
			</a>
		</div>
		<button
			type="button"
			onclick={() => (editing = { interaction: null })}
			class="cursor-pointer rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white
                   transition-colors hover:bg-teal-700"
		>
			Nueva regla de interacción
		</button>
	</div>

	<RuleListToolbar
		loading={store.loading}
		includeInactive={store.includeInactive}
		placeholder="Buscar por clase…"
		onsearch={(v) => store.setSearch(v)}
		onincludeinactive={(v) => store.setIncludeInactive(v)}
	/>

	<ErrorAlert message={store.error} />

	<CatalogTable
		meta={interactionMeta}
		items={rows}
		loading={store.loading}
		busy={store.submitting}
		onEdit={(entry) => (editing = { interaction: original(entry) })}
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

{#if editing}
	{#key editing}
		<InteractionFormModal
			interaction={editing.interaction}
			submitting={store.submitting}
			onsave={(values) => store.save(editing?.interaction?.code ?? null, values)}
			onclose={() => (editing = null)}
		/>
	{/key}
{/if}

{#if toggling}
	<ToggleActiveModal
		meta={interactionMeta}
		entry={toggling}
		submitting={store.submitting}
		onconfirm={confirmToggle}
		oncancel={() => (toggling = null)}
	/>
{/if}
