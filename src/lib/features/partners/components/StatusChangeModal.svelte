<!-- src/lib/features/partners/components/StatusChangeModal.svelte -->
<script lang="ts">
	import type { PartnerStatus } from '$lib/api/partnerApi';
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import { needsReason, statusLabels } from '../partnerMeta';

	interface Props {
		target: PartnerStatus;
		partnerName: string;
		submitting: boolean;
		/** Failure of the last attempt (e.g. 409 with what is still missing). */
		error: string | null;
		onconfirm: (reason: string) => void;
		oncancel: () => void;
	}

	let { target, partnerName, submitting, error, onconfirm, oncancel }: Props = $props();

	let reason = $state('');
	const reasonId = $props.id();

	const reasonRequired = $derived(needsReason(target));
	const destructive = $derived(target === 'Terminated');
	const canConfirm = $derived(!reasonRequired || reason.trim().length > 0);
</script>

<Modal title="Cambiar estado a {statusLabels[target]}" onclose={oncancel} width="max-w-md">
	<div class="space-y-3">
		<p class="text-sm text-stone-600 dark:text-stone-400">
			<strong class="font-medium text-stone-900 dark:text-stone-100">{partnerName}</strong>
			pasará a «{statusLabels[target]}».
			{#if target === 'Terminated'}
				<strong>Esta acción es irreversible</strong>: el partner queda en solo lectura.
			{:else if target === 'Suspended'}
				Dejará de aparecer en el directorio.
			{/if}
		</p>

		{#if reasonRequired}
			<FormField label="Motivo" for={reasonId}>
				<TextInput id={reasonId} bind:value={reason} maxLength={500} />
			</FormField>
		{/if}

		<ErrorAlert message={error} />
	</div>

	{#snippet footer()}
		<button
			type="button"
			onclick={oncancel}
			disabled={submitting}
			class="cursor-pointer rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium
			       text-stone-600 transition-colors hover:bg-stone-50 disabled:cursor-not-allowed
			       disabled:opacity-50 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-700"
		>
			Cancelar
		</button>
		<button
			type="button"
			onclick={() => onconfirm(reason.trim())}
			disabled={submitting || !canConfirm}
			class="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors
			       disabled:cursor-not-allowed disabled:opacity-50
			       {destructive ? 'bg-rose-500 hover:bg-rose-600' : 'bg-teal-600 hover:bg-teal-700'}"
		>
			{submitting ? 'Guardando…' : 'Confirmar'}
		</button>
	{/snippet}
</Modal>
