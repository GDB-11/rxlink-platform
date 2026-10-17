<!-- src/lib/features/mfa/components/MfaQrCode.svelte -->
<script lang="ts">
	import QRCode from 'qrcode';

	interface Props {
		/** The otpauth:// URI to encode. */
		value: string;
	}

	let { value }: Props = $props();

	// Generated in the browser; the secret never leaves the page.
	const qr = $derived(QRCode.toDataURL(value, { margin: 1, width: 192 }));
</script>

{#await qr}
	<div class="h-48 w-48 animate-pulse rounded-lg bg-stone-200 dark:bg-stone-700"></div>
{:then dataUrl}
	<img
		src={dataUrl}
		alt="Código QR para la aplicación de autenticación"
		width="192"
		height="192"
		class="rounded-lg border border-stone-200 bg-white p-1 dark:border-stone-700"
	/>
{:catch}
	<p class="text-sm text-rose-600 dark:text-rose-400">
		No se pudo generar el código QR. Use la clave manual.
	</p>
{/await}
