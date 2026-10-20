<!-- src/lib/features/partners/components/SectionCard.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<section
	class="space-y-3 rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-700 dark:bg-stone-900"
>
	<h2 class="text-sm font-semibold text-stone-900 dark:text-stone-50">{title}</h2>
	{@render children()}
</section>
