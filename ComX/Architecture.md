# WatsonXSAPCommodity — Architecture & API Reference

## Overview

Full-stack TypeScript application combining SAP S/4HANA Material Master analytics with AI-driven procurement strategy, live commodity price fetching, and a 10-industry SAP Excel database.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Express.js (served via Vite middleware in dev) |
| AI (Primary) | IBM watsonx (Granite 3 8B Instruct) |
| AI (Fallback) | Google Gemini (gemini-1.5-flash) |
| Excel I/O | `exceljs` (new endpoints) + `xlsx` (legacy) |
| Language | TypeScript (strict) |
| Seed Script | `scripts/seedIndustryData.ts` via `npx tsx` |

---

## Industry Registry (10 industries)

| Slug | Label | Company Code | Currency |
|---|---|---|---|
| `automobile` | Automobile (Maruti Suzuki) | MSIN | INR |
| `pharma` | Pharma (Sun Pharma) | SPIL | INR |
| `retail` | Retail (Reliance Retail) | RRIL | INR |
| `aerospace` | Aerospace & Defence (HAL) | HALI | INR |
| `energy` | Energy & Utilities (NTPC) | NTPC | INR |
| `fmcg` | FMCG (Hindustan Unilever) | HULI | INR |
| `construction` | Construction (L&T Group) | LNTI | INR |
| `semiconductor` | Semiconductor (Tata Elxsi) | TEXI | USD |
| `food` | Food & Beverage (ITC Ltd) | ITCL | INR |
| `telecom` | Telecom (Bharti Airtel) | BALI | INR |

---

## SAP Table Coverage (per industry Excel workbook)

Each industry workbook at `data/industries/<slug>/master_data.xlsx` contains **20 sheets × 500 records**:

| Sheet | SAP Table | Description |
|---|---|---|
| MARA | MARA | General Material Data |
| MARM | MARM | Units of Measure per Material |
| MARD | MARD | Storage Location Data for Material |
| MATDOC | MATDOC | Material Document Header |
| ACDOCA | ACDOCA | Universal Journal Entry Line Items |
| MBEW | MBEW | Material Valuation |
| EINA | EINA | Purchasing Info Record — General Data |
| EINE | EINE | Purchasing Info Record — Purch Org Data |
| KONH | KONH | Condition Header |
| KONP | KONP | Condition Item |
| A016 | A016 | Info Record Condition Table |
| EKKO | EKKO | Purchasing Document Header |
| EKPO | EKPO | Purchasing Document Item |
| BUT000 | BUT000 | Business Partner General Data |
| LFA1 | LFA1 | Vendor Master — General Data |
| KNA1 | KNA1 | Customer Master — General Data |
| LFB1 | LFB1 | Vendor Master — Company Code Data |
| LFM1 | LFM1 | Vendor Master — Purchasing Org Data |
| LFM2 | LFM2 | Vendor Master — Purchasing Org Data 2 |
| KNB1 | KNB1 | Customer Master — Company Code Data |

---

## API Endpoints

### Legacy Dashboard APIs (existing)

| Method | Path | Description |
|---|---|---|
| GET | `/api/materials?industry=<slug>` | Returns materials array for legacy dashboard (reads from `data/sap_*.xlsx`) |
| GET | `/api/commodities?industry=<slug>` | Returns commodities array |
| GET | `/api/geopolitical-risks?industry=<slug>` | Returns geopolitical risk array |
| GET | `/api/excel/info` | Returns metadata for the 3 legacy Excel files |
| POST | `/api/excel/update-materials` | Saves materials back to legacy Excel |
| POST | `/api/excel/update-commodities` | Saves commodities back to legacy Excel |
| POST | `/api/excel/update-risks` | Saves risks back to legacy Excel |
| POST | `/api/analyze-boms` | AI BOM commodity mapping (WatsonX → Gemini → local fallback) |
| POST | `/api/generate-strategy` | AI strategy memo generation (WatsonX → Gemini → local template) |

### New Industry APIs (v2)

| Method | Path | Description |
|---|---|---|
| GET | `/api/industries` | Returns all 10 industries with `id`, `slug`, `label`, `companyCode`, `currency`, `commodityKeys[4]`, `available` |
| GET | `/api/industry/:slug/tables` | Returns list of sheet names in the industry workbook |
| GET | `/api/industry/:slug/data/:table` | Returns paginated JSON rows from a SAP table sheet |
| POST | `/api/industry/:slug/refresh` | Fetches live commodity prices (Yahoo Finance) and writes to `LivePrices` sheet |

#### `GET /api/industries` Response
```json
[
  {
    "id": "automobile",
    "slug": "automobile",
    "label": "Automobile (Maruti Suzuki)",
    "companyCode": "MSIN",
    "currency": "INR",
    "commodityKeys": ["Copper", "Steel HRC", "Aluminum", "Nickel"],
    "available": true
  }
]
```

#### `GET /api/industry/:slug/data/:table` Query Params
- `limit` (optional, integer): max rows to return (default: all)
- `offset` (optional, integer): row offset for pagination (default: 0)

#### `GET /api/industry/:slug/data/:table` Response
```json
{
  "industry": "automobile",
  "table": "MARA",
  "total": 500,
  "offset": 0,
  "limit": 500,
  "rows": [{ "MANDT": "100", "MATNR": "AUT-00000000000001", ... }]
}
```

#### `POST /api/industry/:slug/refresh` Response
```json
{
  "success": true,
  "industry": "automobile",
  "timestamp": "2024-07-15T10:30:00.000Z",
  "results": [
    { "ticker": "HG=F", "price": 4.12, "currency": "USD", "timestamp": "..." }
  ]
}
```

---

## Seed Script

```bash
# Generate all 10 industry workbooks (idempotent — safe to re-run)
npx tsx scripts/seedIndustryData.ts
```

- Output: `data/industries/<slug>/master_data.xlsx`  
- Records per workbook: 20 tables × 500 rows = 10,000 rows  
- Total across all industries: 100,000 rows  
- Deterministic: same seed → same output  
- Idempotent: deletes existing file before regenerating  

---

## Environment Variables

See `.env.example` for all required and optional variables.

Required for AI features:
- `WATSONX_API_KEY` — IBM Cloud API key
- `WATSONX_PROJECT_ID` — watsonx project ID
- `GEMINI_API_KEY` — Google AI Studio key (fallback)

No key required for:
- Live price fetch (`/api/industry/:slug/refresh`) — uses Yahoo Finance public endpoint
- SAP seed script — purely local, no network calls

---

## Development

```bash
npm run dev      # starts Express + Vite on http://localhost:3000
npm run build    # production build
npm run lint     # TypeScript strict check
```
