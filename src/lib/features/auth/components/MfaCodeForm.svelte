<!-- src/lib/features/auth/components/MfaCodeForm.svelte -->
<script lang="ts">
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import SubmitButton from '$lib/components/ui/SubmitButton.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	interface Props {
		isLoading: boolean;
		error: string | null;
		onsubmit: (code: string) => void;
		oncancel: () => void;
	}

	let { isLoading, error, onsubmit, oncancel }: Props = $props();

	let code = $state('');

	const canSubmit = $derived(code.length === 6 && !isLoading);

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (canSubmit) onsubmit(code);
	}
</script>

<form onsubmit={handleSubmit} novalidate class="space-y-5">
	<div>
		<h2 class="text-lg font-semibold text-stone-900 dark:text-stone-50">
			Verificación en dos pasos
		</h2>
		<p class="mt-1 text-sm text-stone-500 dark:text-stone-400">
			Ingrese el código de 6 dígitos de su aplicación de autenticación.
		</p>
	</div>

	<ErrorAlert message={error} />

	<div class="space-y-1.5">
		<label for="mfa-code" class="block text-sm font-medium text-stone-700 dark:text-stone-300">
			Código de verificación
		</label>
		<TextInput
			id="mfa-code"
			bind:value={code}
			filter="digits"
			maxLength={6}
			placeholder="000000"
			autocomplete="one-time-code"
			disabled={isLoading}
		/>
	</div>

	<SubmitButton {isLoading} disabled={!canSubmit} label="Verificar" loadingLabel="Verificando…" />

	<button
		type="button"
		onclick={oncancel}
		disabled={isLoading}
		class="w-full cursor-pointer text-center text-sm text-stone-500 transition-colors
		       hover:text-stone-800 disabled:cursor-not-allowed disabled:opacity-50
		       dark:text-stone-400 dark:hover:text-stone-200"
	>
		Volver al inicio de sesión
	</button>
</form>
