<!-- src/routes/(app)/catalogos/clases/+page.svelte -->
<script lang="ts">
	import { ClassListView } from '$lib/features/rules';
</script>

<svelte:head>
	<title>Clases de medicamentos — RxLink Plataforma</title>
</svelte:head>

<div class="mx-auto max-w-5xl">
	<ClassListView />
</div>
