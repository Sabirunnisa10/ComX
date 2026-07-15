# Rules.md — WatsonX SAP Commodity Pricing
> **Project:** `WatsonXSAPCommodity/` inside `AI side project`
> **Global infrastructure rules:** See [`../.bob/GLOBAL_RULES.md`](../.bob/GLOBAL_RULES.md) — read that file first.
> This file contains ONLY rules specific to this project.

---

## AGENT STARTUP (This Project)

1. Read `../GLOBAL_RULES.md`.
2. Read this file.
3. Read `Memory.md` — understand what has already been built.
4. Read `Architecture.md` — understand the data flow before touching any service.

---

## 1. Project Purpose

AI-powered commodity price analysis tool that maps SAP procurement materials to commodity indices (steel, copper, aluminium, etc.) and tracks price exposure using WatsonX AI.

---

## 2. AI Usage Rules

- Use `../shared/watsonx.js` (or `src/services/watsonx.ts` local copy) — do NOT reinvent AI calls.
- AI is used for: material→commodity mapping, procurement risk summarization, classification.
- All AI prompts MUST be under 200 tokens. Use key=value format, not prose paragraphs.
- `temperature=0` for classification/mapping. `temperature=0.3` for risk summaries.
- Every AI call has a JSON fallback in `data/dummy-ai.json` — never crash on AI failure.

---

## 3. Data Rules

- SAP material data sourced from `data/*.csv` or `data/*.xlsx` — never hard-coded arrays.
- Commodity price indices fetched via APIs defined in `config/endpoints.json` — never hard-coded URLs.
- All commodity weight mappings configurable in `config/commodities.json` — no code change needed to add a new commodity.
- Cache commodity price API responses for ≥ 5 minutes (TTL) — do not hit APIs on every render.

---

## 4. UI Rules (follows GLOBAL_RULES §10 Testing)

- Responsive: min 375px width. Dark + Light theme via CSS variables.
- Every async call (AI mapping, price fetch) shows a loading skeleton — never blank.
- All dropdowns and filters must have a working "All" / reset option.
- Charts must render a "No data available" state — never throw on empty data arrays.

---

## 5. No Hard-Coding

| What | Where |
|---|---|
| SAP material categories | `config/categories.json` |
| Commodity list and weights | `config/commodities.json` |
| API endpoints | `config/endpoints.json` |
| AI prompt templates | `config/prompts.json` |

---

## 6. What NOT to Change Without Asking

- Do not change the WatsonX model ID without updating `GLOBAL_RULES.md`.
- Do not change the commodity-to-SAP mapping logic in `src/services/watsonx.ts` without updating `Architecture.md`.

---

*Last updated: 2025-07-12 | Project: WatsonX SAP Commodity | Owner: Saurabh Solanki (IBM)*
