<!-- src/lib/components/ui/UsernameField.svelte -->
<script lang="ts">
	interface Props {
		value: string;
		disabled?: boolean;
	}

	let { value = $bindable(''), disabled = false }: Props = $props();
</script>

<div>
	<label for="username" class="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">
		Usuario
	</label>

	<div class="relative">
		<div
			class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5"
			aria-hidden="true"
		>
			<svg
				class="h-4 w-4 text-stone-400 dark:text-stone-500"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501
                       20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112
                       21.75c-2.676 0-5.216-.584-7.499-1.632z"
				/>
			</svg>
		</div>

		<input
			id="username"
			type="text"
			bind:value
			autocomplete="username"
			autocapitalize="none"
			spellcheck="false"
			{disabled}
			placeholder="Su nombre de usuario"
			class="w-full rounded-lg border border-stone-200 bg-white py-2.5
                   pr-4 pl-10
                   text-sm text-stone-900 transition-all
                   duration-150 placeholder:text-stone-400
                   focus:border-transparent focus:ring-2
                   focus:ring-teal-500 focus:outline-none
                   disabled:cursor-not-allowed disabled:opacity-50
                   dark:border-stone-700
                   dark:bg-stone-800 dark:text-stone-50
                   dark:placeholder:text-stone-600 dark:focus:ring-teal-500"
		/>
	</div>
</div>
