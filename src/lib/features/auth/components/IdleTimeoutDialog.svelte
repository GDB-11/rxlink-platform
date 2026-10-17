<!-- src/lib/features/auth/components/IdleTimeoutDialog.svelte -->
<script lang="ts">
	interface Props {
		secondsLeft: number;
		oncontinue: () => void;
		onlogout: () => void;
	}

	let { secondsLeft, oncontinue, onlogout }: Props = $props();
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 p-4 backdrop-blur-sm"
	aria-modal="true"
	role="alertdialog"
	aria-labelledby="idle-timeout-title"
	aria-describedby="idle-timeout-desc"
>
	<div class="w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-xl dark:bg-stone-800">
		<div class="px-6 py-5">
			<h2 id="idle-timeout-title" class="text-base font-semibold text-stone-900 dark:text-stone-50">
				¿Sigue ahí?
			</h2>
			<p id="idle-timeout-desc" class="mt-2 text-sm text-stone-600 dark:text-stone-400">
				Por seguridad, su sesión se cerrará por inactividad en
				<strong class="font-medium text-stone-900 tabular-nums dark:text-stone-100"
					>{secondsLeft}</strong
				>
				segundos.
			</p>
		</div>

		<div class="flex justify-end gap-3 border-t border-stone-200 px-6 py-4 dark:border-stone-700">
			<button
				type="button"
				onclick={onlogout}
				class="cursor-pointer rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium
                       text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900
                       dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-700 dark:hover:text-stone-50"
			>
				Cerrar sesión
			</button>
			<button
				type="button"
				onclick={oncontinue}
				class="cursor-pointer rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white
                       transition-colors hover:bg-teal-700 dark:bg-teal-600 dark:hover:bg-teal-700"
			>
				Continuar sesión
			</button>
		</div>
	</div>
</div>
