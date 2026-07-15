/**
 * scripts/seedIndustryData.ts
 * SAP S/4HANA Industry Seed Script
 *
 * Generates 500 realistic records per sheet × 20 SAP tables × 10 industries.
 * Idempotent: deletes and rewrites the workbook so re-runs do not duplicate records.
 *
 * Run: npx ts-node --esm scripts/seedIndustryData.ts
 *   or: npx tsx scripts/seedIndustryData.ts
 */

import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ─────────────────────────────────────────────────────────────────────────────
// INDUSTRY DEFINITIONS (3 existing + 7 new = 10 total)
// ─────────────────────────────────────────────────────────────────────────────
export interface IndustryDef {
  id: string;
  slug: string;
  label: string;
  companyCode: string;
  companyName: string;
  purchasingOrg: string;
  plant: string;
  storageLoc: string;
  currency: string;
  country: string;
  fiscalYear: string;
  commodityKeys: [string, string, string, string]; // maps to copper/steel/aluminum/nickel display labels
  vendorCountries: string[];
  vendorPools: string[];
  materialCategories: string[];
  exampleMaterials: string[];
}

export const INDUSTRIES: IndustryDef[] = [
  /* ── EXISTING ─────────────────────────────────────────────────────────── */
  {
    id: "automobile",
    slug: "automobile",
    label: "Automobile (Maruti Suzuki)",
    companyCode: "MSIN",
    companyName: "Maruti Suzuki India Ltd",
    purchasingOrg: "MSPO",
    plant: "MS01",
    storageLoc: "0001",
    currency: "INR",
    country: "India",
    fiscalYear: "2024",
    commodityKeys: ["Copper", "Steel HRC", "Aluminum", "Nickel"],
    vendorCountries: ["India", "Japan", "Germany", "France", "China"],
    vendorPools: ["Tata Steel Automotive", "Motherson Sumi Wiring", "Aisin Seiki", "Faurecia", "Tongling Metals"],
    materialCategories: ["Body Structures", "Electrical Systems", "Drivetrain", "Exhaust", "Chassis"],
    exampleMaterials: ["Chassis Steel Frame", "Wiring Harness", "Alloy Wheel", "Catalytic Converter", "Engine Block Al"],
  },
  {
    id: "pharma",
    slug: "pharma",
    label: "Pharma (Sun Pharma)",
    companyCode: "SPIL",
    companyName: "Sun Pharmaceutical Industries Ltd",
    purchasingOrg: "SPPO",
    plant: "SP01",
    storageLoc: "0001",
    currency: "INR",
    country: "India",
    fiscalYear: "2024",
    commodityKeys: ["API Chemicals (Phenol)", "Organic Solvents", "Aluminum Foil", "Borosilicate Glass"],
    vendorCountries: ["India", "China", "Germany", "United Kingdom"],
    vendorPools: ["Aurobindo Pharma", "Hebei Jiheng", "Schott Glass", "BP Chemicals"],
    materialCategories: ["Active Ingredients", "Process Solvents", "Primary Packaging", "Secondary Packaging"],
    exampleMaterials: ["Paracetamol API", "USP Ethanol Solvent", "Borosilicate Vials", "Blister Al Foil", "Amoxicillin API"],
  },
  {
    id: "retail",
    slug: "retail",
    label: "Retail (Reliance Retail)",
    companyCode: "RRIL",
    companyName: "Reliance Retail Ltd",
    purchasingOrg: "RRPO",
    plant: "RR01",
    storageLoc: "0001",
    currency: "INR",
    country: "India",
    fiscalYear: "2024",
    commodityKeys: ["Cotton No.2 (ICE)", "Kraft Pulp & Paper", "PET Plastics", "Agricultural Grains"],
    vendorCountries: ["India", "Vietnam", "Bangladesh", "China"],
    vendorPools: ["Gujarat Cotton Co-op", "WestPack Mills", "Reliance Polymers", "Haryana Agri Co-op"],
    materialCategories: ["Textile Raw", "Logistic Packaging", "Plastic Containers", "Dry Groceries"],
    exampleMaterials: ["Organic Cotton Yarn", "Corrugated Cardboard", "PET Resin", "Basmati Rice", "LDPE Wrap Film"],
  },
  /* ── NEW ──────────────────────────────────────────────────────────────── */
  {
    id: "aerospace",
    slug: "aerospace",
    label: "Aerospace & Defence (HAL)",
    companyCode: "HALI",
    companyName: "Hindustan Aeronautics Ltd",
    purchasingOrg: "HAPO",
    plant: "HA01",
    storageLoc: "0001",
    currency: "INR",
    country: "India",
    fiscalYear: "2024",
    commodityKeys: ["Titanium Alloys", "Carbon Fiber", "Aluminum 7075-T6", "Nickel Superalloys"],
    vendorCountries: ["India", "USA", "France", "Russia", "Israel"],
    vendorPools: ["VSMPO Avisma", "Hexcel Corp", "Arconic Inc", "Safran Nacelles", "Elbit Systems"],
    materialCategories: ["Structural Airframe", "Propulsion", "Avionics", "Landing Gear", "Fuel Systems"],
    exampleMaterials: ["Ti-6Al-4V Forging", "CFRP Fuselage Panel", "Al7075 Wing Rib", "Inconel Turbine Disc", "Hydraulic Actuator"],
  },
  {
    id: "energy",
    slug: "energy",
    label: "Energy & Utilities (NTPC)",
    companyCode: "NTPC",
    companyName: "NTPC Limited",
    purchasingOrg: "NTPO",
    plant: "NT01",
    storageLoc: "0001",
    currency: "INR",
    country: "India",
    fiscalYear: "2024",
    commodityKeys: ["Copper Winding", "Structural Steel", "Silicon Steel", "Chromium Alloy"],
    vendorCountries: ["India", "China", "Germany", "South Korea", "Japan"],
    vendorPools: ["ABB India", "Bharat Heavy Electricals", "Siemens Energy", "Doosan Power", "Mitsubishi Power"],
    materialCategories: ["Power Transformers", "Turbines", "Switchgear", "Boilers", "Cables & Conductors"],
    exampleMaterials: ["400kV Power Transformer", "Steam Turbine Rotor", "GIS Switchgear", "Economizer Module", "HTLS Conductor"],
  },
  {
    id: "fmcg",
    slug: "fmcg",
    label: "FMCG (Hindustan Unilever)",
    companyCode: "HULI",
    companyName: "Hindustan Unilever Ltd",
    purchasingOrg: "HUPO",
    plant: "HU01",
    storageLoc: "0001",
    currency: "INR",
    country: "India",
    fiscalYear: "2024",
    commodityKeys: ["Palm Oil", "Caustic Soda", "HDPE Resin", "Titanium Dioxide"],
    vendorCountries: ["India", "Malaysia", "Indonesia", "China", "UAE"],
    vendorPools: ["IOI Group Malaysia", "Gujarat Alkali", "Reliance Industries", "Kronos TiO2", "Dow Chemical Asia"],
    materialCategories: ["Edible Oils", "Surfactants", "Packaging Materials", "Fragrances", "Preservatives"],
    exampleMaterials: ["Crude Palm Oil", "SDS Surfactant Flakes", "Shampoo HDPE Bottle", "TiO2 Whitening Agent", "Sodium Benzoate"],
  },
  {
    id: "construction",
    slug: "construction",
    label: "Construction (L&T Group)",
    companyCode: "LNTI",
    companyName: "Larsen & Toubro Ltd",
    purchasingOrg: "LTPO",
    plant: "LT01",
    storageLoc: "0001",
    currency: "INR",
    country: "India",
    fiscalYear: "2024",
    commodityKeys: ["TMT Rebar Steel", "Cement", "Copper Wiring", "Aluminum Cladding"],
    vendorCountries: ["India", "China", "UAE", "Germany", "UK"],
    vendorPools: ["SAIL India", "UltraTech Cement", "Hindalco Industries", "Havells India", "Boral Cement"],
    materialCategories: ["Structural Steel", "Concrete & Cement", "Electrical Installation", "Facade & Cladding", "HVAC Systems"],
    exampleMaterials: ["TMT Fe500D Rebar", "OPC 53 Grade Cement", "Copper Flex Cable", "Al Composite Panel", "Chiller Unit"],
  },
  {
    id: "semiconductor",
    slug: "semiconductor",
    label: "Semiconductor (Tata Elxsi)",
    companyCode: "TEXI",
    companyName: "Tata Elxsi Ltd",
    purchasingOrg: "TEPO",
    plant: "TE01",
    storageLoc: "0001",
    currency: "USD",
    country: "India",
    fiscalYear: "2024",
    commodityKeys: ["Silicon Wafers", "Rare Earth Oxides", "Tantalum", "Gold Bond Wire"],
    vendorCountries: ["Taiwan", "South Korea", "Japan", "USA", "Germany"],
    vendorPools: ["TSMC", "Samsung Foundry", "Shin-Etsu Chemical", "Materion Corp", "Heraeus Electronics"],
    materialCategories: ["Wafers & Substrates", "Chemical Mechanical Polish", "Photolithography", "Packaging", "Test Equipment"],
    exampleMaterials: ["300mm Si Wafer", "CMP Slurry SiO2", "EUV Photoresist", "BGA Solder Balls", "Gold Wire 25um"],
  },
  {
    id: "food",
    slug: "food",
    label: "Food & Beverage (ITC Ltd)",
    companyCode: "ITCL",
    companyName: "ITC Ltd",
    purchasingOrg: "ITPO",
    plant: "IT01",
    storageLoc: "0001",
    currency: "INR",
    country: "India",
    fiscalYear: "2024",
    commodityKeys: ["Wheat Flour", "Sugar", "Edible Vegetable Oil", "Corrugated Packaging"],
    vendorCountries: ["India", "Brazil", "Australia", "Canada", "Argentina"],
    vendorPools: ["FCI Wheat Procurement", "Bajaj Hindusthan Sugar", "Ruchi Soya", "Uflex Packaging", "Pratap Snacks"],
    materialCategories: ["Grain Ingredients", "Sweeteners", "Cooking Oils", "Spices & Flavours", "Consumer Packaging"],
    exampleMaterials: ["Atta Wheat Flour Bulk", "Refined Crystal Sugar", "Palm Olein Oil Drum", "Chilli Powder", "Flexible Laminate Pouch"],
  },
  {
    id: "telecom",
    slug: "telecom",
    label: "Telecom (Bharti Airtel)",
    companyCode: "BALI",
    companyName: "Bharti Airtel Ltd",
    purchasingOrg: "BAPO",
    plant: "BA01",
    storageLoc: "0001",
    currency: "INR",
    country: "India",
    fiscalYear: "2024",
    commodityKeys: ["Optical Fiber", "Copper Cat6 Cable", "Aluminum Tower Structure", "Silicon RF Chips"],
    vendorCountries: ["India", "China", "Finland", "South Korea", "USA"],
    vendorPools: ["Sterlite Technologies", "Huawei Networks", "Nokia India", "Samsung Networks", "Ericsson India"],
    materialCategories: ["Network Equipment", "Tower Infrastructure", "Fiber & Cable", "Power Systems", "CPE Devices"],
    exampleMaterials: ["G.652.D SM Fiber Spool", "Cat6A Patch Cable", "Galvanized Tower Leg", "4G RRU Module", "Li-Ion Tower Battery"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DETERMINISTIC PSEUDO-RANDOM HELPER (seeded by industry + row)
// ─────────────────────────────────────────────────────────────────────────────
function seededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function randInt(min: number, max: number, rng: () => number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, decimals: number, rng: () => number): number {
  return parseFloat((rng() * (max - min) + min).toFixed(decimals));
}

function sapDate(rng: () => number): string {
  const year = pick([2021, 2022, 2023, 2024], rng);
  const month = String(randInt(1, 12, rng)).padStart(2, "0");
  const day = String(randInt(1, 28, rng)).padStart(2, "0");
  return `${year}${month}${day}`;
}

function fiscalPeriod(rng: () => number): string {
  const year = pick(["2021", "2022", "2023", "2024"], rng);
  const period = String(randInt(1, 12, rng)).padStart(3, "0");
  return `${period}/${year}`;
}

// SAP 18-char material number
function matNum(industry: IndustryDef, i: number): string {
  const prefix = industry.id.toUpperCase().substring(0, 3);
  return `${prefix}-${String(i + 1).padStart(14, "0")}`.substring(0, 18);
}

// SAP vendor number (1000000–1999999)
function vendorNum(i: number): string {
  return String(1000000 + (i % 1000000)).padStart(10, "0");
}

// SAP customer number (2000000–2999999)
function customerNum(i: number): string {
  return String(2000000 + (i % 1000000)).padStart(10, "0");
}

// SAP PO document number (4500000000+)
function poNum(i: number): string {
  return String(4500000000 + i);
}

// SAP PO item (line items 00010, 00020, ...)
function poItem(i: number): string {
  return String((i + 1) * 10).padStart(5, "0");
}

// SAP journal document
function journalDoc(i: number): string {
  return String(1400000000 + i);
}

// SAP material document
function matDoc(i: number): string {
  return String(4900000000 + i);
}

// SAP info record
function infoRec(i: number): string {
  return String(5300000000 + i);
}

// SAP condition table record
function condNum(i: number): string {
  return String(900000000 + i);
}

// SAP business partner
function bpNum(i: number): string {
  return String(1000000 + i);
}

const UOM_MAP: Record<string, string> = {
  automobile: "PC", pharma: "KG", retail: "KG",
  aerospace: "KG", energy: "PC", fmcg: "KG",
  construction: "KG", semiconductor: "PC", food: "KG", telecom: "PC",
};

const PLANT_NAMES: Record<string, string> = {
  automobile: "Gurugram Plant", pharma: "Ankleshwar Plant", retail: "Navi Mumbai DC",
  aerospace: "Bangalore MRO", energy: "Noida Power Hub", fmcg: "Silvassa Factory",
  construction: "Chennai Yard", semiconductor: "Pune Design Centre", food: "Munger Factory", telecom: "Pune NOC",
};

const PAYMENT_TERMS = ["NT30", "NT45", "NT60", "NT90", "ZB01", "ZB14"];
const INCOTERMS = ["CIF", "FOB", "EXW", "DAP", "DDP", "CFR"];
const GL_ACCOUNTS = ["400000", "405000", "410000", "415000", "420000", "425000"];
const COST_CENTERS = ["CC1000", "CC1100", "CC1200", "CC2000", "CC2100", "CC3000"];
const PROFIT_CENTERS = ["PC1000", "PC1100", "PC2000", "PC2100", "PC3000", "PC3100"];

// ─────────────────────────────────────────────────────────────────────────────
// SHEET GENERATORS (500 records each, deterministic by industry seed)
// ─────────────────────────────────────────────────────────────────────────────
const N = 500; // records per sheet

type Row = Record<string, string | number | boolean>;

function genMARA(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 1000 + i + 1);
    const cat = pick(ind.materialCategories, rng);
    rows.push({
      MANDT: "100",
      MATNR: matNum(ind, i),
      ERSDA: sapDate(rng),
      ERNAM: pick(["PROCUSER", "SAPUSER", "BUYER01", "BUYER02"], rng),
      LAEDA: sapDate(rng),
      AENAM: pick(["PROCUSER", "SAPUSER"], rng),
      VPSTA: "KV",
      PSTAT: "KV",
      LVORM: "",
      MTART: pick(["ROH", "HALB", "FERT", "HIBE", "VERP"], rng),
      MBRSH: ind.id === "pharma" ? "P" : ind.id === "food" ? "F" : "M",
      MATKL: pick(["001", "002", "003", "004", "005", "010", "020"], rng),
      BISMT: "",
      MEINS: UOM_MAP[ind.id] ?? "PC",
      BSTME: UOM_MAP[ind.id] ?? "PC",
      ZEINR: `DRW-${String(i + 1).padStart(8, "0")}`,
      ZEIAR: "O",
      ZEIVR: "01",
      ZEIFO: "A4",
      AESZN: "01",
      BLATT: "1",
      BLANZ: "1",
      FERTH: "",
      FORMT: "",
      GROES: pick(["SMALL", "MEDIUM", "LARGE", "XL"], rng),
      WRKST: pick(ind.materialCategories, rng),
      NORMT: `NORM-${String(i + 1).padStart(5, "0")}`,
      LABOR: pick(["LAB01", "LAB02", "LAB03"], rng),
      EKWSL: "N001",
      BRGEW: randFloat(0.1, 500, 3, rng),
      NTGEW: randFloat(0.1, 450, 3, rng),
      GEWEI: "KG",
      VOLUM: randFloat(0.001, 10, 4, rng),
      VOLEH: "M3",
      BEHVO: "",
      RAUBE: "",
      TEMPB: "",
      DISST: "",
      TRAGR: "TG00",
      STOFF: "",
      SPART: pick(["01", "02", "03"], rng),
      KUNNR: customerNum(i),
      EINA: "1",
      MSTAE: "A0",
      MSTAV: "A0",
      MSTDE: sapDate(rng),
      MSTDV: sapDate(rng),
      KZUMW: "",
      XCHPF: "",
      VNACHWEIS: "",
      INH01: cat,
      INHALT: pick(ind.exampleMaterials, rng),
      MATBF: "",
      IPRKZ: "",
      RDMHF: "",
      PRZUS: "",
    });
  }
  return rows;
}

function genMARM(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  const altUom = [UOM_MAP[ind.id] ?? "PC", "KG", "L", "M", "M2", "M3", "PAL", "CTN"];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 2000 + i + 1);
    const baseUom = UOM_MAP[ind.id] ?? "PC";
    const altU = pick(altUom.filter(u => u !== baseUom), rng);
    rows.push({
      MANDT: "100",
      MATNR: matNum(ind, i),
      MEINH: altU,
      UMREZ: randInt(1, 100, rng),
      UMREN: 1,
      BMENG: randFloat(1, 10, 2, rng),
      BMEINS: baseUom,
      LGMNG: randFloat(1, 50, 2, rng),
      LGMEI: baseUom,
      MESRT: randFloat(0.1, 20, 3, rng),
      VOLUM: randFloat(0.001, 5, 4, rng),
      VOLEH: "M3",
      BRGEW: randFloat(0.1, 100, 3, rng),
      GEWEI: "KG",
      MAXKQ: randFloat(10, 1000, 2, rng),
      MEABG: "X",
      EAN11: `${ind.companyCode}${String(1000000000 + i).padStart(11, "0")}`.substring(0, 13),
      NUMTP: "EAN",
    });
  }
  return rows;
}

function genMARD(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  const slocs = ["0001", "0002", "0003", "0010", "0020"];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 3000 + i + 1);
    const unrestricted = randFloat(10, 5000, 3, rng);
    rows.push({
      MANDT: "100",
      MATNR: matNum(ind, i),
      WERKS: ind.plant,
      LGORT: pick(slocs, rng),
      LBLAB: unrestricted,
      EINME: randFloat(0, 500, 3, rng),
      AUSME: randFloat(0, 500, 3, rng),
      INSME: randFloat(0, 200, 3, rng),
      EINML: randFloat(0, 100, 3, rng),
      KEINM: randFloat(0, 50, 3, rng),
      UMLME: randFloat(0, 100, 3, rng),
      SPEME: randFloat(0, 50, 3, rng),
      RETME: randFloat(0, 30, 3, rng),
      MENGE: unrestricted,
      MEINS: UOM_MAP[ind.id] ?? "PC",
      LBKUM: randFloat(unrestricted * 0.9, unrestricted * 1.1, 3, rng),
      LBKUM_ALT: 0,
      LFGJA: ind.fiscalYear,
      LFMON: String(randInt(1, 12, rng)).padStart(2, "0"),
      BKLAS: pick(["3000", "3001", "3002", "7900"], rng),
    });
  }
  return rows;
}

function genMATDOC(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  const mvTypes = ["101", "102", "201", "202", "261", "262", "301", "311", "321"];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 4000 + i + 1);
    const qty = randFloat(1, 500, 3, rng);
    rows.push({
      MANDT: "100",
      MBLNR: matDoc(i),
      MJAHR: ind.fiscalYear,
      ZEILE: poItem(0),
      BWART: pick(mvTypes, rng),
      MATNR: matNum(ind, i),
      WERKS: ind.plant,
      LGORT: ind.storageLoc,
      CHARG: "",
      BEWTP: "B",
      BWTAR: "",
      BLDAT: sapDate(rng),
      BUDAT: sapDate(rng),
      BLART: "WE",
      XBLNR: `REF${String(9000000 + i)}`,
      BKTXT: `GR posting ${pick(ind.exampleMaterials, rng)}`,
      USNAM: pick(["STOREUSER", "WAREHSEML", "PROCWH01"], rng),
      TCODE: "MIGO",
      CPUDT: sapDate(rng),
      CPUTM: `${String(randInt(0, 23, rng)).padStart(2, "0")}:${String(randInt(0, 59, rng)).padStart(2, "0")}:00`,
      LIFNR: vendorNum(i),
      KUNNR: "",
      EBELN: poNum(i),
      EBELP: poItem(0),
      BUPOS: poItem(0),
      LFSNR: `DN${String(500000000 + i)}`,
      XAUTO: "",
      AUFNR: "",
      KOSTL: pick(COST_CENTERS, rng),
      KOKRS: "1000",
      WERTN: randFloat(qty * 10, qty * 500, 2, rng),
      WAERS: ind.currency,
      ERFMG: qty,
      ERFME: UOM_MAP[ind.id] ?? "PC",
      MENGE: qty,
      MEINS: UOM_MAP[ind.id] ?? "PC",
    });
  }
  return rows;
}

function genACDOCA(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  const docTypes = ["WE", "RE", "SA", "KR", "KZ", "ZP"];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 5000 + i + 1);
    const amt = randFloat(1000, 5000000, 2, rng);
    rows.push({
      MANDT: "100",
      RLDNR: "0L",
      RBUKRS: ind.companyCode,
      GJAHR: ind.fiscalYear,
      BELNR: journalDoc(i),
      DOCLN: String((i + 1) * 10).padStart(6, "0"),
      BLDAT: sapDate(rng),
      BUDAT: sapDate(rng),
      BLART: pick(docTypes, rng),
      POPER: String(randInt(1, 12, rng)).padStart(3, "0"),
      KTOSL: "BSX",
      RCLASS: "1000",
      RACCT: pick(GL_ACCOUNTS, rng),
      KOART: "S",
      AUGDT: sapDate(rng),
      AUGBL: journalDoc(i + 1),
      ZUONR: `ASS${String(i + 1).padStart(8, "0")}`,
      SGTXT: `Journal ${pick(ind.exampleMaterials, rng)}`,
      MATNR: matNum(ind, i),
      WERKS: ind.plant,
      LGORT: ind.storageLoc,
      BWTAR: "",
      CHARG: "",
      LIFNR: vendorNum(i),
      KUNNR: "",
      KOSTL: pick(COST_CENTERS, rng),
      PRCTR: pick(PROFIT_CENTERS, rng),
      GSBER: pick(["0001", "0002", "0003"], rng),
      SEGMENT: pick(["SEG001", "SEG002"], rng),
      KOKRS: "1000",
      AUFNR: "",
      EBELN: poNum(i),
      EBELP: poItem(0),
      MENGE: randFloat(1, 500, 3, rng),
      MEINS: UOM_MAP[ind.id] ?? "PC",
      DMBTR: amt,
      WRBTR: amt,
      TXKRS: randFloat(0.8, 1.2, 6, rng),
      PSWBT: amt,
      PSWSL: ind.currency,
      RHCUR: ind.currency,
      WAERS: ind.currency,
      HSL: amt,
      KSL: amt,
      OSL: amt,
      VSL: amt,
    });
  }
  return rows;
}

function genMBEW(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 6000 + i + 1);
    const price = randFloat(10, 50000, 2, rng);
    const qty = randFloat(10, 10000, 3, rng);
    rows.push({
      MANDT: "100",
      MATNR: matNum(ind, i),
      BWKEY: ind.plant,
      BWTAR: "",
      LFGJA: ind.fiscalYear,
      LFMON: String(randInt(1, 12, rng)).padStart(2, "0"),
      BKLAS: pick(["3000", "3001", "3002", "7900", "7920"], rng),
      VPRSV: pick(["S", "V"], rng),
      VERPR: price,
      STPRS: price * randFloat(0.95, 1.05, 4, rng),
      PEINH: 1,
      BPREIS: price,
      WAERS: ind.currency,
      LBKUM: qty,
      SALK3: qty * price,
      SALKV: qty * price * randFloat(0.98, 1.02, 4, rng),
      LPLPR: price * randFloat(0.9, 1.1, 2, rng),
      BWGEO: 0,
      BWGES: 0,
      VJSTP: price * randFloat(0.92, 1.08, 2, rng),
      VVJST: price * randFloat(0.85, 1.15, 2, rng),
      ZPLP2: 0,
      ZPLP3: 0,
      MLAST: sapDate(rng),
      LPLPD: sapDate(rng),
      PPRDZ: "001",
      PPRDL: "012",
      KALN1: randInt(100000, 999999, rng),
      KALNR: randInt(100000, 999999, rng),
      HLKNN: randInt(100000, 999999, rng),
      UNTTO: randInt(0, 5, rng),
      VIKAK: "",
      LSTPR: price * randFloat(0.88, 1.12, 2, rng),
      LAEPR: price * randFloat(0.9, 1.1, 2, rng),
      LAEDT: sapDate(rng),
    });
  }
  return rows;
}

function genEINA(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 7000 + i + 1);
    rows.push({
      MANDT: "100",
      INFNR: infoRec(i),
      MATNR: matNum(ind, i),
      LIFNR: vendorNum(i),
      EKORG: ind.purchasingOrg,
      WERKS: "",
      LOEKZ: "",
      ERDAT: sapDate(rng),
      ERNAM: pick(["BUYER01", "BUYER02", "BUYER03"], rng),
      LLFNR: vendorNum(i),
      URZOL: "",
      MWSKZ: pick(["I0", "I1", "V0", "V1"], rng),
      EFORM: pick(["NB", "FO", "LP"], rng),
      KFORM: "K",
      LTSNR: `CERT-${String(i + 1).padStart(8, "0")}`,
      NORMT: `ISO-${randInt(1000, 9999, rng)}`,
      BSTAE: "",
      WEBAZ: randInt(0, 30, rng),
      WEBAE: randInt(0, 5, rng),
      KZABS: "0",
      RDPRF: "",
      UMREZ: 1,
      UMREN: 1,
      SPINF: "",
      ABUFW: 0,
      MTPOS_MARA: "NORM",
      KOLIF: "",
      UEBPO: randInt(0, 10, rng),
      UNTPO: randInt(0, 5, rng),
    });
  }
  return rows;
}

function genEINE(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 8000 + i + 1);
    const netPrice = randFloat(10, 100000, 2, rng);
    rows.push({
      MANDT: "100",
      INFNR: infoRec(i),
      EKORG: ind.purchasingOrg,
      WERKS: ind.plant,
      ESOKZ: "0",
      DATAB: sapDate(rng),
      DATBI: `20261231`,
      APLFZ: randInt(1, 90, rng),
      MINBM: randFloat(1, 100, 2, rng),
      MXLIF: randFloat(100, 10000, 2, rng),
      MXFRW: randFloat(1000, 500000, 2, rng),
      MEINH: UOM_MAP[ind.id] ?? "PC",
      BPRME: UOM_MAP[ind.id] ?? "PC",
      UMREZ: 1,
      UMREN: 1,
      NETPR: netPrice,
      PEINH: 1,
      WAERS: ind.currency,
      BSTAE: "QM01",
      INCO1: pick(INCOTERMS, rng),
      INCO2: `${ind.country} Port`,
      KZAUT: "",
      MRPIND: "1",
      PRICELIST: "P001",
      NORBM: randFloat(10, 1000, 2, rng),
      WEBRE: "X",
      WEPOS: "X",
    });
  }
  return rows;
}

function genKONH(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  const condTypes = ["PB00", "PBXX", "RB00", "RA01", "ZPR0", "KP00"];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 9000 + i + 1);
    rows.push({
      MANDT: "100",
      KNUMH: condNum(i),
      KOSRT: "",
      KAPPL: pick(["M", "A", "V"], rng),
      KSCHL: pick(condTypes, rng),
      DATAB: sapDate(rng),
      DATBI: `20261231`,
      ERDAT: sapDate(rng),
      ERNAM: pick(["BUYER01", "PRICINGADM", "BUYER02"], rng),
      AEDAT: sapDate(rng),
      AENAM: pick(["BUYER01", "BUYER02"], rng),
      LOEKZ: "",
      KNUMA: `AGR-${String(i + 1).padStart(8, "0")}`,
      KSTAT: "C",
    });
  }
  return rows;
}

function genKONP(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  const condTypes = ["PB00", "PBXX", "RB00", "RA01", "ZPR0", "KP00"];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 10000 + i + 1);
    const amount = randFloat(1, 500000, 2, rng);
    rows.push({
      MANDT: "100",
      KNUMH: condNum(i),
      KOPOS: String((i % 50) + 1).padStart(4, "0"),
      KAPPL: pick(["M", "A", "V"], rng),
      KSCHL: pick(condTypes, rng),
      KBETR: amount,
      KPEIN: 1,
      KMEIN: UOM_MAP[ind.id] ?? "PC",
      WAERS: ind.currency,
      KKURS: randFloat(0.8, 1.3, 6, rng),
      KUFRE: randFloat(0, 10, 2, rng),
      KUMZA: 1,
      KUMNE: 1,
      KOEIN: UOM_MAP[ind.id] ?? "PC",
      LOEVM_KO: "",
      KZNEP: "",
      KAWRT: randFloat(amount * 0.9, amount * 1.1, 2, rng),
      STUFE: randInt(1, 5, rng),
      KHERK: "",
      KGRPE: "A",
      ZAEHK: i + 1,
      BOMAT: "",
      KNPRS: "A",
    });
  }
  return rows;
}

function genA016(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 11000 + i + 1);
    rows.push({
      MANDT: "100",
      KNUMH: condNum(i),
      KAPPL: "M",
      KSCHL: "PB00",
      KFORM: "K",
      DATAB: sapDate(rng),
      DATBI: `20261231`,
      LIFNR: vendorNum(i),
      EKORG: ind.purchasingOrg,
      WERKS: ind.plant,
      MATNR: matNum(ind, i),
      MEINS: UOM_MAP[ind.id] ?? "PC",
    });
  }
  return rows;
}

function genEKKO(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  const docCats = ["F", "K", "L", "U", "Q"];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 12000 + i + 1);
    rows.push({
      MANDT: "100",
      EBELN: poNum(i),
      BUKRS: ind.companyCode,
      BSTYP: pick(docCats, rng),
      BSART: pick(["NB", "FO", "ZSTO", "LP"], rng),
      LOEKZ: "",
      STATU: pick(["I", "B", "F"], rng),
      AEDAT: sapDate(rng),
      ERNAM: pick(["BUYER01", "BUYER02", "BUYER03"], rng),
      PINCR: pick(["1", "5", "10"], rng),
      LPONR: i + 1,
      LIFNR: vendorNum(i),
      EKORG: ind.purchasingOrg,
      EKGRP: pick(["001", "002", "003"], rng),
      WAERS: ind.currency,
      WKURS: 1,
      KUFIX: "",
      BEDAT: sapDate(rng),
      KDATB: sapDate(rng),
      KDATE: `20261231`,
      KDATV: `20261231`,
      BWBDT: sapDate(rng),
      ANGDT: sapDate(rng),
      BNDDT: sapDate(rng),
      GWLDT: sapDate(rng),
      AUSNR: `RFQ-${String(8000000 + i)}`,
      ANGNR: `QUOT-${String(8000000 + i)}`,
      IHRAN: "",
      IHREZ: "",
      VERKF: "",
      TELF1: `+91${randInt(7000000000, 9999999999, rng)}`,
      ANFNR: "",
      MSCHL: "",
      ZAHLG: "",
      ZTERM: pick(PAYMENT_TERMS, rng),
      ZBD1T: randInt(0, 30, rng),
      ZBD2T: randInt(0, 60, rng),
      ZBD3T: randInt(0, 90, rng),
      ZBD1P: randFloat(0, 5, 2, rng),
      ZBD2P: randFloat(0, 3, 2, rng),
      INCO1: pick(INCOTERMS, rng),
      INCO2: `${ind.country}`,
      BSTZD: "",
      UNSEZ: `${ind.companyCode}/PO/2024`,
      RESWK: ind.plant,
      SOBKZ: "",
      MWSKZ: pick(["I0", "I1", "V0"], rng),
      RLWRT: randFloat(10000, 50000000, 2, rng),
      KUFIX2: "",
      REVNO: `00${randInt(1, 9, rng)}`,
    });
  }
  return rows;
}

function genEKPO(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 13000 + i + 1);
    const qty = randFloat(1, 5000, 3, rng);
    const price = randFloat(10, 100000, 2, rng);
    rows.push({
      MANDT: "100",
      EBELN: poNum(i),
      EBELP: poItem(0),
      LOEKZ: "",
      STATU: pick(["I", "B", "F"], rng),
      AEDAT: sapDate(rng),
      TXZ01: pick(ind.exampleMaterials, rng),
      MATNR: matNum(ind, i),
      EMATN: matNum(ind, i),
      BUKRS: ind.companyCode,
      WERKS: ind.plant,
      LGORT: ind.storageLoc,
      BEDNR: `REQ-${String(i + 1).padStart(10, "0")}`,
      INFNR: infoRec(i),
      KRMNR: "",
      MATKL: pick(["001", "002", "003"], rng),
      INFCE: "",
      EKORG: ind.purchasingOrg,
      EKGRP: pick(["001", "002", "003"], rng),
      KTMNG: qty * 12,
      MENGE: qty,
      MEINS: UOM_MAP[ind.id] ?? "PC",
      NETPR: price,
      PEINH: 1,
      BPRME: UOM_MAP[ind.id] ?? "PC",
      WAERS: ind.currency,
      NETWR: qty * price,
      BRTWR: qty * price * 1.18,
      TAXAP: pick(["TX001", "TX002"], rng),
      REVLV: 0,
      EPSTP: "",
      BSTAE: "QM01",
      INCO1: pick(INCOTERMS, rng),
      INCO2: ind.country,
      MWSKZ: pick(["I0", "I1", "V0"], rng),
      EINDT: sapDate(rng),
      SKTOF: "X",
      WEPOS: "X",
      WEBRE: "X",
      REPOS: "X",
      WEUNB: "",
      RETPO: "",
      ELIKZ: "",
      EREKZ: "",
      KNTTP: "U",
      BANFN: `PR${String(i + 1).padStart(8, "0")}`,
      BNFPO: poItem(0),
    });
  }
  return rows;
}

function genBUT000(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  const bpTypes = ["1", "2", "3"]; // person, org, group
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 14000 + i + 1);
    rows.push({
      MANDT: "100",
      PARTNER: bpNum(i),
      TYPE: pick(bpTypes, rng),
      BPKIND: pick(["OR", "PE", "GR"], rng),
      BU_SORT1: `${ind.vendorPools[i % ind.vendorPools.length]} ${String(i + 1)}`.substring(0, 40),
      BU_SORT2: `${ind.country}-${String(i + 1).padStart(6, "0")}`,
      RLTYP: "FLVN00",
      BPEXT: vendorNum(i),
      VALID_FROM: sapDate(rng),
      VALID_TO: `20991231`,
      CREATED_ON: sapDate(rng),
      CREATED_AT: `${String(randInt(0, 23, rng)).padStart(2, "0")}:00:00`,
      CREATED_BY: pick(["SYSUSER", "PROCUSER", "ADMINUSR"], rng),
      CHANGED_ON: sapDate(rng),
      CHANGED_AT: `${String(randInt(0, 23, rng)).padStart(2, "0")}:00:00`,
      CHANGED_BY: pick(["SYSUSER", "PROCUSER"], rng),
      XBLCK: "",
      NAME_ORG1: `${pick(ind.vendorPools, rng)} ${String(i + 1)}`.substring(0, 40),
      NAME_ORG2: "",
      COUNTRY: pick(ind.vendorCountries, rng),
      LANGU: "EN",
      ISOALPHA2: "IN",
    });
  }
  return rows;
}

function genLFA1(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 15000 + i + 1);
    const cntry = pick(ind.vendorCountries, rng);
    rows.push({
      MANDT: "100",
      LIFNR: vendorNum(i),
      LAND1: cntry.substring(0, 2).toUpperCase(),
      NAME1: `${pick(ind.vendorPools, rng)} ${String(i + 1)}`.substring(0, 35),
      NAME2: "",
      NAME3: "",
      NAME4: "",
      ORT01: pick(["Mumbai", "Pune", "Chennai", "Bangalore", "Delhi", "Tokyo", "Berlin", "Paris", "Shenzhen"], rng),
      ORT02: "",
      PSTLZ: String(randInt(100000, 999999, rng)),
      STRAS: `${randInt(1, 999, rng)} Industrial Area`,
      PFACH: "",
      TELF1: `+${randInt(1, 99, rng)} ${randInt(1000000000, 9999999999, rng)}`,
      TELFX: `+${randInt(1, 99, rng)} ${randInt(1000000000, 9999999999, rng)}`,
      XCPDK: "",
      ADRNR: `ADR${String(i + 1).padStart(8, "0")}`,
      AUFSD: "",
      LOEVM: "",
      SPERR: "",
      SPERM: "",
      KTOKK: pick(["0001", "0002", "0003"], rng),
      KONZS: "",
      VBUND: "",
      ERDAT: sapDate(rng),
      ERNAM: pick(["PROCADMIN", "SYSADMIN"], rng),
      STCD1: `${cntry.substring(0, 2).toUpperCase()}${randInt(100000000, 999999999, rng)}`,
      STCD2: "",
      STKZU: "X",
      STKZN: "X",
      BUREAUTH: "X",
    });
  }
  return rows;
}

function genKNA1(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  const customers = [`${ind.companyName} B2B Client`, "Government Agency", "Infrastructure Corp", "Distribution Partner", "Subsidiary Entity"];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 16000 + i + 1);
    rows.push({
      MANDT: "100",
      KUNNR: customerNum(i),
      LAND1: ind.country.substring(0, 2).toUpperCase(),
      NAME1: `${pick(customers, rng)} ${String(i + 1)}`.substring(0, 35),
      NAME2: "",
      ORT01: pick(["Mumbai", "Delhi", "Kolkata", "Bangalore", "Hyderabad"], rng),
      ORT02: "",
      PSTLZ: String(randInt(100000, 999999, rng)),
      STRAS: `${randInt(1, 999, rng)} Commercial Zone`,
      TELF1: `+91${randInt(7000000000, 9999999999, rng)}`,
      XCPDK: "",
      ADRNR: `CADR${String(i + 1).padStart(7, "0")}`,
      AUFSD: "",
      LOEVM: "",
      SPERR: "",
      SPERM: "",
      KTOKD: pick(["0001", "0002", "Z001"], rng),
      KONZS: "",
      VBUND: "",
      ERDAT: sapDate(rng),
      ERNAM: pick(["SDADMIN", "SYSADMIN"], rng),
      STCD1: `IN${randInt(100000000, 999999999, rng)}`,
      STCD2: "",
      STKZU: "X",
    });
  }
  return rows;
}

function genLFB1(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 17000 + i + 1);
    rows.push({
      MANDT: "100",
      LIFNR: vendorNum(i),
      BUKRS: ind.companyCode,
      PERNR: "",
      ERDAT: sapDate(rng),
      ERNAM: pick(["FIADMIN", "PROCADMIN"], rng),
      AKONT: pick(["160000", "161000", "162000"], rng),
      FDGRV: "",
      BEGRU: "",
      RECALL: "X",
      ZUAWA: "001",
      TOGRP: "",
      HBKID: pick(["HDFC", "SBI", "ICICI", "BNP", "MUFG"], rng),
      HKTID: `ACC${String(randInt(100000, 999999, rng))}`,
      ZAHLS: "C",
      ZTERM: pick(PAYMENT_TERMS, rng),
      EIKTO: `EXT-${String(i + 1).padStart(8, "0")}`,
      ZSABE: "",
      FDTLV: pick(["A", "B", "C"], rng),
      BUSAB: pick(["01", "02", "03"], rng),
      LNRZA: "",
      REPRF: "X",
      PERNR2: "",
      CEDAT: sapDate(rng),
      ABSBT: "",
      LOEVM: "",
      SPERR: "",
      SPERM: "",
      VRSDZ: pick(["001", "002", "003"], rng),
      LIBDV: randInt(0, 30, rng),
      INTAD: `${pick(ind.vendorPools, rng).replace(/ /g, "").toLowerCase()}@vendor.com`.substring(0, 40),
    });
  }
  return rows;
}

function genLFM1(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 18000 + i + 1);
    rows.push({
      MANDT: "100",
      LIFNR: vendorNum(i),
      EKORG: ind.purchasingOrg,
      EKGRP: pick(["001", "002", "003"], rng),
      ERDAT: sapDate(rng),
      ERNAM: pick(["BUYER01", "PROCADMIN"], rng),
      SPERM: "",
      LOEVM: "",
      DATLM: sapDate(rng),
      WAERS: ind.currency,
      MINBM: randFloat(1, 100, 2, rng),
      MXLIF: randFloat(1000, 10000000, 2, rng),
      INCO1: pick(INCOTERMS, rng),
      INCO2: ind.country,
      ZTERM: pick(PAYMENT_TERMS, rng),
      KALSK: pick(["01", "02", "03"], rng),
      KZAUT: "",
      WEBRE: "X",
      WEPOS: "X",
      REPOS: "X",
      ABSKZ: "",
      NRGLD: "X",
      PRFRE: "X",
      LIEFF: "X",
      LIPFE: "",
      MWSKZ: pick(["I0", "I1", "V0", "V1"], rng),
      ABUFW: 0,
    });
  }
  return rows;
}

function genLFM2(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 19000 + i + 1);
    rows.push({
      MANDT: "100",
      LIFNR: vendorNum(i),
      EKORG: ind.purchasingOrg,
      WERKS: ind.plant,
      SPERM: "",
      LOEVM: "",
      DATLM: sapDate(rng),
      ERDAT: sapDate(rng),
      ERNAM: pick(["BUYER01", "PROCADMIN"], rng),
      APLZL: randInt(1, 90, rng),
      MINBM: randFloat(1, 100, 2, rng),
      MXLIF: randFloat(100, 500000, 2, rng),
      WEBRE: "X",
      WEPOS: "X",
      REPOS: "X",
      KZRET: "",
      LIEFF: "X",
      MWSKZ: pick(["I0", "I1", "V0", "V1"], rng),
    });
  }
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
// NEW PTP TABLE GENERATORS — from SAP_S4HANA_Table_Field_Structures.xlsx
// Tables: EBAN, EKET, EKBE, EKKN, EORD, EKAB, MVER, MBEWH, EBKN
// ─────────────────────────────────────────────────────────────────────────────

/** EBAN — Purchase Requisition (ME51N/ME52N) */
function genEBAN(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  const statuses = ["N", "A", "B", "R", "S"]; // Open, In Process, PO created, Rejected, Closed
  const bsartTypes = ["NB", "RO", "UB"];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 17000 + i + 1);
    const qty = randFloat(1, 2000, 3, rng);
    const price = randFloat(10, 100000, 2, rng);
    const converted = rng() > 0.5;
    rows.push({
      MANDT:  "100",
      BANFN:  `PR${String(1000000000 + i)}`,
      BNFPO:  poItem(0),
      BSART:  pick(bsartTypes, rng),
      BADAT:  sapDate(rng),
      MATNR:  matNum(ind, i),
      WERKS:  ind.plant,
      LGORT:  ind.storageLoc,
      MENGE:  qty,
      MEINS:  UOM_MAP[ind.id] ?? "PC",
      PREIS:  price,
      PEINH:  1,
      WAERS:  ind.currency,
      LIFNR:  converted ? vendorNum(i) : "",
      FLIFNR: vendorNum(Math.floor(rng() * N)),
      EKGRP:  pick(["EG1", "EG2", "EG3"], rng),
      EKORG:  `${ind.companyCode.substring(0, 2)}PO`,
      EBELN:  converted ? poNum(i) : "",
      EBELP:  converted ? poItem(0) : "",
      BANPR:  pick(statuses, rng),
      ESTKZ:  pick(["B", "F", "K", ""], rng),
      LOEKZ:  "",
      AFNAM:  pick(["REQSTUSER", "PROCBUYER", "STOREKEEPER"], rng),
      KOSTL:  pick(COST_CENTERS, rng),
      PRCTR:  pick(PROFIT_CENTERS, rng),
      SAKTO:  pick(GL_ACCOUNTS, rng),
      TXZ01:  `${pick(ind.exampleMaterials, rng)} REQ`.substring(0, 40),
    });
  }
  return rows;
}

/** EKET — Delivery Schedule Lines (for PO / Scheduling Agreement) */
function genEKET(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 18000 + i + 1);
    const schedQty = randFloat(1, 1000, 3, rng);
    const grQty    = schedQty * randFloat(0.8, 1.0, 4, rng);
    rows.push({
      MANDT:  "100",
      EBELN:  poNum(i),
      EBELP:  poItem(0),
      ETENR:  String(randInt(1, 9, rng)).padStart(4, "0"),
      EINDT:  sapDate(rng),
      SLFDT:  sapDate(rng),
      MENGE:  schedQty,
      WEMNG:  grQty,
      REMNG:  schedQty - grQty,
      MEINS:  UOM_MAP[ind.id] ?? "PC",
      REPOS:  grQty > 0 ? "X" : "",
      BANFN:  `PR${String(1000000000 + i)}`,
    });
  }
  return rows;
}

/** EKBE — PO History (Goods Receipt / Invoice Receipt / Returns) */
function genEKBE(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  const vgabe = ["1", "2", "3", "4"]; // 1=GR, 2=IR, 3=Subsequent Debit, 4=Return
  const bwarts  = ["101", "102", "103", "104", "501", "122"];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 19000 + i + 1);
    const qty  = randFloat(1, 500, 3, rng);
    const val  = qty * randFloat(10, 50000, 2, rng);
    const vg   = pick(vgabe, rng);
    rows.push({
      MANDT:  "100",
      EBELN:  poNum(i),
      EBELP:  poItem(0),
      ZEKKN:  "01",
      VGABE:  vg,
      GJAHR:  ind.fiscalYear,
      BELNR:  journalDoc(i),
      BUZEI:  String(randInt(1, 9, rng)).padStart(4, "0"),
      BEWTP:  vg === "1" ? "E" : "R",
      BWART:  pick(bwarts, rng),
      BUDAT:  sapDate(rng),
      MENGE:  qty,
      MEINS:  UOM_MAP[ind.id] ?? "PC",
      DMBTR:  val,
      WAERS:  ind.currency,
      SHKZG:  rng() > 0.8 ? "H" : "S",
      MATNR:  matNum(ind, i),
    });
  }
  return rows;
}

/** EKKN — Account Assignment in Purchasing Document */
function genEKKN(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  const knttps = ["K", "F", "P", "A", ""]; // cost centre, order, project, asset
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 20000 + i + 1);
    rows.push({
      MANDT:  "100",
      EBELN:  poNum(i),
      EBELP:  poItem(0),
      ZEKKN:  "01",
      KNTTP:  pick(knttps, rng),
      VPROZ:  100,
      SAKTO:  pick(GL_ACCOUNTS, rng),
      KOSTL:  pick(COST_CENTERS, rng),
      PRCTR:  pick(PROFIT_CENTERS, rng),
      AUFNR:  rng() > 0.7 ? `ORD${String(randInt(100000, 999999, rng))}` : "",
      PSPNR:  "",
      ANLN1:  "",
      NPLNR:  "",
    });
  }
  return rows;
}

/** EORD — Source List (approved vendor list per material/plant) */
function genEORD(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 21000 + i + 1);
    rows.push({
      MANDT:  "100",
      MATNR:  matNum(ind, i),
      WERKS:  ind.plant,
      ZEORD:  String(randInt(1, 5, rng)).padStart(4, "0"),
      DATAB:  sapDate(rng),
      DATED:  "20991231",
      LIFNR:  vendorNum(i),
      EKORG:  `${ind.companyCode.substring(0, 2)}PO`,
      EBELN:  rng() > 0.5 ? poNum(i) : "",
      EBELP:  rng() > 0.5 ? poItem(0) : "",
      VDATU:  sapDate(rng),
      BDATU:  "20991231",
      FLIFNR: vendorNum(i + 1),
      MFRNR:  rng() > 0.7 ? vendorNum(i + 2) : "",
      FIXKZ:  rng() > 0.8 ? "X" : "",   // fixed source indicator
    });
  }
  return rows;
}

/** EKAB — Release Documentation for Contracts (call-off releases) */
function genEKAB(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 22000 + i + 1);
    const qty = randFloat(1, 500, 3, rng);
    rows.push({
      MANDT:  "100",
      EBELN:  `45${String(10000000 + i)}`.substring(0, 10), // contract number
      EBELP:  poItem(0),
      ABRUF:  String(randInt(1, 999, rng)).padStart(10, "0"),
      ABRDT:  sapDate(rng),
      ABLAD:  sapDate(rng),
      ABRME:  UOM_MAP[ind.id] ?? "PC",
      ABRMG:  qty,
      EBELN2: poNum(i),  // linked release PO
      EBELP2: poItem(0),
      LOEKZ:  "",
    });
  }
  return rows;
}

/** MVER — Material Consumption (Actual Usage) */
function genMVER(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 23000 + i + 1);
    rows.push({
      MANDT:  "100",
      MATNR:  matNum(ind, i),
      WERKS:  ind.plant,
      PERKZ:  "M",          // M=monthly
      LFGJA:  ind.fiscalYear,
      LFMON:  String(randInt(1, 12, rng)).padStart(2, "0"),
      VBWGK:  pick(["0", "1", "2"], rng),
      GISSM:  randFloat(0, 2000, 3, rng),   // total issues current month
      VBSM:   randFloat(0, 500, 3, rng),    // withdrawals for orders
      ENMNG:  randFloat(0, 100, 3, rng),    // sampling
      BWGME:  UOM_MAP[ind.id] ?? "PC",
      VBEW1:  randFloat(0, 2000, 3, rng),   // forecast period 1
      VBEW2:  randFloat(0, 2000, 3, rng),   // forecast period 2
      VBEW3:  randFloat(0, 2000, 3, rng),
    });
  }
  return rows;
}

/** MBEWH — Material Valuation - History (price evolution) */
function genMBEWH(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 24000 + i + 1);
    const basePrice = randFloat(10, 50000, 2, rng);
    rows.push({
      MANDT:  "100",
      MATNR:  matNum(ind, i),
      BWKEY:  ind.plant,
      BWTAR:  "",
      LFGJA:  ind.fiscalYear,
      LFMON:  String(randInt(1, 12, rng)).padStart(2, "0"),
      BKLAS:  pick(["3000", "3001", "7900", "7920"], rng),
      VPRSV:  pick(["S", "V"], rng),
      VERPR:  basePrice,
      STPRS:  basePrice * randFloat(0.95, 1.05, 4, rng),
      PEINH:  1,
      WAERS:  ind.currency,
      LBKUM:  randFloat(10, 10000, 3, rng),
      SALK3:  randFloat(1000, 50000000, 2, rng),
    });
  }
  return rows;
}

/** EBKN — Purchase Requisition Account Assignment */
function genEBKN(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  const knttps = ["K", "F", "P", "A", ""];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 25000 + i + 1);
    rows.push({
      MANDT:  "100",
      BANFN:  `PR${String(1000000000 + i)}`,
      BNFPO:  poItem(0),
      ZEBNF:  "01",
      KNTTP:  pick(knttps, rng),
      VPROZ:  100,
      SAKTO:  pick(GL_ACCOUNTS, rng),
      KOSTL:  pick(COST_CENTERS, rng),
      PRCTR:  pick(PROFIT_CENTERS, rng),
      AUFNR:  rng() > 0.7 ? `ORD${String(randInt(100000, 999999, rng))}` : "",
    });
  }
  return rows;
}

function genKNB1(ind: IndustryDef): Row[] {
  const rows: Row[] = [];
  for (let i = 0; i < N; i++) {
    const rng = seededRand(ind.id.charCodeAt(0) * 20000 + i + 1);
    rows.push({
      MANDT: "100",
      KUNNR: customerNum(i),
      BUKRS: ind.companyCode,
      ERDAT: sapDate(rng),
      ERNAM: pick(["SDADMIN", "FIADMIN"], rng),
      AKONT: pick(["140000", "141000", "142000"], rng),
      BEGRU: "",
      HBKID: pick(["HDFC", "SBI", "ICICI"], rng),
      HKTID: `CACC${String(randInt(100000, 999999, rng))}`,
      ZAHLS: "C",
      ZTERM: pick(PAYMENT_TERMS, rng),
      ZUAWA: "001",
      FDGRV: "",
      REPRF: "X",
      BUSAB: pick(["01", "02", "03"], rng),
      VRSDZ: pick(["001", "002"], rng),
      LIBDV: randInt(0, 30, rng),
      LOEVM: "",
      SPERR: "",
      SPERM: "",
      CPDKZ: "",
      ALTKN: "",
      TLFXS: `+91${randInt(7000000000, 9999999999, rng)}`,
      INTAD: `customer${String(i + 1)}@${ind.companyName.replace(/ /g, "").toLowerCase()}.com`.substring(0, 50),
    });
  }
  return rows;
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLE REGISTRY
// ─────────────────────────────────────────────────────────────────────────────
interface TableDef {
  name: string;
  description: string;
  generator: (ind: IndustryDef) => Row[];
}

const SAP_TABLES: TableDef[] = [
  { name: "MARA",   description: "General Material Data",                        generator: genMARA },
  { name: "MARM",   description: "Units of Measure per Material",               generator: genMARM },
  { name: "MARD",   description: "Storage Location Data for Material",          generator: genMARD },
  { name: "MATDOC", description: "Material Document Header",                    generator: genMATDOC },
  { name: "ACDOCA", description: "Universal Journal Entry Line Items",          generator: genACDOCA },
  { name: "MBEW",   description: "Material Valuation",                          generator: genMBEW },
  { name: "MBEWH",  description: "Material Valuation - History",                generator: genMBEWH },
  { name: "EINA",   description: "Purchasing Info Record - General",            generator: genEINA },
  { name: "EINE",   description: "Purchasing Info Record - Purch Org",          generator: genEINE },
  { name: "KONH",   description: "Condition Header",                            generator: genKONH },
  { name: "KONP",   description: "Condition Item",                              generator: genKONP },
  { name: "A016",   description: "Info Record Condition Table",                 generator: genA016 },
  { name: "EKKO",   description: "Purchasing Document Header",                  generator: genEKKO },
  { name: "EKPO",   description: "Purchasing Document Item",                    generator: genEKPO },
  { name: "EBAN",   description: "Purchase Requisition",                        generator: genEBAN },
  { name: "EBKN",   description: "PR Account Assignment",                       generator: genEBKN },
  { name: "EKET",   description: "Delivery Schedule Lines (PO / SA)",           generator: genEKET },
  { name: "EKBE",   description: "PO History (GR/IR)",                          generator: genEKBE },
  { name: "EKKN",   description: "Account Assignment in PO",                   generator: genEKKN },
  { name: "EORD",   description: "Source List (Approved Vendors)",              generator: genEORD },
  { name: "EKAB",   description: "Contract Release Documentation",              generator: genEKAB },
  { name: "MVER",   description: "Material Consumption (Actual Usage)",         generator: genMVER },
  { name: "BUT000", description: "Business Partner General Data",               generator: genBUT000 },
  { name: "LFA1",   description: "Vendor Master - General Data",                generator: genLFA1 },
  { name: "KNA1",   description: "Customer Master - General Data",              generator: genKNA1 },
  { name: "LFB1",   description: "Vendor Master - Company Code Data",           generator: genLFB1 },
  { name: "LFM1",   description: "Vendor Master - Purchasing Org Data",         generator: genLFM1 },
  { name: "LFM2",   description: "Vendor Master - Purchasing Org Data 2",       generator: genLFM2 },
  { name: "KNB1",   description: "Customer Master - Company Code Data",         generator: genKNB1 },
];

// ─────────────────────────────────────────────────────────────────────────────
// WORKBOOK WRITER
// ─────────────────────────────────────────────────────────────────────────────
async function writeIndustryWorkbook(ind: IndustryDef, outDir: string): Promise<void> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "WatsonXSAPCommodity Seed";
  wb.created = new Date();
  wb.modified = new Date();

  console.log(`  → Generating ${SAP_TABLES.length} sheets × ${N} rows for [${ind.label}]...`);
  const start = Date.now();

  for (const tbl of SAP_TABLES) {
    const rows = tbl.generator(ind);
    const ws = wb.addWorksheet(tbl.name, {
      properties: { tabColor: { argb: "FF4F46E5" } },
    });

    if (rows.length === 0) continue;
    const columns = Object.keys(rows[0]);

    ws.columns = columns.map((k) => ({
      header: k,
      key: k,
      width: Math.max(k.length + 4, 14),
    }));

    // Header style
    const headerRow = ws.getRow(1);
    headerRow.height = 18;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 9, color: { argb: "FFFFFFFF" } };
      cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1E3A5F" } };
      cell.alignment = { vertical: "middle", horizontal: "center" };
    });

    // Data rows (streamed)
    for (const row of rows) {
      ws.addRow(row);
    }

    // Freeze top row
    ws.views = [{ state: "frozen", xSplit: 0, ySplit: 1 }];
  }

  const filePath = path.join(outDir, "master_data.xlsx");
  await wb.xlsx.writeFile(filePath);
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`  ✓ Written: ${filePath} (${elapsed}s, ${SAP_TABLES.length} sheets × ${N} rows)`);
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────
async function main(): Promise<void> {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dataRoot = path.resolve(__dirname, "..", "data", "industries");

  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  SAP S/4HANA Industry Seed Script — WatsonXSAPCommodity");
  console.log(`  Seeding ${INDUSTRIES.length} industries × ${SAP_TABLES.length} tables × ${N} records`);
  console.log("═══════════════════════════════════════════════════════════════\n");

  for (const ind of INDUSTRIES) {
    const indDir = path.join(dataRoot, ind.slug);
    fs.mkdirSync(indDir, { recursive: true });

    const filePath = path.join(indDir, "master_data.xlsx");
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // idempotent: delete before regenerating
    }

    console.log(`\n[${ind.id.toUpperCase()}] ${ind.label} (${ind.companyCode})`);
    await writeIndustryWorkbook(ind, indDir);
  }

  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log(`  ✅ All ${INDUSTRIES.length} industry workbooks seeded successfully.`);
  console.log("═══════════════════════════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
