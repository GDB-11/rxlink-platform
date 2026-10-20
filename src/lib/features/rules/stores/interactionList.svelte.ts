// src/lib/features/rules/stores/interactionList.svelte.ts

import {
	ruleApi,
	type InteractionItem,
	type InteractionValues,
	type ListQuery,
	type RulePage
} from '$lib/api/ruleApi';
import { RuleListStore } from './ruleList.svelte';

export class InteractionListStore extends RuleListStore<InteractionItem, InteractionValues> {
	protected fetchPage(query: ListQuery): Promise<RulePage<InteractionItem>> {
		return ruleApi.listInteractions(query);
	}

	protected saveItem(code: string | null, values: InteractionValues): Promise<unknown> {
		// The class pair is the rule's identity: an edit sends severity and description only.
		return code
			? ruleApi.updateInteraction(code, {
					severity: values.severity,
					description: values.description
				})
			: ruleApi.createInteraction(values);
	}

	protected toggleItem(item: InteractionItem, active: boolean): Promise<unknown> {
		return ruleApi.setInteractionActive(item.code, active);
	}
}
