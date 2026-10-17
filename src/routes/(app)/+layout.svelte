<!-- src/routes/(app)/+layout.svelte -->
<script lang="ts">
	import '../../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { auth } from '$lib/features/auth';
	import { authApi } from '$lib/api/authApi';
	import SessionGuard from '$lib/features/auth/components/SessionGuard.svelte';
	import type { SessionEndReason } from '$lib/features/auth/sessionPolicy';
	import { AppHeader, AppNav } from '$lib/features/shell';

	let { children } = $props();

	let loggingOut = $state(false);

	onMount(() => {
		if (!auth.isAuthenticated) goto(resolve('/login'));
	});

	async function handleLogout(reason?: SessionEndReason) {
		loggingOut = true;
		const refreshToken = auth.getRefreshToken();
		const accessToken = auth.accessToken;

		if (refreshToken && accessToken) {
			try {
				await authApi.logout(refreshToken, accessToken);
			} catch {
				// Network or expired session: local state is cleared regardless.
			}
		}

		auth.logout();
		const login = resolve('/login');
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- only a query string is appended to a resolved path
		await goto(reason ? `${login}?reason=${reason}` : login);
	}
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Outfit:wght@400;500;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<SessionGuard onexpire={handleLogout} />

<div
	class="flex h-screen flex-col overflow-hidden bg-stone-100 dark:bg-stone-950"
	style="font-family: 'Outfit', sans-serif;"
>
	<AppHeader username={auth.user?.username ?? ''} {loggingOut} onLogout={() => handleLogout()} />
	<AppNav />

	<main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8" id="main-content">
		{#if auth.isAuthenticated}
			{@render children()}
		{/if}
	</main>
</div>
