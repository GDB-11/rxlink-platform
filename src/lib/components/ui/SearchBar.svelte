<!-- src/lib/components/ui/SearchBar.svelte -->
<script lang="ts">
	import { IconSearch, IconX } from '@tabler/icons-svelte';

	interface Props {
		placeholder?: string;
		disabled?: boolean;
		onsearch: (value: string) => void;
	}
	let { placeholder = 'Buscar…', disabled = false, onsearch }: Props = $props();

	let inputValue = $state('');
	let timer: ReturnType<typeof setTimeout> | undefined;

	function handleInput(e: Event) {
		inputValue = (e.currentTarget as HTMLInputElement).value;
		clearTimeout(timer);
		timer = setTimeout(() => onsearch(inputValue), 350);
	}

	function clear() {
		inputValue = '';
		clearTimeout(timer);
		onsearch('');
	}
</script>

<div class="relative">
	<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
		<IconSearch size={16} class="text-stone-400" aria-hidden="true" />
	</div>
	<input
		type="search"
		value={inputValue}
		oninput={handleInput}
		{disabled}
		{placeholder}
		aria-label={placeholder}
		class="w-full rounded-lg border border-stone-200 bg-white py-2 pr-9 pl-9 text-sm text-stone-900
               transition-colors placeholder:text-stone-400
               focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none
               disabled:cursor-not-allowed disabled:opacity-50
               dark:border-stone-700 dark:bg-stone-800 dark:text-stone-50
               dark:placeholder:text-stone-600 dark:focus:border-teal-600"
	/>
	{#if inputValue}
		<button
			type="button"
			onclick={clear}
			{disabled}
			class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3
                   text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
			aria-label="Limpiar búsqueda"
		>
			<IconX size={16} aria-hidden="true" />
		</button>
	{/if}
</div>
