import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const timeline = vi.hoisted(() => ({ loop: null as { index: number; cycle: number } | null, reduced: false }));
vi.mock("@/components/diagrams/use-step-loop", () => ({ useStepLoop: () => timeline.loop }));
vi.mock("@/lib/motion", () => ({ softEase: [0.22, 1, 0.36, 1], useReducedMotion: () => timeline.reduced }));
import {
  PanelAutomation,
  RUN_STEPS,
  STEP_DWELL_MS,
  STEP_TRAVEL_MS,
  VALIDATION_REVEAL_INDEX,
  arrivedStep,
  edgeRunState,
  stepDuration,
  stepTravelMs,
  subNodesRevealed,
} from "./automation";

describe("edgeRunState (sequential execution)", () => {
  it("walks one connector at a time, in order", () => {
    // Step 1: only the first connector is in flight.
    expect(edgeRunState(1, 0)).toBe("running");
    expect(edgeRunState(2, 0)).toBe("pending");
    expect(edgeRunState(3, 0)).toBe("pending");
    expect(edgeRunState(4, 0)).toBe("pending");
    // Each later segment only starts after the previous one is done.
    expect(edgeRunState(1, 1)).toBe("done");
    expect(edgeRunState(2, 1)).toBe("running");
    expect(edgeRunState(3, 2)).toBe("running"); // taken branch
    expect(edgeRunState(4, 3)).toBe("running"); // last hop
  });

  it("keeps finished segments marked done for the rest of the cycle", () => {
    expect(edgeRunState(1, 3)).toBe("done");
    expect(edgeRunState(2, 3)).toBe("done");
    expect(edgeRunState(3, RUN_STEPS)).toBe("done"); // hold / final frame
    expect(edgeRunState(4, RUN_STEPS)).toBe("done");
  });

  it("never traverses the not-taken branch", () => {
    expect(edgeRunState(null, 0)).toBe("idle");
    expect(edgeRunState(null, RUN_STEPS)).toBe("idle");
  });
});

describe("step timing (travel + dwell)", () => {
  it("gives every step a travel phase and a dwell phase", () => {
    for (let index = 0; index < RUN_STEPS; index++) {
      expect(stepTravelMs(index)).toBeGreaterThan(0);
      // The wire draws for the travel time, then the node reacts during the
      // dwell: a step is never just one instant transition.
      expect(stepDuration(index)).toBe(stepTravelMs(index) + STEP_DWELL_MS);
      expect(stepDuration(index)).toBeGreaterThan(STEP_TRAVEL_MS);
    }
  });

  it("travels the longer branch diagonal more slowly", () => {
    expect(stepTravelMs(2)).toBeGreaterThan(STEP_TRAVEL_MS);
  });
});

describe("arrivedStep (the arrival lands when the travel ends)", () => {
  it("only lights the destination node once the packet has arrived", () => {
    // Travel in progress: the run is still on its way, so nothing has landed.
    expect(arrivedStep(0, false)).toBe(0);
    // Travel finished: validar is reached and reacts during the dwell.
    expect(arrivedStep(0, true)).toBe(1);
    expect(arrivedStep(1, false)).toBe(1);
    expect(arrivedStep(3, true)).toBe(RUN_STEPS);
  });
});

describe("subNodesRevealed (validation inputs)", () => {
  it("appears with the Validar datos step, not after it", () => {
    expect(VALIDATION_REVEAL_INDEX).toBe(1);
    // Before the first travel ends the run has not reached validation yet.
    expect(subNodesRevealed(arrivedStep(0, false))).toBe(false);
    // The moment it lands on Validar datos, its inputs are already there.
    expect(subNodesRevealed(arrivedStep(0, true))).toBe(true);
    expect(subNodesRevealed(RUN_STEPS)).toBe(true);
  });
});

describe("PanelAutomation", () => {
  it("keeps narrow header text readable and compact content top-anchored", () => {
    const html = renderToStaticMarkup(<PanelAutomation />);
    const title = html.match(/<h2 class="([^"]+)">Flujo automatizado<\/h2>/)?.[1];
    expect(title).toContain("leading-5");
    expect(title).not.toContain("truncate");
    expect(html).toMatch(/<span class="[^"]*shrink-0[^\"]*whitespace-nowrap[^\"]*">/);
    expect(html).toContain("flex-1 items-start justify-center");
    expect(html).toContain("@[1040px]:self-center");
  });

  it("preserves the complete request ID in concise desktop subtitles", () => {
    const html = renderToStaticMarkup(<PanelAutomation />);
    for (const subtitle of ["Web · SOL-024", "BD · SOL-024", "Aviso · SOL-024"]) {
      expect(html).toContain(`>${subtitle}</span>`);
    }
  });

  it("uses a neutral result until the whole request is completed", () => {
    for (const index of [0, 3]) {
      timeline.loop = { index, cycle: 0 };
      try {
        const html = renderToStaticMarkup(<PanelAutomation />);
        expect(html).toContain('data-result-state="pending"');
        expect(html).toMatch(/data-result-state="pending" class="[^"]*border-border/);
        expect(html).not.toMatch(/data-result-state="pending" class="[^"]*border-brand-green/);
        expect(html).toMatch(/class="[^"]*text-muted-foreground">(?:Esperando registro y aviso|Registro SOL-024 guardado)<\/p>/);
      } finally {
        timeline.loop = null;
      }
    }
    expect(renderToStaticMarkup(<PanelAutomation />)).toContain('data-result-state="done"');
  });

  it("traces the fictional request into its record and team receipt", () => {
    const html = renderToStaticMarkup(<PanelAutomation />);
    expect(html).toContain("SOL-024 · Inspección de equipo");
    expect(html).toContain("Registro SOL-024 guardado");
    expect(html).toContain("Equipo de mantenimiento · SOL-024");
    expect(html).toContain("Finalizado");
    expect(html).not.toContain("En ejecución");
    expect(html).toContain("Faltan datos → revisión manual");
  });

  it("drives compact active and completed steps from the desktop run", () => {
    timeline.loop = { index: 2, cycle: 0 };
    try {
      const html = renderToStaticMarkup(<PanelAutomation />);
      expect(html).toContain('data-compact-step="validar" data-state="done"');
      expect(html).toContain('data-compact-step="condicion" data-state="running"');
      expect(html).toContain('data-compact-step="guardar" data-state="pending"');
      expect(html).toContain("En ejecución");
      expect(html).toContain("Esperando registro y aviso");
      expect(html).not.toContain("Registro SOL-024 guardado");
      expect(html).toContain('data-edge="e3" data-state="running"');
    } finally {
      timeline.loop = null;
    }
  });

  it("starts at intake without prematurely publishing a successful result", () => {
    timeline.loop = { index: 0, cycle: 1 };
    try {
      const html = renderToStaticMarkup(<PanelAutomation />);
      expect(html).toContain('data-compact-step="trigger" data-state="running"');
      expect(html).toContain('data-compact-step="notificar" data-state="pending"');
      expect(html).toContain("Origen de datos · Equipo EQ-07");
      expect(html).toContain("Plantilla · Inspección técnica");
      expect(html).toContain("Pendiente de evaluación");
      expect(html).toContain("No se guarda ni se envía el aviso.");
      expect(html).not.toContain("Registro SOL-024 guardado");
      expect(html).not.toContain("Equipo de mantenimiento · SOL-024");
    } finally {
      timeline.loop = null;
    }
  });

  it("keeps reduced motion finished even if a loop frame is available", () => {
    timeline.reduced = true;
    timeline.loop = { index: 0, cycle: 0 };
    try {
      const html = renderToStaticMarkup(<PanelAutomation />);
      expect(html).toContain("Finalizado");
      expect(html).toContain('data-compact-step="notificar" data-state="done"');
      expect(html).toContain('data-edge="e5" data-state="done"');
      expect(html).not.toContain("animate-ping");
    } finally {
      timeline.reduced = false;
      timeline.loop = null;
    }
  });
  it("presents the same ordered process and branch outcomes in compact and desktop views", () => {
    const html = renderToStaticMarkup(<PanelAutomation />);
    for (const label of [
      "Cuando llega una solicitud", "Validar datos", "Condición",
      "Origen de datos", "Plantilla", "Guardar registro",
      "Notificar al equipo", "Solicitar revisión",
    ]) {
      expect(html.split(label).length - 1).toBe(2);
    }
    // The branch wording lives where each layout needs it: the compact list
    // spells the outcomes out, the canvas uses the flow-chart Sí/No diamond.
    expect(html.split("Aprobado").length - 1).toBe(1);
    expect(html.split("Rechazado").length - 1).toBe(1);
    expect(html.split(">Sí<").length - 1).toBe(1);
    expect(html.split(">No<").length - 1).toBe(1);

    expect(html).toContain("@[1040px]:hidden");
    expect(html).toContain("@[1040px]:block");
    expect(html).toContain('viewBox="0 0 1040 470"');
  });

  it("renders the fully-executed frame: run segments done, rejected branch idle", () => {
    const html = renderToStaticMarkup(<PanelAutomation />);
    // Static markup has no running loop, so it shows the finished picture
    // (same convention as the other diagrams) — legible in a screenshot.
    expect(html).toContain('data-edge="e1" data-state="done"');
    expect(html).toContain('data-edge="e2" data-state="done"');
    expect(html).toContain('data-edge="e3" data-state="done"');
    expect(html).toContain('data-edge="e5" data-state="done"');
    // The not-taken branch is a visible alternative, never traversed.
    expect(html).toContain('data-edge="e4" data-state="idle"');
  });

  it("expresses the branches as flow-chart Sí/No diamonds on the wires", () => {
    const html = renderToStaticMarkup(<PanelAutomation />);
    expect(html).toContain('data-branch-marker="si"');
    expect(html).toContain('data-branch-marker="no"');
    // The old pills sat inside the Condición card; nothing renders them now.
    expect(html).not.toContain("data-branch-output");
    // The old floating labels sat at absolute left 592 — no longer rendered.
    expect(html).not.toContain("592");
  });

  it("keeps both branch diamonds opaque above their wires in pending and completed states", () => {
    for (const loop of [{ index: 0, cycle: 0 }, null]) {
      timeline.loop = loop;
      try {
        const html = renderToStaticMarkup(<PanelAutomation />);
        for (const id of ["si", "no"]) {
          const marker = html.match(new RegExp(`data-branch-marker="${id}"[^>]*>(<span[^>]*>)`));
          expect(marker?.[1]).toMatch(/\bbg-background\b/);
          expect(marker?.[1]).not.toContain("bg-brand-green/10");
        }
      } finally {
        timeline.loop = null;
      }
    }
  });

  it("never renders a dashed connector without its sub-node card", () => {
    const html = renderToStaticMarkup(<PanelAutomation />);
    // Final frame: both validation inputs and both dashed wires are present,
    // and their counts match, so an orphaned dashed tail cannot slip through.
    const dashed = (html.match(/stroke-dasharray="5 6"/g) ?? []).length;
    const cards = (html.match(/data-subnode=/g) ?? []).length;
    expect(dashed).toBe(2);
    expect(cards).toBe(2);
    expect(dashed).toBe(cards);
  });
});
