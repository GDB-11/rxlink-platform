<!-- src/lib/features/partners/components/PartnerForm.svelte -->
<script lang="ts">
	import { untrack } from 'svelte';
	import type { PartnerValues } from '$lib/api/partnerApi';
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import FormField from '$lib/components/ui/FormField.svelte';
	import SubmitButton from '$lib/components/ui/SubmitButton.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import { fieldLabels } from '../partnerMeta';

	interface Props {
		initial: PartnerValues;
		submitting: boolean;
		fieldErrors: Record<string, string>;
		message: string | null;
		submitLabel: string;
		/** The slug is frozen once a partner has been activated. */
		slugLocked?: boolean;
		/** Terminated partners are read-only. */
		readOnly?: boolean;
		onsubmit: (values: PartnerValues) => void;
	}

	let {
		initial,
		submitting,
		fieldErrors,
		message,
		submitLabel,
		slugLocked = false,
		readOnly = false,
		onsubmit
	}: Props = $props();

	// Initialised once; the parent remounts the form (via {#key}) when the partner changes.
	let values = $state<PartnerValues>(untrack(() => ({ ...initial })));

	const formId = $props.id();

	type TextKey = Exclude<keyof PartnerValues, 'isTest'>;

	interface Section {
		title: string;
		keys: TextKey[];
	}

	const sections: Section[] = [
		{ title: 'Identidad', keys: ['slug', 'displayName', 'legalName', 'taxId'] },
		{ title: 'Regionalización', keys: ['country', 'timezone', 'currency', 'locale'] },
		{
			title: 'Integración',
			keys: ['apiBaseUrl', 'catalogRoleName']
		},
		{ title: 'Marca', keys: ['brandPrimaryColor', 'brandAccentColor'] },
		{ title: 'Contacto', keys: ['contactName', 'contactEmail', 'contactPhone'] }
	];

	const hints: Partial<Record<TextKey, string>> = {
		slug: 'Minúsculas, números y guiones (3–40).',
		taxId: '11 dígitos.',
		apiBaseUrl: 'https://… (la URL pública de la API del partner).',
		catalogRoleName: 'catalog_reader_<partner>',
		brandPrimaryColor: '#RRGGBB',
		brandAccentColor: '#RRGGBB'
	};

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		onsubmit({ ...values });
	}
</script>

<form onsubmit={handleSubmit} class="space-y-6" novalidate>
	<ErrorAlert {message} />

	{#each sections as section (section.title)}
		<fieldset class="space-y-3" disabled={readOnly}>
			<legend class="text-sm font-semibold text-stone-900 dark:text-stone-50">
				{section.title}
			</legend>
			<div class="grid gap-4 sm:grid-cols-2">
				{#each section.keys as key (key)}
					{@const id = `${formId}-${key}`}
					<FormField label={fieldLabels[key]} for={id} error={fieldErrors[key]} hint={hints[key]}>
						<TextInput
							{id}
							bind:value={values[key]}
							type={key === 'contactEmail' ? 'email' : 'text'}
							disabled={readOnly || (key === 'slug' && slugLocked)}
						/>
					</FormField>
				{/each}
			</div>
		</fieldset>
	{/each}

	<label class="flex items-center gap-2 text-sm text-stone-600 dark:text-stone-400">
		<input
			type="checkbox"
			bind:checked={values.isTest}
			disabled={readOnly}
			class="rounded border-stone-300 text-teal-600 focus:ring-teal-500"
		/>
		{fieldLabels.isTest}
	</label>

	{#if !readOnly}
		<div class="flex justify-end">
			<div class="w-40">
				<SubmitButton isLoading={submitting} label={submitLabel} loadingLabel="Guardando…" />
			</div>
		</div>
	{/if}
</form>
