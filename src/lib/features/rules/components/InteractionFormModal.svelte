<!-- src/lib/features/rules/components/InteractionFormModal.svelte -->
<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { ruleApi, type InteractionItem, type InteractionValues } from '$lib/api/ruleApi';
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import SelectInput from '$lib/components/ui/SelectInput.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';
	import EntryFormActions from '$lib/features/catalogs/components/EntryFormActions.svelte';
	import { severityOptions } from '../ruleMeta';
	import type { SaveResult } from '../stores/ruleList.svelte';

	interface Props {
		/** `null` creates a new rule; editing keeps the class pair fixed. */
		interaction: InteractionItem | null;
		submitting: boolean;
		onsave: (values: InteractionValues) => Promise<SaveResult>;
		onclose: () => void;
	}

	let { interaction, submitting, onsave, onclose }: Props = $props();

	interface Option {
		value: string;
		label: string;
	}

	let classA = $state(untrack(() => interaction?.classACode ?? ''));
	let classB = $state(untrack(() => interaction?.classBCode ?? ''));
	let severity = $state(untrack(() => interaction?.severity ?? ''));
	let description = $state(untrack(() => interaction?.description ?? ''));
	let classes = $state<Option[]>([]);
	let loadError = $state<string | null>(null);
	let fieldErrors = $state<Record<string, string>>({});
	let message = $state<string | null>(null);

	const formId = $props.id();
	const editing = $derived(interaction !== null);
	// Editing: each side shows its stored class (it may be inactive and absent from the active list). Separate
	// lists, because a same-class rule (AINE ↔ AINE) would otherwise repeat an option key.
	const optionsA = $derived(
		interaction ? [{ value: interaction.classACode, label: interaction.classAName }] : classes
	);
	const optionsB = $derived(
		interaction ? [{ value: interaction.classBCode, label: interaction.classBName }] : classes
	);

	onMount(async () => {
		if (editing) return;
		try {
			const page = await ruleApi.listClasses({ includeInactive: false, pageSize: 200 });
			classes = page.items.map((c) => ({ value: c.code, label: c.name }));
		} catch {
			loadError = 'No se pudieron cargar las clases.';
		}
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		fieldErrors = {};
		message = null;
		const result = await onsave({
			classACode: classA,
			classBCode: classB,
			severity,
			description: description.trim()
		});
		if (result.ok) onclose();
		else {
			fieldErrors = result.fieldErrors ?? {};
			message = result.message ?? null;
		}
	}
</script>

<Modal title={editing ? 'Editar regla de interacción' : 'Nueva regla de interacción'} {onclose}>
	<form onsubmit={handleSubmit} class="space-y-4" novalidate>
		<ErrorAlert message={message ?? loadError} />

		<FormField label="Clase A" for="{formId}-a" error={fieldErrors.classACode}>
			<SelectInput id="{formId}-a" bind:value={classA} options={optionsA} disabled={editing} />
		</FormField>

		<FormField
			label="Clase B"
			for="{formId}-b"
			error={fieldErrors.classBCode}
			hint="Puede ser la misma clase (p. ej. dos AINE entre sí)."
		>
			<SelectInput id="{formId}-b" bind:value={classB} options={optionsB} disabled={editing} />
		</FormField>

		<FormField label="Severidad" for="{formId}-severity" error={fieldErrors.severity}>
			<SelectInput id="{formId}-severity" bind:value={severity} options={severityOptions} />
		</FormField>

		<FormField label="Descripción" for="{formId}-description" error={fieldErrors.description}>
			<TextArea id="{formId}-description" bind:value={description} maxLength={1000} />
		</FormField>

		<EntryFormActions {submitting} submitLabel={editing ? 'Guardar' : 'Crear'} oncancel={onclose} />
	</form>
</Modal>
