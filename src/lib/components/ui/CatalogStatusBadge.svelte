<!-- src/lib/components/ui/CatalogStatusBadge.svelte -->
<script lang="ts">
	interface Props {
		isActive: boolean;
	}
	let { isActive }: Props = $props();
</script>

<span
	class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
           {isActive
		? 'bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-300'
		: 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-400'}"
>
	{isActive ? 'Activo' : 'Inactivo'}
</span>
