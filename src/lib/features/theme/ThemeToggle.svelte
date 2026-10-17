<!-- src/lib/features/theme/ThemeToggle.svelte -->
<script lang="ts">
	import MoonSvg from '$lib/components/svg/MoonSvg.svelte';
	import SunSvg from '$lib/components/svg/SunSvg.svelte';
	import { theme } from './stores/theme.svelte';

	let currentTheme = $state<'light' | 'dark'>('light');

	$effect(() => {
		const unsubscribe = theme.subscribe((value) => {
			currentTheme = value;
		});

		return unsubscribe;
	});

	function toggleTheme() {
		theme.toggle();
	}
</script>

<button
	onclick={toggleTheme}
	class="relative inline-flex h-10 w-10 cursor-pointer items-center justify-center
         rounded-lg bg-stone-200
         transition-colors duration-200
         hover:bg-stone-300 focus:ring-2
         focus:ring-teal-500 focus:ring-offset-2 focus:outline-none dark:bg-stone-700
         dark:hover:bg-stone-600 dark:focus:ring-offset-stone-900"
	aria-label={currentTheme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
	title={currentTheme === 'light' ? 'Modo oscuro' : 'Modo claro'}
>
	<SunSvg {currentTheme} />

	<MoonSvg {currentTheme} />
</button>
