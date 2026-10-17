<!-- src/routes/(auth)/+layout.svelte -->
<script lang="ts">
	import '../../app.css';
	import { ThemeToggle } from '$lib/features/theme';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="relative min-h-screen">
	<div class="absolute top-4 right-4 z-50">
		<ThemeToggle />
	</div>

	{@render children()}
</div>
