// src/lib/features/catalogs/catalogMeta.ts

import { MEDICATIONS_SLUG, type CatalogEntry } from '$lib/api/catalogApi';

export interface ColumnDef {
	key: string;
	label: string;
	format?: (entry: CatalogEntry) => string;
}

export interface CatalogMeta {
	slug: string;
	/** Plural, for titles and lists. */
	label: string;
	/** Singular, for buttons and dialogs ("Nuevo …"). */
	singular: string;
	/** "o" | "a": grammatical gender of the singular noun, for "Nuevo/Nueva". */
	gender: 'o' | 'a';
	/** Field `name` (camelCase) → label shown in forms. */
	fieldLabels: Record<string, string>;
	/** Columns after the status badge is added by the table. */
	columns: ColumnDef[];
	/** Field that names a row in confirmations. */
	nameKey: string;
}

const text = (key: string) => (e: CatalogEntry) => String(e[key] ?? '—');

export const catalogMetas: CatalogMeta[] = [
	{
		slug: 'document-types',
		label: 'Tipos de documento',
		singular: 'tipo de documento',
		gender: 'o',
		fieldLabels: { name: 'Nombre' },
		columns: [{ key: 'name', label: 'Nombre' }],
		nameKey: 'name'
	},
	{
		slug: 'sexes',
		label: 'Sexos',
		singular: 'sexo',
		gender: 'o',
		fieldLabels: { name: 'Nombre' },
		columns: [{ key: 'name', label: 'Nombre' }],
		nameKey: 'name'
	},
	{
		slug: 'specialties',
		label: 'Especialidades',
		singular: 'especialidad',
		gender: 'a',
		fieldLabels: { name: 'Nombre' },
		columns: [{ key: 'name', label: 'Nombre' }],
		nameKey: 'name'
	},
	{
		slug: 'pharmaceutical-forms',
		label: 'Formas farmacéuticas',
		singular: 'forma farmacéutica',
		gender: 'a',
		fieldLabels: { name: 'Nombre' },
		columns: [{ key: 'name', label: 'Nombre' }],
		nameKey: 'name'
	},
	{
		slug: 'administration-routes',
		label: 'Vías de administración',
		singular: 'vía de administración',
		gender: 'a',
		fieldLabels: { name: 'Nombre' },
		columns: [{ key: 'name', label: 'Nombre' }],
		nameKey: 'name'
	},
	{
		slug: 'frequencies',
		label: 'Frecuencias',
		singular: 'frecuencia',
		gender: 'a',
		fieldLabels: { description: 'Descripción', intervalHours: 'Intervalo (horas)' },
		columns: [
			{ key: 'description', label: 'Descripción' },
			{ key: 'intervalHours', label: 'Intervalo (h)', format: text('intervalHours') }
		],
		nameKey: 'description'
	},
	{
		slug: 'allergies',
		label: 'Alergias',
		singular: 'alergia',
		gender: 'a',
		fieldLabels: { name: 'Nombre', description: 'Descripción' },
		columns: [
			{ key: 'name', label: 'Nombre' },
			{ key: 'description', label: 'Descripción', format: text('description') }
		],
		nameKey: 'name'
	},
	{
		slug: 'allergy-severities',
		label: 'Severidades de alergia',
		singular: 'severidad de alergia',
		gender: 'a',
		fieldLabels: { name: 'Nombre', sortOrder: 'Orden' },
		columns: [
			{ key: 'name', label: 'Nombre' },
			{ key: 'sortOrder', label: 'Orden', format: text('sortOrder') }
		],
		nameKey: 'name'
	},
	{
		slug: 'insurances',
		label: 'Seguros',
		singular: 'seguro',
		gender: 'o',
		fieldLabels: { name: 'Nombre', defaultCoveragePercentage: 'Cobertura por defecto (%)' },
		columns: [
			{ key: 'name', label: 'Nombre' },
			{
				key: 'defaultCoveragePercentage',
				label: 'Cobertura',
				format: (e) => `${e.defaultCoveragePercentage ?? 0}%`
			}
		],
		nameKey: 'name'
	},
	{
		slug: MEDICATIONS_SLUG,
		label: 'Medicamentos',
		singular: 'medicamento',
		gender: 'o',
		fieldLabels: {
			genericName: 'Nombre genérico',
			commercialName: 'Nombre comercial',
			concentration: 'Concentración',
			pharmaceuticalFormCode: 'Forma farmacéutica',
			administrationRouteCode: 'Vía de administración'
		},
		columns: [
			{ key: 'genericName', label: 'Genérico' },
			{ key: 'commercialName', label: 'Comercial', format: text('commercialName') },
			{ key: 'concentration', label: 'Concentración' },
			{ key: 'pharmaceuticalFormName', label: 'Forma' },
			{ key: 'administrationRouteName', label: 'Vía' }
		],
		nameKey: 'genericName'
	}
];

export function findCatalogMeta(slug: string): CatalogMeta | undefined {
	return catalogMetas.find((m) => m.slug === slug);
}
