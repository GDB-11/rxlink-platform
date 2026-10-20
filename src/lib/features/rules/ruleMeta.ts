// src/lib/features/rules/ruleMeta.ts

import type { CatalogEntry } from '$lib/api/catalogApi';
import type { CatalogMeta } from '$lib/features/catalogs';
import type { Severity } from '$lib/api/ruleApi';

export const severityOptions: { value: Severity; label: string }[] = [
	{ value: 'Contraindicated', label: 'Contraindicada' },
	{ value: 'Major', label: 'Mayor' },
	{ value: 'Moderate', label: 'Moderada' },
	{ value: 'Minor', label: 'Menor' }
];

export function severityLabel(severity: string): string {
	return severityOptions.find((o) => o.value === severity)?.label ?? severity;
}

const text = (key: string) => (e: CatalogEntry) => String(e[key] ?? '—');

/** Columns and wording for `CatalogTable` and the shared activate/deactivate dialog. */
export const classMeta: CatalogMeta = {
	slug: 'medication-classes',
	label: 'Clases de medicamentos',
	singular: 'clase de medicamentos',
	gender: 'a',
	fieldLabels: { name: 'Nombre', description: 'Descripción' },
	columns: [
		{ key: 'name', label: 'Nombre' },
		{ key: 'description', label: 'Descripción', format: text('description') },
		{ key: 'memberCount', label: 'Medicamentos' },
		{ key: 'allergyCount', label: 'Alergias' }
	],
	nameKey: 'name'
};

export const interactionMeta: CatalogMeta = {
	slug: 'medication-interactions',
	label: 'Interacciones',
	singular: 'regla de interacción',
	gender: 'a',
	fieldLabels: { severity: 'Severidad', description: 'Descripción' },
	columns: [
		{ key: 'classAName', label: 'Clase A' },
		{ key: 'classBName', label: 'Clase B' },
		{ key: 'severity', label: 'Severidad', format: (e) => severityLabel(String(e.severity)) },
		{ key: 'description', label: 'Descripción' }
	],
	// The rule has no name of its own: the list adds a synthetic `name` ("A ↔ B") for the dialogs.
	nameKey: 'name'
};
