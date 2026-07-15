// ─── Supply Risk types ────────────────────────────────────────────────────────
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type RecommendationPriority = "Critical" | "High" | "Medium" | "Low";

/** Material extended with server-computed risk fields */
export interface MaterialWithRisk extends Material {
  /** Normalised 0–100 composite score: 40% lead time + 40% geo risk + 20% single-source */
  riskScore: number;
  riskLevel: RiskLevel;
  /** Estimated lead time in days (derived from vendor country + category on backend) */
  leadTimeDays: number;
  /** 0–100 geo risk (normalised from 1–5 catalog entry) */
  geopoliticalRiskScore: number;
  /** True when only one vendor supplies this material */
  isSingleSource: boolean;
}

export interface Recommendation {
  id: string;                    // e.g. "rule1_MAT-001"
  materialId: string;
  materialName: string;
  category: string;
  riskLevel: RiskLevel;
  priority: RecommendationPriority;
  message: string;
  actionLabel: string;
  timestamp: string;             // ISO 8601
}

// ─── BP Evaluation types ─────────────────────────────────────────────────────

/** Concentration of spend across vendors / customers (Herfindahl-style) */
export interface ConcentrationRisk {
  /** "vendor" or "customer" */
  side: "vendor" | "customer";
  /** Herfindahl-Hirschman Index  0–10000 (>2500 = high concentration) */
  hhi: number;
  /** Plain-English level derived from HHI */
  level: "Low" | "Moderate" | "High" | "Critical";
  /** Top entity names and their spend share % */
  topEntities: { name: string; country: string; spendShare: number; materialCount: number }[];
  /** Total unique entities */
  totalEntities: number;
  /** Share held by top-3 combined */
  top3SharePct: number;
}

/** Simulated delivery-performance stats per vendor (derived from inventory fields) */
export interface VendorScore {
  vendorName: string;
  vendorCountry: string;
  /** Materials supplied by this vendor */
  materialCount: number;
  /** Total annual spend (volume × unitPrice) */
  totalSpend: number;
  /** Estimated on-time delivery rate 0–100 */
  onTimeDeliveryRate: number;
  /** Estimated over-delivery tolerance breaches 0–100 (lower = better) */
  overDeliveryRate: number;
  /** Estimated under-delivery tolerance breaches 0–100 (lower = better) */
  underDeliveryRate: number;
  /** Composite vendor score 0–100 (higher = better) */
  compositeScore: number;
  /** "Preferred" | "Approved" | "Restricted" | "At Risk" */
  status: "Preferred" | "Approved" | "Restricted" | "At Risk";
  /** Number of active contracts / scheduling agreements inferred */
  activeContracts: number;
  /** Dependency flag: true when vendor holds >30% of total spend */
  isOverDependency: boolean;
}

/** OLA / Contract dependency summary per vendor */
export interface ContractDependency {
  vendorName: string;
  vendorCountry: string;
  /** Estimated contract type from spend pattern */
  contractType: "Scheduling Agreement" | "Long-Term Contract" | "Framework OLA" | "Spot Purchase";
  /** Materials covered by this contract */
  materials: string[];
  /** Annual value of the contract/OLA */
  annualValue: number;
  /** As % of total industry spend */
  spendSharePct: number;
  /** Risk flag: true when annualValue > 15% of total spend */
  isConcentrated: boolean;
}

/** Full BP evaluation response */
export interface BPEvaluation {
  industry: string;
  totalSpend: number;
  vendorConcentration: ConcentrationRisk;
  customerConcentration: ConcentrationRisk;
  vendorScores: VendorScore[];
  contractDependencies: ContractDependency[];
  /** Summary KPIs */
  kpis: {
    totalVendors: number;
    atRiskVendors: number;
    overDependencyVendors: number;
    avgVendorScore: number;
    top3VendorSharePct: number;
    concentratedContracts: number;
  };
}

// ─── Industry type (fetched from /api/industries) ────────────────────────────
export interface Industry {
  id: string;
  slug: string;
  label: string;
  companyCode: string;
  currency: string;
  commodityKeys: [string, string, string, string];
  available: boolean;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  currency: string;
  volume: number; // Annual or Quarterly quantity
  totalValue: number; // volume * unitPrice
  vendorName: string;
  vendorCountry: string;
  // Material composition weights (should sum up to <= 100%)
  commodityWeights: {
    copper: number; // e.g. 45 for 45%
    steel: number;
    aluminum: number;
    nickel: number;
    other: number;
  };
  // Flag indicating if mapped by AI or manually edited
  isAiMapped?: boolean;
  inventoryUsed?: number;
  inventoryOrdered?: number;
  inventoryBufferStock?: number;
}

export interface FoContract {
  symbol: string;
  exchange: string;
  contractType: "Futures" | "Options";
  strikePrice?: number;
  currentPrice: number;
  expiryDate: string;
  lotSize: string;
  openInterest: number;
  volume: number;
}

export interface CommodityMarket {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number; // USD per Metric Ton or Lb
  unit: string; // e.g., "USD/MT" or "USD/lb"
  change24h: number; // percentage
  history: { date: string; price: number }[]; // 12 months history
  forecast: { period: string; price: number; change: number; signal: 'up' | 'down' | 'flat' }[]; // Next 4 quarters
  volatility: 'High' | 'Medium' | 'Low';
  weight?: number; // Calculated dynamic company weightage
  foContracts?: FoContract[];
}

export interface ProcurementAction {
  materialId: string;
  materialName: string;
  category: string;
  totalValue: number;
  primaryCommodity: string;
  primaryWeight: number;
  exposureValue: number; // totalValue * (primaryWeight / 100)
  forecastTrend: number; // predicted change of primary commodity over next Q
  recommendation: 'BUY_ADVANCE' | 'POSTPONE' | 'HOLD';
  confidence: number; // 0-100%
  reason: string;
  suggestedActionDate: string;
}

export interface GeopoliticalRisk {
  country: string;
  riskScore: number; // 1 to 5 (1: Low, 5: High)
  status: 'Stable' | 'Caution' | 'High Risk';
  description: string;
  vendorCount: number;
  materialShare: number; // Percentage of total spend
}

export interface DashboardState {
  materials: Material[];
  commodities: CommodityMarket[];
  recommendations: ProcurementAction[];
  geopoliticalRisks: GeopoliticalRisk[];
  selectedCommodity: string | null;
  selectedMaterial: string | null;
  isSimulating: boolean;
  simulationRates: {
    copper: number; // percentage change e.g. +15
    steel: number;
    aluminum: number;
    nickel: number;
  };
}
