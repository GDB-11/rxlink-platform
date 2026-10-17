<!-- src/routes/(auth)/login/+page.svelte -->
<script lang="ts">
	import BrandLogo from '$lib/components/ui/BrandLogo.svelte';
	import LoginForm from '$lib/features/auth/components/LoginForm.svelte';
</script>

<svelte:head>
	<title>Iniciar sesión — RxLink Plataforma</title>
</svelte:head>

<div
	class="flex min-h-screen flex-col items-center justify-center gap-10 bg-stone-50 px-6 py-16
	       dark:bg-stone-900"
	style="font-family: 'Outfit', sans-serif;"
>
	<BrandLogo variant="color" size="lg" />
	<LoginForm />
</div>
