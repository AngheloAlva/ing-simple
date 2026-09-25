import type { ReactNode } from "react";

/**
 * Reusable macOS-style window chrome extracted from `window-mockup`.
 *
 * On desktop the body is a FIXED height so rotating panels never cause a layout
 * jump, and children are expected to fill it (`h-full`) and manage their own
 * overflow. Below `lg` the same desktop-density panels need more room than
 * 560px, and that fixed height silently swallowed the excess — a table region
 * collapsed to 1px and a course column lost its last row. The narrower values
 * are measured: below them the panel contents overlap each other.
 */
export function WindowFrame({
  tabs,
  children,
}: {
  tabs: ReactNode;
  children: ReactNode;
}): ReactNode {
  return (
    <div className="mx-auto max-w-[1100px] overflow-hidden rounded-2xl border border-border/60 bg-background shadow-2xl shadow-black/[0.08]">
      {/* Window chrome — traffic lights plus the service tabs */}
      <div className="flex h-10 items-stretch gap-2 border-b border-border/60 pl-2.5">
        <div className="flex shrink-0 items-center gap-1.5 pr-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        {tabs}
      </div>

      {/* Body — a definite height per breakpoint; see the note above */}
      <div className="h-[960px] overflow-hidden sm:h-[880px] lg:h-[560px]">{children}</div>
    </div>
  );
}
