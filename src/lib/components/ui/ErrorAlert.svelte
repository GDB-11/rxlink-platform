<!-- src/lib/components/ui/ErrorAlert.svelte -->
<script lang="ts">
	interface Props {
		message: string | null;
	}

	let { message }: Props = $props();
</script>

{#if message}
	<div
		class="flex items-start gap-2.5
               rounded-lg border border-rose-200
               bg-rose-50 px-4
               py-3 text-sm text-rose-800
               dark:border-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
		role="alert"
		aria-live="polite"
	>
		<svg
			class="mt-0.5 h-4 w-4 shrink-0 text-rose-500 dark:text-rose-400"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
			stroke-width="2"
			aria-hidden="true"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0
                   2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898
                   0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
			/>
		</svg>
		<span>{message}</span>
	</div>
{/if}
