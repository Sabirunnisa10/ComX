// ─────────────────────────────────────────────────────────────────────────────
// Client Profiles – globally recognised, highest-market-cap companies
// mapped to SAP modules used in WatsonX SAP Commodity advisory context.
// ─────────────────────────────────────────────────────────────────────────────

export interface ClientProfile {
  id: string;
  companyName: string;
  ticker: string;
  industry:
    | "automobile"
    | "pharma"
    | "retail"
    | "aerospace"
    | "energy"
    | "fmcg"
    | "construction"
    | "semiconductor"
    | "food"
    | "telecom";
  geography: string;
  region: "APAC" | "Europe" | "North America" | "Africa" | "South America";
  marketCapTier: "Mega" | "Large" | "Mid";
  primarySapModules: string[];
  sapCompanyCode: string;
  currency: string;
  description: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Master list
// ─────────────────────────────────────────────────────────────────────────────

export const CLIENT_PROFILES: ClientProfile[] = [

  // ── AUTOMOBILE ─────────────────────────────────────────────────────────────
  {
    id: "CP-001",
    companyName: "Maruti Suzuki India",
    ticker: "MARUTI.NS",
    industry: "automobile",
    geography: "India",
    region: "APAC",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PP", "SD", "FI", "CO", "WM"],
    sapCompanyCode: "MSUZ",
    currency: "INR",
    description:
      "India's largest passenger-vehicle manufacturer by volume, operating a high-throughput just-in-time supply chain.",
  },
  {
    id: "CP-002",
    companyName: "Toyota Motor Japan",
    ticker: "7203.T",
    industry: "automobile",
    geography: "Japan",
    region: "APAC",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PP", "EWM", "TM", "FI"],
    sapCompanyCode: "TYMC",
    currency: "JPY",
    description:
      "World's largest automaker by annual unit sales, pioneer of the Toyota Production System and lean manufacturing.",
  },
  {
    id: "CP-003",
    companyName: "Volkswagen Group",
    ticker: "VOW3.DE",
    industry: "automobile",
    geography: "Germany",
    region: "Europe",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PP", "SD", "TM", "EWM"],
    sapCompanyCode: "VWAG",
    currency: "EUR",
    description:
      "Europe's largest automotive group, owning VW, Audi, Porsche, SEAT, Škoda, and Lamborghini brands.",
  },
  {
    id: "CP-004",
    companyName: "BMW Group",
    ticker: "BMW.DE",
    industry: "automobile",
    geography: "Germany",
    region: "Europe",
    marketCapTier: "Large",
    primarySapModules: ["MM", "PP", "SD", "QM"],
    sapCompanyCode: "BMWG",
    currency: "EUR",
    description:
      "Premium German automaker renowned for performance vehicles, motorcycles, and MINI/Rolls-Royce brands.",
  },
  {
    id: "CP-005",
    companyName: "BYD Company",
    ticker: "002594.SZ",
    industry: "automobile",
    geography: "China",
    region: "APAC",
    marketCapTier: "Large",
    primarySapModules: ["MM", "PP", "EWM", "PM"],
    sapCompanyCode: "BYDC",
    currency: "CNY",
    description:
      "China's leading new-energy vehicle manufacturer and one of the world's top EV producers by unit volume.",
  },
  {
    id: "CP-006",
    companyName: "Ford Motor Company",
    ticker: "F",
    industry: "automobile",
    geography: "USA",
    region: "North America",
    marketCapTier: "Large",
    primarySapModules: ["MM", "SD", "FI", "CO"],
    sapCompanyCode: "FORD",
    currency: "USD",
    description:
      "Iconic American automaker with a broad portfolio spanning trucks, SUVs, and electric vehicles.",
  },

  // ── PHARMA ─────────────────────────────────────────────────────────────────
  {
    id: "CP-007",
    companyName: "Sun Pharmaceutical Industries",
    ticker: "SUNPHARMA.NS",
    industry: "pharma",
    geography: "India",
    region: "APAC",
    marketCapTier: "Large",
    primarySapModules: ["MM", "QM", "EHS", "PP", "WM"],
    sapCompanyCode: "SPIL",
    currency: "INR",
    description:
      "India's largest and the world's fourth-largest specialty generics pharmaceutical company.",
  },
  {
    id: "CP-008",
    companyName: "Novartis AG",
    ticker: "NOVN.SW",
    industry: "pharma",
    geography: "Switzerland",
    region: "Europe",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PP", "QM", "EHS", "SD"],
    sapCompanyCode: "NOVZ",
    currency: "CHF",
    description:
      "Swiss multinational pharmaceutical powerhouse focused on innovative medicines and advanced therapies.",
  },
  {
    id: "CP-009",
    companyName: "Pfizer Inc.",
    ticker: "PFE",
    industry: "pharma",
    geography: "USA",
    region: "North America",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "QM", "PP", "WM", "TM"],
    sapCompanyCode: "PFIZ",
    currency: "USD",
    description:
      "One of the world's largest pharmaceutical corporations, known for vaccines, oncology, and primary-care portfolios.",
  },
  {
    id: "CP-010",
    companyName: "Roche Holding AG",
    ticker: "ROG.SW",
    industry: "pharma",
    geography: "Switzerland",
    region: "Europe",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "QM", "FI", "SD"],
    sapCompanyCode: "ROCH",
    currency: "CHF",
    description:
      "Swiss leader in in-vitro diagnostics and personalised oncology medicines.",
  },
  {
    id: "CP-011",
    companyName: "AstraZeneca PLC",
    ticker: "AZN.L",
    industry: "pharma",
    geography: "UK",
    region: "Europe",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "QM", "PP", "EHS"],
    sapCompanyCode: "AZUK",
    currency: "GBP",
    description:
      "British-Swedish multinational with a leading oncology, cardiovascular, and rare-disease pipeline.",
  },

  // ── RETAIL ─────────────────────────────────────────────────────────────────
  {
    id: "CP-012",
    companyName: "Reliance Retail",
    ticker: "RELIANCE.NS",
    industry: "retail",
    geography: "India",
    region: "APAC",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "SD", "WM", "FI"],
    sapCompanyCode: "RRIL",
    currency: "INR",
    description:
      "India's largest retailer by revenue, operating grocery, fashion, electronics, and wholesale formats.",
  },
  {
    id: "CP-013",
    companyName: "Amazon.com Inc.",
    ticker: "AMZN",
    industry: "retail",
    geography: "USA",
    region: "North America",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "EWM", "TM", "SD", "FI"],
    sapCompanyCode: "AMZN",
    currency: "USD",
    description:
      "World's largest online retailer and cloud-services provider, operating a global fulfilment network.",
  },
  {
    id: "CP-014",
    companyName: "Walmart Inc.",
    ticker: "WMT",
    industry: "retail",
    geography: "USA",
    region: "North America",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "WM", "SD", "FI"],
    sapCompanyCode: "WALM",
    currency: "USD",
    description:
      "World's largest brick-and-mortar retailer by revenue, with extensive omnichannel and private-label operations.",
  },
  {
    id: "CP-015",
    companyName: "Carrefour SA",
    ticker: "CA.PA",
    industry: "retail",
    geography: "France",
    region: "Europe",
    marketCapTier: "Large",
    primarySapModules: ["MM", "SD", "WM"],
    sapCompanyCode: "CARR",
    currency: "EUR",
    description:
      "French multinational operating hypermarkets, supermarkets, and convenience stores across 30+ countries.",
  },

  // ── AEROSPACE ──────────────────────────────────────────────────────────────
  {
    id: "CP-016",
    companyName: "Hindustan Aeronautics Limited",
    ticker: "HAL.NS",
    industry: "aerospace",
    geography: "India",
    region: "APAC",
    marketCapTier: "Large",
    primarySapModules: ["MM", "PP", "PM", "PS", "QM"],
    sapCompanyCode: "HALI",
    currency: "INR",
    description:
      "India's state-owned aerospace and defence manufacturer of fighter jets, helicopters, and aero-engines.",
  },
  {
    id: "CP-017",
    companyName: "The Boeing Company",
    ticker: "BA",
    industry: "aerospace",
    geography: "USA",
    region: "North America",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PP", "PS", "QM", "EWM"],
    sapCompanyCode: "BOEI",
    currency: "USD",
    description:
      "World's largest aerospace and defence manufacturer, producing commercial jetliners and military aircraft.",
  },
  {
    id: "CP-018",
    companyName: "Airbus SE",
    ticker: "AIR.PA",
    industry: "aerospace",
    geography: "Germany",
    region: "Europe",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PP", "PS", "QM", "TM"],
    sapCompanyCode: "AIRF",
    currency: "EUR",
    description:
      "European aerospace giant manufacturing commercial aircraft, helicopters, and space-launch vehicles.",
  },
  {
    id: "CP-019",
    companyName: "Lockheed Martin Corporation",
    ticker: "LMT",
    industry: "aerospace",
    geography: "USA",
    region: "North America",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PP", "PS", "PM"],
    sapCompanyCode: "LMTZ",
    currency: "USD",
    description:
      "World's largest defence contractor, producing the F-35 fighter, missile systems, and space vehicles.",
  },

  // ── ENERGY ─────────────────────────────────────────────────────────────────
  {
    id: "CP-020",
    companyName: "NTPC Limited",
    ticker: "NTPC.NS",
    industry: "energy",
    geography: "India",
    region: "APAC",
    marketCapTier: "Large",
    primarySapModules: ["MM", "PM", "PS", "FI", "CO"],
    sapCompanyCode: "NTPC",
    currency: "INR",
    description:
      "India's largest power utility, operating coal, gas, hydro, and renewable generation assets.",
  },
  {
    id: "CP-021",
    companyName: "ExxonMobil Corporation",
    ticker: "XOM",
    industry: "energy",
    geography: "USA",
    region: "North America",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PM", "PS", "FI", "EHS"],
    sapCompanyCode: "EXXM",
    currency: "USD",
    description:
      "One of the world's largest publicly traded international oil and gas companies.",
  },
  {
    id: "CP-022",
    companyName: "Shell PLC",
    ticker: "SHEL.L",
    industry: "energy",
    geography: "UK",
    region: "Europe",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PM", "EHS", "FI"],
    sapCompanyCode: "SHEL",
    currency: "GBP",
    description:
      "Anglo-Dutch integrated energy company with upstream, downstream, and LNG operations worldwide.",
  },
  {
    id: "CP-023",
    companyName: "China Petroleum & Chemical Corporation (Sinopec)",
    ticker: "600028.SS",
    industry: "energy",
    geography: "China",
    region: "APAC",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PP", "PM", "FI"],
    sapCompanyCode: "SNPC",
    currency: "CNY",
    description:
      "World's largest oil refiner and one of the largest chemical producers by capacity.",
  },
  {
    id: "CP-024",
    companyName: "BP PLC",
    ticker: "BP.L",
    industry: "energy",
    geography: "UK",
    region: "Europe",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PM", "EHS", "FI"],
    sapCompanyCode: "BPUK",
    currency: "GBP",
    description:
      "British multinational oil and gas company transitioning towards lower-carbon energy solutions.",
  },

  // ── FMCG ───────────────────────────────────────────────────────────────────
  {
    id: "CP-025",
    companyName: "Hindustan Unilever Limited",
    ticker: "HINDUNILVR.NS",
    industry: "fmcg",
    geography: "India",
    region: "APAC",
    marketCapTier: "Large",
    primarySapModules: ["MM", "SD", "PP", "WM", "TM"],
    sapCompanyCode: "HULI",
    currency: "INR",
    description:
      "India's largest FMCG company, selling home care, personal care, and food & refreshment brands.",
  },
  {
    id: "CP-026",
    companyName: "Procter & Gamble Company",
    ticker: "PG",
    industry: "fmcg",
    geography: "USA",
    region: "North America",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "SD", "PP", "WM"],
    sapCompanyCode: "PGCO",
    currency: "USD",
    description:
      "American multinational owning iconic consumer brands across beauty, grooming, health, fabric, and home care.",
  },
  {
    id: "CP-027",
    companyName: "Unilever PLC",
    ticker: "ULVR.L",
    industry: "fmcg",
    geography: "UK",
    region: "Europe",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "SD", "PP", "TM"],
    sapCompanyCode: "UNLV",
    currency: "GBP",
    description:
      "British-Dutch FMCG giant with a portfolio of over 400 brands sold in 190+ countries.",
  },
  {
    id: "CP-028",
    companyName: "Nestlé SA",
    ticker: "NESN.SW",
    industry: "fmcg",
    geography: "Switzerland",
    region: "Europe",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PP", "SD", "QM"],
    sapCompanyCode: "NSTL",
    currency: "CHF",
    description:
      "World's largest food and beverage company by revenue, with categories spanning coffee, dairy, nutrition, and pet care.",
  },
  {
    id: "CP-029",
    companyName: "BASF SE",
    ticker: "BAS.DE",
    industry: "fmcg",
    geography: "Germany",
    region: "Europe",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PP", "SD", "PM"],
    sapCompanyCode: "BSFG",
    currency: "EUR",
    description:
      "World's largest chemical company by sales, supplying raw materials to FMCG, agriculture, and automotive sectors.",
  },

  // ── CONSTRUCTION ───────────────────────────────────────────────────────────
  {
    id: "CP-030",
    companyName: "Larsen & Toubro Group",
    ticker: "LT.NS",
    industry: "construction",
    geography: "India",
    region: "APAC",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PS", "PP", "PM", "FI"],
    sapCompanyCode: "LNTI",
    currency: "INR",
    description:
      "India's largest engineering and construction conglomerate spanning infrastructure, defence, and technology.",
  },
  {
    id: "CP-031",
    companyName: "Vinci SA",
    ticker: "DG.PA",
    industry: "construction",
    geography: "France",
    region: "Europe",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PS", "FI", "CO"],
    sapCompanyCode: "VNCI",
    currency: "EUR",
    description:
      "World's largest construction and concessions group, operating motorways, airports, and stadiums.",
  },
  {
    id: "CP-032",
    companyName: "Caterpillar Inc.",
    ticker: "CAT",
    industry: "construction",
    geography: "USA",
    region: "North America",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PP", "SD", "PM"],
    sapCompanyCode: "CATI",
    currency: "USD",
    description:
      "World's leading manufacturer of construction and mining equipment, diesel engines, and gas turbines.",
  },
  {
    id: "CP-033",
    companyName: "Skanska AB",
    ticker: "SKA-B.ST",
    industry: "construction",
    geography: "Sweden",
    region: "Europe",
    marketCapTier: "Large",
    primarySapModules: ["MM", "PS", "FI"],
    sapCompanyCode: "SKSK",
    currency: "SEK",
    description:
      "Swedish multinational construction and project-development company active in the Nordics, Europe, and USA.",
  },

  // ── SEMICONDUCTOR ──────────────────────────────────────────────────────────
  {
    id: "CP-034",
    companyName: "Tata Elxsi Limited",
    ticker: "TATAELXSI.NS",
    industry: "semiconductor",
    geography: "India",
    region: "APAC",
    marketCapTier: "Mid",
    primarySapModules: ["MM", "PP", "PM", "PS"],
    sapCompanyCode: "TEXI",
    currency: "INR",
    description:
      "Indian technology design and services company specialising in embedded software and semiconductor IP.",
  },
  {
    id: "CP-035",
    companyName: "NVIDIA Corporation",
    ticker: "NVDA",
    industry: "semiconductor",
    geography: "USA",
    region: "North America",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "SD", "FI", "PP"],
    sapCompanyCode: "NVDA",
    currency: "USD",
    description:
      "World's most valuable semiconductor company, dominant in GPU computing, AI training, and data-centre chips.",
  },
  {
    id: "CP-036",
    companyName: "Taiwan Semiconductor Manufacturing Company (TSMC)",
    ticker: "2330.TW",
    industry: "semiconductor",
    geography: "Taiwan",
    region: "APAC",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PP", "PM", "QM", "EWM"],
    sapCompanyCode: "TSMC",
    currency: "TWD",
    description:
      "World's largest dedicated independent semiconductor foundry, manufacturing chips for Apple, NVIDIA, and AMD.",
  },
  {
    id: "CP-037",
    companyName: "Samsung Electronics",
    ticker: "005930.KS",
    industry: "semiconductor",
    geography: "South Korea",
    region: "APAC",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PP", "EWM", "QM"],
    sapCompanyCode: "SMSE",
    currency: "KRW",
    description:
      "World's largest memory chip manufacturer and leading producer of logic semiconductors and display panels.",
  },
  {
    id: "CP-038",
    companyName: "ASML Holding NV",
    ticker: "ASML.AS",
    industry: "semiconductor",
    geography: "Netherlands",
    region: "Europe",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PP", "QM", "PM"],
    sapCompanyCode: "ASML",
    currency: "EUR",
    description:
      "World's sole supplier of EUV lithography machines, a critical chokepoint in advanced chip manufacturing.",
  },

  // ── FOOD ───────────────────────────────────────────────────────────────────
  {
    id: "CP-039",
    companyName: "ITC Limited",
    ticker: "ITC.NS",
    industry: "food",
    geography: "India",
    region: "APAC",
    marketCapTier: "Large",
    primarySapModules: ["MM", "PP", "SD", "WM"],
    sapCompanyCode: "ITCL",
    currency: "INR",
    description:
      "Indian conglomerate with a leading foods business spanning staples, snacks, dairy, and agri-commodities.",
  },
  {
    id: "CP-040",
    companyName: "Nestlé SA (Food segment)",
    ticker: "NESN.SW",
    industry: "food",
    geography: "Switzerland",
    region: "Europe",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PP", "SD", "QM"],
    sapCompanyCode: "NST2",
    currency: "CHF",
    description:
      "Global leader in packaged food categories including infant nutrition, frozen meals, confectionery, and condiments.",
  },
  {
    id: "CP-041",
    companyName: "Tyson Foods Inc.",
    ticker: "TSN",
    industry: "food",
    geography: "USA",
    region: "North America",
    marketCapTier: "Large",
    primarySapModules: ["MM", "PP", "SD", "WM"],
    sapCompanyCode: "TYSN",
    currency: "USD",
    description:
      "America's largest meat processor, producing chicken, beef, and pork under the Tyson, Jimmy Dean, and Hillshire brands.",
  },
  {
    id: "CP-042",
    companyName: "Danone SA",
    ticker: "BN.PA",
    industry: "food",
    geography: "France",
    region: "Europe",
    marketCapTier: "Large",
    primarySapModules: ["MM", "PP", "QM", "SD"],
    sapCompanyCode: "DNON",
    currency: "EUR",
    description:
      "French multinational specialising in dairy products, plant-based foods, and specialised nutrition.",
  },
  {
    id: "CP-043",
    companyName: "JBS SA",
    ticker: "JBSS3.SA",
    industry: "food",
    geography: "Brazil",
    region: "South America",
    marketCapTier: "Large",
    primarySapModules: ["MM", "PP", "SD"],
    sapCompanyCode: "JBSB",
    currency: "BRL",
    description:
      "World's largest animal protein company, processing beef, pork, poultry, and lamb across six continents.",
  },

  // ── TELECOM ────────────────────────────────────────────────────────────────
  {
    id: "CP-044",
    companyName: "Bharti Airtel Limited",
    ticker: "BHARTIARTL.NS",
    industry: "telecom",
    geography: "India",
    region: "APAC",
    marketCapTier: "Large",
    primarySapModules: ["MM", "PM", "FI", "TM"],
    sapCompanyCode: "BALI",
    currency: "INR",
    description:
      "India's second-largest telecom operator by subscribers, with mobile, enterprise, and DTH offerings across Asia and Africa.",
  },
  {
    id: "CP-045",
    companyName: "AT&T Inc.",
    ticker: "T",
    industry: "telecom",
    geography: "USA",
    region: "North America",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PM", "FI", "SD"],
    sapCompanyCode: "ATTZ",
    currency: "USD",
    description:
      "America's largest telecom operator providing wireless, broadband, and enterprise connectivity services.",
  },
  {
    id: "CP-046",
    companyName: "Deutsche Telekom AG",
    ticker: "DTE.DE",
    industry: "telecom",
    geography: "Germany",
    region: "Europe",
    marketCapTier: "Mega",
    primarySapModules: ["MM", "PM", "FI", "WM"],
    sapCompanyCode: "DTEL",
    currency: "EUR",
    description:
      "Europe's largest telecom operator, owner of T-Mobile US and a major fixed-line and IT services provider.",
  },
  {
    id: "CP-047",
    companyName: "Vodafone Group PLC",
    ticker: "VOD.L",
    industry: "telecom",
    geography: "UK",
    region: "Europe",
    marketCapTier: "Large",
    primarySapModules: ["MM", "PM", "FI"],
    sapCompanyCode: "VODA",
    currency: "GBP",
    description:
      "British multinational telecom providing mobile and fixed broadband services across Europe and Africa.",
  },
  {
    id: "CP-048",
    companyName: "Reliance Jio Infocomm (Jio)",
    ticker: "RELIANCE.NS",
    industry: "telecom",
    geography: "India",
    region: "APAC",
    marketCapTier: "Large",
    primarySapModules: ["MM", "PM", "SD", "FI"],
    sapCompanyCode: "JIOI",
    currency: "INR",
    description:
      "India's largest telecom operator by subscribers, operating a fully 4G/5G all-IP network with digital services.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a filtered subset of CLIENT_PROFILES.
 * All filter fields are optional; only non-undefined values are applied.
 * Comparisons are case-insensitive.
 */
export function filterClientProfiles(filters: {
  industry?: string;
  geography?: string;
  marketCapTier?: string;
}): ClientProfile[] {
  return CLIENT_PROFILES.filter((profile) => {
    if (
      filters.industry !== undefined &&
      profile.industry.toLowerCase() !== filters.industry.toLowerCase()
    ) {
      return false;
    }
    if (
      filters.geography !== undefined &&
      profile.geography.toLowerCase() !== filters.geography.toLowerCase()
    ) {
      return false;
    }
    if (
      filters.marketCapTier !== undefined &&
      profile.marketCapTier.toLowerCase() !== filters.marketCapTier.toLowerCase()
    ) {
      return false;
    }
    return true;
  });
}

/**
 * Looks up a single ClientProfile by its unique id (e.g. "CP-001").
 * Returns undefined when no match is found.
 */
export function getClientProfile(id: string): ClientProfile | undefined {
  return CLIENT_PROFILES.find((profile) => profile.id === id);
}
