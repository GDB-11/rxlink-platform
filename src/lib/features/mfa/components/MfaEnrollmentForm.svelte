<!-- src/lib/features/mfa/components/MfaEnrollmentForm.svelte -->
<script lang="ts">
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import SubmitButton from '$lib/components/ui/SubmitButton.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import type { MfaEnrollment } from '$lib/api/mfaApi';
	import MfaQrCode from './MfaQrCode.svelte';

	interface Props {
		enrollment: MfaEnrollment;
		submitting: boolean;
		error: string | null;
		onconfirm: (code: string) => void;
		oncancel: () => void;
	}

	let { enrollment, submitting, error, onconfirm, oncancel }: Props = $props();

	let code = $state('');

	const canSubmit = $derived(code.length === 6 && !submitting);

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (canSubmit) onconfirm(code);
	}
</script>

<form onsubmit={handleSubmit} class="space-y-5">
	<ol class="list-decimal space-y-1 pl-5 text-sm text-stone-600 dark:text-stone-400">
		<li>Escanee el código QR con su aplicación de autenticación.</li>
		<li>Ingrese el código de 6 dígitos que muestra la aplicación.</li>
	</ol>

	<div class="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
		<MfaQrCode value={enrollment.otpauthUri} />
		<div class="space-y-1 text-sm">
			<p class="text-stone-500 dark:text-stone-400">
				¿No puede escanear? Ingrese esta clave manualmente:
			</p>
			<code
				class="block rounded bg-stone-100 px-2 py-1 font-mono text-xs break-all
                         text-stone-800 dark:bg-stone-900 dark:text-stone-200"
			>
				{enrollment.secret}
			</code>
		</div>
	</div>

	<ErrorAlert message={error} />

	<div class="space-y-1.5">
		<label
			for="mfa-enroll-code"
			class="block text-sm font-medium text-stone-700 dark:text-stone-300"
		>
			Código de verificación
		</label>
		<TextInput
			id="mfa-enroll-code"
			bind:value={code}
			filter="digits"
			maxLength={6}
			placeholder="000000"
			autocomplete="one-time-code"
			disabled={submitting}
		/>
	</div>

	<div class="flex gap-3">
		<SubmitButton
			isLoading={submitting}
			disabled={!canSubmit}
			label="Activar verificación"
			loadingLabel="Verificando…"
		/>
		<button
			type="button"
			onclick={oncancel}
			disabled={submitting}
			class="cursor-pointer rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium
                   text-stone-600 transition-colors hover:bg-stone-50
                   disabled:cursor-not-allowed disabled:opacity-50
                   dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-700"
		>
			Cancelar
		</button>
	</div>
</form>
