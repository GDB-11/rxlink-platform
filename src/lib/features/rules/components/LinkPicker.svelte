<!-- src/lib/features/rules/components/LinkPicker.svelte -->
<script lang="ts">
	import SearchBar from '$lib/components/ui/SearchBar.svelte';
	import type { LinkCandidate } from '../stores/classDetail.svelte';

	interface Props {
		placeholder: string;
		candidates: LinkCandidate[];
		searching: boolean;
		busy: boolean;
		/** True once the user has searched, so "no results" is not shown before the first search. */
		searched: boolean;
		onsearch: (value: string) => void;
		onadd: (code: string) => void;
	}

	let { placeholder, candidates, searching, busy, searched, onsearch, onadd }: Props = $props();
</script>

<div class="space-y-2">
	<SearchBar {placeholder} disabled={busy} {onsearch} />

	{#if searching}
		<p class="text-sm text-stone-500 dark:text-stone-400">Buscando…</p>
	{:else if searched && candidates.length === 0}
		<p class="text-sm text-stone-500 dark:text-stone-400">Sin resultados.</p>
	{:else if candidates.length > 0}
		<ul
			class="divide-y divide-stone-100 rounded-lg border border-stone-200 dark:divide-stone-800 dark:border-stone-700"
		>
			{#each candidates as candidate (candidate.code)}
				<li class="flex items-center justify-between gap-3 px-3 py-2 text-sm">
					<span class="text-stone-800 dark:text-stone-200">{candidate.label}</span>
					<button
						type="button"
						disabled={busy}
						onclick={() => onadd(candidate.code)}
						class="cursor-pointer rounded-lg border border-teal-600 px-3 py-1 text-xs font-medium
                               text-teal-700 transition-colors hover:bg-teal-50
                               disabled:cursor-not-allowed disabled:opacity-50
                               dark:text-teal-300 dark:hover:bg-teal-950"
					>
						Agregar
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
