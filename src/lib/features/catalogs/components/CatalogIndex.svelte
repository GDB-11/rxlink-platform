<!-- src/lib/features/catalogs/components/CatalogIndex.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import { catalogMetas } from '../catalogMeta';

	// Clinical rules (Phase 11.1) have their own pages: they are not flat lookup lists.
	const rules = [
		{ href: '/catalogos/clases', label: 'Clases de medicamentos' },
		{ href: '/catalogos/interacciones', label: 'Interacciones entre clases' }
	] as const;

	const cardClass = `block rounded-xl border border-stone-200 bg-white px-4 py-4 text-sm font-medium
		text-stone-900 transition-colors hover:border-teal-500 hover:text-teal-700
		dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50
		dark:hover:border-teal-600 dark:hover:text-teal-300`;
</script>

<div class="space-y-6">
	<ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
		{#each catalogMetas as meta (meta.slug)}
			<li>
				<a href={resolve(`/catalogos/${meta.slug}`)} class={cardClass}>{meta.label}</a>
			</li>
		{/each}
	</ul>

	<section class="space-y-3">
		<div>
			<h2 class="text-lg font-semibold text-stone-900 dark:text-stone-50">Reglas clínicas</h2>
			<p class="text-sm text-stone-500 dark:text-stone-400">
				Alertas de alergia e interacción que los partners muestran al firmar una receta.
			</p>
		</div>
		<ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each rules as rule (rule.href)}
				<li><a href={resolve(rule.href)} class={cardClass}>{rule.label}</a></li>
			{/each}
		</ul>
	</section>
</div>
