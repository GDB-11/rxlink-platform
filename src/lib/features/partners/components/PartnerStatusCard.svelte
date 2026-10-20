<!-- src/lib/features/partners/components/PartnerStatusCard.svelte -->
<script lang="ts">
	import type { Partner, PartnerStatus } from '$lib/api/partnerApi';
	import { formatDateTime, nextStatuses, statusLabels } from '../partnerMeta';
	import PartnerStatusBadge from './PartnerStatusBadge.svelte';
	import SectionCard from './SectionCard.svelte';

	interface Props {
		partner: Partner;
		busy: boolean;
		onchange: (status: PartnerStatus) => void;
	}

	let { partner, busy, onchange }: Props = $props();

	const targets = $derived(nextStatuses(partner.status));

	function actionLabel(target: PartnerStatus): string {
		switch (target) {
			case 'Active':
				return partner.status === 'Suspended' ? 'Reactivar' : 'Activar';
			case 'Suspended':
				return 'Suspender';
			case 'Terminated':
				return 'Terminar';
			default:
				return statusLabels[target];
		}
	}
</script>

<SectionCard title="Estado">
	<div class="flex flex-wrap items-center gap-3">
		<PartnerStatusBadge status={partner.status} />
		<span class="text-xs text-stone-500 dark:text-stone-400">
			desde {formatDateTime(partner.statusChangedAt)}
		</span>
	</div>
	{#if partner.statusReason}
		<p class="text-sm text-stone-600 dark:text-stone-400">Motivo: {partner.statusReason}</p>
	{/if}

	{#if targets.length === 0}
		<p class="text-sm text-stone-500 dark:text-stone-400">
			{statusLabels[partner.status]}: no admite más cambios.
		</p>
	{:else}
		<div class="flex flex-wrap gap-2">
			{#each targets as target (target)}
				<button
					type="button"
					disabled={busy}
					onclick={() => onchange(target)}
					data-status-action={target}
					class="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium transition-colors
					       disabled:cursor-not-allowed disabled:opacity-50
					       {target === 'Terminated'
						? 'border border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/30'
						: 'border border-stone-200 text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800'}"
				>
					{actionLabel(target)}
				</button>
			{/each}
		</div>
	{/if}
</SectionCard>
