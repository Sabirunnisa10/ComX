import React, { useState, useEffect, useCallback } from "react";
import { Recommendation, RecommendationPriority } from "../types";
import {
  ChevronDown,
  ChevronUp,
  Lightbulb,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Zap,
} from "lucide-react";

interface RecommendationsPanelProps {
  /** Active industry slug — panel re-fetches when this changes. */
  industry: string;
}

// ─── Colour helpers (shared priority palette) ────────────────────────────────
const PRIORITY_COLOURS: Record<
  RecommendationPriority,
  { bg: string; border: string; text: string; badgeBg: string; badgeText: string }
> = {
  Critical: {
    bg: "bg-red-50/60",
    border: "border-red-200",
    text: "text-red-800",
    badgeBg: "bg-red-100",
    badgeText: "text-red-700",
  },
  High: {
    bg: "bg-orange-50/60",
    border: "border-orange-200",
    text: "text-orange-800",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-700",
  },
  Medium: {
    bg: "bg-amber-50/60",
    border: "border-amber-200",
    text: "text-amber-800",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
  },
  Low: {
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-700",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-600",
  },
};

function PriorityIcon({ priority }: { priority: RecommendationPriority }) {
  const cls = "w-3.5 h-3.5 shrink-0";
  if (priority === "Critical") return <AlertOctagon className={`${cls} text-red-600`} />;
  if (priority === "High")     return <AlertTriangle className={`${cls} text-orange-500`} />;
  if (priority === "Medium")   return <Info          className={`${cls} text-amber-500`} />;
  return                               <Zap           className={`${cls} text-slate-400`} />;
}

// ─── Single recommendation card ──────────────────────────────────────────────
interface RecCardProps {
  rec: Recommendation;
  isAcknowledged: boolean;
  onAcknowledge: (id: string) => void;
}

const RecCard: React.FC<RecCardProps> = ({ rec, isAcknowledged, onAcknowledge }) => {
  const c = PRIORITY_COLOURS[rec.priority];

  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-3 transition-all ${
        isAcknowledged
          ? "bg-slate-50 border-slate-200 opacity-60"
          : `${c.bg} ${c.border}`
      }`}
      role="listitem"
    >
      {/* Top row: priority badge + action label */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <PriorityIcon priority={rec.priority} />
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              isAcknowledged
                ? "bg-slate-100 border-slate-200 text-slate-500"
                : `${c.badgeBg} border-current ${c.badgeText}`
            }`}
            aria-label={`Priority: ${rec.priority}`}
          >
            {rec.priority}
          </span>

          <span className="text-[10px] text-slate-400 font-mono truncate">
            {rec.materialId}
          </span>
        </div>

        {/* Action button */}
        {isAcknowledged ? (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 whitespace-nowrap shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Acknowledged ✓
          </span>
        ) : (
          <button
            onClick={() => onAcknowledge(rec.id)}
            className={`shrink-0 text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
              rec.priority === "Critical"
                ? "bg-red-600 hover:bg-red-700 text-white border-red-700"
                : rec.priority === "High"
                ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-600"
                : rec.priority === "Medium"
                ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600"
                : "bg-slate-200 hover:bg-slate-300 text-slate-700 border-slate-300"
            }`}
            aria-label={`${rec.actionLabel} for ${rec.materialName}`}
          >
            {rec.actionLabel}
          </button>
        )}
      </div>

      {/* Message */}
      <p
        className={`text-xs leading-relaxed ${
          isAcknowledged ? "line-through text-slate-400" : "text-slate-700"
        }`}
      >
        {rec.message}
      </p>

      {/* Category chip */}
      <span className="text-[10px] text-slate-400 font-medium">{rec.category}</span>
    </div>
  );
}

// ─── Main panel ──────────────────────────────────────────────────────────────
export default function RecommendationsPanel({ industry }: RecommendationsPanelProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading,       setIsLoading]        = useState(true);
  const [error,           setError]            = useState<string | null>(null);
  const [isCollapsed,     setIsCollapsed]      = useState(false);
  /** Set of recommendation IDs the user has acknowledged (local state only). */
  const [acknowledged,    setAcknowledged]     = useState<Set<string>>(new Set());

  const fetchRecommendations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAcknowledged(new Set()); // reset acknowledgements on industry change
    try {
      const res = await fetch(`/api/recommendations?industry=${encodeURIComponent(industry)}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data: Recommendation[] = await res.json();
      setRecommendations(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [industry]);

  // Re-fetch whenever industry changes
  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleAcknowledge = (id: string) => {
    setAcknowledged(prev => new Set([...prev, id]));
  };

  // Counts for summary line
  const counts = { Critical: 0, High: 0, Medium: 0, Low: 0 };
  for (const r of recommendations) counts[r.priority] = (counts[r.priority] ?? 0) + 1;
  const ackCount = acknowledged.size;

  return (
    <div
      className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
      id="recommendations-panel"
      aria-label="Procurement Recommendations"
    >
      {/* ── Panel header ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/60">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4.5 h-4.5 text-amber-500 shrink-0" />
          <h2 className="text-sm font-bold text-slate-800">
            Procurement Recommendations
            {!isLoading && (
              <span className="ml-2 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                {recommendations.length}
              </span>
            )}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh button */}
          <button
            onClick={fetchRecommendations}
            disabled={isLoading}
            aria-label="Refresh recommendations"
            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setIsCollapsed(v => !v)}
            aria-expanded={!isCollapsed}
            aria-controls="rec-panel-body"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            {isCollapsed
              ? <ChevronDown className="w-4 h-4" />
              : <ChevronUp   className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Panel body ──────────────────────────────────────────────────── */}
      {!isCollapsed && (
        <div id="rec-panel-body" className="p-5 space-y-4">

          {/* Loading spinner */}
          {isLoading && (
            <div className="flex items-center justify-center py-10 gap-3 text-slate-500">
              <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
              <span className="text-sm font-medium">Evaluating procurement rules…</span>
            </div>
          )}

          {/* Error state */}
          {!isLoading && error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              <AlertOctagon className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
              <div>
                <p className="font-semibold">Failed to load recommendations</p>
                <p className="text-xs mt-1 text-red-600">{error}</p>
                <button
                  onClick={fetchRecommendations}
                  className="mt-2 text-xs font-bold text-red-700 underline cursor-pointer"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && recommendations.length === 0 && (
            <div className="flex flex-col items-center py-10 text-center text-slate-400 gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <p className="text-sm font-semibold text-slate-600">No active recommendations</p>
              <p className="text-xs text-slate-400">All supply risk indicators are within acceptable thresholds.</p>
            </div>
          )}

          {/* Recommendation cards grid */}
          {!isLoading && !error && recommendations.length > 0 && (
            <div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3"
              role="list"
              aria-label="Recommendation list"
            >
              {recommendations.map(rec => (
                <RecCard
                  key={rec.id}
                  rec={rec}
                  isAcknowledged={acknowledged.has(rec.id)}
                  onAcknowledge={handleAcknowledge}
                />
              ))}
            </div>
          )}

          {/* Summary line */}
          {!isLoading && !error && recommendations.length > 0 && (
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-semibold">
              {counts.Critical > 0 && (
                <span className="text-red-600">{counts.Critical} critical</span>
              )}
              {counts.High > 0 && (
                <span className="text-orange-500">{counts.High} high</span>
              )}
              {counts.Medium > 0 && (
                <span className="text-amber-600">{counts.Medium} medium</span>
              )}
              {counts.Low > 0 && (
                <span className="text-slate-500">{counts.Low} low</span>
              )}
              <span className="text-slate-400">·</span>
              <span className="text-emerald-600">{ackCount} acknowledged</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
