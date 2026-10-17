<!-- src/routes/(app)/seguridad/+page.svelte -->
<script lang="ts">
	import { MfaSetupCard } from '$lib/features/mfa';
</script>

<svelte:head>
	<title>Seguridad — RxLink Plataforma</title>
</svelte:head>

<div class="mx-auto max-w-2xl space-y-4">
	<h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-50">Seguridad</h1>
	<MfaSetupCard />
</div>
