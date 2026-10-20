<!-- src/routes/(app)/partners/nuevo/+page.svelte -->
<script lang="ts">
	import { PartnerCreateView } from '$lib/features/partners';
</script>

<svelte:head>
	<title>Nuevo partner — RxLink Plataforma</title>
</svelte:head>

<div class="mx-auto max-w-3xl">
	<PartnerCreateView />
</div>
