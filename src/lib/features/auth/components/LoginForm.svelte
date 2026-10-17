<!-- src/lib/features/auth/components/LoginForm.svelte -->

<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { authApi, ApiError, isMfaChallenge } from '$lib/api/authApi';
	import { auth } from '$lib/features/auth';
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import InfoAlert from '$lib/components/ui/InfoAlert.svelte';
	import PasswordField from '$lib/components/ui/PasswordField.svelte';
	import SubmitButton from '$lib/components/ui/SubmitButton.svelte';
	import UsernameField from '$lib/components/ui/UsernameField.svelte';
	import LoginFormHeading from './LoginFormHeading.svelte';
	import MfaCodeForm from './MfaCodeForm.svelte';
	import { SESSION_END_MESSAGES, type SessionEndReason } from '../sessionPolicy';

	let username = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let error = $state<string | null>(null);
	/** Set when the password was accepted but the account requires a second factor. */
	let mfaToken = $state<string | null>(null);

	/** Why the previous session ended (?reason=idle|session), shown above the form. */
	const sessionNotice = $derived.by(() => {
		const reason = page.url.searchParams.get('reason') as SessionEndReason | null;
		return reason && reason in SESSION_END_MESSAGES ? SESSION_END_MESSAGES[reason] : null;
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!username.trim() || !password.trim()) {
			error = 'Por favor ingrese su usuario y contraseña.';
			return;
		}

		isLoading = true;
		error = null;

		try {
			const data = await authApi.login(username.trim(), password);
			if (isMfaChallenge(data)) {
				mfaToken = data.mfaToken;
				password = '';
				return;
			}
			auth.login(data);
			await goto(resolve('/inicio'));
		} catch (err) {
			error = toMessage(err, 'Error al iniciar sesión. Intente nuevamente.');
		} finally {
			isLoading = false;
		}
	}

	async function handleMfaSubmit(code: string) {
		if (!mfaToken) return;

		isLoading = true;
		error = null;

		try {
			const data = await authApi.verifyMfa(mfaToken, code);
			auth.login(data);
			await goto(resolve('/inicio'));
		} catch (err) {
			error = toMessage(err, 'No se pudo verificar el código. Intente nuevamente.');
			// A 401 can also mean the challenge expired; the user restarts from the password step.
		} finally {
			isLoading = false;
		}
	}

	function cancelMfa() {
		mfaToken = null;
		error = null;
	}

	function toMessage(err: unknown, fallback: string): string {
		if (err instanceof ApiError) return err.message || fallback;
		return 'Error de conexión. Verifique su red e intente nuevamente.';
	}
</script>

<div class="w-full max-w-88">
	{#if mfaToken}
		<MfaCodeForm {isLoading} {error} onsubmit={handleMfaSubmit} oncancel={cancelMfa} />
	{:else}
		<LoginFormHeading />

		<form onsubmit={handleSubmit} novalidate class="space-y-5">
			<InfoAlert message={sessionNotice} />
			<ErrorAlert message={error} />

			<UsernameField bind:value={username} disabled={isLoading} />

			<PasswordField bind:value={password} disabled={isLoading} />

			<SubmitButton {isLoading} label="Iniciar sesión" loadingLabel="Iniciando sesión…" />
		</form>
	{/if}

	<p class="mt-8 text-center text-xs leading-relaxed text-stone-400 dark:text-stone-600">
		Acceso exclusivo para el personal de la plataforma RxLink.
	</p>
</div>
