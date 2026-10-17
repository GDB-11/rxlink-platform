<!-- src/lib/features/shell/components/AppHeader.svelte -->
<script lang="ts">
	import BrandLogo from '$lib/components/ui/BrandLogo.svelte';
	import { ThemeToggle } from '$lib/features/theme';

	interface Props {
		username: string;
		loggingOut: boolean;
		onLogout: () => void;
	}

	let { username, loggingOut, onLogout }: Props = $props();
</script>

<header
	class="flex h-14 shrink-0 items-center justify-between border-b border-stone-200 bg-white px-4
	       md:px-6 dark:border-stone-800 dark:bg-stone-900"
>
	<div class="flex items-center gap-3">
		<BrandLogo variant="color" size="xs" />
		<span
			class="rounded bg-stone-100 px-2 py-0.5 text-xs font-medium tracking-wide text-stone-500 uppercase
			       dark:bg-stone-800 dark:text-stone-400"
		>
			Plataforma
		</span>
	</div>

	<div class="flex items-center gap-3">
		<span class="hidden text-sm text-stone-600 sm:inline dark:text-stone-300">{username}</span>
		<ThemeToggle />
		<button
			type="button"
			onclick={onLogout}
			disabled={loggingOut}
			class="cursor-pointer rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium
			       text-stone-600 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed
			       disabled:opacity-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
		>
			{loggingOut ? 'Cerrando…' : 'Cerrar sesión'}
		</button>
	</div>
</header>
