<!-- src/lib/features/partners/components/PartnerHealthCard.svelte -->
<script lang="ts">
	import type { Partner } from '$lib/api/partnerApi';
	import { formatDateTime, formatSchemaRange } from '../partnerMeta';
	import HeartbeatBadge from './HeartbeatBadge.svelte';
	import SectionCard from './SectionCard.svelte';

	interface Props {
		partner: Partner;
	}

	let { partner }: Props = $props();

	const rows = $derived([
		['Versión de la API', partner.apiVersion ?? '—'],
		['Versión del esquema de BD', partner.dbSchemaVersion ?? '—'],
		['Esquemas de catálogo soportados', formatSchemaRange(partner.supportedCatalogSchemas)],
		['Esquema de catálogo visto', partner.catalogSchemaVersionSeen?.toString() ?? '—'],
		['Versión de catálogo vista', partner.catalogVersionSeen?.toString() ?? '—'],
		['Último heartbeat', formatDateTime(partner.lastHeartbeatAt)]
	]);
</script>

<SectionCard title="Salud">
	<div class="flex items-center gap-2">
		<HeartbeatBadge {partner} />
		{#if partner.heartbeatStale}
			<span class="text-xs text-rose-700 dark:text-rose-300">
				El partner activo dejó de reportar: revise su despliegue.
			</span>
		{/if}
	</div>
	<dl class="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
		{#each rows as [label, value] (label)}
			<div>
				<dt class="text-xs text-stone-500 dark:text-stone-400">{label}</dt>
				<dd class="text-stone-900 dark:text-stone-100">{value}</dd>
			</div>
		{/each}
	</dl>
</SectionCard>
