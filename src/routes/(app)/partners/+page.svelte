<!-- src/routes/(app)/partners/+page.svelte -->
<script lang="ts">
	import { PartnerListView } from '$lib/features/partners';
</script>

<svelte:head>
	<title>Partners — RxLink Plataforma</title>
</svelte:head>

<div class="mx-auto max-w-6xl">
	<PartnerListView />
</div>
