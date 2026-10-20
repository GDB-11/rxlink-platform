// src/lib/api/catalogApi.ts

import { api } from './api';

export type FieldType = 'text' | 'integer' | 'decimal';

export interface CatalogFieldInfo {
	name: string;
	type: FieldType;
	required: boolean;
	maxLength: number | null;
	min: number | null;
	max: number | null;
}

export interface CatalogInfo {
	slug: string;
	fields: CatalogFieldInfo[];
}

/** A catalog row: `code`, `isActive` plus the table's own camelCase fields. */
export type CatalogEntry = { code: string; isActive: boolean } & Record<string, unknown>;

export interface CatalogPage {
	items: CatalogEntry[];
	page: number;
	pageSize: number;
	total: number;
}

export interface CatalogAuditEntry {
	auditLogId: number;
	action: string;
	recordKey: string | null;
	oldValues: string | null;
	newValues: string | null;
	changedColumns: string[] | null;
	changedBy: string | null;
	occurredAt: string;
	requestId: string | null;
}

export interface CatalogAuditPage {
	items: CatalogAuditEntry[];
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

export type ImportAction = 'created' | 'updated' | 'unchanged' | 'skipped';

export interface ImportRowResult {
	line: number;
	action: ImportAction;
	/** Null for rows a dry run would create (the code is not persisted). */
	code: string | null;
	label: string;
}

export interface ImportRowError {
	line: number;
	field: string | null;
	message: string;
}

/** What an import did (`committed`) or would do (`dryRun`). Any error means nothing was applied. */
export interface CatalogImportReport {
	dryRun: boolean;
	committed: boolean;
	total: number;
	created: number;
	updated: number;
	unchanged: number;
	skipped: number;
	rows: ImportRowResult[];
	errors: ImportRowError[];
}

export type EntryValues = Record<string, string | number | null>;

/** Medications live under their own route; everything else under /catalogs/{slug}. */
export const MEDICATIONS_SLUG = 'medications';

function base(slug: string): string {
	return `/api/v1/catalogs/${slug}`;
}

function listQuery(q: ListQuery): string {
	const params = new URLSearchParams();
	if (q.search) params.set('search', q.search);
	params.set('includeInactive', String(q.includeInactive ?? true));
	params.set('page', String(q.page ?? 1));
	params.set('pageSize', String(q.pageSize ?? 50));
	return params.toString();
}

function auditQuery(page: number, pageSize: number): string {
	return new URLSearchParams({ page: String(page), pageSize: String(pageSize) }).toString();
}

export const catalogApi = {
	/** GET /api/v1/catalogs — field metadata of the nine simple catalogs */
	listCatalogs(): Promise<CatalogInfo[]> {
		return api.get<CatalogInfo[]>('/api/v1/catalogs');
	},

	/** GET /api/v1/catalogs/{slug} (medications included) */
	list(slug: string, query: ListQuery = {}): Promise<CatalogPage> {
		return api.get<CatalogPage>(`${base(slug)}?${listQuery(query)}`);
	},

	/** POST — 201 | 400 `{title, errors}` */
	create(slug: string, values: EntryValues): Promise<CatalogEntry> {
		return api.post<CatalogEntry>(base(slug), values);
	},

	/** PUT — full body. 200 | 400 | 404 | 409 (medication identity locked) */
	update(slug: string, code: string, values: EntryValues): Promise<CatalogEntry> {
		return api.put<CatalogEntry>(`${base(slug)}/${code}`, values);
	},

	activate(slug: string, code: string): Promise<CatalogEntry> {
		return api.post<CatalogEntry>(`${base(slug)}/${code}/activate`, {});
	},

	deactivate(slug: string, code: string): Promise<CatalogEntry> {
		return api.post<CatalogEntry>(`${base(slug)}/${code}/deactivate`, {});
	},

	/**
	 * POST …/{slug}/import (multipart `file`). Dry run answers 200 with any row errors in the report;
	 * a commit with errors answers 422 with the same report in `ApiError.body`.
	 */
	importCsv(slug: string, file: File, dryRun: boolean): Promise<CatalogImportReport> {
		const form = new FormData();
		form.append('file', file);
		return api.postForm<CatalogImportReport>(`${base(slug)}/import?dryRun=${dryRun}`, form);
	},

	/** GET …/{slug}/audit — change history of a whole catalog */
	audit(slug: string, page = 1, pageSize = 50): Promise<CatalogAuditPage> {
		return api.get<CatalogAuditPage>(`${base(slug)}/audit?${auditQuery(page, pageSize)}`);
	}
};
