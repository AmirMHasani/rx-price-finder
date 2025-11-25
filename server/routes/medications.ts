/**
 * Medication API Routes
 * Provides endpoints for searching medications from RxNorm and FDA APIs
 */

import express, { Request, Response } from "express";
import {
  searchMedications,
  getMedicationDetails,
  getRelatedDrugs,
  getDrugInteractions,
} from "../services/rxnormService.js";
import {
  searchDrugsByName,
  searchDrugByNDC,
  searchGenericAlternatives,
} from "../services/fdaNdcService.js";

const router = express.Router();

/**
 * Search for medications by name
 * GET /api/medications/search?q=metformin
 */
router.get("/search", async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.q as string;

    if (!searchTerm || searchTerm.length < 2) {
      return res.status(400).json({
        error: "Search term must be at least 2 characters",
      });
    }

    // Search both RxNorm and FDA APIs in parallel
    const [rxnormResults, fdaResults] = await Promise.all([
      searchMedications(searchTerm),
      searchDrugsByName(searchTerm),
    ]);

    // Combine and deduplicate results
    const combinedResults = [
      ...rxnormResults.map((drug) => ({
        source: "rxnorm",
        rxcui: drug.rxcui,
        name: drug.name,
        type: drug.tty,
      })),
      ...fdaResults.map((drug) => ({
        source: "fda",
        ndc: drug.ndc,
        name: drug.brandName || drug.genericName,
        type: drug.dosageForm,
        genericName: drug.genericName,
        manufacturer: drug.manufacturer,
      })),
    ];

    // Remove duplicates based on name
    const uniqueResults = Array.from(
      new Map(combinedResults.map((item) => [item.name, item])).values()
    );

    res.json({
      success: true,
      count: uniqueResults.length,
      results: uniqueResults.slice(0, 20), // Limit to 20 results
    });
  } catch (error) {
    console.error("Error searching medications:", error);
    res.status(500).json({
      error: "Failed to search medications",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Get medication details
 * GET /api/medications/:rxcui/details
 */
router.get("/:rxcui/details", async (req: Request, res: Response) => {
  try {
    const { rxcui } = req.params;

    const [details, related, interactions] = await Promise.all([
      getMedicationDetails(rxcui),
      getRelatedDrugs(rxcui),
      getDrugInteractions(rxcui),
    ]);

    if (!details) {
      return res.status(404).json({
        error: "Medication not found",
      });
    }

    res.json({
      success: true,
      medication: details,
      relatedDrugs: related,
      interactions: interactions || [],
    });
  } catch (error) {
    console.error("Error getting medication details:", error);
    res.status(500).json({
      error: "Failed to get medication details",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Get generic alternatives for a brand name drug
 * GET /api/medications/alternatives?brandName=Lipitor
 */
router.get("/alternatives", async (req: Request, res: Response) => {
  try {
    const brandName = req.query.brandName as string;

    if (!brandName) {
      return res.status(400).json({
        error: "Brand name is required",
      });
    }

    const alternatives = await searchGenericAlternatives(brandName);

    res.json({
      success: true,
      brandName,
      count: alternatives.length,
      alternatives,
    });
  } catch (error) {
    console.error("Error getting alternatives:", error);
    res.status(500).json({
      error: "Failed to get alternatives",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Search by NDC code
 * GET /api/medications/ndc/:ndc
 */
router.get("/ndc/:ndc", async (req: Request, res: Response) => {
  try {
    const { ndc } = req.params;

    const drug = await searchDrugByNDC(ndc);

    if (!drug) {
      return res.status(404).json({
        error: "Drug not found",
      });
    }

    res.json({
      success: true,
      drug,
    });
  } catch (error) {
    console.error("Error searching by NDC:", error);
    res.status(500).json({
      error: "Failed to search by NDC",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
