<!-- src/lib/components/ui/InfoAlert.svelte -->
<script lang="ts">
	interface Props {
		message: string | null;
	}

	let { message }: Props = $props();
</script>

{#if message}
	<div
		class="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800
               dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
		role="status"
		aria-live="polite"
	>
		{message}
	</div>
{/if}
