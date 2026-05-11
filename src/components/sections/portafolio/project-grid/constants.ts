import { CATEGORY_LABELS, type ProjectCategory } from "@/lib/portfolio-data"

export type FilterValue = "todos" | ProjectCategory

export const FILTERS = Object.keys(CATEGORY_LABELS) as FilterValue[]

export const PAGE_SIZE = 8
