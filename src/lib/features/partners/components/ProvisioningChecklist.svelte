<!-- src/lib/features/partners/components/ProvisioningChecklist.svelte -->
<script lang="ts">
	import type { Partner } from '$lib/api/partnerApi';
	import { provisioningSteps } from '../partnerMeta';
	import SectionCard from './SectionCard.svelte';

	interface Props {
		partner: Partner;
	}

	let { partner }: Props = $props();

	const steps = $derived(provisioningSteps(partner));
</script>

<SectionCard title="Lista de aprovisionamiento">
	<ol class="space-y-2">
		{#each steps as step (step.key)}
			<li class="flex items-start gap-3 text-sm" data-step={step.key} data-done={step.done}>
				<span
					class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold
					       {step.done === true
						? 'bg-teal-600 text-white'
						: step.done === false
							? 'border border-stone-300 text-transparent dark:border-stone-600'
							: 'border border-dashed border-stone-300 text-stone-400 dark:border-stone-600'}"
					aria-hidden="true"
				>
					{step.done === true ? '✓' : step.done === null ? '·' : ''}
				</span>
				<span>
					<span class="text-stone-900 dark:text-stone-100">{step.label}</span>
					{#if step.done === null}
						<span class="text-xs text-stone-500"> (manual)</span>
					{/if}
					<span class="block text-xs text-stone-500 dark:text-stone-400">{step.hint}</span>
				</span>
			</li>
		{/each}
	</ol>
</SectionCard>
