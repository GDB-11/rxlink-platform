<!-- src/lib/features/partners/components/PartnerTable.svelte -->
<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Partner } from '$lib/api/partnerApi';
	import { formatDateTime } from '../partnerMeta';
	import HeartbeatBadge from './HeartbeatBadge.svelte';
	import PartnerStatusBadge from './PartnerStatusBadge.svelte';

	interface Props {
		items: Partner[];
		loading: boolean;
	}

	let { items, loading }: Props = $props();

	const skeletonRows = [1, 2, 3, 4, 5];
	const colspan = 6;
	const head = 'px-4 py-3 text-left font-medium text-stone-600 dark:text-stone-400';
</script>

<div
	class="overflow-x-auto rounded-xl border border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900"
>
	<table class="w-full text-sm">
		<thead>
			<tr class="border-b border-stone-200 bg-stone-50 dark:border-stone-700 dark:bg-stone-800/60">
				<th class={head}>Partner</th>
				<th class={head}>Estado</th>
				<th class={head}>Directorio</th>
				<th class={head}>Salud</th>
				<th class={head}>Último heartbeat</th>
				<th class="{head} text-right">Acciones</th>
			</tr>
		</thead>
		<tbody class="divide-y divide-stone-100 dark:divide-stone-800">
			{#if loading}
				{#each skeletonRows as n (n)}
					<tr>
						<td class="px-4 py-3" {colspan}>
							<div class="h-4 w-full animate-pulse rounded bg-stone-200 dark:bg-stone-700"></div>
						</td>
					</tr>
				{/each}
			{:else if items.length === 0}
				<tr>
					<td {colspan} class="px-4 py-12 text-center">
						<p class="text-sm text-stone-500 dark:text-stone-400">No se encontraron partners.</p>
					</td>
				</tr>
			{:else}
				{#each items as partner (partner.code)}
					<tr class="transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/40">
						<td class="px-4 py-3">
							<p class="font-medium text-stone-900 dark:text-stone-50">
								{partner.displayName}
								{#if partner.isTest}
									<span class="ml-1 text-xs font-normal text-stone-500">(prueba)</span>
								{/if}
							</p>
							<p class="text-xs text-stone-500 dark:text-stone-400">{partner.slug}</p>
						</td>
						<td class="px-4 py-3"><PartnerStatusBadge status={partner.status} /></td>
						<td class="px-4 py-3 text-stone-600 dark:text-stone-400">
							{partner.directoryVisible ? 'Visible' : 'Oculto'}
						</td>
						<td class="px-4 py-3"><HeartbeatBadge {partner} /></td>
						<td class="px-4 py-3 text-stone-600 dark:text-stone-400">
							{formatDateTime(partner.lastHeartbeatAt)}
						</td>
						<td class="px-4 py-3 text-right">
							<a
								href={resolve(`/partners/${partner.code}`)}
								class="rounded-lg border border-stone-200 px-3 py-1 text-xs font-medium text-stone-600
								       transition-colors hover:bg-stone-50 hover:text-stone-900
								       dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-50"
							>
								Administrar
							</a>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
