// ─────────────────────────────────────────────────────────────────────────────
// GlobalClientsPanel – filterable grid of global SAP enterprise client profiles
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from "react";
import {
  Building2,
  Globe2,
  TrendingUp,
  Filter,
  Search,
  ChevronDown,
  BarChart3,
  Award,
  RefreshCw,
} from "lucide-react";
import { ClientProfile } from "../data/clientProfiles";

// ── Types ────────────────────────────────────────────────────────────────────

interface ProfilesResponse {
  total: number;
  profiles: ClientProfile[];
}

interface ClientStats {
  byIndustry: Record<string, number>;
  byRegion: Record<string, number>;
  byTier: Record<string, number>;
  total: number;
}

type MarketCapTierFilter = "" | "Mega" | "Large" | "Mid";

// ── Industry colour pills ─────────────────────────────────────────────────────

const INDUSTRY_COLOURS: Record<string, { bg: string; text: string }> = {
  automobile:  { bg: "bg-blue-100",    text: "text-blue-700"    },
  pharma:      { bg: "bg-violet-100",  text: "text-violet-700"  },
  retail:      { bg: "bg-pink-100",    text: "text-pink-700"    },
  aerospace:   { bg: "bg-sky-100",     text: "text-sky-700"     },
  energy:      { bg: "bg-orange-100",  text: "text-orange-700"  },
  fmcg:        { bg: "bg-lime-100",    text: "text-lime-700"    },
  construction:{ bg: "bg-amber-100",   text: "text-amber-700"   },
  semiconductor:{ bg: "bg-cyan-100",   text: "text-cyan-700"    },
  food:        { bg: "bg-green-100",   text: "text-green-700"   },
  telecom:     { bg: "bg-purple-100",  text: "text-purple-700"  },
};

const TIER_COLOURS: Record<ClientProfile["marketCapTier"], { bg: string; text: string; border: string }> = {
  Mega:  { bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-300" },
  Large: { bg: "bg-blue-50",     text: "text-blue-700",    border: "border-blue-300"    },
  Mid:   { bg: "bg-amber-50",    text: "text-amber-700",   border: "border-amber-300"   },
};

// ── Helper: derive unique option lists from profiles ─────────────────────────

function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ── Sub-component: single client card ────────────────────────────────────────

function ClientCard({ profile }: { profile: ClientProfile }) {
  const tier = TIER_COLOURS[profile.marketCapTier];
  const industry = INDUSTRY_COLOURS[profile.industry] ?? { bg: "bg-slate-100", text: "text-slate-600" };
  const visibleModules = profile.primarySapModules.slice(0, 5);
  const extraModules = profile.primarySapModules.length - 5;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-150 flex flex-col">
      {/* Card Header */}
      <div className="px-4 pt-4 pb-3 flex items-start gap-3">
        {/* Initials avatar */}
        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-white font-mono tracking-wide">
            {getInitials(profile.companyName)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p
            className="text-sm font-bold text-slate-800 truncate leading-tight"
            title={profile.companyName}
          >
            {profile.companyName}
          </p>
          <p className="text-[10px] font-mono text-slate-400 mt-0.5">{profile.ticker}</p>
        </div>
        {/* Market cap tier badge */}
        <span
          className={`shrink-0 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${tier.bg} ${tier.text} ${tier.border}`}
        >
          {profile.marketCapTier}
        </span>
      </div>

      {/* Meta row: industry + geography */}
      <div className="px-4 flex flex-wrap gap-1.5 items-center">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${industry.bg} ${industry.text}`}
        >
          {profile.industry}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-slate-500">
          <Globe2 className="w-3 h-3 shrink-0" />
          {profile.geography}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-slate-400">
          <Building2 className="w-3 h-3 shrink-0" />
          {profile.region}
        </span>
      </div>

      {/* SAP modules */}
      <div className="px-4 pt-3 flex flex-wrap gap-1">
        {visibleModules.map((mod) => (
          <span
            key={mod}
            className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[9px] font-mono text-slate-600"
          >
            {mod}
          </span>
        ))}
        {extraModules > 0 && (
          <span className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 rounded text-[9px] font-mono text-slate-400">
            +{extraModules} more
          </span>
        )}
      </div>

      {/* SAP Company Code */}
      <div className="px-4 pt-2 flex items-center gap-1.5">
        <Award className="w-3 h-3 text-indigo-400 shrink-0" />
        <span className="text-[10px] text-slate-400">SAP Code</span>
        <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
          {profile.sapCompanyCode}
        </span>
      </div>

      {/* Description */}
      <div className="px-4 pt-2 flex-1">
        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
          {profile.description}
        </p>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 mt-2 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 italic">0 active scenarios</span>
        <span className="text-[10px] font-mono text-slate-400">{profile.currency}</span>
      </div>
    </div>
  );
}

// ── Sub-component: stat mini-card ─────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-lg font-bold text-slate-800 font-mono leading-tight">{value}</p>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function GlobalClientsPanel() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [profiles, setProfiles] = useState<ClientProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<ClientProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filterIndustry, setFilterIndustry] = useState<string>("");
  const [filterGeography, setFilterGeography] = useState<string>("");
  const [filterTier, setFilterTier] = useState<MarketCapTierFilter>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [stats, setStats] = useState<ClientStats | null>(null);

  // ── Derived option lists ───────────────────────────────────────────────────
  const allIndustries: string[] = (unique(profiles.map((p) => p.industry)) as string[]).sort();
  const allGeographies: string[] = (unique(profiles.map((p) => p.geography)) as string[]).sort();

  // ── Data fetching ─────────────────────────────────────────────────────────
  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterIndustry) params.set("industry", filterIndustry);
      if (filterGeography) params.set("geography", filterGeography);
      if (filterTier) params.set("marketCapTier", filterTier);

      const res = await fetch(`/api/client-profiles?${params.toString()}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ProfilesResponse = await res.json();
      setProfiles(json.profiles);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load client profiles.");
    } finally {
      setLoading(false);
    }
  }, [filterIndustry, filterGeography, filterTier]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/client-profiles/stats");
      if (!res.ok) return; // stats are non-critical; fail silently
      const json: ClientStats = await res.json();
      setStats(json);
    } catch {
      // non-critical — swallow
    }
  }, []);

  // Mount: fetch both
  useEffect(() => {
    fetchProfiles();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Client-side filtering ─────────────────────────────────────────────────
  useEffect(() => {
    let result = profiles;

    if (filterIndustry) {
      result = result.filter((p) => p.industry === filterIndustry);
    }
    if (filterGeography) {
      result = result.filter((p) => p.geography === filterGeography);
    }
    if (filterTier) {
      result = result.filter((p) => p.marketCapTier === filterTier);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.companyName.toLowerCase().includes(q) ||
          p.ticker.toLowerCase().includes(q),
      );
    }

    setFilteredProfiles(result);
  }, [profiles, filterIndustry, filterGeography, filterTier, searchQuery]);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const clearFilters = () => {
    setFilterIndustry("");
    setFilterGeography("");
    setFilterTier("");
    setSearchQuery("");
  };

  const hasActiveFilters =
    filterIndustry !== "" ||
    filterGeography !== "" ||
    filterTier !== "" ||
    searchQuery.trim() !== "";

  const megaCount = profiles.filter((p) => p.marketCapTier === "Mega").length;
  const industriesCount = stats
    ? Object.keys(stats.byIndustry).length
    : unique(profiles.map((p) => p.industry)).length;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5 font-sans">

      {/* ── 1. Header Row ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800 leading-tight">
              Global SAP Client Registry
            </h2>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Enterprise client profiles · SAP modules · market intelligence
            </p>
          </div>
          {!loading && profiles.length > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-[10px] font-mono font-bold text-indigo-700">
              <BarChart3 className="w-3 h-3" />
              {profiles.length} total
            </span>
          )}
        </div>
        <button
          onClick={() => { fetchProfiles(); fetchStats(); }}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* ── 2. Stats Row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard
          label="Total Clients"
          value={stats?.total ?? profiles.length}
          icon={<Building2 className="w-4 h-4 text-indigo-600" />}
        />
        <StatCard
          label="Mega-Cap Clients"
          value={stats ? (stats.byTier["Mega"] ?? megaCount) : megaCount}
          icon={<TrendingUp className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          label="Industries Covered"
          value={industriesCount}
          icon={<Globe2 className="w-4 h-4 text-indigo-500" />}
        />
      </div>

      {/* ── 3. Filter Bar ─────────────────────────────────────────────────── */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 space-y-3">
        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
          <Filter className="w-3 h-3" />
          Filters
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold normal-case tracking-normal cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search company or ticker…"
              className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 transition"
            />
          </div>

          {/* Industry dropdown */}
          <div className="relative">
            <select
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 cursor-pointer transition min-w-[130px]"
            >
              <option value="">All Industries</option>
              {allIndustries.map((ind) => (
                <option key={ind} value={ind} className="capitalize">
                  {ind.charAt(0).toUpperCase() + ind.slice(1)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Region dropdown */}
          <div className="relative">
            <select
              value={filterGeography}
              onChange={(e) => setFilterGeography(e.target.value)}
              className="appearance-none pl-3 pr-7 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-200 cursor-pointer transition min-w-[130px]"
            >
              <option value="">All Regions</option>
              {allGeographies.map((geo) => (
                <option key={geo} value={geo}>{geo}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Market Cap Tier toggle buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono text-slate-400 mr-1">Market Cap:</span>
          {(["", "Mega", "Large", "Mid"] as MarketCapTierFilter[]).map((tier) => (
            <button
              key={tier === "" ? "all" : tier}
              onClick={() => setFilterTier(tier)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition cursor-pointer ${
                filterTier === tier
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700"
              }`}
            >
              {tier === "" ? "All" : tier}
            </button>
          ))}
        </div>
      </div>

      {/* ── 4 / 5 / 6 / 7 / 8: Content area ────────────────────────────── */}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-20 gap-3 text-slate-500">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
          <span className="text-sm font-medium">Loading global clients…</span>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-red-700">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4 text-red-600" />
          </div>
          <span className="flex-1">{error}</span>
          <button
            onClick={() => { fetchProfiles(); fetchStats(); }}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-700 underline underline-offset-2 cursor-pointer hover:text-red-900"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Results grid + empty state */}
      {!loading && !error && (
        <>
          {/* Result count label */}
          {profiles.length > 0 && (
            <p className="text-[10px] font-mono text-slate-400">
              Showing{" "}
              <span className="font-bold text-slate-600">{filteredProfiles.length}</span>
              {" "}of{" "}
              <span className="font-bold text-slate-600">{profiles.length}</span>
              {" "}clients
              {hasActiveFilters && " · filtered"}
            </p>
          )}

          {/* Empty state */}
          {filteredProfiles.length === 0 && profiles.length > 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-600">No clients match your filters</p>
                <p className="text-xs text-slate-400 mt-1">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-4 py-1.5 rounded-lg cursor-pointer transition"
              >
                Clear filters
              </button>
            </div>
          )}

          {/* No data at all yet (server returned empty) */}
          {profiles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Globe2 className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-500">No client profiles available</p>
            </div>
          )}

          {/* Responsive card grid */}
          {filteredProfiles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProfiles.map((profile: ClientProfile) => (
                <React.Fragment key={profile.id}>
                  <ClientCard profile={profile} />
                </React.Fragment>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
