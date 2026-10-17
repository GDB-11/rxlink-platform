<!-- src/lib/components/ui/PasswordField.svelte -->
<script lang="ts">
	import EyeOnSvg from '$lib/components/svg/EyeOnSvg.svelte';
	import EyeOffSvg from '$lib/components/svg/EyeOffSvg.svelte';

	interface Props {
		value: string;
		id?: string;
		placeholder?: string;
		autocomplete?: HTMLInputElement['autocomplete'];
		disabled?: boolean;
	}

	let {
		value = $bindable(''),
		id = 'password',
		placeholder = 'Su contraseña',
		autocomplete = 'current-password',
		disabled = false
	}: Props = $props();

	let showPassword = $state(false);
</script>

<div>
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
					d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25
                       2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25
                       2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
				/>
			</svg>
		</div>

		<input
			{id}
			type={showPassword ? 'text' : 'password'}
			bind:value
			{autocomplete}
			{disabled}
			{placeholder}
			class="w-full rounded-lg border border-stone-200 bg-white py-2.5
                   pr-11 pl-10
                   text-sm text-stone-900 transition-all
                   duration-150 placeholder:text-stone-400
                   focus:border-transparent focus:ring-2
                   focus:ring-teal-500 focus:outline-none
                   disabled:cursor-not-allowed disabled:opacity-50
                   dark:border-stone-700
                   dark:bg-stone-800 dark:text-stone-50
                   dark:placeholder:text-stone-600 dark:focus:ring-teal-500"
		/>

		<button
			type="button"
			onclick={() => (showPassword = !showPassword)}
			{disabled}
			aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
			class="absolute inset-y-0 right-0 flex cursor-pointer items-center
                   pr-3.5 text-stone-400
                   transition-colors duration-150
                   hover:text-stone-600 disabled:cursor-not-allowed
                   dark:text-stone-500 dark:hover:text-stone-300"
		>
			{#if showPassword}
				<EyeOffSvg class="h-4 w-4" />
			{:else}
				<EyeOnSvg class="h-4 w-4" />
			{/if}
		</button>
	</div>
</div>
