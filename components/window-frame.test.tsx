import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { WindowFrame } from "@/components/window-frame";

describe("WindowFrame responsive demo sizing", () => {
  it("opts the redesigned demos into a shorter narrow-screen body", () => {
    const html = renderToStaticMarkup(
      <WindowFrame compact tabs={<span>Services</span>}><span>Demo</span></WindowFrame>,
    );
    expect(html).toContain("h-[760px]");
    expect(html).toContain("lg:h-[560px]");
    expect(html).not.toContain("h-[960px]");
    expect(html).not.toContain("sm:h-[880px]");
    expect(html.indexOf("Services")).toBeLessThan(html.indexOf("Demo"));
  });

  it("preserves the existing heights for every caller that does not opt in", () => {
    const html = renderToStaticMarkup(<WindowFrame tabs="Services">Demo</WindowFrame>);
    expect(html).toContain("h-[960px]");
    expect(html).toContain("sm:h-[880px]");
    expect(html).toContain("lg:h-[560px]");
  });
});
