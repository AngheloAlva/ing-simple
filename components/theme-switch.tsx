"use client";

import { MoonIcon } from "@/components/icons/animated/animated-moon";
import { SunIcon } from "@/components/icons/animated/animated-sun";
import type { AnimatedIconHandle } from "@/components/icons/animated/types";
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
  const iconRef = useRef<AnimatedIconHandle>(null);

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

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={toggleTheme}
        onMouseEnter={() => iconRef.current?.startAnimation()}
        onMouseLeave={() => iconRef.current?.stopAnimation()}
        onFocus={() => iconRef.current?.startAnimation()}
        onBlur={() => iconRef.current?.stopAnimation()}
        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-muted text-foreground opacity-30 shadow-lg transition-opacity duration-300 hover:opacity-100 hover:shadow-xl"
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
        aria-pressed={isDark}
        type="button"
      >
        {/* Keyed so swapping sun for moon remounts the icon: a fresh mount
            resets the animation state instead of inheriting the old one. */}
        {isDark ? (
          <SunIcon key="sun" ref={iconRef} size={20} className="flex" />
        ) : (
          <MoonIcon key="moon" ref={iconRef} size={20} className="flex" />
        )}
      </button>
    </div>
  );
}
