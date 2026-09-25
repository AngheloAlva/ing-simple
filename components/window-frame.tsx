import type { ReactNode } from "react";

/**
 * Reusable macOS-style window chrome extracted from `window-mockup`.
 * The body is a FIXED height so rotating panels never cause layout jump;
 * children are expected to fill it (`h-full`) and manage their own overflow.
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

      {/* Body — fixed height keeps the frame stable across panel rotation */}
      <div className="h-[560px] overflow-hidden">{children}</div>
    </div>
  );
}
