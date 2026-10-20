<!-- src/lib/features/rules/components/RuleListToolbar.svelte -->
<script lang="ts">
	import SearchBar from '$lib/components/ui/SearchBar.svelte';

	interface Props {
		loading: boolean;
		includeInactive: boolean;
		placeholder?: string;
		onsearch: (value: string) => void;
		onincludeinactive: (value: boolean) => void;
	}

	let {
		loading,
		includeInactive,
		placeholder = 'Buscar…',
		onsearch,
		onincludeinactive
	}: Props = $props();
</script>

<div class="flex flex-wrap items-center gap-4">
	<div class="w-full max-w-sm">
		<SearchBar {placeholder} disabled={loading} {onsearch} />
	</div>
	<label class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
		<input
			type="checkbox"
			checked={includeInactive}
			onchange={(e) => onincludeinactive(e.currentTarget.checked)}
			class="rounded border-stone-300 text-teal-600 focus:ring-teal-500"
		/>
		Mostrar inactivos
	</label>
</div>
