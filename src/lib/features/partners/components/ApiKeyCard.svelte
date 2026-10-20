<!-- src/lib/features/partners/components/ApiKeyCard.svelte -->
<script lang="ts">
	import type { PartnerApiKey } from '$lib/api/partnerApi';
	import InfoAlert from '$lib/components/ui/InfoAlert.svelte';
	import SectionCard from './SectionCard.svelte';

	interface Props {
		hasApiKey: boolean;
		issuedKey: PartnerApiKey | null;
		busy: boolean;
		readOnly: boolean;
		onissue: () => void;
		ondismiss: () => void;
	}

	let { hasApiKey, issuedKey, busy, readOnly, onissue, ondismiss }: Props = $props();

	let confirmingRotate = $state(false);
	let copied = $state(false);

	function issue() {
		confirmingRotate = false;
		onissue();
	}

	async function copy() {
		if (!issuedKey) return;
		await navigator.clipboard.writeText(issuedKey.apiKey);
		copied = true;
	}
</script>

<SectionCard title="Clave de API (heartbeat)">
	{#if issuedKey}
		<div class="space-y-2">
			<InfoAlert message="Cópiela ahora: no se puede volver a mostrar." />
			<code
				data-testid="issued-api-key"
				class="block rounded-lg bg-stone-100 px-3 py-2 text-xs break-all text-stone-900 dark:bg-stone-800 dark:text-stone-100"
			>
				{issuedKey.apiKey}
			</code>
			<div class="flex gap-2">
				<button
					type="button"
					onclick={copy}
					class="cursor-pointer rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-700
					       hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
				>
					{copied ? 'Copiada' : 'Copiar'}
				</button>
				<button
					type="button"
					onclick={ondismiss}
					class="cursor-pointer rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-700
					       hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
				>
					Ya la guardé
				</button>
			</div>
		</div>
	{:else}
		<p class="text-sm text-stone-600 dark:text-stone-400">
			{hasApiKey
				? 'Hay una clave emitida (no se puede consultar).'
				: 'Aún no se emitió ninguna clave.'}
		</p>
		{#if !readOnly}
			{#if confirmingRotate}
				<div class="space-y-2">
					<p class="text-sm text-rose-700 dark:text-rose-300">
						La clave actual dejará de funcionar de inmediato: el partner no reportará heartbeats
						hasta que se configure la nueva.
					</p>
					<div class="flex gap-2">
						<button
							type="button"
							onclick={issue}
							disabled={busy}
							class="cursor-pointer rounded-lg bg-rose-500 px-3 py-1.5 text-sm font-medium text-white
							       hover:bg-rose-600 disabled:opacity-50"
						>
							Rotar clave
						</button>
						<button
							type="button"
							onclick={() => (confirmingRotate = false)}
							class="cursor-pointer rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-700
							       hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
						>
							Cancelar
						</button>
					</div>
				</div>
			{:else}
				<button
					type="button"
					disabled={busy}
					onclick={() => (hasApiKey ? (confirmingRotate = true) : issue())}
					class="cursor-pointer rounded-lg border border-stone-200 px-3 py-1.5 text-sm font-medium
					       text-stone-700 hover:bg-stone-50 disabled:opacity-50
					       dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
				>
					{hasApiKey ? 'Rotar clave' : 'Emitir clave'}
				</button>
			{/if}
		{/if}
	{/if}
</SectionCard>
