<!-- src/lib/features/rules/components/ClassLinkPanel.svelte -->
<script lang="ts">
	import type { RuleLink } from '$lib/api/ruleApi';
	import type { LinkCandidate } from '../stores/classDetail.svelte';
	import LinkPicker from './LinkPicker.svelte';

	interface Props {
		title: string;
		description: string;
		emptyText: string;
		searchPlaceholder: string;
		links: RuleLink[];
		candidates: LinkCandidate[];
		searching: boolean;
		busy: boolean;
		onsearch: (value: string) => void;
		onadd: (code: string) => void;
		onremove: (code: string) => void;
	}

	let {
		title,
		description,
		emptyText,
		searchPlaceholder,
		links,
		candidates,
		searching,
		busy,
		onsearch,
		onadd,
		onremove
	}: Props = $props();

	let searched = $state(false);

	function handleSearch(value: string) {
		searched = value.trim() !== '';
		onsearch(value);
	}
</script>

<section
	class="space-y-3 rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-700 dark:bg-stone-900"
>
	<div>
		<h2 class="text-base font-semibold text-stone-900 dark:text-stone-50">{title}</h2>
		<p class="text-sm text-stone-500 dark:text-stone-400">{description}</p>
	</div>

	{#if links.length === 0}
		<p class="text-sm text-stone-500 dark:text-stone-400">{emptyText}</p>
	{:else}
		<ul class="divide-y divide-stone-100 dark:divide-stone-800">
			{#each links as link (link.code)}
				<li class="flex items-center justify-between gap-3 py-2 text-sm">
					<span class="text-stone-800 dark:text-stone-200">
						{link.label}
						{#if !link.isActive}
							<span class="ml-1 text-xs text-stone-500 dark:text-stone-400">(inactivo)</span>
						{/if}
					</span>
					<button
						type="button"
						disabled={busy}
						onclick={() => onremove(link.code)}
						class="cursor-pointer rounded-lg border border-stone-200 px-3 py-1 text-xs font-medium
                               text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900
                               disabled:cursor-not-allowed disabled:opacity-50
                               dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800
                               dark:hover:text-stone-50"
					>
						Quitar
					</button>
				</li>
			{/each}
		</ul>
	{/if}

	<LinkPicker
		placeholder={searchPlaceholder}
		{candidates}
		{searching}
		{busy}
		{searched}
		onsearch={handleSearch}
		{onadd}
	/>
</section>
