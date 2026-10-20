// src/lib/features/catalogs/stores/catalogImport.svelte.ts

import { ApiError } from '$lib/api/api';
import { catalogApi, type CatalogImportReport } from '$lib/api/catalogApi';

/** CSV import of one catalog: choose file → dry-run preview → commit. */
export class CatalogImportStore {
	readonly slug: string;

	file = $state<File | null>(null);
	report = $state<CatalogImportReport | null>(null);
	busy = $state(false);
	error = $state<string | null>(null);

	/** The preview is valid and nothing in it blocks a commit. */
	canCommit = $derived(
		!!this.report && this.report.dryRun && this.report.errors.length === 0 && this.report.total > 0
	);

	constructor(slug: string) {
		this.slug = slug;
	}

	/** Picking another file discards the previous preview/result. */
	setFile(file: File | null): void {
		this.file = file;
		this.report = null;
		this.error = null;
	}

	preview(): Promise<void> {
		return this.run(true);
	}

	commit(): Promise<void> {
		return this.run(false);
	}

	reset(): void {
		this.setFile(null);
	}

	private async run(dryRun: boolean): Promise<void> {
		if (!this.file || this.busy) return;
		this.busy = true;
		this.error = null;
		try {
			this.report = await catalogApi.importCsv(this.slug, this.file, dryRun);
		} catch (err) {
			if (err instanceof ApiError && err.status === 422) {
				// Commit rejected: show the row errors the API found, as a preview again.
				this.report = err.body as CatalogImportReport;
			} else {
				this.error = err instanceof Error ? err.message : 'Error al importar el archivo.';
			}
		} finally {
			this.busy = false;
		}
	}
}
