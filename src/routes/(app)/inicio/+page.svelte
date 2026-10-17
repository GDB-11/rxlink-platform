<!-- src/routes/(app)/inicio/+page.svelte -->
<script lang="ts">
	import { auth } from '$lib/features/auth';
</script>

<svelte:head>
	<title>Inicio — RxLink Plataforma</title>
</svelte:head>

<div class="mx-auto max-w-3xl space-y-2">
	<h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-50">
		Hola, {auth.user?.username}
	</h1>
	<p class="text-sm text-stone-500 dark:text-stone-400">
		Desde aquí se administrará el catálogo compartido y los partners de RxLink.
	</p>
</div>
