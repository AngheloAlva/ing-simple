import { access, readFile, readdir } from "node:fs/promises"
import path from "node:path"

import { isGuiaFile, listGuias, parseGuia } from "@/lib/guias"
import type { GuiaMeta } from "@/lib/guias/schema"

const CONTENT_DIR = path.join(process.cwd(), "content", "guias")
const PUBLIC_DIR = path.join(process.cwd(), "public")

/** Drafts render only outside production, so writers can preview them in `pnpm dev`. */
function includeDrafts(): boolean {
	return process.env.NODE_ENV !== "production"
}

/**
 * Every guide must ship a real cover photo (see `guiaFrontmatterSchema`).
 * This check lives here, not in the pure `lib/guias/index.ts`, because it is
 * the only part of the cover requirement that touches the filesystem. A
 * missing file fails the build loudly, naming the slug and the expected path,
 * instead of shipping a guide with a broken `<img>`.
 */
async function assertCoverExists(slug: string, portada: string): Promise<void> {
	const coverPath = path.join(PUBLIC_DIR, portada)
	try {
		await access(coverPath)
	} catch {
		throw new Error(
			`Guía "${slug}" references a missing cover image: "${portada}" (expected at ${coverPath})`
		)
	}
}

async function readGuiaFiles(): Promise<Array<{ slug: string; raw: string }>> {
	const entries = await readdir(CONTENT_DIR)
	const fileNames = entries.filter(isGuiaFile)

	return Promise.all(
		fileNames.map(async (fileName) => ({
			slug: fileName.replace(/\.mdx$/, ""),
			raw: await readFile(path.join(CONTENT_DIR, fileName), "utf8"),
		}))
	)
}

/** All published guides (drafts included outside production), newest first. */
export async function getAllGuias(): Promise<GuiaMeta[]> {
	const files = await readGuiaFiles()
	const metas = listGuias(files, { includeDrafts: includeDrafts() })
	await Promise.all(metas.map((meta) => assertCoverExists(meta.slug, meta.portada)))
	return metas
}

function isEnoentError(error: unknown): boolean {
	return (
		error instanceof Error && "code" in error && (error as NodeJS.ErrnoException).code === "ENOENT"
	)
}

/** One guide by slug, or `undefined` when it does not exist or is a draft in production. */
export async function getGuiaBySlug(
	slug: string
): Promise<{ meta: GuiaMeta; body: string } | undefined> {
	try {
		const raw = await readFile(path.join(CONTENT_DIR, `${slug}.mdx`), "utf8")
		const parsed = parseGuia(slug, raw)

		if (!includeDrafts() && parsed.meta.draft) return undefined
		await assertCoverExists(parsed.meta.slug, parsed.meta.portada)
		return parsed
	} catch (error) {
		if (isEnoentError(error)) return undefined
		throw error
	}
}
