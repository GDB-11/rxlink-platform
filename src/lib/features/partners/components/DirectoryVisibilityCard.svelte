<!-- src/lib/features/partners/components/DirectoryVisibilityCard.svelte -->
<script lang="ts">
	import type { Partner } from '$lib/api/partnerApi';
	import SectionCard from './SectionCard.svelte';

	interface Props {
		partner: Partner;
		busy: boolean;
		onchange: (visible: boolean) => void;
	}

	let { partner, busy, onchange }: Props = $props();

	const eligible = $derived(partner.status === 'Active' && !partner.isTest);
</script>

<SectionCard title="Directorio de la app móvil">
	<label class="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
		<input
			type="checkbox"
			checked={partner.directoryVisible}
			disabled={busy || !eligible}
			onchange={(e) => onchange(e.currentTarget.checked)}
			class="rounded border-stone-300 text-teal-600 focus:ring-teal-500"
		/>
		Listar en el directorio público
	</label>
	{#if !eligible}
		<p class="text-xs text-stone-500 dark:text-stone-400">
			Solo los partners activos y que no son de prueba pueden listarse. Un partner oculto sigue
			accesible por enlace o QR.
		</p>
	{/if}
</SectionCard>
