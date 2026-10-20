<!-- src/lib/features/rules/components/ClassFormModal.svelte -->
<script lang="ts">
	import { untrack } from 'svelte';
	import type { ClassValues } from '$lib/api/ruleApi';
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import EntryFormActions from '$lib/features/catalogs/components/EntryFormActions.svelte';
	import type { SaveResult } from '../stores/ruleList.svelte';

	interface Props {
		/** `null` creates a new class. */
		initial: ClassValues | null;
		submitting: boolean;
		onsave: (values: ClassValues) => Promise<SaveResult>;
		onclose: () => void;
	}

	let { initial, submitting, onsave, onclose }: Props = $props();

	let name = $state(untrack(() => initial?.name ?? ''));
	let description = $state(untrack(() => initial?.description ?? ''));
	let fieldErrors = $state<Record<string, string>>({});
	let message = $state<string | null>(null);

	const formId = $props.id();

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		fieldErrors = {};
		message = null;
		const result = await onsave({ name: name.trim(), description: description.trim() });
		if (result.ok) onclose();
		else {
			fieldErrors = result.fieldErrors ?? {};
			message = result.message ?? null;
		}
	}
</script>

<Modal title={initial ? 'Editar clase de medicamentos' : 'Nueva clase de medicamentos'} {onclose}>
	<form onsubmit={handleSubmit} class="space-y-4" novalidate>
		<ErrorAlert {message} />

		<FormField label="Nombre" for="{formId}-name" error={fieldErrors.name}>
			<TextInput id="{formId}-name" bind:value={name} maxLength={150} />
		</FormField>

		<FormField
			label="Descripción (opcional)"
			for="{formId}-description"
			error={fieldErrors.description}
		>
			<TextArea id="{formId}-description" bind:value={description} maxLength={1000} />
		</FormField>

		<EntryFormActions {submitting} submitLabel={initial ? 'Guardar' : 'Crear'} oncancel={onclose} />
	</form>
</Modal>
