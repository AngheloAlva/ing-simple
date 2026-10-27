"use client";

import { MoonIcon } from "@/components/icons/animated/animated-moon";
import { SunIcon } from "@/components/icons/animated/animated-sun";
import type { AnimatedIconHandle } from "@/components/icons/animated/types";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useRef, useSyncExternalStore, type ReactNode } from "react";

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeSwitch(): ReactNode {
  const mounted = useIsMounted();
  const { setTheme, resolvedTheme } = useTheme();
  // One ref per icon: during the swap both are mounted, and the outgoing one
  // clears its ref when it unmounts, which would null out a shared ref.
  const sunRef = useRef<AnimatedIconHandle>(null);
  const moonRef = useRef<AnimatedIconHandle>(null);

  const toggleTheme = (): void => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="h-10 w-10 cursor-not-allowed rounded-full bg-foreground/10 opacity-30"
          aria-label="Toggle theme"
          disabled
        />
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";
  const activeIcon = (): AnimatedIconHandle | null =>
    (isDark ? sunRef : moonRef).current;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleTheme}
        onMouseEnter={() => activeIcon()?.startAnimation()}
        onMouseLeave={() => activeIcon()?.stopAnimation()}
        onFocus={() => activeIcon()?.startAnimation()}
        onBlur={() => activeIcon()?.stopAnimation()}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted text-foreground opacity-30 shadow-lg transition-opacity duration-300 hover:opacity-100 hover:shadow-xl"
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        aria-pressed={isDark}
        type="button"
      >
        {/* Keyed so swapping sun for moon remounts the icon: a fresh mount
            resets the animation state instead of inheriting the old one. Both
            icons share one grid cell so the swap is a crossfade, not a jump. */}
        <span className="grid">
          <AnimatePresence initial={false}>
            <motion.span
              key={isDark ? "sun" : "moon"}
              className="col-start-1 row-start-1 flex"
              initial={{ opacity: 0, scale: 0.8, filter: "blur(2px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.8, filter: "blur(2px)" }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {isDark ? (
                <SunIcon ref={sunRef} size={20} className="flex" />
              ) : (
                <MoonIcon ref={moonRef} size={20} className="flex" />
              )}
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
    </div>
  );
}
