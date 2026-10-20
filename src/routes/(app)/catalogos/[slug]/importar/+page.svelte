<!-- src/routes/(app)/catalogos/[slug]/importar/+page.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import { CatalogImportView, findCatalogMeta, isImportable } from '$lib/features/catalogs';

	const meta = $derived(findCatalogMeta(page.params.slug ?? ''));
</script>

<svelte:head>
	<title>Importar — {meta?.label ?? 'Catálogo'} — RxLink Plataforma</title>
</svelte:head>

<div class="mx-auto max-w-5xl">
	{#if meta && isImportable(meta.slug)}
		{#key meta.slug}
			<CatalogImportView {meta} />
		{/key}
	{:else}
		<p class="text-sm text-stone-500 dark:text-stone-400">Este catálogo no admite importación.</p>
	{/if}
</div>
