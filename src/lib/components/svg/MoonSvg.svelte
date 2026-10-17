<!-- src/lib/components/svg/MoonSvg.svelte -->
<script lang="ts">
	let { currentTheme }: { currentTheme: 'light' | 'dark' } = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	fill="none"
	viewBox="0 0 24 24"
	stroke-width="2"
	stroke="currentColor"
	class="h-5 w-5 text-stone-600 transition-all duration-300 dark:text-stone-400
           {currentTheme === 'dark'
		? 'scale-100 rotate-0 opacity-100'
		: 'absolute scale-0 -rotate-90 opacity-0'}"
>
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
	/>
</svg>
