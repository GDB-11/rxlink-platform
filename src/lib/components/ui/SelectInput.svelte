<!-- src/lib/components/ui/SelectInput.svelte -->
<script lang="ts">
	interface Option {
		value: string;
		label: string;
	}

	interface Props {
		value?: string;
		id?: string;
		options: Option[];
		placeholder?: string;
		disabled?: boolean;
	}

	let {
		value = $bindable(''),
		id,
		options,
		placeholder = 'Seleccione…',
		disabled = false
	}: Props = $props();
</script>

<select
	{id}
	bind:value
	{disabled}
	class="w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900
           transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none
           disabled:cursor-not-allowed disabled:opacity-50
           dark:border-stone-700 dark:bg-stone-900 dark:text-stone-50 dark:focus:border-teal-600"
>
	<option value="" disabled>{placeholder}</option>
	{#each options as option (option.value)}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>
