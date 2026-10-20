<!-- src/lib/features/partners/components/PartnerDetailView.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import type { PartnerStatus, PartnerValues } from '$lib/api/partnerApi';
	import ErrorAlert from '$lib/components/ui/ErrorAlert.svelte';
	import { valuesOf } from '../partnerMeta';
	import { PartnerDetailStore } from '../stores/partnerDetail.svelte';
	import ApiKeyCard from './ApiKeyCard.svelte';
	import DirectoryVisibilityCard from './DirectoryVisibilityCard.svelte';
	import PartnerForm from './PartnerForm.svelte';
	import PartnerHealthCard from './PartnerHealthCard.svelte';
	import PartnerLogoCard from './PartnerLogoCard.svelte';
	import PartnerStatusBadge from './PartnerStatusBadge.svelte';
	import PartnerStatusCard from './PartnerStatusCard.svelte';
	import ProvisioningChecklist from './ProvisioningChecklist.svelte';
	import SectionCard from './SectionCard.svelte';
	import StatusChangeModal from './StatusChangeModal.svelte';

	interface Props {
		code: string;
	}

	let { code }: Props = $props();

	// The page remounts this view (via {#key}) when the code changes.
	// svelte-ignore state_referenced_locally
	const store = new PartnerDetailStore(code);

	let changingTo = $state<PartnerStatus | null>(null);
	let statusError = $state<string | null>(null);
	let fieldErrors = $state<Record<string, string>>({});
	let formMessage = $state<string | null>(null);
	let saved = $state(false);
	/** Bumped after each save so the form remounts with the stored values. */
	let formVersion = $state(0);

	onMount(() => {
		store.load();
	});

	const partner = $derived(store.partner);
	const readOnly = $derived(partner?.status === 'Terminated');

	async function handleSave(values: PartnerValues) {
		fieldErrors = {};
		formMessage = null;
		saved = false;
		const result = await store.save(values);
		if (result.ok) {
			saved = true;
			formVersion += 1;
		} else {
			fieldErrors = result.fieldErrors ?? {};
			formMessage = result.message ?? null;
		}
	}

	async function confirmStatus(reason: string) {
		if (!changingTo) return;
		statusError = await store.changeStatus(changingTo, reason || undefined);
		if (!statusError) changingTo = null;
	}

	function openStatus(status: PartnerStatus) {
		statusError = null;
		changingTo = status;
	}
</script>

<div class="space-y-4">
	<div>
		<a href={resolve('/partners')} class="text-sm text-teal-700 hover:underline dark:text-teal-400">
			← Partners
		</a>
		{#if partner}
			<div class="mt-1 flex flex-wrap items-center gap-3">
				<h1 class="text-2xl font-semibold text-stone-900 dark:text-stone-50">
					{partner.displayName}
				</h1>
				<PartnerStatusBadge status={partner.status} />
			</div>
			<p class="text-sm text-stone-500 dark:text-stone-400">{partner.slug}</p>
		{/if}
	</div>

	<ErrorAlert message={store.error} />

	{#if store.loading && !partner}
		<p class="text-sm text-stone-500 dark:text-stone-400">Cargando…</p>
	{:else if partner}
		<div class="grid gap-4 lg:grid-cols-[1fr_22rem]">
			<div class="space-y-4">
				<SectionCard title="Datos del partner">
					{#if saved}
						<p class="text-sm text-teal-700 dark:text-teal-400" role="status">Cambios guardados.</p>
					{/if}
					{#key formVersion}
						<PartnerForm
							initial={valuesOf(partner)}
							submitting={store.submitting}
							{fieldErrors}
							message={formMessage}
							submitLabel="Guardar cambios"
							slugLocked={partner.activatedAt !== null}
							{readOnly}
							onsubmit={handleSave}
						/>
					{/key}
				</SectionCard>
			</div>

			<div class="space-y-4">
				<PartnerStatusCard {partner} busy={store.submitting} onchange={openStatus} />
				<ProvisioningChecklist {partner} />
				<DirectoryVisibilityCard
					{partner}
					busy={store.submitting}
					onchange={(v) => store.setDirectoryVisible(v)}
				/>
				<PartnerLogoCard
					code={partner.code}
					hasLogo={partner.hasLogo}
					version={store.logoVersion}
					busy={store.submitting}
					{readOnly}
					onupload={(file) => store.uploadLogo(file)}
				/>
				<ApiKeyCard
					hasApiKey={partner.hasApiKey}
					issuedKey={store.issuedKey}
					busy={store.submitting}
					{readOnly}
					onissue={() => store.issueApiKey()}
					ondismiss={() => store.dismissKey()}
				/>
				<PartnerHealthCard {partner} />
			</div>
		</div>
	{/if}
</div>

{#if changingTo && partner}
	<StatusChangeModal
		target={changingTo}
		partnerName={partner.displayName}
		submitting={store.submitting}
		error={statusError}
		onconfirm={confirmStatus}
		oncancel={() => (changingTo = null)}
	/>
{/if}
