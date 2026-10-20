<!-- src/routes/(app)/catalogos/[slug]/historial/+page.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import { CatalogHistoryView, findCatalogMeta } from '$lib/features/catalogs';

	const meta = $derived(findCatalogMeta(page.params.slug ?? ''));
</script>

<svelte:head>
	<title>Historial — {meta?.label ?? 'Catálogo'} — RxLink Plataforma</title>
</svelte:head>

<div class="mx-auto max-w-5xl">
	{#if meta}
		{#key meta.slug}
			<CatalogHistoryView {meta} />
		{/key}
	{:else}
		<p class="text-sm text-stone-500 dark:text-stone-400">El catálogo no existe.</p>
	{/if}
</div>
