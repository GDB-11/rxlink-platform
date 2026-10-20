// src/lib/api/partnerApi.ts

import { api } from './api';

export type PartnerStatus = 'Provisioning' | 'Active' | 'Suspended' | 'Terminated';

export interface Partner {
	code: string;
	slug: string;
	displayName: string;
	legalName: string;
	taxId: string;
	status: PartnerStatus;
	statusReason: string | null;
	statusChangedAt: string;
	directoryVisible: boolean;
	isTest: boolean;
	country: string;
	timezone: string;
	currency: string;
	locale: string;
	apiBaseUrl: string | null;
	brandPrimaryColor: string | null;
	brandAccentColor: string | null;
	contactName: string | null;
	contactEmail: string | null;
	contactPhone: string | null;
	catalogRoleName: string | null;
	hasApiKey: boolean;
	hasLogo: boolean;
	logoSha256: string | null;
	apiVersion: string | null;
	dbSchemaVersion: string | null;
	supportedCatalogSchemas: string | null;
	catalogSchemaVersionSeen: number | null;
	catalogVersionSeen: number | null;
	lastHeartbeatAt: string | null;
	heartbeatStale: boolean;
	createdAt: string;
	activatedAt: string | null;
	updatedAt: string;
}

export interface PartnerPage {
	items: Partner[];
	page: number;
	pageSize: number;
	total: number;
}

/** Body of POST /partners and PUT /partners/{code}. Blank optional fields are sent as `''`. */
export interface PartnerValues {
	slug: string;
	displayName: string;
	legalName: string;
	taxId: string;
	country: string;
	timezone: string;
	currency: string;
	locale: string;
	apiBaseUrl: string;
	brandPrimaryColor: string;
	brandAccentColor: string;
	contactName: string;
	contactEmail: string;
	contactPhone: string;
	catalogRoleName: string;
	isTest: boolean;
}

export interface PartnerApiKey {
	apiKey: string;
	issuedAt: string;
}

export interface PartnerLogoInfo {
	contentType: string;
	sha256: string;
	sizeBytes: number;
	width: number;
	height: number;
}

export interface PartnerListQuery {
	search?: string;
	status?: PartnerStatus | '';
	page?: number;
	pageSize?: number;
}

function listQuery(q: PartnerListQuery): string {
	const params = new URLSearchParams();
	if (q.search) params.set('search', q.search);
	if (q.status) params.set('status', q.status);
	params.set('page', String(q.page ?? 1));
	params.set('pageSize', String(q.pageSize ?? 25));
	return params.toString();
}

const base = '/api/v1/partners';

export const partnerApi = {
	list(query: PartnerListQuery = {}): Promise<PartnerPage> {
		return api.get<PartnerPage>(`${base}?${listQuery(query)}`);
	},

	get(code: string): Promise<Partner> {
		return api.get<Partner>(`${base}/${code}`);
	},

	/** 201 | 400 `{title, errors}` | 409 `{message, field}` */
	create(values: PartnerValues): Promise<Partner> {
		return api.post<Partner>(base, values);
	},

	/** Full body. 200 | 400 | 404 | 409 (slug locked after activation, terminated, duplicate) */
	update(code: string, values: PartnerValues): Promise<Partner> {
		return api.put<Partner>(`${base}/${code}`, values);
	},

	/** 409 `{message, missing}` when activating without the prerequisites. Suspend/terminate need a reason. */
	changeStatus(code: string, status: PartnerStatus, reason?: string): Promise<Partner> {
		return api.post<Partner>(`${base}/${code}/status`, { status, reason: reason ?? null });
	},

	setDirectoryVisibility(code: string, visible: boolean): Promise<Partner> {
		return api.post<Partner>(`${base}/${code}/directory-visibility`, { visible });
	},

	/** Issues or rotates the key (the previous one stops working). The plain key is returned once. */
	issueApiKey(code: string): Promise<PartnerApiKey> {
		return api.post<PartnerApiKey>(`${base}/${code}/api-key`, {});
	},

	uploadLogo(code: string, file: File): Promise<PartnerLogoInfo> {
		const form = new FormData();
		form.append('file', file);
		return api.putForm<PartnerLogoInfo>(`${base}/${code}/logo`, form);
	},

	logo(code: string): Promise<Blob> {
		return api.getBlob(`${base}/${code}/logo`);
	}
};
