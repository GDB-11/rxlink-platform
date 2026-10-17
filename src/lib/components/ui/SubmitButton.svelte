<!-- src/lib/components/ui/SubmitButton.svelte -->
<script lang="ts">
	interface Props {
		isLoading: boolean;
		label: string;
		loadingLabel: string;
		disabled?: boolean;
	}

	let { isLoading, label, loadingLabel, disabled = false }: Props = $props();
</script>

<button
	type="submit"
	disabled={isLoading || disabled}
	class="flex w-full cursor-pointer items-center justify-center
           gap-2 rounded-lg bg-teal-500 px-4 py-2.5
           text-sm font-medium
           text-white transition-all
           duration-150 hover:bg-teal-600
           focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
           focus:ring-offset-stone-50 focus:outline-none
           active:scale-[0.98]
           disabled:cursor-not-allowed disabled:opacity-60
           dark:bg-teal-600 dark:hover:bg-teal-700 dark:focus:ring-offset-stone-900"
>
	{#if isLoading}
		<svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
			/>
		</svg>
		{loadingLabel}
	{:else}
		{label}
	{/if}
</button>
