<!-- src/lib/components/ui/BrandLogo.svelte -->
<script lang="ts">
	type Variant = 'light' | 'color';
	type Size = 'xs' | 'sm' | 'md' | 'lg';

	interface Props {
		variant?: Variant;
		size?: Size;
		/** Partner display name; when set (and no logo) it replaces the default "RxLink" wordmark. */
		name?: string | null;
		/** Partner logo image; takes precedence over the text. */
		logoSrc?: string | null;
	}

	let { variant = 'light', size = 'md', name = null, logoSrc = null }: Props = $props();

	const sizeClass: Record<Size, string> = {
		xs: 'text-2xl',
		sm: 'text-3xl',
		md: 'text-4xl',
		lg: 'text-5xl'
	};

	const imageClass: Record<Size, string> = {
		xs: 'h-7',
		sm: 'h-8',
		md: 'h-10',
		lg: 'h-14'
	};

	const rxColor: Record<Variant, string> = {
		light: 'text-teal-300',
		color: 'text-teal-600 dark:text-teal-400'
	};

	const linkColor: Record<Variant, string> = {
		light: 'text-white',
		color: 'text-stone-900 dark:text-stone-50'
	};
</script>

{#if logoSrc}
	<img
		src={logoSrc}
		alt={name ?? 'Logo'}
		class="w-auto max-w-full object-contain {imageClass[size]}"
	/>
{:else if name}
	<span
		style="font-family: 'Instrument Serif', serif;"
		class="leading-none tracking-tight {sizeClass[size]} {linkColor[variant]}"
	>
		{name}
	</span>
{:else}
	<div class="flex items-baseline gap-1">
		<span
			style="font-family: 'Instrument Serif', serif;"
			class="leading-none tracking-tight italic {sizeClass[size]} {rxColor[variant]}"
		>
			Rx
		</span>
		<span
			style="font-family: 'Instrument Serif', serif;"
			class="leading-none tracking-tight {sizeClass[size]} {linkColor[variant]}"
		>
			Link
		</span>
	</div>
{/if}
