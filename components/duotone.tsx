/**
 * The ground the duotone plate sits on: a light blue field in light mode, a
 * near-black one in dark. These two hexes appear nowhere else in the repository,
 * so this is their single source. The plate supplies the treatment filters, the
 * accent tint and the three blend layers on top of it.
 */
export const DUOTONE_CONTAINER =
  "bg-[#e6eeff] [filter:saturate(1.15)] [isolation:isolate] dark:bg-[#05122e] dark:[filter:saturate(1.35)]";
