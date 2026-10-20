// src/lib/api/ruleApi.ts

import { api } from './api';

export type Severity = 'Minor' | 'Moderate' | 'Major' | 'Contraindicated';

export interface RulePage<T> {
	items: T[];
	page: number;
	pageSize: number;
	total: number;
}

export interface ListQuery {
	search?: string;
	includeInactive?: boolean;
	page?: number;
	pageSize?: number;
}

export interface MedicationClassItem {
	code: string;
	isActive: boolean;
	name: string;
	description: string | null;
	memberCount: number;
	allergyCount: number;
}

/** A medication or allergy linked to a class; `isActive` is the linked row's own state. */
export interface RuleLink {
	code: string;
	label: string;
	isActive: boolean;
}

export interface MedicationClassDetail {
	code: string;
	isActive: boolean;
	name: string;
	description: string | null;
	members: RuleLink[];
	allergies: RuleLink[];
}

export interface ClassValues {
	name: string;
	description: string;
}

export interface InteractionItem {
	code: string;
	isActive: boolean;
	classACode: string;
	classAName: string;
	classBCode: string;
	classBName: string;
	severity: Severity;
	description: string;
}

export interface InteractionValues {
	classACode: string;
	classBCode: string;
	severity: string;
	description: string;
}

export type LinkKind = 'medications' | 'allergies';

const CLASSES = '/api/v1/catalogs/medication-classes';
const INTERACTIONS = '/api/v1/catalogs/medication-interactions';

function listQuery(q: ListQuery): string {
	const params = new URLSearchParams();
	if (q.search) params.set('search', q.search);
	params.set('includeInactive', String(q.includeInactive ?? true));
	params.set('page', String(q.page ?? 1));
	params.set('pageSize', String(q.pageSize ?? 25));
	return params.toString();
}

export const ruleApi = {
	listClasses(query: ListQuery = {}): Promise<RulePage<MedicationClassItem>> {
		return api.get(`${CLASSES}?${listQuery(query)}`);
	},

	getClass(code: string): Promise<MedicationClassDetail> {
		return api.get(`${CLASSES}/${code}`);
	},

	/** POST — 201 | 400 `{title, errors}` | 409 duplicate name */
	createClass(values: ClassValues): Promise<MedicationClassDetail> {
		return api.post(CLASSES, values);
	},

	updateClass(code: string, values: ClassValues): Promise<MedicationClassDetail> {
		return api.put(`${CLASSES}/${code}`, values);
	},

	setClassActive(code: string, active: boolean): Promise<MedicationClassDetail> {
		return api.post(`${CLASSES}/${code}/${active ? 'activate' : 'deactivate'}`, {});
	},

	/** PUT …/{kind}/{itemCode} — adds (or re-activates) the link. 400 when the item is inactive. */
	addLink(classCode: string, kind: LinkKind, itemCode: string): Promise<MedicationClassDetail> {
		return api.put(`${CLASSES}/${classCode}/${kind}/${itemCode}`, {});
	},

	removeLink(classCode: string, kind: LinkKind, itemCode: string): Promise<MedicationClassDetail> {
		return api.delete(`${CLASSES}/${classCode}/${kind}/${itemCode}`);
	},

	listInteractions(query: ListQuery = {}): Promise<RulePage<InteractionItem>> {
		return api.get(`${INTERACTIONS}?${listQuery(query)}`);
	},

	/** POST — 201 | 400 | 409 when the class pair already has a rule (active or not) */
	createInteraction(values: InteractionValues): Promise<InteractionItem> {
		return api.post(INTERACTIONS, values);
	},

	/** PUT — severity and description only; the class pair is the rule's identity. */
	updateInteraction(
		code: string,
		values: Pick<InteractionValues, 'severity' | 'description'>
	): Promise<InteractionItem> {
		return api.put(`${INTERACTIONS}/${code}`, values);
	},

	setInteractionActive(code: string, active: boolean): Promise<InteractionItem> {
		return api.post(`${INTERACTIONS}/${code}/${active ? 'activate' : 'deactivate'}`, {});
	}
};
