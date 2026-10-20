<!-- src/lib/components/ui/Modal.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		onclose: () => void;
		children: Snippet;
		footer?: Snippet;
		/** Tailwind max-width class of the panel. */
		width?: string;
	}

	let { title, onclose, children, footer, width = 'max-w-lg' }: Props = $props();

	const titleId = $props.id();

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-sm"
	aria-modal="true"
	role="dialog"
	aria-labelledby={titleId}
>
	<div
		class="flex max-h-full w-full {width} flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-stone-800"
	>
		<div class="overflow-y-auto px-6 py-5">
			<h2 id={titleId} class="text-base font-semibold text-stone-900 dark:text-stone-50">
				{title}
			</h2>
			<div class="mt-3">
				{@render children()}
			</div>
		</div>

		{#if footer}
			<div class="flex justify-end gap-3 border-t border-stone-200 px-6 py-4 dark:border-stone-700">
				{@render footer()}
			</div>
		{/if}
	</div>
</div>
