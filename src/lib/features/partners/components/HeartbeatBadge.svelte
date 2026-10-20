<!-- src/lib/features/partners/components/HeartbeatBadge.svelte -->
<script lang="ts">
	import type { Partner } from '$lib/api/partnerApi';

	interface Props {
		partner: Pick<Partner, 'lastHeartbeatAt' | 'heartbeatStale' | 'status'>;
	}

	let { partner }: Props = $props();

	const state = $derived(
		partner.lastHeartbeatAt === null
			? {
					label: 'Sin heartbeat',
					style: 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-400'
				}
			: partner.heartbeatStale
				? {
						label: 'Sin señal',
						style: 'bg-rose-100 text-rose-900 dark:bg-rose-900 dark:text-rose-300'
					}
				: {
						label: 'Al día',
						style: 'bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-300'
					}
	);
</script>

<span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {state.style}">
	{state.label}
</span>
