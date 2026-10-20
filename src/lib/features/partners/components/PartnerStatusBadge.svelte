<!-- src/lib/features/partners/components/PartnerStatusBadge.svelte -->
<script lang="ts">
	import type { PartnerStatus } from '$lib/api/partnerApi';
	import { statusLabels } from '../partnerMeta';

	interface Props {
		status: PartnerStatus;
	}

	let { status }: Props = $props();

	const styles: Record<PartnerStatus, string> = {
		Provisioning: 'bg-amber-100 text-amber-900 dark:bg-amber-900 dark:text-amber-200',
		Active: 'bg-teal-100 text-teal-900 dark:bg-teal-900 dark:text-teal-300',
		Suspended: 'bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300',
		Terminated: 'bg-rose-100 text-rose-900 dark:bg-rose-900 dark:text-rose-300'
	};
</script>

<span
	class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium {styles[status]}"
>
	{statusLabels[status]}
</span>
