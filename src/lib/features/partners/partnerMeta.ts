// src/lib/features/partners/partnerMeta.ts

import type { Partner, PartnerStatus, PartnerValues } from '$lib/api/partnerApi';

export const statusLabels: Record<PartnerStatus, string> = {
	Provisioning: 'En aprovisionamiento',
	Active: 'Activo',
	Suspended: 'Suspendido',
	Terminated: 'Terminado'
};

export const statusOptions = (Object.keys(statusLabels) as PartnerStatus[]).map((value) => ({
	value,
	label: statusLabels[value]
}));

/** Statuses a partner can move to from `status` (mirrors the API's lifecycle rules). */
export function nextStatuses(status: PartnerStatus): PartnerStatus[] {
	switch (status) {
		case 'Provisioning':
			return ['Active', 'Terminated'];
		case 'Active':
			return ['Suspended', 'Terminated'];
		case 'Suspended':
			return ['Active', 'Terminated'];
		default:
			return [];
	}
}

/** Moving to these needs a written reason (and Terminated is irreversible). */
export function needsReason(status: PartnerStatus): boolean {
	return status === 'Suspended' || status === 'Terminated';
}

/** Names the API uses in its 409 `missing` list → what the admin has to do. */
export const missingLabels: Record<string, string> = {
	apiBaseUrl: 'URL de la API del partner',
	catalogRoleName: 'Rol de lectura del catálogo',
	logo: 'Logo',
	apiKey: 'Clave de API',
	firstHeartbeat: 'Primer heartbeat recibido'
};

export const fieldLabels: Record<keyof PartnerValues, string> = {
	slug: 'Slug (identificador en URLs)',
	displayName: 'Nombre comercial',
	legalName: 'Razón social',
	taxId: 'RUC',
	country: 'País',
	timezone: 'Zona horaria',
	currency: 'Moneda',
	locale: 'Idioma-región',
	apiBaseUrl: 'URL base de la API',
	brandPrimaryColor: 'Color primario',
	brandAccentColor: 'Color de acento',
	contactName: 'Contacto',
	contactEmail: 'Correo de contacto',
	contactPhone: 'Teléfono de contacto',
	catalogRoleName: 'Rol de lectura del catálogo',
	isTest: 'Partner de prueba (nunca aparece en el directorio)'
};

export function emptyValues(): PartnerValues {
	return {
		slug: '',
		displayName: '',
		legalName: '',
		taxId: '',
		country: 'PE',
		timezone: 'America/Lima',
		currency: 'PEN',
		locale: 'es-PE',
		apiBaseUrl: '',
		brandPrimaryColor: '',
		brandAccentColor: '',
		contactName: '',
		contactEmail: '',
		contactPhone: '',
		catalogRoleName: '',
		isTest: false
	};
}

export function valuesOf(partner: Partner): PartnerValues {
	return {
		slug: partner.slug,
		displayName: partner.displayName,
		legalName: partner.legalName,
		taxId: partner.taxId,
		country: partner.country,
		timezone: partner.timezone,
		currency: partner.currency,
		locale: partner.locale,
		apiBaseUrl: partner.apiBaseUrl ?? '',
		brandPrimaryColor: partner.brandPrimaryColor ?? '',
		brandAccentColor: partner.brandAccentColor ?? '',
		contactName: partner.contactName ?? '',
		contactEmail: partner.contactEmail ?? '',
		contactPhone: partner.contactPhone ?? '',
		catalogRoleName: partner.catalogRoleName ?? '',
		isTest: partner.isTest
	};
}

export interface ProvisioningStep {
	key: string;
	label: string;
	hint: string;
	/** `null` = not observable from the registry (done outside, e.g. Neon project, deploy). */
	done: boolean | null;
}

/** The §5.5 provisioning flow, with what the registry can observe ticked off. */
export function provisioningSteps(partner: Partner): ProvisioningStep[] {
	return [
		{
			key: 'row',
			label: 'Partner registrado',
			hint: 'Datos de identidad guardados.',
			done: true
		},
		{
			key: 'logo',
			label: 'Logo cargado',
			hint: 'PNG o WebP, máx. 256 KB y 1024×1024 px.',
			done: partner.hasLogo
		},
		{
			key: 'db',
			label: 'Proyecto/BD de Neon creados y migraciones aplicadas',
			hint: 'Se hace fuera de la plataforma (ver docs/partner-provisioning.md).',
			done: null
		},
		{
			key: 'role',
			label: 'Rol de lectura del catálogo definido y creado',
			hint: 'Registre aquí su nombre; el rol se crea en la BD del catálogo.',
			done: partner.catalogRoleName !== null ? true : false
		},
		{
			key: 'url',
			label: 'URL de la API del partner registrada',
			hint: 'Se usa en el directorio para las apps móviles.',
			done: partner.apiBaseUrl !== null
		},
		{
			key: 'key',
			label: 'Clave de API emitida',
			hint: 'Se muestra una sola vez; configúrela en el despliegue del partner.',
			done: partner.hasApiKey
		},
		{
			key: 'heartbeat',
			label: 'Primer heartbeat recibido',
			hint: 'Confirma que el partner desplegado alcanza la plataforma.',
			done: partner.lastHeartbeatAt !== null
		},
		{
			key: 'active',
			label: 'Partner activo',
			hint: 'Cambie el estado a Activo cuando todo lo anterior esté listo.',
			done: partner.status === 'Active' || partner.status === 'Suspended'
		}
	];
}

export function formatDateTime(iso: string | null): string {
	if (!iso) return '—';
	return new Date(iso).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' });
}

/** The API stores the supported schema range as a Postgres range (`[1,2)`, upper bound exclusive). */
export function formatSchemaRange(range: string | null): string {
	const match = range?.match(/^\[(\d+),(\d+)\)$/);
	if (!match) return range ?? '—';
	const min = Number(match[1]);
	const max = Number(match[2]) - 1;
	return min === max ? String(min) : `${min}–${max}`;
}
