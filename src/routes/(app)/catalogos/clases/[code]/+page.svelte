<!-- src/routes/(app)/catalogos/clases/[code]/+page.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import { ClassDetailView } from '$lib/features/rules';

	const code = $derived(page.params.code ?? '');
</script>

<svelte:head>
	<title>Clase de medicamentos — RxLink Plataforma</title>
</svelte:head>

<div class="mx-auto max-w-5xl">
	{#key code}
		<ClassDetailView {code} />
	{/key}
</div>
