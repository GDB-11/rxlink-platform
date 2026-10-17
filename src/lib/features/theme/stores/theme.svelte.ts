// src/lib/features/theme/stores/theme.svelte.ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

const themeStore = writable<Theme>('light');

if (browser) {
	const stored = localStorage.getItem('theme') as Theme | null;
	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	const initialTheme = stored === 'dark' || (!stored && prefersDark) ? 'dark' : 'light';

	themeStore.set(initialTheme);
	document.documentElement.classList.toggle('dark', initialTheme === 'dark');
}

export const theme = {
	subscribe: themeStore.subscribe,

	toggle() {
		themeStore.update((current) => {
			const newTheme = current === 'light' ? 'dark' : 'light';
			if (browser) {
				document.documentElement.classList.toggle('dark', newTheme === 'dark');
				localStorage.setItem('theme', newTheme);
			}
			return newTheme;
		});
	},

	init() {
		if (browser) {
			const stored = localStorage.getItem('theme') as Theme | null;
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			const initialTheme = stored === 'dark' || (!stored && prefersDark) ? 'dark' : 'light';
			themeStore.set(initialTheme);
			document.documentElement.classList.toggle('dark', initialTheme === 'dark');
		}
	}
};
