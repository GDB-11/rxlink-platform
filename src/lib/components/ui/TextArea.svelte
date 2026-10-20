<!-- src/lib/components/ui/TextArea.svelte -->
<script lang="ts">
	interface Props {
		value?: string;
		id?: string;
		placeholder?: string;
		disabled?: boolean;
		maxLength?: number;
		rows?: number;
	}

	let {
		value = $bindable(''),
		id,
		placeholder,
		disabled = false,
		maxLength,
		rows = 3
	}: Props = $props();
</script>

<textarea
	{id}
	bind:value
	{placeholder}
	{disabled}
	{rows}
	maxlength={maxLength}
	class="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900
           transition-colors placeholder:text-stone-400
           focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none
           disabled:cursor-not-allowed disabled:opacity-50
           dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50 dark:placeholder:text-stone-600
           dark:focus:border-teal-600"
></textarea>
