import {
  Activity,
  Bell,
  Building2,
  Calculator,
  CalendarRange,
  Check,
  ChevronDown,
  ChevronRight,
  Clock,
  Columns3,
  DraftingCompass,
  FileText,
  Globe,
  LayoutDashboard,
  LifeBuoy,
  Moon,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

/* --------------------------------------------------------------------------
 * Nexo ERP — fictional bespoke ERP mockup (illustrative, no real names).
 * Modern admin shell: left nav with an expanded "Comercial" group, a top bar,
 * stat cards, and a requests data table. Brand blue for the primary action and
 * links; green as the single positive accent (approved states).
 * ------------------------------------------------------------------------ */

type NavItem = { label: string; icon: LucideIcon };

const COLLAPSED_GROUPS: NavItem[] = [
  { label: "Ingeniería", icon: DraftingCompass },
  { label: "Hispana", icon: Globe },
  { label: "Evaluación y Costos", icon: Calculator },
  { label: "Planificación", icon: CalendarRange },
  { label: "Calidad", icon: ShieldCheck },
];

const SINGLE_ITEMS: NavItem[] = [
  { label: "Notificaciones", icon: Bell },
  { label: "Soporte", icon: LifeBuoy },
];

const ADMIN_ITEMS: NavItem[] = [
  { label: "Registro de Actividad", icon: Activity },
  { label: "Clientes", icon: Building2 },
  { label: "Usuarios", icon: Users },
];

const COMERCIAL_SUB: { label: string; active?: boolean }[] = [
  { label: "Resumen" },
  { label: "Solicitudes Comerciales", active: true },
  { label: "Flujo de Solicitudes" },
  { label: "Solicitudes de Levantamiento" },
  { label: "Calendario de Visitas" },
];

type Status =
  | "Aprobado"
  | "Pendiente"
  | "Discrepancia"
  | "En Desarrollo"
  | "No creado";

type Row = {
  code: string;
  project: string;
  client: string;
  sc: Status;
  components: Status;
  projectStatus: Status;
  date: string;
  area: "MINERÍA" | "PLANTA";
};

// Client and project names are invented/generic to keep third parties confidential.
const ROWS: Row[] = [
  {
    code: "SC-7956",
    project: "Placas Concavex",
    client: "Minera Norte",
    sc: "Aprobado",
    components: "Aprobado",
    projectStatus: "En Desarrollo",
    date: "12-08-2026",
    area: "MINERÍA",
  },
  {
    code: "SC-7955",
    project: "Ducto de descarga",
    client: "Planta Andes",
    sc: "Pendiente",
    components: "No creado",
    projectStatus: "No creado",
    date: "15-08-2026",
    area: "PLANTA",
  },
  {
    code: "SC-7954",
    project: "Boquilla aspersora",
    client: "Industrias del Sur",
    sc: "Aprobado",
    components: "Discrepancia",
    projectStatus: "En Desarrollo",
    date: "09-08-2026",
    area: "PLANTA",
  },
  {
    code: "SC-7953",
    project: "Banda transportadora",
    client: "Cobre Región",
    sc: "Discrepancia",
    components: "Pendiente",
    projectStatus: "No creado",
    date: "22-08-2026",
    area: "MINERÍA",
  },
  {
    code: "SC-7952",
    project: "Revestimiento de molino",
    client: "Minera Altiplano",
    sc: "Aprobado",
    components: "Aprobado",
    projectStatus: "Aprobado",
    date: "05-08-2026",
    area: "MINERÍA",
  },
  {
    code: "SC-7951",
    project: "Tolva de alimentación",
    client: "Planta Pacífico",
    sc: "En Desarrollo",
    components: "En Desarrollo",
    projectStatus: "En Desarrollo",
    date: "18-08-2026",
    area: "PLANTA",
  },
  {
    code: "SC-7950",
    project: "Ciclón hidráulico",
    client: "Metalúrgica Centro",
    sc: "Pendiente",
    components: "No creado",
    projectStatus: "No creado",
    date: "27-08-2026",
    area: "PLANTA",
  },
  {
    code: "SC-7949",
    project: "Estructura de soporte",
    client: "Minera Norte",
    sc: "Aprobado",
    components: "Aprobado",
    projectStatus: "En Desarrollo",
    date: "11-08-2026",
    area: "MINERÍA",
  },
  {
    code: "SC-7948",
    project: "Chute de traspaso",
    client: "Áridos del Valle",
    sc: "Discrepancia",
    components: "Discrepancia",
    projectStatus: "No creado",
    date: "30-08-2026",
    area: "PLANTA",
  },
  {
    code: "SC-7947",
    project: "Parrilla vibratoria",
    client: "Cobre Región",
    sc: "Aprobado",
    components: "Pendiente",
    projectStatus: "En Desarrollo",
    date: "03-09-2026",
    area: "MINERÍA",
  },
];

type Stat = {
  value: string;
  label: string;
  sub: string;
  icon: LucideIcon;
  tint: string;
};

const STATS: Stat[] = [
  {
    value: "2.945",
    label: "Total Solicitudes",
    sub: "Total de solicitudes creadas",
    icon: FileText,
    tint: "bg-primary/10 text-primary",
  },
  {
    value: "2.928",
    label: "Aprobadas",
    sub: "Solicitudes aprobadas",
    icon: Check,
    tint: "bg-brand-green/15 text-brand-green",
  },
  {
    value: "8",
    label: "Pendientes",
    sub: "Esperando revisión",
    icon: Clock,
    tint: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
];

function StatusBadge({ status }: { status: Status }): ReactNode {
  // "No creado" is rendered as plain text, not a pill (matches the reference).
  if (status === "No creado") {
    return <span className="text-[11px] text-muted-foreground/60">No creado</span>;
  }

  const styles: Record<Exclude<Status, "No creado">, { pill: string; dot: string }> =
    {
      Aprobado: {
        pill: "bg-brand-green/12 text-brand-green-foreground",
        dot: "bg-brand-green",
      },
      Pendiente: {
        pill: "bg-muted text-muted-foreground",
        dot: "bg-muted-foreground/50",
      },
      Discrepancia: {
        pill: "bg-primary/10 text-primary",
        dot: "bg-primary",
      },
      "En Desarrollo": {
        pill: "bg-amber-500/12 text-amber-600 dark:text-amber-400",
        dot: "bg-amber-500",
      },
    };
  const s = styles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-medium whitespace-nowrap ${s.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}

function NavRow({
  icon: Icon,
  label,
  trailing,
}: {
  icon: LucideIcon;
  label: string;
  trailing?: ReactNode;
}): ReactNode {
  return (
    <span className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12.5px] text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground">
      <Icon className="h-[15px] w-[15px] shrink-0" strokeWidth={1.75} aria-hidden="true" />
      <span className="truncate">{label}</span>
      {trailing ? <span className="ml-auto">{trailing}</span> : null}
    </span>
  );
}

function Sidebar(): ReactNode {
  return (
    <aside className="hidden w-[230px] shrink-0 flex-col border-r border-border/60 bg-muted/20 lg:flex">
      {/* Brand */}
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border/60 px-4">
        <span
          className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-[12px] font-bold text-primary-foreground"
          aria-hidden="true"
        >
          N
        </span>
        <span className="text-[15px] font-semibold tracking-tight">Nexo ERP</span>
      </div>

      {/* Search */}
      <div className="shrink-0 px-3 pt-3">
        <div className="flex h-8 items-center gap-2 rounded-md border border-border/60 bg-background px-2.5 text-muted-foreground">
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-xs">Buscar</span>
          <kbd className="ml-auto rounded border border-border/60 bg-muted/60 px-1 text-[10px] font-medium">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden p-3">
        <p className="px-2 pb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
          Menú
        </p>
        <NavRow icon={LayoutDashboard} label="Dashboard Gerencia" />

        {/* Comercial — expanded/active group */}
        <span className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[12.5px] font-medium text-foreground">
          <Building2 className="h-[15px] w-[15px] shrink-0" strokeWidth={1.75} aria-hidden="true" />
          Comercial
          <ChevronDown className="ml-auto h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
        </span>
        <span className="ml-[18px] flex flex-col gap-0.5 border-l border-border/60 pl-2.5">
          {COMERCIAL_SUB.map((sub) => (
            <span
              key={sub.label}
              className={`truncate rounded-md px-2.5 py-1.5 text-[12px] transition-colors ${
                sub.active
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {sub.label}
            </span>
          ))}
        </span>

        {COLLAPSED_GROUPS.map((g) => (
          <NavRow
            key={g.label}
            icon={g.icon}
            label={g.label}
            trailing={
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden="true" />
            }
          />
        ))}

        {SINGLE_ITEMS.map((item) => (
          <NavRow key={item.label} icon={item.icon} label={item.label} />
        ))}

        <p className="px-2 pb-1 pt-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
          Administración
        </p>
        {ADMIN_ITEMS.map((item) => (
          <NavRow key={item.label} icon={item.icon} label={item.label} />
        ))}
      </nav>

      {/* User chip */}
      <div className="shrink-0 border-t border-border/60 p-3">
        <div className="flex items-center gap-2.5 rounded-md px-1 py-1">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
            AD
          </span>
          <span className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-[12px] font-medium">Admin</span>
            <span className="truncate text-[10.5px] text-muted-foreground">
              admin@nexoerp.app
            </span>
          </span>
        </div>
      </div>
    </aside>
  );
}

function Topbar(): ReactNode {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/60 px-4 sm:px-5">
      <div className="flex min-w-0 items-center gap-1.5 text-[12.5px]">
        <span className="text-muted-foreground">Dashboard</span>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" aria-hidden="true" />
        <span className="truncate font-medium">Solicitudes Comerciales</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden h-8 w-48 items-center gap-2 rounded-md border border-border/60 bg-muted/40 px-2.5 text-muted-foreground md:flex">
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-xs">Buscar</span>
          <kbd className="ml-auto rounded border border-border/60 bg-background px-1 text-[10px] font-medium">
            ⌘K
          </kbd>
        </div>
        <span className="grid h-8 w-8 place-items-center rounded-md border border-border/60 text-muted-foreground">
          <Bell className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="grid h-8 w-8 place-items-center rounded-md border border-border/60 text-muted-foreground">
          <Moon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

function StatCard({ stat }: { stat: Stat }): ReactNode {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background p-4">
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-2xl font-semibold leading-none tracking-tight tabular-nums">
          {stat.value}
        </span>
        <span className="text-[13px] font-medium">{stat.label}</span>
        <span className="truncate text-[11px] text-muted-foreground">
          {stat.sub}
        </span>
      </div>
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${stat.tint}`}
      >
        <stat.icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      </span>
    </div>
  );
}

function RequestsTable(): ReactNode {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border/60 bg-background">
      {/* Toolbar */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border/60 p-3">
        <h3 className="mr-auto text-[13px] font-semibold tracking-tight">
          Listado de Solicitudes
        </h3>
        <div className="flex h-8 w-full max-w-[280px] items-center gap-2 rounded-md border border-border/60 bg-muted/30 px-2.5 text-muted-foreground sm:w-64">
          <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate text-xs">
            Buscar por código, proyecto, cliente…
          </span>
        </div>
        <span className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border/60 px-2.5 text-xs font-medium text-muted-foreground">
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          Filtros
        </span>
        <span className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border/60 px-2.5 text-xs font-medium text-muted-foreground">
          <Columns3 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          Columnas
        </span>
      </div>

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-hidden">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col className="w-[9%]" />
            <col className="w-[16%]" />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[14%]" />
            <col className="w-[13%]" />
            <col className="w-[11%]" />
            <col className="w-[8%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2.5 font-medium">Código SC</th>
              <th className="px-2 py-2.5 font-medium">Nombre del Proyecto</th>
              <th className="px-2 py-2.5 font-medium">Cliente</th>
              <th className="px-2 py-2.5 font-medium">Estado SC</th>
              <th className="px-2 py-2.5 font-medium">Estado Componentes</th>
              <th className="px-2 py-2.5 font-medium">Estado del Proyecto</th>
              <th className="px-2 py-2.5 font-medium">Fecha de Entrega</th>
              <th className="px-2 py-2.5 font-medium">Área</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {ROWS.map((r) => (
              <tr
                key={r.code}
                className="text-[12px] transition-colors hover:bg-muted/40"
              >
                <td className="truncate px-3 py-2.5 font-medium text-primary">
                  {r.code}
                </td>
                <td className="truncate px-2 py-2.5">{r.project}</td>
                <td className="truncate px-2 py-2.5 text-muted-foreground">
                  {r.client}
                </td>
                <td className="px-2 py-2.5">
                  <StatusBadge status={r.sc} />
                </td>
                <td className="px-2 py-2.5">
                  <StatusBadge status={r.components} />
                </td>
                <td className="px-2 py-2.5">
                  <StatusBadge status={r.projectStatus} />
                </td>
                <td className="truncate px-2 py-2.5 tabular-nums text-muted-foreground">
                  {r.date}
                </td>
                <td className="px-2 py-2.5">
                  <span className="text-[10px] font-medium tracking-wide text-muted-foreground">
                    {r.area}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / pagination */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border/60 px-3 py-2.5 text-[11px] text-muted-foreground">
        <span>Filas por página: 10</span>
        <div className="flex items-center gap-2">
          <span className="tabular-nums">1 - 10 de 2.945</span>
          <div className="flex items-center gap-0.5">
            <span className="grid h-6 w-6 place-items-center rounded border border-border/60">
              <ChevronRight className="h-3 w-3 rotate-180" aria-hidden="true" />
            </span>
            <span className="grid h-6 w-6 place-items-center rounded bg-primary text-[11px] font-medium text-primary-foreground">
              1
            </span>
            {["2", "3", "4", "5"].map((p) => (
              <span
                key={p}
                className="grid h-6 w-6 place-items-center rounded hover:bg-muted/60"
              >
                {p}
              </span>
            ))}
            <span className="px-0.5">…</span>
            <span className="grid h-6 w-6 place-items-center rounded border border-border/60">
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PanelWeb(): ReactNode {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <Sidebar />

      <section className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="flex min-h-0 flex-1 flex-col gap-4 p-4 sm:p-5">
          {/* Page heading */}
          <div className="flex shrink-0 flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-1">
              <h1 className="text-xl font-bold tracking-tight">
                Solicitudes Comerciales
              </h1>
              <p className="text-[13px] text-muted-foreground">
                Gestiona y revisa las solicitudes de nuevos proyectos.
              </p>
            </div>
            <span className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3.5 text-[13px] font-medium text-primary-foreground transition-opacity hover:opacity-90">
              <Plus className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
              Nueva Solicitud
            </span>
          </div>

          {/* Stat cards */}
          <div className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-3">
            {STATS.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>

          {/* Requests table */}
          <RequestsTable />
        </main>
      </section>
    </div>
  );
}
