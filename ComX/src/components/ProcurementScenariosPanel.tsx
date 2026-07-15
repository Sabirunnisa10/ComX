// ============================================================
//  ProcurementScenariosPanel.tsx
//  11-tab SAP MM/WM/IM procurement scenario management panel
//  Dynamic: driven entirely by SCENARIO_TABLES metadata
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import {
  ArrowLeftRight,
  Truck,
  PackageCheck,
  FileText,
  Calendar,
  Wrench,
  Package,
  Pipette,
  ArrowRightLeft,
  ClipboardList,
  MoveHorizontal,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  PlusCircle,
  AlertCircle,
} from "lucide-react";
import {
  SCENARIO_TABLES,
  type ScenarioTableMeta,
} from "../data/scenarioData";

// ── Tab icon mapping (order matches SCENARIO_TABLES order) ──────────────────
const TAB_ICONS: React.FC<{ className?: string }>[] = [
  ({ className }) => <ArrowLeftRight className={className} />,
  ({ className }) => <Truck className={className} />,
  ({ className }) => <PackageCheck className={className} />,
  ({ className }) => <FileText className={className} />,
  ({ className }) => <Calendar className={className} />,
  ({ className }) => <Wrench className={className} />,
  ({ className }) => <Package className={className} />,
  ({ className }) => <Pipette className={className} />,
  ({ className }) => <ArrowRightLeft className={className} />,
  ({ className }) => <ClipboardList className={className} />,
  ({ className }) => <MoveHorizontal className={className} />,
];

// ── Status option sets keyed by field name ───────────────────────────────────
const STATUS_OPTIONS: Record<string, string[]> = {
  STATUS: [
    "OPEN",
    "IN_TRANSIT",
    "DELIVERED",
    "CANCELLED",
    "ACTIVE",
    "EXPIRED",
    "BLOCKED",
    "COMPONENTS_SENT",
    "IN_PROCESS",
    "RECEIVED",
    "DELIVERY_CREATED",
    "GR_POSTED",
  ],
  GR_STATUS: ["PENDING", "PARTIAL", "COMPLETE", "CANCELLED"],
  POD_STATUS: ["PENDING", "IN_TRANSIT", "DELIVERED", "RETURNED"],
};

// ── Status badge colour mapping ──────────────────────────────────────────────
const STATUS_COLOURS: Record<string, string> = {
  OPEN: "bg-blue-100 text-blue-700",
  IN_TRANSIT: "bg-amber-100 text-amber-700",
  DELIVERED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-rose-100 text-rose-700",
  ACTIVE: "bg-emerald-100 text-emerald-700",
  EXPIRED: "bg-slate-100 text-slate-600",
  BLOCKED: "bg-rose-100 text-rose-700",
  COMPONENTS_SENT: "bg-violet-100 text-violet-700",
  IN_PROCESS: "bg-amber-100 text-amber-700",
  RECEIVED: "bg-emerald-100 text-emerald-700",
  PENDING: "bg-slate-100 text-slate-600",
  PARTIAL: "bg-amber-100 text-amber-700",
  COMPLETE: "bg-emerald-100 text-emerald-700",
  RETURNED: "bg-rose-100 text-rose-700",
  DELIVERY_CREATED: "bg-violet-100 text-violet-700",
  GR_POSTED: "bg-emerald-100 text-emerald-700",
};

// ── Helper: detect the status field name for a given scenario ────────────────
function detectStatusField(fields: string[]): string | null {
  for (const f of fields) {
    if (f in STATUS_OPTIONS) return f;
  }
  return null;
}

// ── Helper: resolve smart input type from field name ─────────────────────────
function inputTypeFor(field: string): "date" | "number" | "checkbox" | "text" {
  const upper = field.toUpperCase();
  if (upper.includes("DATE")) return "date";
  if (
    upper.includes("QUANTITY") ||
    upper.includes("QTY") ||
    upper.includes("PRICE") ||
    upper.includes("VALUE") ||
    upper.includes("DAYS") ||
    upper === "ITEM" ||
    upper === "YEAR" ||
    upper.includes("READING") ||
    upper.includes("HORIZON")
  )
    return "number";
  if (
    upper.includes("JIT_INDICATOR") ||
    upper.includes("ONE_STEP") ||
    upper.includes("RECOUNT") ||
    upper.includes("POSTED")
  )
    return "checkbox";
  return "text";
}

// ── Helper: build initial form state for a scenario ─────────────────────────
function buildInitialForm(
  fields: string[]
): Record<string, string | number | boolean> {
  const init: Record<string, string | number | boolean> = {};
  for (const f of fields) {
    if (f === "createdAt") continue;
    const t = inputTypeFor(f);
    if (t === "checkbox") init[f] = false;
    else if (t === "number") init[f] = 0;
    else if (f in STATUS_OPTIONS) init[f] = STATUS_OPTIONS[f][0];
    else init[f] = "";
  }
  return init;
}

// ── Helper: format cell value for display ───────────────────────────────────
function formatCell(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "✓" : "✗";
  const s = String(value);
  return s.length > 20 ? s.slice(0, 20) + "…" : s;
}

// ── Sub-component: status summary badges ─────────────────────────────────────
function StatusSummary({
  records,
  statusField,
}: {
  records: Record<string, unknown>[];
  statusField: string;
}) {
  const counts: Record<string, number> = {};
  for (const row of records) {
    const val = String(row[statusField] ?? "UNKNOWN");
    counts[val] = (counts[val] ?? 0) + 1;
  }
  if (Object.keys(counts).length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(counts).map(([status, count]) => (
        <span
          key={status}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
            STATUS_COLOURS[status] ?? "bg-slate-100 text-slate-600"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
          {status}
          <span className="ml-1 bg-white/60 rounded-full px-1.5 font-mono text-[10px]">
            {count}
          </span>
        </span>
      ))}
    </div>
  );
}

// ── Sub-component: inline status updater cell ────────────────────────────────
function StatusCell({
  rowKey,
  currentValue,
  statusField,
  endpoint,
  primaryKey,
  primaryValue,
  onUpdated,
}: {
  rowKey: string;
  currentValue: string;
  statusField: string;
  endpoint: string;
  primaryKey: string;
  primaryValue: string;
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const options = STATUS_OPTIONS[statusField] ?? [];

  const handleChange = async (next: string) => {
    setSaving(true);
    setOpen(false);
    try {
      await fetch(`${endpoint}/${encodeURIComponent(primaryValue)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [statusField]: next }),
      });
      onUpdated();
    } catch {
      // silently fail — list refresh will show truth
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative inline-block" key={rowKey}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={saving}
        className="flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {saving ? (
          <RefreshCw className="w-3 h-3 animate-spin text-indigo-400" />
        ) : (
          <>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                STATUS_COLOURS[currentValue] ?? "bg-slate-100 text-slate-600"
              }`}
            >
              {currentValue}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </>
        )}
      </button>

      {open && (
        <div className="absolute z-30 top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg min-w-[140px] py-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleChange(opt)}
              className={`w-full text-left px-3 py-1.5 text-[11px] font-semibold hover:bg-slate-50 transition-colors cursor-pointer ${
                opt === currentValue ? "text-indigo-600" : "text-slate-700"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Sub-component: Create New form ───────────────────────────────────────────
function CreateForm({
  meta,
  onCreated,
}: {
  meta: ScenarioTableMeta;
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Record<string, string | number | boolean>>(
    () => buildInitialForm(meta.fields)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when scenario changes
  useEffect(() => {
    setForm(buildInitialForm(meta.fields));
    setError(null);
    setOpen(false);
  }, [meta.key]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(meta.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || `HTTP ${res.status}`);
      }
      setOpen(false);
      setForm(buildInitialForm(meta.fields));
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create record");
    } finally {
      setSubmitting(false);
    }
  };

  const formFields = meta.fields.filter((f) => f !== "createdAt");

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-50 hover:bg-indigo-50/50 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <PlusCircle className="w-4 h-4 text-indigo-500" />
          Create New {meta.label}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="px-5 py-5 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {formFields.map((field) => {
              const isStatus = field in STATUS_OPTIONS;
              const inputType = inputTypeFor(field);
              const value = form[field];

              return (
                <div key={field} className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                    {field.replace(/_/g, " ")}
                  </label>

                  {isStatus ? (
                    <select
                      value={String(value)}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          [field]: e.target.value,
                        }))
                      }
                      className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                    >
                      {STATUS_OPTIONS[field].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : inputType === "checkbox" ? (
                    <div className="flex items-center gap-2 h-9">
                      <input
                        type="checkbox"
                        id={`form-${field}`}
                        checked={Boolean(value)}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            [field]: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400 cursor-pointer"
                      />
                      <label
                        htmlFor={`form-${field}`}
                        className="text-sm text-slate-700 cursor-pointer"
                      >
                        {Boolean(value) ? "Yes" : "No"}
                      </label>
                    </div>
                  ) : (
                    <input
                      type={inputType}
                      value={inputType === "number" ? Number(value) : String(value)}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          [field]:
                            inputType === "number"
                              ? parseFloat(e.target.value) || 0
                              : e.target.value,
                        }))
                      }
                      className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-4 py-2.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-60 cursor-pointer shadow-sm"
            >
              {submitting && (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              )}
              Create Record
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setError(null);
              }}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function ProcurementScenariosPanel() {
  const [scenarios, setScenarios] = useState<ScenarioTableMeta[]>(SCENARIO_TABLES);
  const [activeIndex, setActiveIndex] = useState(0);
  const [records, setRecords] = useState<Record<string, unknown>[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ── Bootstrap: try to get scenario list from /api/scenarios ──────────────
  useEffect(() => {
    fetch("/api/scenarios")
      .then((r) => {
        if (!r.ok) throw new Error("API unavailable");
        return r.json() as Promise<ScenarioTableMeta[]>;
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setScenarios(data);
      })
      .catch(() => {
        // Fall back to static import — already the default state
      });
  }, []);

  const activeMeta = scenarios[activeIndex] ?? scenarios[0];

  // ── Fetch records for the active tab ─────────────────────────────────────
  const loadRecords = useCallback(async () => {
    if (!activeMeta) return;
    setLoadingRecords(true);
    setFetchError(null);
    try {
      const res = await fetch(activeMeta.endpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRecords(Array.isArray(data) ? (data as Record<string, unknown>[]) : []);
    } catch (err) {
      setFetchError(
        err instanceof Error ? err.message : "Failed to load records"
      );
      setRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  }, [activeMeta]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const statusField = detectStatusField(activeMeta?.fields ?? []);
  const displayFields = activeMeta?.fields ?? [];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

      {/* ── Panel header ─────────────────────────────────────────────────── */}
      <div className="px-6 py-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 to-indigo-950">
        <h2 className="text-base font-bold text-white tracking-tight">
          SAP Procurement Scenarios
        </h2>
        <p className="text-[11px] text-indigo-300 mt-0.5">
          11 MM / WM / IM process simulation modules
        </p>
      </div>

      {/* ── Horizontal tab bar ───────────────────────────────────────────── */}
      <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 gap-0">
        {scenarios.map((s, i) => {
          const IconComp = TAB_ICONS[i] ?? TAB_ICONS[0];
          const isActive = i === activeIndex;
          return (
            <button
              key={s.key}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-3.5 text-[11px] font-semibold border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "border-indigo-600 text-indigo-700 bg-white"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-white/50"
              }`}
              title={s.label}
            >
              <IconComp className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="max-w-[120px] truncate">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Active tab body ──────────────────────────────────────────────── */}
      <div className="p-6 space-y-5">

        {/* Description banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs text-slate-600 leading-relaxed">
          <span className="font-bold text-slate-700 mr-2">
            {activeMeta.label}:
          </span>
          {activeMeta.description}
        </div>

        {/* ── Status summary widget ────────────────────────────────────── */}
        {statusField && records.length > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              Status Distribution
            </span>
            <StatusSummary records={records} statusField={statusField} />
          </div>
        )}

        {/* ── Records table ────────────────────────────────────────────── */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-600">
              {records.length} record{records.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={loadRecords}
              disabled={loadingRecords}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loadingRecords ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>

          {/* Loading state */}
          {loadingRecords && (
            <div className="flex items-center justify-center py-16 text-slate-400 gap-2 text-sm">
              <RefreshCw className="w-5 h-5 animate-spin" />
              Loading records…
            </div>
          )}

          {/* Error state */}
          {!loadingRecords && fetchError && (
            <div className="flex items-center justify-center py-12 gap-2 text-rose-600 text-sm">
              <AlertCircle className="w-5 h-5" />
              {fetchError}
            </div>
          )}

          {/* Empty state */}
          {!loadingRecords && !fetchError && records.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 gap-2">
              <Package className="w-8 h-8 opacity-30" />
              <p className="text-sm font-medium">No records found</p>
              <p className="text-xs">
                Use the form below to create the first entry.
              </p>
            </div>
          )}

          {/* Data table */}
          {!loadingRecords && !fetchError && records.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    {displayFields.map((f) => (
                      <th
                        key={f}
                        className="px-3 py-2.5 text-left font-mono font-bold text-slate-500 whitespace-nowrap"
                      >
                        {f.replace(/_/g, " ")}
                      </th>
                    ))}
                    {/* Status update column — only if there's a status field */}
                    {statusField && (
                      <th className="px-3 py-2.5 text-left font-mono font-bold text-slate-500 whitespace-nowrap">
                        UPDATE
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {records.map((row, rowIdx) => {
                    const pk = String(
                      row[activeMeta.primaryKey] ?? rowIdx
                    );
                    return (
                      <tr
                        key={pk}
                        className={
                          rowIdx % 2 === 0
                            ? "bg-white hover:bg-indigo-50/30 transition-colors"
                            : "bg-slate-50 hover:bg-indigo-50/30 transition-colors"
                        }
                      >
                        {displayFields.map((f) => (
                          <td
                            key={f}
                            className="px-3 py-2 text-slate-700 whitespace-nowrap border-b border-slate-100"
                            title={String(row[f] ?? "")}
                          >
                            {f === statusField ? (
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  STATUS_COLOURS[String(row[f] ?? "")] ??
                                  "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {String(row[f] ?? "—")}
                              </span>
                            ) : (
                              <span className="font-mono">
                                {formatCell(row[f])}
                              </span>
                            )}
                          </td>
                        ))}
                        {statusField && (
                          <td className="px-3 py-2 border-b border-slate-100">
                            <StatusCell
                              rowKey={pk}
                              currentValue={String(
                                row[statusField] ?? ""
                              )}
                              statusField={statusField}
                              endpoint={activeMeta.endpoint}
                              primaryKey={activeMeta.primaryKey}
                              primaryValue={pk}
                              onUpdated={loadRecords}
                            />
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Create New form ──────────────────────────────────────────── */}
        <CreateForm meta={activeMeta} onCreated={loadRecords} />
      </div>
    </div>
  );
}
