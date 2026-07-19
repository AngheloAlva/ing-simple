import type { ReactNode } from "react";

/**
 * Reusable macOS-style window chrome extracted from `window-mockup`.
 * The body is a FIXED height so rotating panels never cause layout jump;
 * children are expected to fill it (`h-full`) and manage their own overflow.
 */
export function WindowFrame({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div className="mx-auto max-w-[1100px] overflow-hidden rounded-2xl border border-border/60 bg-background shadow-2xl shadow-black/[0.08]">
      {/* Title bar */}
      <div className="relative flex h-7 items-center border-b border-border/60 px-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="pointer-events-none absolute inset-x-0 text-center text-xs font-normal text-muted-foreground">
          {label}
        </span>
      </div>

      {/* Body — fixed height keeps the frame stable across panel rotation */}
      <div className="h-[560px] overflow-hidden">{children}</div>
    </div>
  );
}
