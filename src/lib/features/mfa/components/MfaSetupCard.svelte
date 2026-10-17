<!-- src/lib/features/mfa/components/MfaSetupCard.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import { mfa } from '../stores/mfa.svelte';
	import MfaEnrollmentForm from './MfaEnrollmentForm.svelte';

	onMount(() => {
		mfa.load();
	});
</script>

<section
	class="space-y-4 rounded-xl border border-stone-200 bg-white p-5
           dark:border-stone-700 dark:bg-stone-800"
	aria-labelledby="mfa-card-title"
>
	<div>
		<h2 id="mfa-card-title" class="text-base font-semibold text-stone-900 dark:text-stone-50">
			Verificación en dos pasos
		</h2>
		<p class="mt-1 text-sm text-stone-500 dark:text-stone-400">
			Añade una capa de seguridad: al iniciar sesión se le pedirá un código de su aplicación de
			autenticación.
		</p>
	</div>

	{#if mfa.loading}
		<div class="h-10 animate-pulse rounded-lg bg-stone-200 dark:bg-stone-700"></div>
	{:else if mfa.enrollment}
		<MfaEnrollmentForm
			enrollment={mfa.enrollment}
			submitting={mfa.submitting}
			error={mfa.error}
			onconfirm={(code) => mfa.confirm(code)}
			oncancel={() => mfa.cancelEnrollment()}
		/>
	{:else if mfa.status?.enabled}
		<p
			class="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800
                   dark:border-teal-800 dark:bg-teal-900/30 dark:text-teal-300"
			role="status"
		>
			La verificación en dos pasos está activada. Si perdió su dispositivo, otro administrador de la
			plataforma puede restablecerla.
		</p>
	{:else}
		<ErrorAlert message={mfa.error} />
		<button
			type="button"
			onclick={() => mfa.startEnrollment()}
			disabled={mfa.submitting || !mfa.status}
			class="cursor-pointer rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-white
                   transition-colors hover:bg-teal-600
                   disabled:cursor-not-allowed disabled:opacity-60
                   dark:bg-teal-600 dark:hover:bg-teal-700"
		>
			{mfa.submitting
				? 'Preparando…'
				: mfa.status?.pending
					? 'Reiniciar registro'
					: 'Activar verificación en dos pasos'}
		</button>
	{/if}
</section>
