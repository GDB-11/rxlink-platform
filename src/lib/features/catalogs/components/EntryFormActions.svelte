<!-- src/lib/features/catalogs/components/EntryFormActions.svelte -->
<script lang="ts">
	import SubmitButton from '$lib/components/ui/SubmitButton.svelte';

	interface Props {
		submitting: boolean;
		submitLabel: string;
		oncancel: () => void;
	}

	let { submitting, submitLabel, oncancel }: Props = $props();
</script>

<div class="flex justify-end gap-3 pt-2">
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
	<div class="w-36">
		<SubmitButton isLoading={submitting} label={submitLabel} loadingLabel="Guardando…" />
	</div>
</div>
