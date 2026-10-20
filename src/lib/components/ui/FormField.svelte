<!-- src/lib/components/ui/FormField.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		/** `id` of the control inside; wires the label to it. */
		for: string;
		error?: string | null;
		hint?: string;
		children: Snippet;
	}

	let { label, for: controlId, error = null, hint, children }: Props = $props();
</script>

<div class="space-y-1">
	<label for={controlId} class="block text-sm font-medium text-stone-700 dark:text-stone-300">
		{label}
	</label>
	{@render children()}
	{#if hint && !error}
		<p class="text-xs text-stone-500 dark:text-stone-400">{hint}</p>
	{/if}
	{#if error}
		<p class="text-xs text-rose-600 dark:text-rose-400" role="alert">{error}</p>
	{/if}
</div>
