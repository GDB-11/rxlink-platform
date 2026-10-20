// src/lib/features/catalogs/importMeta.ts

export interface ImportColumnHelp {
	name: string;
	required: boolean;
	hint: string;
}

/** CSV columns accepted per importable catalog slug (mirrors the API's import parsers). */
export const importColumns: Record<string, ImportColumnHelp[]> = {
	medications: [
		{ name: 'genericName', required: true, hint: 'Nombre genérico' },
		{ name: 'concentration', required: true, hint: 'Ej. 500 mg' },
		{
			name: 'pharmaceuticalForm',
			required: true,
			hint: 'Nombre de una forma farmacéutica existente'
		},
		{
			name: 'administrationRoute',
			required: true,
			hint: 'Nombre de una vía de administración existente'
		},
		{ name: 'commercialName', required: false, hint: 'Nombre comercial' }
	],
	allergies: [
		{ name: 'name', required: true, hint: 'Nombre de la alergia' },
		{ name: 'description', required: false, hint: 'Descripción' }
	]
};

export function isImportable(slug: string): boolean {
	return slug in importColumns;
}

export const actionLabels = {
	created: 'Se creará',
	updated: 'Se actualizará',
	unchanged: 'Sin cambios',
	skipped: 'Omitido (inactivo)'
} as const;

export const committedActionLabels = {
	created: 'Creado',
	updated: 'Actualizado',
	unchanged: 'Sin cambios',
	skipped: 'Omitido (inactivo)'
} as const;
