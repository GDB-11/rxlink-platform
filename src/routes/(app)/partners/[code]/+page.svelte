<!-- src/routes/(app)/partners/[code]/+page.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import { PartnerDetailView } from '$lib/features/partners';

	const code = $derived(page.params.code ?? '');
</script>

<svelte:head>
	<title>Partner — RxLink Plataforma</title>
</svelte:head>

<div class="mx-auto max-w-6xl">
	{#key code}
		<PartnerDetailView {code} />
	{/key}
</div>
