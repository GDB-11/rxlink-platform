<!-- src/routes/(app)/catalogos/+page.svelte -->
<script lang="ts">
	import { CatalogIndex } from '$lib/features/catalogs';
</script>

<svelte:head>
	<title>Catálogos — RxLink Plataforma</title>
</svelte:head>

<div class="mx-auto max-w-5xl space-y-4">
	<h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-50">Catálogos</h1>
	<p class="text-sm text-stone-500 dark:text-stone-400">
		Datos compartidos por todos los partners. Los registros nunca se eliminan: se desactivan.
	</p>
	<CatalogIndex />
</div>
