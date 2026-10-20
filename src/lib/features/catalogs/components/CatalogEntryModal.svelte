<!-- src/lib/features/catalogs/components/CatalogEntryModal.svelte -->
<script lang="ts">
	import { MEDICATIONS_SLUG, type CatalogEntry, type EntryValues } from '$lib/api/catalogApi';
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { CatalogMeta } from '../catalogMeta';
	import type { CatalogListStore } from '../stores/catalogList.svelte';
	import MedicationEntryForm from './MedicationEntryForm.svelte';
	import SimpleEntryForm from './SimpleEntryForm.svelte';

	interface Props {
		meta: CatalogMeta;
		store: CatalogListStore;
		/** `null` creates a new entry. */
		entry: CatalogEntry | null;
		onclose: () => void;
	}

	let { meta, store, entry, onclose }: Props = $props();

	let fieldErrors = $state<Record<string, string>>({});
	let message = $state<string | null>(null);

	const title = $derived(entry ? `Editar ${meta.singular}` : `Nuev${meta.gender} ${meta.singular}`);

	async function handleSubmit(values: EntryValues) {
		fieldErrors = {};
		message = null;
		const result = await store.save(entry?.code ?? null, values);
		if (result.ok) onclose();
		else {
			fieldErrors = result.fieldErrors ?? {};
			message = result.message ?? null;
		}
	}
</script>

<Modal {title} {onclose}>
	{#if meta.slug === MEDICATIONS_SLUG}
		<MedicationEntryForm
			{meta}
			{entry}
			submitting={store.submitting}
			{fieldErrors}
			{message}
			onsubmit={handleSubmit}
			oncancel={onclose}
		/>
	{:else if store.fields.length > 0}
		<SimpleEntryForm
			{meta}
			fields={store.fields}
			{entry}
			submitting={store.submitting}
			{fieldErrors}
			{message}
			onsubmit={handleSubmit}
			oncancel={onclose}
		/>
	{:else}
		<p class="text-sm text-stone-500 dark:text-stone-400">Cargando…</p>
	{/if}
</Modal>
