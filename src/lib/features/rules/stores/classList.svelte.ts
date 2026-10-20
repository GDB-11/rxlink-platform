// src/lib/features/rules/stores/classList.svelte.ts

import {
	ruleApi,
	type ClassValues,
	type ListQuery,
	type MedicationClassItem,
	type RulePage
} from '$lib/api/ruleApi';
import { RuleListStore } from './ruleList.svelte';

export class ClassListStore extends RuleListStore<MedicationClassItem, ClassValues> {
	protected fetchPage(query: ListQuery): Promise<RulePage<MedicationClassItem>> {
		return ruleApi.listClasses(query);
	}

	protected saveItem(code: string | null, values: ClassValues): Promise<unknown> {
		return code ? ruleApi.updateClass(code, values) : ruleApi.createClass(values);
	}

	protected toggleItem(item: MedicationClassItem, active: boolean): Promise<unknown> {
		return ruleApi.setClassActive(item.code, active);
	}
}
