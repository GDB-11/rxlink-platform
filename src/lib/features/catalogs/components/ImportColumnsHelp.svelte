<!-- src/lib/features/catalogs/components/ImportColumnsHelp.svelte -->
<script lang="ts">
	import type { ImportColumnHelp } from '../importMeta';

	interface Props {
		columns: ImportColumnHelp[];
	}

	let { columns }: Props = $props();
</script>

<div class="space-y-2 text-sm text-stone-600 dark:text-stone-400">
	<p>
		CSV en UTF-8 con una fila de encabezados (separador coma, punto y coma o tabulador). Máximo 5000
		filas y 2 MB.
	</p>
	<ul class="list-inside list-disc">
		{#each columns as col (col.name)}
			<li>
				<code class="rounded bg-stone-100 px-1 dark:bg-stone-800">{col.name}</code>
				— {col.hint}{col.required ? '' : ' (opcional)'}
			</li>
		{/each}
	</ul>
</div>
