<!-- src/lib/features/catalogs/components/CatalogHistoryView.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import Pagination from '$lib/components/ui/Pagination.svelte';
	import type { CatalogMeta } from '../catalogMeta';
	import { CatalogAuditStore } from '../stores/catalogAudit.svelte';
	import AuditTable from './AuditTable.svelte';

	interface Props {
		meta: CatalogMeta;
	}

	let { meta }: Props = $props();

	// The page remounts this view (via {#key}) when the catalog changes.
	// svelte-ignore state_referenced_locally
	const store = new CatalogAuditStore(meta.slug);

	onMount(() => store.load());
</script>

<div class="space-y-4">
	<div>
		<h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-50">
			Historial — {meta.label}
		</h1>
		<a
			href={resolve(`/catalogos/${meta.slug}`)}
			class="text-sm text-teal-700 hover:underline dark:text-teal-400"
		>
			Volver al catálogo
		</a>
	</div>

	<ErrorAlert message={store.error} />

	<AuditTable items={store.items} loading={store.loading} />

	<Pagination
		page={store.page}
		pageSize={store.pageSize}
		total={store.total}
		totalPages={store.totalPages}
		loading={store.loading}
		onPageChange={(p) => store.goToPage(p)}
	/>
</div>
