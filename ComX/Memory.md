# Memory.md — WatsonX SAP Commodity Pricing
> Append-only. Never edit past entries. Format: `## DD-MMM-YYYY HH:MM`

---

## 11-Jul-2025 00:00
**Prompt**: Build AI-powered SAP commodity price tracker using WatsonX — map procurement materials to commodity indices, show price exposure.
**Action**: Built TypeScript/Vite/React app with WatsonX AI service (3-tier fallback), SAP material→commodity mapping, procurement risk summarizer. Shared `watsonx.ts` service with IAM token caching.
**Result**: ✅ Working — UI renders commodity weights per material, risk summary via AI.

## 12-Jul-2025 03:00
**Prompt**: Apply GLOBAL_RULES.md standards to all projects. Rewrite project-specific Rules.md.
**Action**: Rewrote `Rules.md` to be project-specific only (references `../GLOBAL_RULES.md`). Removed duplicated global infra content. Created `Memory.md`, `Architecture.md`, `skills.md`.
**Result**: ✅ Documentation aligned with workspace standards.

## 12-Jul-2025 04:00
**Prompt**: AUDIT — fix all projects. WatsonXSAPCommodity was using Gemini-only (GLOBAL_RULES §1 violation).
**Action**: Added inline WatsonX helper to `server.ts`. `/api/analyze-boms` now tries WatsonX first, falls through to Gemini, then to local keyword heuristic. Stripped real API keys from `.env.example`.
**Result**: ✅ `tsc --noEmit` clean. WatsonX-first chain operational.


## 13-Jul-2025 (SAP PTP DB + MCP Rules + PTP UI)

**Prompt**: (1) Read SAP DB Excel files in `.bob/SAP DB/`, add missing PTP tables to seed script. (2) Update frontend with PTP fields. (3) Update GLOBAL_RULES.md with full MCP registry from `.bob/Online Git MCP/`.

**Action**:
- Part 1 — SAP PTP Excel DB:
  - Read `SAP_S4HANA_Table_Field_Structures.xlsx` (44 SAP tables across Material Master, Purchasing, Vendor Master, Forecasting categories)
  - `.xls` file format is unsupported — only `.xlsx` was parsed
  - Identified 9 missing PTP tables vs. the existing 20-table seed script
  - Added to `scripts/seedIndustryData.ts`: `EBAN` (Purchase Requisition), `EKET` (Delivery Schedule Lines), `EKBE` (PO History GR/IR), `EKKN` (PO Account Assignment), `EORD` (Source List), `EKAB` (Contract Releases), `MVER` (Material Consumption), `MBEWH` (Valuation History), `EBKN` (PR Account Assignment)
  - Total seed tables: 20 → 29 (500 rows each × 10 industries = 14,500 new rows per full seed run)
  - All new generators use authentic SAP field names: BANFN, BNFPO, BANPR, EBELN, EBELP, VGABE, BWART, EINDT, WEMNG, REMNG, DATAB, FIXKZ, ABRUF, GISSM, VPRSV, VERPR, STPRS, etc.

- Part 2 — Frontend PTP Insights:
  - Created `src/components/PTPInsightsPanel.tsx` — collapsible 12-table PTP dashboard
  - Tabs: EBAN, EKKO, EKPO, EKBE, EKET, EKKN, EORD, EKAB, MVER, MBEWH, EINA, EINE
  - Features: PTP flow banner (PR→PO→Schedule→GR/IR→Invoice→Payment), per-table field legend, paginated data table, lazy load from `/api/industry/:slug/data/:table` or scenario endpoints
  - Wired into `App.tsx` below BPEvaluationPanel (always visible, collapsible)
  - `npx tsc --noEmit`: 0 errors

- Part 3 — GLOBAL_RULES.md MCP Registry:
  - Replaced thin §4 with comprehensive §4.1–4.4
  - 4.1: Full registry — 13 Anthropic reference servers, 5 Google Workspace OAuth servers, 2 Google Maps, 7 Financial (Yahoo, AlphaVantage, Polygon, IEX, Zerodha, Apify), 7 SAP-specific (Integration Suite × 3, Docs, BTP Audit, AI Core, CF), 6 Productivity (Notion, Slack, GitHub, BigQuery, Cloud Storage, Analytics)
  - 4.2: Quick-setup mcp.json config block for 4 common servers
  - 4.3: 8 MCP usage rules for coding agents (rate limits, caching, auth patterns, batching)
  - 4.4: Inventory of 8 locally downloaded MCP ZIP packages in `.bob/Online Git MCP/`
  - Source documents parsed: `SAP MCP.txt`, `NOTEPAD COVERING MCP.txt`

**Result**: ✅ `tsc --noEmit` 0 errors. 3 new files: `PTPInsightsPanel.tsx`, 9 new seed generators added to `seedIndustryData.ts`. GLOBAL_RULES.md §4 expanded from 6 lines to ~150 lines of structured MCP documentation.

**Note**: `SAP Table Fields.xls` (legacy XLS format) could not be parsed — only `.xlsx` is supported. Re-save as `.xlsx` if fields from that file are needed.
