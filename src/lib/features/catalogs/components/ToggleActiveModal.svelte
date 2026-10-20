<!-- src/lib/features/catalogs/components/ToggleActiveModal.svelte -->
<script lang="ts">
	import type { CatalogEntry } from '$lib/api/catalogApi';
	import Modal from '$lib/components/ui/Modal.svelte';
	import type { CatalogMeta } from '../catalogMeta';

	interface Props {
		meta: CatalogMeta;
		entry: CatalogEntry;
		submitting: boolean;
		onconfirm: () => void;
		oncancel: () => void;
	}

	let { meta, entry, submitting, onconfirm, oncancel }: Props = $props();

	const deactivating = $derived(entry.isActive);
	const verb = $derived(deactivating ? 'Desactivar' : 'Activar');
</script>

<Modal title="{verb} {meta.singular}" onclose={oncancel} width="max-w-sm">
	<p class="text-sm text-stone-600 dark:text-stone-400">
		¿Desea {verb.toLowerCase()}
		<strong class="font-medium text-stone-900 dark:text-stone-100">
			{entry[meta.nameKey]}
		</strong>?
		{#if deactivating}
			El registro se conserva y puede reactivarse más adelante; los partners dejarán de verlo en el
			catálogo.
		{:else}
			Volverá a estar disponible para los partners.
		{/if}
	</p>

	{#snippet footer()}
		<button
			type="button"
			onclick={oncancel}
			disabled={submitting}
			class="cursor-pointer rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium
                   text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900
                   disabled:cursor-not-allowed disabled:opacity-50
                   dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-700 dark:hover:text-stone-50"
		>
			Cancelar
		</button>
		<button
			type="button"
			onclick={onconfirm}
			disabled={submitting}
			class="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors
                   disabled:cursor-not-allowed disabled:opacity-50
                   {deactivating
				? 'bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700'
				: 'bg-teal-600 hover:bg-teal-700'}"
		>
			{submitting ? 'Guardando…' : verb}
		</button>
	{/snippet}
</Modal>
