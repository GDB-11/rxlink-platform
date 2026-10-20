<!-- src/lib/features/catalogs/components/SimpleEntryForm.svelte -->
<script lang="ts">
	import { untrack } from 'svelte';
	import type { CatalogEntry, CatalogFieldInfo, EntryValues } from '$lib/api/catalogApi';
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import type { CatalogMeta } from '../catalogMeta';
	import EntryFormActions from './EntryFormActions.svelte';

	interface Props {
		meta: CatalogMeta;
		fields: CatalogFieldInfo[];
		entry: CatalogEntry | null;
		submitting: boolean;
		fieldErrors: Record<string, string>;
		message: string | null;
		onsubmit: (values: EntryValues) => void;
		oncancel: () => void;
	}

	let { meta, fields, entry, submitting, fieldErrors, message, onsubmit, oncancel }: Props =
		$props();

	// Initialised once; the parent remounts the form (via {#key}) when the entry changes.
	let raw = $state<Record<string, string>>(
		untrack(() => Object.fromEntries(fields.map((f) => [f.name, String(entry?.[f.name] ?? '')])))
	);

	const formId = $props.id();

	function toValues(): EntryValues {
		const values: EntryValues = {};
		for (const field of fields) {
			const text = String(raw[field.name] ?? '').trim();
			if (field.type === 'text') values[field.name] = text;
			else values[field.name] = text === '' ? null : Number(text);
		}
		return values;
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		onsubmit(toValues());
	}
</script>

<form onsubmit={handleSubmit} class="space-y-4" novalidate>
	<ErrorAlert {message} />

	{#each fields as field (field.name)}
		{@const id = `${formId}-${field.name}`}
		<FormField
			label={`${meta.fieldLabels[field.name] ?? field.name}${field.required ? '' : ' (opcional)'}`}
			for={id}
			error={fieldErrors[field.name]}
		>
			{#if field.type === 'text'}
				<TextInput {id} bind:value={raw[field.name]} maxLength={field.maxLength ?? undefined} />
			{:else}
				<NumberInput
					{id}
					bind:value={raw[field.name]}
					min={field.min}
					max={field.max}
					step={field.type === 'decimal' ? 'any' : 1}
				/>
			{/if}
		</FormField>
	{/each}

	<EntryFormActions {submitting} submitLabel={entry ? 'Guardar' : 'Crear'} {oncancel} />
</form>
