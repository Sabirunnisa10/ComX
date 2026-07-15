# skills.md — WatsonX SAP Commodity Pricing

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| `react` | ^18.x | UI framework |
| `vite` | ^5.x | Dev server + build tool |
| `typescript` | ^5.x | Type safety |
| `axios` | ^1.x | HTTP client for API calls |
| `recharts` | ^2.x | Commodity weight + exposure charts |
| `dotenv` | ^16.x | Environment variable loader |

## Custom Utilities

| File | What it does |
|---|---|
| `src/services/watsonx.ts` | 3-tier AI chain: WatsonX → Gemini → dummy fallback |
| `mapMaterialToCommodity()` | AI maps SAP material name to commodity % weights |
| `summarizeProcurementRisk()` | AI summarizes top 3 risks from material list |

## Known Limitations / Tech Debt

- [ ] `config/commodities.json` not yet created — commodity list partially in source
- [ ] `config/endpoints.json` not yet created — commodity price API URLs not externalised
- [ ] `config/prompts.json` not yet created — AI prompt templates in source code
- [ ] No caching of commodity price API responses (TTL enforcement missing)
- [ ] README only mentions Gemini — needs update to document WatsonX as primary

## Testing Checklist

- [ ] Material selector: all categories load, commodity chart renders
- [ ] AI fallback: run with `WATSONX_API_KEY=` empty → must show dummy weights, not crash
- [ ] Responsive: 375px, 768px, 1280px — no horizontal overflow
- [ ] Dark/Light theme toggle: all text readable in both modes
- [ ] Charts: empty material list → "No data" state, not JS error
