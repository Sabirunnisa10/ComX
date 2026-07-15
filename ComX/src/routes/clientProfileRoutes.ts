import { Router, Request, Response } from "express";
import {
  ClientProfile,
  CLIENT_PROFILES,
  filterClientProfiles,
  getClientProfile,
} from "../data/clientProfiles";

const router = Router();

// ── GET /api/client-profiles ──────────────────────────────────────────────────
// Supports ?industry=, ?geography=, ?marketCapTier= query filters.
router.get("/api/client-profiles", (req: Request, res: Response): void => {
  try {
    const { industry, geography, marketCapTier } = req.query;

    const filters: { industry?: string; geography?: string; marketCapTier?: string } = {};
    if (typeof industry === "string") filters.industry = industry;
    if (typeof geography === "string") filters.geography = geography;
    if (typeof marketCapTier === "string") filters.marketCapTier = marketCapTier;

    const hasFilters =
      filters.industry !== undefined ||
      filters.geography !== undefined ||
      filters.marketCapTier !== undefined;

    const profiles: ClientProfile[] = hasFilters
      ? filterClientProfiles(filters)
      : CLIENT_PROFILES;

    res.json({ total: profiles.length, profiles });
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

// ── GET /api/client-profiles/stats ───────────────────────────────────────────
// Must be declared BEFORE /:id so Express does not treat "stats" as an id param.
router.get("/api/client-profiles/stats", (_req: Request, res: Response): void => {
  try {
    const byIndustry: Record<string, number> = {};
    const byRegion: Record<string, number> = {};
    const byTier: Record<string, number> = {};

    for (const profile of CLIENT_PROFILES) {
      byIndustry[profile.industry] = (byIndustry[profile.industry] ?? 0) + 1;
      byRegion[profile.region] = (byRegion[profile.region] ?? 0) + 1;
      byTier[profile.marketCapTier] = (byTier[profile.marketCapTier] ?? 0) + 1;
    }

    res.json({
      byIndustry,
      byRegion,
      byTier,
      total: CLIENT_PROFILES.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

// ── GET /api/client-profiles/:id ─────────────────────────────────────────────
router.get("/api/client-profiles/:id", (req: Request, res: Response): void => {
  try {
    const profile = getClientProfile(req.params.id);
    if (!profile) {
      res.status(404).json({ error: `Client profile '${req.params.id}' not found` });
      return;
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

export default router;
