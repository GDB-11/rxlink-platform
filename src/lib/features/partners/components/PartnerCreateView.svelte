<!-- src/lib/features/partners/components/PartnerCreateView.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { ApiError } from '$lib/api/api';
	import { partnerApi, type PartnerValues } from '$lib/api/partnerApi';
	import { emptyValues } from '../partnerMeta';
	import PartnerForm from './PartnerForm.svelte';

	let submitting = $state(false);
	let fieldErrors = $state<Record<string, string>>({});
	let message = $state<string | null>(null);

	async function handleSubmit(values: PartnerValues) {
		submitting = true;
		fieldErrors = {};
		message = null;
		try {
			const partner = await partnerApi.create(values);
			await goto(resolve(`/partners/${partner.code}`));
		} catch (err) {
			if (err instanceof ApiError && err.fieldErrors) {
				fieldErrors = err.fieldErrors;
			} else if (err instanceof ApiError && (err.body as { field?: string })?.field) {
				// Duplicate slug / name / RUC / URL / role: pin the message to its field.
				fieldErrors = { [(err.body as { field: string }).field]: err.message };
			} else {
				message = err instanceof Error ? err.message : 'No se pudo crear el partner.';
			}
		} finally {
			submitting = false;
		}
	}
</script>

<div class="space-y-4">
	<div>
		<a href={resolve('/partners')} class="text-sm text-teal-700 hover:underline dark:text-teal-400">
			← Partners
		</a>
		<h1 class="mt-1 text-2xl font-semibold text-stone-900 dark:text-stone-50">Nuevo partner</h1>
		<p class="text-sm text-stone-500 dark:text-stone-400">
			Se crea en aprovisionamiento y oculto del directorio. El logo, la clave de API y el estado se
			gestionan después, en la ficha del partner.
		</p>
	</div>

	<div
		class="rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-700 dark:bg-stone-900"
	>
		<PartnerForm
			initial={emptyValues()}
			{submitting}
			{fieldErrors}
			{message}
			submitLabel="Crear partner"
			onsubmit={handleSubmit}
		/>
	</div>
</div>
