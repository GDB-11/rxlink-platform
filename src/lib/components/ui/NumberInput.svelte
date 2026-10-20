<!-- src/lib/components/ui/NumberInput.svelte -->
<script lang="ts">
	interface Props {
		/** Raw text so an empty box stays empty; the caller parses it. */
		value?: string;
		id?: string;
		min?: number | null;
		max?: number | null;
		step?: number | 'any';
		disabled?: boolean;
	}

	let {
		value = $bindable(''),
		id,
		min = null,
		max = null,
		step = 1,
		disabled = false
	}: Props = $props();
</script>

<input
	{id}
	type="number"
	bind:value
	min={min ?? undefined}
	max={max ?? undefined}
	{step}
	{disabled}
	class="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900
           transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none
           disabled:cursor-not-allowed disabled:opacity-50
           dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50 dark:focus:border-teal-600"
/>
