<!-- src/lib/features/catalogs/components/MedicationEntryForm.svelte -->
<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { catalogApi, type CatalogEntry, type EntryValues } from '$lib/api/catalogApi';
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import InfoAlert from '$lib/components/ui/InfoAlert.svelte';
	import SelectInput from '$lib/components/ui/SelectInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import type { CatalogMeta } from '../catalogMeta';
	import EntryFormActions from './EntryFormActions.svelte';

	interface Props {
		meta: CatalogMeta;
		entry: CatalogEntry | null;
		submitting: boolean;
		fieldErrors: Record<string, string>;
		message: string | null;
		onsubmit: (values: EntryValues) => void;
		oncancel: () => void;
	}

	let { meta, entry, submitting, fieldErrors, message, onsubmit, oncancel }: Props = $props();

	interface Option {
		value: string;
		label: string;
	}

	let genericName = $state(untrack(() => String(entry?.genericName ?? '')));
	let commercialName = $state(untrack(() => String(entry?.commercialName ?? '')));
	let concentration = $state(untrack(() => String(entry?.concentration ?? '')));
	let formCode = $state(untrack(() => String(entry?.pharmaceuticalFormCode ?? '')));
	let routeCode = $state(untrack(() => String(entry?.administrationRouteCode ?? '')));

	let forms = $state<Option[]>([]);
	let routes = $state<Option[]>([]);
	let loadError = $state<string | null>(null);

	const formId = $props.id();
	/** Concentration, form and route never change after creation (plan §5.2). */
	const locked = $derived(entry !== null);

	async function activeOptions(slug: string, current: string | null): Promise<Option[]> {
		const page = await catalogApi.list(slug, { includeInactive: false, pageSize: 200 });
		const options = page.items.map((i) => ({ value: i.code, label: String(i.name) }));
		// An inactive form/route can still be the current one of an existing medication.
		if (current && !options.some((o) => o.value === current)) {
			const all = await catalogApi.list(slug, { includeInactive: true, pageSize: 200 });
			const match = all.items.find((i) => i.code === current);
			if (match) options.push({ value: match.code, label: `${match.name} (inactivo)` });
		}
		return options;
	}

	onMount(async () => {
		try {
			[forms, routes] = await Promise.all([
				activeOptions('pharmaceutical-forms', formCode || null),
				activeOptions('administration-routes', routeCode || null)
			]);
		} catch {
			loadError = 'No se pudieron cargar las formas y vías.';
		}
	});

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		onsubmit({
			genericName: genericName.trim(),
			commercialName: commercialName.trim(),
			// Locked fields go back exactly as stored, whatever the (disabled) controls show.
			concentration: entry ? String(entry.concentration) : concentration.trim(),
			pharmaceuticalFormCode: entry ? String(entry.pharmaceuticalFormCode) : formCode,
			administrationRouteCode: entry ? String(entry.administrationRouteCode) : routeCode
		});
	}
</script>

<form onsubmit={handleSubmit} class="space-y-4" novalidate>
	<ErrorAlert message={message ?? loadError} />
	{#if locked}
		<InfoAlert
			message="La concentración, la forma y la vía no se pueden modificar. Si hay un error, cree un nuevo medicamento y desactive este."
		/>
	{/if}

	<FormField
		label={meta.fieldLabels.genericName}
		for="{formId}-generic"
		error={fieldErrors.genericName}
	>
		<TextInput id="{formId}-generic" bind:value={genericName} maxLength={200} />
	</FormField>
	<FormField
		label="{meta.fieldLabels.commercialName} (opcional)"
		for="{formId}-commercial"
		error={fieldErrors.commercialName}
	>
		<TextInput id="{formId}-commercial" bind:value={commercialName} maxLength={200} />
	</FormField>
	<FormField
		label={meta.fieldLabels.concentration}
		for="{formId}-concentration"
		error={fieldErrors.concentration}
	>
		<TextInput
			id="{formId}-concentration"
			bind:value={concentration}
			maxLength={50}
			disabled={locked}
		/>
	</FormField>
	<FormField
		label={meta.fieldLabels.pharmaceuticalFormCode}
		for="{formId}-form"
		error={fieldErrors.pharmaceuticalFormCode}
	>
		<SelectInput id="{formId}-form" bind:value={formCode} options={forms} disabled={locked} />
	</FormField>
	<FormField
		label={meta.fieldLabels.administrationRouteCode}
		for="{formId}-route"
		error={fieldErrors.administrationRouteCode}
	>
		<SelectInput id="{formId}-route" bind:value={routeCode} options={routes} disabled={locked} />
	</FormField>

	<EntryFormActions {submitting} submitLabel={entry ? 'Guardar' : 'Crear'} {oncancel} />
</form>
