<!-- src/lib/features/shell/components/AppNav.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';

	interface NavItem {
		href: '/inicio' | '/catalogos' | '/partners' | '/seguridad';
		label: string;
	}

	const items: NavItem[] = [
		{ href: '/inicio', label: 'Inicio' },
		{ href: '/catalogos', label: 'Catálogos' },
		{ href: '/partners', label: 'Partners' },
		{ href: '/seguridad', label: 'Seguridad' }
	];
</script>

<nav
	class="flex gap-1 border-b border-stone-200 bg-white px-4 md:px-6 dark:border-stone-800 dark:bg-stone-900"
	aria-label="Principal"
>
	{#each items as item (item.href)}
		{@const active = page.url.pathname === item.href}
		<a
			href={resolve(item.href)}
			aria-current={active ? 'page' : undefined}
			class="-mb-px border-b-2 px-3 py-2.5 text-sm font-medium transition-colors
			       {active
				? 'border-teal-500 text-teal-700 dark:border-teal-400 dark:text-teal-300'
				: 'border-transparent text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200'}"
		>
			{item.label}
		</a>
	{/each}
</nav>
