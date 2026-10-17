<!-- src/lib/components/ui/TextInput.svelte -->
<script lang="ts">
	type FilterMode = 'names' | 'digits' | 'username';

	interface Props {
		value?: string;
		id?: string;
		type?: 'text' | 'email';
		placeholder?: string;
		disabled?: boolean;
		autocomplete?: import('svelte/elements').HTMLInputAttributes['autocomplete'];
		maxLength?: number;
		minLength?: number;
		/** 'names' — Spanish/American letters, spaces, hyphens, apostrophes
		 *  'digits' — 0-9 only
		 *  'username' — a-z and 0-9 only, auto-lowercases */
		filter?: FilterMode;
		class?: string;
	}

	let {
		value = $bindable(''),
		id,
		type = 'text',
		placeholder,
		disabled = false,
		autocomplete,
		maxLength,
		minLength,
		filter,
		class: className = ''
	}: Props = $props();

	const FILTER_RE: Record<FilterMode, RegExp> = {
		names: /[^\p{L}\s\-']/gu,
		digits: /[^0-9]/g,
		username: /[^a-z0-9]/g
	};

	let composing = false;

	function handleInput(e: Event) {
		if (composing) return;
		const el = e.currentTarget as HTMLInputElement;
		let v = el.value;
		if (filter === 'username') v = v.toLowerCase();
		if (filter) v = v.replace(FILTER_RE[filter], '');
		value = v;
		if (el.value !== v) el.value = v;
	}
</script>

<input
	{id}
	{type}
	{value}
	oninput={handleInput}
	oncompositionstart={() => (composing = true)}
	oncompositionend={() => (composing = false)}
	{placeholder}
	{disabled}
	{autocomplete}
	maxlength={maxLength}
	minlength={minLength}
	autocapitalize={filter === 'username' || type === 'email' ? 'none' : undefined}
	spellcheck={filter != null || type === 'email' ? false : undefined}
	class="w-full rounded-lg border px-3 py-2 text-sm text-stone-900
           transition-colors placeholder:text-stone-400
           focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 focus:outline-none
           disabled:cursor-not-allowed disabled:opacity-50
           dark:text-stone-50 dark:placeholder:text-stone-600 dark:focus:border-teal-600
           {className || 'border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900'}"
/>
