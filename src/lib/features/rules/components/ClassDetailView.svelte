<!-- src/lib/features/rules/components/ClassDetailView.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import CatalogStatusBadge from '$lib/components/ui/CatalogStatusBadge.svelte';
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import ToggleActiveModal from '$lib/features/catalogs/components/ToggleActiveModal.svelte';
	import { classMeta } from '../ruleMeta';
	import { ClassDetailStore } from '../stores/classDetail.svelte';
	import ClassFormModal from './ClassFormModal.svelte';
	import ClassLinkPanel from './ClassLinkPanel.svelte';

	interface Props {
		code: string;
	}

	let { code }: Props = $props();

	// The page remounts this view (via {#key}) when the code changes.
	// svelte-ignore state_referenced_locally
	const store = new ClassDetailStore(code);

	let editing = $state(false);
	let toggling = $state(false);

	onMount(() => store.load());

	async function confirmToggle() {
		if (!store.detail) return;
		if (await store.setActive(!store.detail.isActive)) toggling = false;
	}

	const actionClass = `cursor-pointer rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium
		text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900
		disabled:cursor-not-allowed disabled:opacity-50 dark:border-stone-700 dark:text-stone-400
		dark:hover:bg-stone-800 dark:hover:text-stone-50`;
</script>

<div class="space-y-4">
	<a
		href={resolve('/catalogos/clases')}
		class="text-sm text-teal-700 hover:underline dark:text-teal-400"
	>
		← Clases de medicamentos
	</a>

	<ErrorAlert message={store.error} />

	{#if store.detail}
		{@const detail = store.detail}
		<div class="flex flex-wrap items-start justify-between gap-3">
			<div class="space-y-1">
				<div class="flex items-center gap-3">
					<h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-50">{detail.name}</h1>
					<CatalogStatusBadge isActive={detail.isActive} />
				</div>
				{#if detail.description}
					<p class="text-sm text-stone-500 dark:text-stone-400">{detail.description}</p>
				{/if}
			</div>
			<div class="flex gap-2">
				<button
					type="button"
					class={actionClass}
					disabled={store.submitting}
					onclick={() => (editing = true)}
				>
					Editar
				</button>
				<button
					type="button"
					class={actionClass}
					disabled={store.submitting}
					onclick={() => (toggling = true)}
				>
					{detail.isActive ? 'Desactivar' : 'Activar'}
				</button>
			</div>
		</div>

		<div class="grid gap-4 lg:grid-cols-2">
			<ClassLinkPanel
				title="Medicamentos"
				description="Productos que pertenecen a la clase; las reglas de interacción se aplican a todos."
				emptyText="Ningún medicamento en esta clase."
				searchPlaceholder="Buscar medicamento…"
				links={detail.members}
				candidates={store.candidates.medications}
				searching={store.searching === 'medications'}
				busy={store.submitting}
				onsearch={(v) => store.searchCandidates('medications', v)}
				onadd={(c) => store.addLink('medications', c)}
				onremove={(c) => store.removeLink('medications', c)}
			/>
			<ClassLinkPanel
				title="Alergias"
				description="Un paciente con estas alergias recibe una alerta al firmar un medicamento de la clase."
				emptyText="Ninguna alergia vinculada."
				searchPlaceholder="Buscar alergia…"
				links={detail.allergies}
				candidates={store.candidates.allergies}
				searching={store.searching === 'allergies'}
				busy={store.submitting}
				onsearch={(v) => store.searchCandidates('allergies', v)}
				onadd={(c) => store.addLink('allergies', c)}
				onremove={(c) => store.removeLink('allergies', c)}
			/>
		</div>
	{:else if store.loading}
		<div class="h-24 w-full animate-pulse rounded-xl bg-stone-200 dark:bg-stone-800"></div>
	{/if}
</div>

{#if editing && store.detail}
	<ClassFormModal
		initial={{ name: store.detail.name, description: store.detail.description ?? '' }}
		submitting={store.submitting}
		onsave={(values) => store.saveDetails(values)}
		onclose={() => (editing = false)}
	/>
{/if}

{#if toggling && store.detail}
	<ToggleActiveModal
		meta={classMeta}
		entry={{ ...store.detail }}
		submitting={store.submitting}
		onconfirm={confirmToggle}
		oncancel={() => (toggling = false)}
	/>
{/if}
