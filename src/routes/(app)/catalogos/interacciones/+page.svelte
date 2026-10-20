<!-- src/routes/(app)/catalogos/interacciones/+page.svelte -->
<script lang="ts">
	import { InteractionListView } from '$lib/features/rules';
</script>

<svelte:head>
	<title>Interacciones — RxLink Plataforma</title>
</svelte:head>

<div class="mx-auto max-w-5xl">
	<InteractionListView />
</div>
