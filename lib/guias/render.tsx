import GithubSlugger from "github-slugger"
import { compileMDX } from "next-mdx-remote/rsc"
import type { ReactNode } from "react"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"

import { mdxComponents } from "@/components/guias/mdx-components"

/** Compiles a guide's MDX body (frontmatter already stripped) into a React tree. */
export async function compileGuia(body: string): Promise<ReactNode> {
	const { content } = await compileMDX({
		source: body,
		components: mdxComponents,
		options: {
			parseFrontmatter: false,
			mdxOptions: {
				remarkPlugins: [remarkGfm],
				rehypePlugins: [rehypeSlug],
			},
		},
	})

	return content
}

export interface GuiaHeading {
	depth: 2 | 3
	text: string
	id: string
}

const HEADING_RE = /^(#{2,3})\s+(.+?)\s*#*\s*$/
const FENCE_RE = /^\s*(```|~~~)/

/** Removes the inline markdown a slugified heading text would render without. */
function stripInlineMarkdown(text: string): string {
	return text
		.replace(/`([^`]*)`/g, "$1")
		.replace(/\*\*([^*]*)\*\*/g, "$1")
		.replace(/\*([^*]*)\*/g, "$1")
		.replace(/_([^_]*)_/g, "$1")
		.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
		.trim()
}

/**
 * Extracts `##`/`###` headings from raw MDX, ignoring anything inside a code
 * fence. `id` is generated with the same `github-slugger` instance
 * `rehype-slug` uses internally, so anchors here always match the ones
 * rendered in the compiled article.
 */
export function extractHeadings(body: string): GuiaHeading[] {
	const slugger = new GithubSlugger()
	const headings: GuiaHeading[] = []
	let inFence = false

	for (const line of body.split("\n")) {
		if (FENCE_RE.test(line)) {
			inFence = !inFence
			continue
		}
		if (inFence) continue

		const match = HEADING_RE.exec(line)
		if (!match) continue

		const depth = match[1]!.length as 2 | 3
		const text = stripInlineMarkdown(match[2]!)
		if (text.length === 0) continue

		headings.push({ depth, text, id: slugger.slug(text) })
	}

	return headings
}
