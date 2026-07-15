// ============================================================
//  PTPInsightsPanel.tsx
//  SAP Purchase-to-Pay (PTP) Insights Dashboard
//  Surfaces key PTP fields from:
//    EBAN (Purchase Requisitions), EKKO/EKPO (PO Headers/Items),
//    EKBE (PO History - GR/IR), EKET (Delivery Schedules),
//    EKKN (Account Assignment), EORD (Source List),
//    EKAB (Contract Releases), MVER (Material Consumption),
//    MBEWH (Valuation History), EINA/EINE (Info Records)
// ============================================================

import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ClipboardList,
  BarChart3,
  Users,
  Package,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

// ─── Types aligned with the SAP PTP table field structures ───────────────────

interface PTPSummary {
  industry: string;
  // EBAN — Purchase Requisition summary
  prStats: {
    totalPRs: number;
    openPRs: number;
    convertedPRs: number;       // BANPR = 'B' (PO created)
    avgRequisitionQty: number;
    avgValuationPrice: number;
  };
  // EKKO/EKPO — PO summary
  poStats: {
    totalPOs: number;
    activeContracts: number;    // BSTYP = 'K'
    schedulingAgreements: number; // BSTYP = 'L'
    avgNetPrice: number;
    totalNetValue: number;
    topPaymentTerms: string[];  // ZTERM
    topIncoterms: string[];     // INCO1
  };
  // EKBE — GR/IR history
  grirStats: {
    totalGRLines: number;
    totalIRLines: number;
    totalGRValue: number;
    totalIRValue: number;
    pendingInvoices: number;
  };
  // EKET — Delivery schedule adherence
  deliveryStats: {
    totalScheduleLines: number;
    fullyDelivered: number;
    partiallyDelivered: number;
    openScheduleLines: number;
    avgDeliveryRate: number;    // WEMNG / MENGE %
  };
  // EORD — Source list
  sourceListStats: {
    totalSources: number;
    fixedSources: number;       // FIXKZ = 'X'
    multiSourced: number;       // material has > 1 approved vendor
  };
  // MVER — Material consumption
  consumptionStats: {
    avgMonthlyIssues: number;
    totalActualConsumption: number;
    highConsumptionMaterials: number;
  };
  // EKAB — Contract releases
  contractStats: {
    totalReleases: number;
    avgReleaseQty: number;
  };
}

interface PTPRecord {
  [key: string]: string | number | boolean | null;
}

type PTPTableKey =
  | "EBAN" | "EKKO" | "EKPO" | "EKBE" | "EKET"
  | "EKKN" | "EORD" | "EKAB" | "MVER" | "MBEWH" | "EINA" | "EINE";

interface TableMeta {
  key: PTPTableKey;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  primaryFields: string[];  // fields to show as columns in the table
}

const PTP_TABLES: TableMeta[] = [
  {
    key: "EBAN",
    label: "Purchase Requisitions",
    description: "EBAN — ME51N/ME52N. Tracks internal buying requests before PO creation.",
    icon: <ClipboardList className="w-4 h-4" />,
    color: "indigo",
    primaryFields: ["BANFN", "MATNR", "WERKS", "MENGE", "MEINS", "PREIS", "WAERS", "LIFNR", "EKGRP", "BANPR", "BADAT"],
  },
  {
    key: "EKKO",
    label: "PO Headers",
    description: "EKKO — Purchasing Document Header for PO (NB), Contract (MK/WK), Scheduling Agreement (LP), RFQ (AN).",
    icon: <FileText className="w-4 h-4" />,
    color: "blue",
    primaryFields: ["EBELN", "BSTYP", "BSART", "LIFNR", "EKORG", "EKGRP", "WAERS", "BEDAT", "ZTERM", "INCO1", "KTWRT"],
  },
  {
    key: "EKPO",
    label: "PO Line Items",
    description: "EKPO — Purchasing Document Item with material, qty, price, and GR indicators.",
    icon: <Package className="w-4 h-4" />,
    color: "blue",
    primaryFields: ["EBELN", "EBELP", "MATNR", "TXZ01", "WERKS", "MENGE", "MEINS", "NETPR", "NETWR", "WEBRE", "ELIKZ"],
  },
  {
    key: "EKBE",
    label: "PO History (GR/IR)",
    description: "EKBE — Tracks every goods receipt (mvt 101), invoice receipt, and return against a PO.",
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "emerald",
    primaryFields: ["EBELN", "EBELP", "VGABE", "BWART", "BUDAT", "MENGE", "MEINS", "DMBTR", "WAERS", "SHKZG", "MATNR"],
  },
  {
    key: "EKET",
    label: "Delivery Schedule Lines",
    description: "EKET — Scheduled vs. received quantities per PO line, critical for on-time delivery tracking.",
    icon: <Truck className="w-4 h-4" />,
    color: "amber",
    primaryFields: ["EBELN", "EBELP", "ETENR", "EINDT", "MENGE", "WEMNG", "REMNG", "MEINS", "REPOS"],
  },
  {
    key: "EKKN",
    label: "PO Account Assignment",
    description: "EKKN — Cost centre, order, or project assigned to a PO item for financial controlling.",
    icon: <BarChart3 className="w-4 h-4" />,
    color: "purple",
    primaryFields: ["EBELN", "EBELP", "ZEKKN", "KNTTP", "SAKTO", "KOSTL", "PRCTR", "AUFNR", "VPROZ"],
  },
  {
    key: "EORD",
    label: "Source List",
    description: "EORD — Approved vendor list per material/plant. Controls automatic source determination.",
    icon: <Users className="w-4 h-4" />,
    color: "teal",
    primaryFields: ["MATNR", "WERKS", "LIFNR", "EKORG", "DATAB", "DATED", "FIXKZ", "EBELN", "FLIFNR"],
  },
  {
    key: "EKAB",
    label: "Contract Releases",
    description: "EKAB — Call-off releases against outline agreements (contracts/scheduling agreements).",
    icon: <ArrowRight className="w-4 h-4" />,
    color: "orange",
    primaryFields: ["EBELN", "EBELP", "ABRUF", "ABRDT", "ABRMG", "ABRME", "EBELN2", "ABLAD"],
  },
  {
    key: "MVER",
    label: "Material Consumption",
    description: "MVER — Actual material issues/withdrawals by period. Used for forecast and reorder analysis.",
    icon: <TrendingUp className="w-4 h-4" />,
    color: "rose",
    primaryFields: ["MATNR", "WERKS", "LFGJA", "LFMON", "GISSM", "VBSM", "ENMNG", "BWGME", "VBEW1", "VBEW2"],
  },
  {
    key: "MBEWH",
    label: "Valuation History",
    description: "MBEWH — Historical material prices (MAP/Standard) by period. Enables price trend analysis.",
    icon: <BarChart3 className="w-4 h-4" />,
    color: "slate",
    primaryFields: ["MATNR", "BWKEY", "LFGJA", "LFMON", "BKLAS", "VPRSV", "VERPR", "STPRS", "LBKUM", "SALK3", "WAERS"],
  },
  {
    key: "EINA",
    label: "Info Records (General)",
    description: "EINA — Purchasing info record linking vendor + material. Base for automatic price proposals.",
    icon: <FileText className="w-4 h-4" />,
    color: "violet",
    primaryFields: ["INFNR", "MATNR", "LIFNR", "MATKL", "MEINS", "ERDAT", "LOEKZ", "IDNLF"],
  },
  {
    key: "EINE",
    label: "Info Records (Price)",
    description: "EINE — Price and delivery time per purchasing org. Drives net price proposals in PO.",
    icon: <FileText className="w-4 h-4" />,
    color: "violet",
    primaryFields: ["INFNR", "EKORG", "WERKS", "NETPR", "PEINH", "EFFPR", "APLFZ", "MINBM", "WAERS", "LOEKZ"],
  },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", badge: "bg-indigo-100 text-indigo-700" },
  blue:   { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-200",   badge: "bg-blue-100 text-blue-700" },
  emerald:{ bg: "bg-emerald-50",text: "text-emerald-700",border: "border-emerald-200",badge: "bg-emerald-100 text-emerald-700" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-200",  badge: "bg-amber-100 text-amber-700" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", badge: "bg-purple-100 text-purple-700" },
  teal:   { bg: "bg-teal-50",   text: "text-teal-700",   border: "border-teal-200",   badge: "bg-teal-100 text-teal-700" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", badge: "bg-orange-100 text-orange-700" },
  rose:   { bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-200",   badge: "bg-rose-100 text-rose-700" },
  slate:  { bg: "bg-slate-50",  text: "text-slate-700",  border: "border-slate-200",  badge: "bg-slate-100 text-slate-600" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", badge: "bg-violet-100 text-violet-700" },
};

interface Props {
  activeIndustry: string;
}

export default function PTPInsightsPanel({ activeIndustry }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTable, setActiveTable] = useState<PTPTableKey>("EBAN");
  const [records, setRecords] = useState<PTPRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  // EBAN-derived summary computed from the scenario data endpoint
  const [prSummary, setPRSummary] = useState<{
    total: number; open: number; converted: number;
  } | null>(null);

  const activeMeta = PTP_TABLES.find(t => t.key === activeTable)!;
  const colors = COLOR_MAP[activeMeta.color] ?? COLOR_MAP.slate;

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError(null);
    setPage(0);
    try {
      // Try scenario endpoint first (EBAN, EKET, EKBE, EKKN, EORD, EKAB, MVER)
      const scenarioKey = tableToScenarioEndpoint(activeTable);
      if (scenarioKey) {
        const res = await fetch(`/api/scenarios/${scenarioKey}`);
        if (res.ok) {
          const data = await res.json();
          setRecords(Array.isArray(data) ? data : []);
          if (activeTable === "EBAN") {
            const all = data as PTPRecord[];
            setPRSummary({
              total: all.length,
              open: all.filter(r => r.BANPR === "N" || r.BANPR === "A").length,
              converted: all.filter(r => r.BANPR === "B" || r.EBELN).length,
            });
          }
          return;
        }
      }

      // Fallback: SAP industry table endpoint
      const res = await fetch(
        `/api/industry/${activeIndustry}/data/${activeTable}?limit=200`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRecords(data.rows ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load records");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [activeTable, activeIndustry]);

  useEffect(() => {
    if (isOpen) loadRecords();
  }, [isOpen, loadRecords]);

  useEffect(() => {
    if (isOpen) loadRecords();
  }, [activeTable, activeIndustry]);

  const pageRecords = records.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(records.length / PAGE_SIZE);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden" id="ptp-insights-panel">
      {/* ── Header / Toggle ── */}
      <button
        onClick={() => setIsOpen(p => !p)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
        aria-expanded={isOpen}
        aria-label="Toggle SAP PTP Insights panel"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-800">SAP PTP Module Insights</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              12 PTP tables · EBAN → EKKO → EKPO → EKET → EKBE · Info Records · Source List · Consumption
            </p>
          </div>
          {prSummary && (
            <div className="hidden md:flex items-center gap-2 ml-4">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {prSummary.total} PRs
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                {prSummary.open} Open
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {prSummary.converted} Converted
              </span>
            </div>
          )}
        </div>
        {isOpen
          ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
      </button>

      {/* ── Expanded Content ── */}
      {isOpen && (
        <div className="border-t border-slate-200">

          {/* ── PTP Flow Banner ── */}
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono font-semibold text-slate-500">
              {["PR (EBAN)", "→", "PO (EKKO/EKPO)", "→", "Schedule (EKET)", "→", "GR/IR (EKBE)", "→", "Invoice", "→", "Payment"].map((step, i) => (
                <span key={i} className={step === "→" ? "text-slate-300" : "px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600"}>
                  {step}
                </span>
              ))}
            </div>
          </div>

          {/* ── Table Selector Tabs ── */}
          <div className="flex overflow-x-auto border-b border-slate-200 bg-white">
            {PTP_TABLES.map(t => {
              const c = COLOR_MAP[t.color] ?? COLOR_MAP.slate;
              const isActive = activeTable === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTable(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-[10px] font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer flex-shrink-0 ${
                    isActive
                      ? `border-current ${c.text} ${c.bg}`
                      : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                  title={t.description}
                >
                  {t.icon}
                  {t.key}
                </button>
              );
            })}
          </div>

          {/* ── Active Table Info + Data ── */}
          <div className="px-5 py-4 space-y-4">

            {/* Description bar */}
            <div className={`rounded-lg border px-4 py-2.5 flex items-start gap-3 ${colors.bg} ${colors.border}`}>
              <div className={`mt-0.5 ${colors.text}`}>{activeMeta.icon}</div>
              <div>
                <p className={`text-xs font-bold ${colors.text}`}>{activeMeta.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{activeMeta.description}</p>
              </div>
              <button
                onClick={loadRecords}
                className="ml-auto shrink-0 p-1.5 hover:bg-white/60 rounded-lg transition-colors cursor-pointer"
                title="Refresh data"
                aria-label="Refresh table data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${colors.text} ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>

            {/* Key field legend */}
            <div className="flex flex-wrap gap-1.5">
              {activeMeta.primaryFields.map(f => (
                <span key={f} className="text-[9px] font-mono px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600">
                  {f}
                </span>
              ))}
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-10 gap-3 text-slate-500">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading {activeMeta.key} data…</span>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
                <button onClick={loadRecords} className="ml-auto text-xs underline cursor-pointer">Retry</button>
              </div>
            )}

            {/* Data Table */}
            {!loading && !error && records.length > 0 && (
              <>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="font-mono">{records.length} records · showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, records.length)}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setPage(p => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                      aria-label="Previous page"
                    >‹</button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                      className="px-2 py-1 rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                      aria-label="Next page"
                    >›</button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs border-collapse">
                    <thead className={`${colors.bg} text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider`}>
                      <tr>
                        {activeMeta.primaryFields.map(f => (
                          <th key={f} className="px-3 py-2.5 text-left whitespace-nowrap">{f}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pageRecords.map((row, ri) => (
                        <tr key={ri} className="hover:bg-slate-50 transition-colors">
                          {activeMeta.primaryFields.map(f => {
                            const val = row[f];
                            const strVal = val === null || val === undefined ? "" : String(val);
                            const isKey = f.endsWith("NR") || f.endsWith("LN") || f.endsWith("FNFN") ||
                              ["EBELN", "BANFN", "INFNR", "MATNR", "LIFNR"].includes(f);
                            return (
                              <td
                                key={f}
                                className={`px-3 py-2 max-w-[140px] truncate ${isKey ? "font-mono font-semibold text-slate-700" : "text-slate-600"}`}
                                title={strVal}
                              >
                                {strVal.length > 18 ? strVal.substring(0, 18) + "…" : strVal || (
                                  <span className="text-slate-300 italic">—</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Empty state */}
            {!loading && !error && records.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-2">
                <Package className="w-8 h-8 opacity-40" />
                <p className="text-sm">No {activeMeta.key} records available for <strong>{activeIndustry}</strong>.</p>
                <p className="text-xs">Run <code className="font-mono text-slate-500">npx tsx scripts/seedIndustryData.ts</code> to regenerate industry data.</p>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

// Map SAP table names to scenario API endpoints where applicable
function tableToScenarioEndpoint(table: PTPTableKey): string | null {
  const map: Partial<Record<PTPTableKey, string>> = {
    EBAN:  "scenario-eban",      // not yet in scenario routes — falls back to industry API
    EKET:  "scheduling-agreement",
    EKBE:  "inbound-delivery",
    EKKN:  "outline-agreement",
    EKAB:  "outline-agreement",
  };
  return map[table] ?? null;
}
