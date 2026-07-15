import React, { useState, useEffect, useCallback } from "react";
import { BPEvaluation, VendorScore, ContractDependency } from "../types";
import { ShieldAlert, ChevronDown, ChevronUp, RefreshCw, AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";

interface Props {
  industry: string;
  /** When true, panel starts in expanded state (used when mounted in dedicated tab). */
  expanded?: boolean;
}

const HHI_LABEL: Record<string, { bg: string; text: string; border: string }> = {
  Low:      { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  Moderate: { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200"   },
  High:     { bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200"  },
  Critical: { bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200"     },
};

const STATUS_LABEL: Record<string, { bg: string; text: string }> = {
  Preferred:  { bg: "bg-emerald-100", text: "text-emerald-700" },
  Approved:   { bg: "bg-blue-100",    text: "text-blue-700"    },
  Restricted: { bg: "bg-amber-100",   text: "text-amber-700"   },
  "At Risk":  { bg: "bg-red-100",     text: "text-red-700"     },
};

const CONTRACT_LABEL: Record<string, { bg: string; text: string }> = {
  "Scheduling Agreement": { bg: "bg-indigo-100",  text: "text-indigo-700"  },
  "Long-Term Contract":   { bg: "bg-blue-100",    text: "text-blue-700"    },
  "Framework OLA":        { bg: "bg-purple-100",  text: "text-purple-700"  },
  "Spot Purchase":        { bg: "bg-slate-100",   text: "text-slate-600"   },
};

const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

/** Thin horizontal bar showing a 0–10000 HHI value. */
function HHIBar({ hhi }: { hhi: number }) {
  const pct = Math.min((hhi / 10000) * 100, 100);
  const color = hhi <= 1500 ? "bg-emerald-500" : hhi <= 2500 ? "bg-amber-500" : hhi <= 5000 ? "bg-orange-500" : "bg-red-500";
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div className={`h-2 rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Score bar 0–100. */
function ScoreBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = value >= 75 ? "bg-emerald-500" : value >= 50 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-mono font-bold text-slate-600 w-8 text-right">{value}</span>
    </div>
  );
}

export default function BPEvaluationPanel({ industry, expanded = false }: Props) {
  const [isOpen, setIsOpen] = useState(expanded);
  const [data, setData] = useState<BPEvaluation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sort state for vendor scorecard table
  const [sortKey, setSortKey] = useState<keyof VendorScore>("compositeScore");
  const [sortAsc, setSortAsc] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bp-evaluation?industry=${industry}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: BPEvaluation = await res.json();
      setData(json);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load BP evaluation.");
    } finally {
      setLoading(false);
    }
  }, [industry]);

  // Fetch when panel opens or industry changes
  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen, fetchData]);

  // Re-fetch when industry changes even if already open
  useEffect(() => {
    if (isOpen && data && data.industry !== industry) fetchData();
  }, [industry]);

  const toggleSort = (key: keyof VendorScore) => {
    if (sortKey === key) setSortAsc((p) => !p);
    else { setSortKey(key); setSortAsc(false); }
  };

  const sortedVendors: VendorScore[] = data
    ? [...data.vendorScores].sort((a, b) => {
        const av = a[sortKey] as number | string;
        const bv = b[sortKey] as number | string;
        const cmp = typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv));
        return sortAsc ? cmp : -cmp;
      })
    : [];

  const SortIcon = ({ col }: { col: keyof VendorScore }) =>
    sortKey === col ? (
      sortAsc ? <ChevronUp className="w-3 h-3 inline ml-0.5" /> : <ChevronDown className="w-3 h-3 inline ml-0.5" />
    ) : null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden" id="bp-evaluation-panel">
      {/* ── Header / Toggle ── */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-slate-800">BP Vendor Evaluation</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              HHI concentration · vendor scoring · contract dependency · OLA analysis
            </p>
          </div>
          {data && (
            <div className="hidden md:flex items-center gap-2 ml-4">
              {data.kpis.atRiskVendors > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                  <AlertTriangle className="w-3 h-3" />
                  {data.kpis.atRiskVendors} At-Risk Vendor{data.kpis.atRiskVendors !== 1 ? "s" : ""}
                </span>
              )}
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${HHI_LABEL[data.vendorConcentration.level].bg} ${HHI_LABEL[data.vendorConcentration.level].text} ${HHI_LABEL[data.vendorConcentration.level].border}`}>
                HHI {data.vendorConcentration.hhi} · {data.vendorConcentration.level}
              </span>
            </div>
          )}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
      </button>

      {/* ── Expanded Content ── */}
      {isOpen && (
        <div className="border-t border-slate-200 px-5 py-5 space-y-6">

          {/* Loading / Error states */}
          {loading && (
            <div className="flex items-center justify-center py-12 gap-3 text-slate-500">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-sm">Computing vendor evaluation…</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {error}
              <button onClick={fetchData} className="ml-auto text-xs underline cursor-pointer">Retry</button>
            </div>
          )}

          {data && !loading && (
            <>
              {/* ── KPI Summary Row ── */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: "Total Vendors",         value: data.kpis.totalVendors,                     mono: false },
                  { label: "At-Risk Vendors",        value: data.kpis.atRiskVendors,                    mono: false, warn: data.kpis.atRiskVendors > 0 },
                  { label: "Over-Dependency",        value: data.kpis.overDependencyVendors,             mono: false, warn: data.kpis.overDependencyVendors > 0 },
                  { label: "Avg Vendor Score",       value: `${data.kpis.avgVendorScore}/100`,           mono: true  },
                  { label: "Top-3 Spend Share",      value: `${data.kpis.top3VendorSharePct}%`,          mono: true, warn: data.kpis.top3VendorSharePct > 60 },
                  { label: "Concentrated Contracts", value: data.kpis.concentratedContracts,             mono: false, warn: data.kpis.concentratedContracts > 0 },
                ].map(({ label, value, mono, warn }) => (
                  <div key={label} className={`rounded-lg border p-3 ${warn ? "bg-amber-50 border-amber-200" : "bg-slate-50 border-slate-200"}`}>
                    <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">{label}</p>
                    <p className={`text-lg font-bold mt-1 ${mono ? "font-mono" : ""} ${warn ? "text-amber-700" : "text-slate-800"}`}>{value}</p>
                  </div>
                ))}
              </div>

              {/* ── Concentration Risk Cards ── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[data.vendorConcentration, data.customerConcentration].map((c) => {
                  const style = HHI_LABEL[c.level];
                  return (
                    <div key={c.side} className={`rounded-xl border p-4 space-y-3 ${style.border} ${style.bg}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                            {c.side === "vendor" ? "Vendor" : "Supply-Region"} Concentration
                          </p>
                          <p className={`text-sm font-bold mt-0.5 ${style.text}`}>
                            HHI {c.hhi.toLocaleString()} — {c.level}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {c.totalEntities} entities · Top-3 share: <strong>{c.top3SharePct}%</strong>
                          </p>
                        </div>
                        <TrendingUp className={`w-6 h-6 ${style.text} opacity-60`} />
                      </div>
                      <HHIBar hhi={c.hhi} />
                      <div className="space-y-1 pt-1">
                        {c.topEntities.slice(0, 4).map((e) => (
                          <div key={e.name} className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-700 font-semibold truncate max-w-[55%]" title={e.name}>{e.name}</span>
                            <span className="text-slate-500 font-mono">{e.spendShare}% · {e.materialCount} mat.</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Vendor Scorecard Table ── */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Vendor Scorecard ({data.vendorScores.length} vendors)
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs border-collapse">
                    <thead className="bg-slate-50 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                      <tr>
                        {(
                          [
                            ["vendorName",          "Vendor"],
                            ["vendorCountry",       "Country"],
                            ["materialCount",       "Mat."],
                            ["totalSpend",          "Spend"],
                            ["onTimeDeliveryRate",  "On-Time%"],
                            ["underDeliveryRate",   "Under%"],
                            ["overDeliveryRate",    "Over%"],
                            ["compositeScore",      "Score"],
                            ["status",              "Status"],
                          ] as [keyof VendorScore, string][]
                        ).map(([key, label]) => (
                          <th
                            key={key}
                            className="px-3 py-2.5 text-left cursor-pointer hover:text-slate-700 whitespace-nowrap select-none"
                            onClick={() => toggleSort(key)}
                          >
                            {label}<SortIcon col={key} />
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedVendors.map((v) => {
                        const st = STATUS_LABEL[v.status] ?? { bg: "bg-slate-100", text: "text-slate-600" };
                        return (
                          <tr key={v.vendorName} className={`hover:bg-slate-50 transition-colors ${v.isOverDependency ? "bg-amber-50/40" : ""}`}>
                            <td className="px-3 py-2.5 font-semibold text-slate-800 max-w-[160px] truncate" title={v.vendorName}>
                              {v.vendorName}
                              {v.isOverDependency && <span className="ml-1 text-[9px] text-amber-600 font-bold">(over-dep)</span>}
                            </td>
                            <td className="px-3 py-2.5 text-slate-500">{v.vendorCountry}</td>
                            <td className="px-3 py-2.5 font-mono text-slate-700 text-center">{v.materialCount}</td>
                            <td className="px-3 py-2.5 font-mono text-slate-700 whitespace-nowrap">{formatUSD(v.totalSpend)}</td>
                            <td className="px-3 py-2.5">
                              <ScoreBar value={v.onTimeDeliveryRate} />
                            </td>
                            <td className="px-3 py-2.5 font-mono text-slate-500">{v.underDeliveryRate}%</td>
                            <td className="px-3 py-2.5 font-mono text-slate-500">{v.overDeliveryRate}%</td>
                            <td className="px-3 py-2.5">
                              <ScoreBar value={v.compositeScore} />
                            </td>
                            <td className="px-3 py-2.5">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap ${st.bg} ${st.text}`}>
                                {v.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Contract Dependency List ── */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Contract / OLA Dependencies — top 8
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.contractDependencies.slice(0, 8).map((cd: ContractDependency) => {
                    const cs = CONTRACT_LABEL[cd.contractType] ?? { bg: "bg-slate-100", text: "text-slate-600" };
                    return (
                      <div
                        key={cd.vendorName}
                        className={`rounded-xl border p-4 space-y-2 ${cd.isConcentrated ? "border-amber-300 bg-amber-50/30" : "border-slate-200"}`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 truncate" title={cd.vendorName}>{cd.vendorName}</p>
                            <p className="text-[10px] text-slate-500">{cd.vendorCountry}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${cs.bg} ${cs.text}`}>
                              {cd.contractType}
                            </span>
                            {cd.isConcentrated && (
                              <span className="flex items-center gap-0.5 text-[9px] text-amber-700 font-semibold">
                                <AlertTriangle className="w-3 h-3" /> Concentrated
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-600 font-semibold">{formatUSD(cd.annualValue)}</span>
                          <span className="text-slate-400">{cd.spendSharePct}% of spend</span>
                        </div>
                        <p className="text-[9px] text-slate-400 truncate" title={cd.materials.join(", ")}>
                          Materials: {cd.materials.slice(0, 4).join(", ")}{cd.materials.length > 4 ? ` +${cd.materials.length - 4}` : ""}
                        </p>
                      </div>
                    );
                  })}
                </div>
                {!data.contractDependencies.length && (
                  <div className="flex items-center gap-2 text-sm text-emerald-700 py-3">
                    <CheckCircle2 className="w-4 h-4" />
                    No contract dependencies found — sourcing is well-diversified.
                  </div>
                )}
              </div>

            </>
          )}
        </div>
      )}
    </div>
  );
}
