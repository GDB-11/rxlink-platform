<!-- src/lib/features/partners/components/PartnerLogoCard.svelte -->
<script lang="ts">
	import { partnerApi } from '$lib/api/partnerApi';
	import SectionCard from './SectionCard.svelte';

	interface Props {
		code: string;
		hasLogo: boolean;
		/** Changes whenever the stored logo does, to refetch the preview. */
		version: number;
		busy: boolean;
		readOnly: boolean;
		onupload: (file: File) => void;
	}

	let { code, hasLogo, version, busy, readOnly, onupload }: Props = $props();

	let previewUrl = $state<string | null>(null);
	const inputId = $props.id();

	$effect(() => {
		// Re-run when the logo (or its presence) changes.
		void version;
		if (!hasLogo) {
			previewUrl = null;
			return;
		}
		let url: string | null = null;
		let cancelled = false;
		partnerApi
			.logo(code)
			.then((blob) => {
				if (cancelled) return;
				url = URL.createObjectURL(blob);
				previewUrl = url;
			})
			.catch(() => {
				if (!cancelled) previewUrl = null;
			});
		return () => {
			cancelled = true;
			if (url) URL.revokeObjectURL(url);
		};
	});

	function handleChange(e: Event & { currentTarget: HTMLInputElement }) {
		const file = e.currentTarget.files?.[0];
		if (file) onupload(file);
		e.currentTarget.value = '';
	}
</script>

<SectionCard title="Logo">
	<div
		class="flex h-24 w-24 items-center justify-center overflow-hidden rounded-lg border border-stone-200
		       bg-stone-50 dark:border-stone-700 dark:bg-stone-800"
	>
		{#if previewUrl}
			<img src={previewUrl} alt="Logo del partner" class="max-h-full max-w-full object-contain" />
		{:else}
			<span class="text-xs text-stone-400">Sin logo</span>
		{/if}
	</div>

	{#if !readOnly}
		<div>
			<label
				for={inputId}
				class="inline-block cursor-pointer rounded-lg border border-stone-200 px-3 py-1.5 text-sm
				       font-medium text-stone-700 transition-colors hover:bg-stone-50
				       dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800
				       {busy ? 'pointer-events-none opacity-50' : ''}"
			>
				{hasLogo ? 'Reemplazar logo' : 'Subir logo'}
			</label>
			<input
				id={inputId}
				type="file"
				accept="image/png,image/webp"
				class="sr-only"
				disabled={busy}
				onchange={handleChange}
			/>
			<p class="mt-1 text-xs text-stone-500 dark:text-stone-400">
				PNG o WebP, máx. 256 KB y 1024×1024 px. Se vuelve a codificar como PNG.
			</p>
		</div>
	{/if}
</SectionCard>
