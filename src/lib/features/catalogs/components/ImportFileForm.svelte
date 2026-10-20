<!-- src/lib/features/catalogs/components/ImportFileForm.svelte -->
<script lang="ts">
	interface Props {
		file: File | null;
		busy: boolean;
		onfile: (file: File | null) => void;
		onpreview: () => void;
	}

	let { file, busy, onfile, onpreview }: Props = $props();
</script>

<form
	class="flex flex-wrap items-center gap-3"
	onsubmit={(e) => {
		e.preventDefault();
		onpreview();
	}}
>
	<input
		type="file"
		accept=".csv,text/csv"
		disabled={busy}
		onchange={(e) => onfile(e.currentTarget.files?.[0] ?? null)}
		class="block text-sm text-stone-700 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0
               file:bg-stone-100 file:px-3 file:py-2 file:text-sm file:font-medium
               dark:text-stone-300 dark:file:bg-stone-800"
		aria-label="Archivo CSV"
	/>
	<button
		type="submit"
		disabled={!file || busy}
		class="cursor-pointer rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white
               transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
	>
		{busy ? 'Procesando…' : 'Previsualizar'}
	</button>
</form>
