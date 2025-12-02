/**
 * Insurance API Routes
 * 
 * Endpoints for querying insurance formulary data and copays
 */

import { Router } from "express";
import { getFormularyCoverage, getBestCopay, getActivePlans } from "../services/insuranceFormularyService";

const router = Router();

/**
 * GET /api/insurance/formulary/:rxcui
 * Get formulary coverage for a medication by RXCUI
 */
router.get("/formulary/:rxcui", async (req, res) => {
  try {
    const { rxcui } = req.params;
    const { insurance } = req.query;

    const coverage = await getFormularyCoverage(rxcui, insurance as string | undefined);

    res.json({
      success: true,
      rxcui,
      coverage,
      count: coverage.length,
    });
  } catch (error) {
    console.error("[Insurance API] Error fetching formulary:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch formulary data",
    });
  }
});

/**
 * GET /api/insurance/copay/:rxcui
 * Get best copay for a medication under specific insurance
 */
router.get("/copay/:rxcui", async (req, res) => {
  try {
    const { rxcui } = req.params;
    const { insurance } = req.query;

    if (!insurance) {
      return res.status(400).json({
        success: false,
        error: "Insurance parameter is required",
      });
    }

    const bestCopay = await getBestCopay(rxcui, insurance as string);

    if (!bestCopay) {
      return res.json({
        success: true,
        rxcui,
        insurance,
        covered: false,
        message: "Medication not covered by selected insurance",
      });
    }

    res.json({
      success: true,
      rxcui,
      insurance,
      covered: true,
      copay: bestCopay.copay,
      planName: bestCopay.planName,
      tierName: bestCopay.tierName,
    });
  } catch (error) {
    console.error("[Insurance API] Error fetching copay:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch copay data",
    });
  }
});

/**
 * GET /api/insurance/plans
 * Get all active insurance plans
 */
router.get("/plans", async (req, res) => {
  try {
    const plans = await getActivePlans();

    res.json({
      success: true,
      plans,
      count: plans.length,
    });
  } catch (error) {
    console.error("[Insurance API] Error fetching plans:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch insurance plans",
    });
  }
});

export default router;
