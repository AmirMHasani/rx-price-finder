import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { genomicTests, medicationGeneInteractions } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const genomicRouter = router({
  // Get user's genomic test
  getGenomicTest: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get most recent genomic test
    const tests = await db
      .select()
      .from(genomicTests)
      .where(eq(genomicTests.userId, userId))
      .orderBy(genomicTests.requestDate)
      .limit(1);

    if (tests.length === 0) {
      return null;
    }

    const test = tests[0];

    // Get medication-gene interactions for this test
    const interactions = await db
      .select()
      .from(medicationGeneInteractions)
      .where(eq(medicationGeneInteractions.genomicTestId, test.id));

    return {
      test: {
        id: test.id,
        testType: test.testType,
        testProvider: test.testProvider,
        status: test.status,
        requestDate: test.requestDate,
        resultsDate: test.resultsDate,
        reportUrl: test.reportUrl,
      },
      interactions: interactions.map(i => ({
        id: i.id,
        medicationName: i.medicationName,
        medicationClass: i.medicationClass,
        gene: i.gene,
        variant: i.variant,
        phenotype: i.phenotype,
        safetyLevel: i.safetyLevel,
        interpretation: i.interpretation,
        recommendation: i.recommendation,
        evidenceLevel: i.evidenceLevel,
        guidelineSource: i.guidelineSource,
      })),
    };
  }),

  // Request genomic test
  requestGenomicTest: protectedProcedure
    .input(
      z.object({
        testType: z.string(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(genomicTests).values({
        userId,
        testType: input.testType,
        testProvider: "GeneDx Laboratories",
        status: "requested",
        patientNotes: input.notes || null,
      });

      return { success: true };
    }),

  // Seed sample genomic data (for demo purposes)
  seedSampleData: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Check if test already exists
    const existing = await db
      .select()
      .from(genomicTests)
      .where(eq(genomicTests.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      return { success: true, message: "Sample data already exists" };
    }

    // Create sample genomic test
    const testResult = await db.insert(genomicTests).values({
      userId,
      testType: "Comprehensive Pharmacogenomic Panel",
      testProvider: "GeneDx Laboratories",
      status: "completed",
      requestDate: new Date("2024-11-15"),
      resultsDate: new Date("2024-12-01"),
    });

    // Get the inserted test ID
    const insertedTests = await db
      .select()
      .from(genomicTests)
      .where(eq(genomicTests.userId, userId))
      .limit(1);
    
    const testId = insertedTests[0].id;

    // Sample medication-gene interactions
    const sampleInteractions = [
      // Cardiovascular
      {
        medicationName: "Clopidogrel (Plavix)",
        medicationClass: "Cardiovascular",
        gene: "CYP2C19",
        variant: "*2/*17",
        phenotype: "Intermediate Metabolizer",
        safetyLevel: "caution" as const,
        interpretation: "Reduced CYP2C19 activity may decrease the effectiveness of clopidogrel. The medication may not provide adequate antiplatelet protection.",
        recommendation: "Consider alternative antiplatelet therapy such as prasugrel or ticagrelor, or increase monitoring for cardiovascular events.",
        evidenceLevel: "strong" as const,
        guidelineSource: "CPIC",
      },
      {
        medicationName: "Warfarin (Coumadin)",
        medicationClass: "Cardiovascular",
        gene: "CYP2C9, VKORC1",
        variant: "*1/*3",
        phenotype: "Intermediate Metabolizer",
        safetyLevel: "caution" as const,
        interpretation: "CYP2C9 *1/*3 genotype may require dose adjustment. VKORC1 GG genotype suggests normal sensitivity.",
        recommendation: "Start with lower initial dose (3-4 mg/day instead of 5 mg/day). Monitor INR closely and adjust dose based on response.",
        evidenceLevel: "strong" as const,
        guidelineSource: "CPIC, FDA",
      },
      {
        medicationName: "Simvastatin (Zocor)",
        medicationClass: "Cardiovascular",
        gene: "SLCO1B1",
        variant: "*1/*1",
        phenotype: "Normal Function",
        safetyLevel: "safe" as const,
        interpretation: "Normal SLCO1B1 function. Standard dosing is appropriate with normal risk of myopathy.",
        recommendation: "Use standard dosing. No genetic contraindications identified.",
        evidenceLevel: "strong" as const,
        guidelineSource: "CPIC",
      },
      // Antidepressants
      {
        medicationName: "Sertraline (Zoloft)",
        medicationClass: "Antidepressants",
        gene: "CYP2C19",
        variant: "*2/*17",
        phenotype: "Intermediate Metabolizer",
        safetyLevel: "caution" as const,
        interpretation: "Intermediate metabolizer status may affect sertraline levels. May require dose adjustment.",
        recommendation: "Consider 50% dose reduction if side effects occur. Monitor for efficacy and tolerability.",
        evidenceLevel: "moderate" as const,
        guidelineSource: "CPIC",
      },
      {
        medicationName: "Escitalopram (Lexapro)",
        medicationClass: "Antidepressants",
        gene: "CYP2C19",
        variant: "*2/*17",
        phenotype: "Intermediate Metabolizer",
        safetyLevel: "caution" as const,
        interpretation: "Intermediate CYP2C19 activity may lead to variable drug levels.",
        recommendation: "Start with standard dose, adjust based on response. Consider alternative SSRI if poor response.",
        evidenceLevel: "moderate" as const,
        guidelineSource: "CPIC",
      },
      {
        medicationName: "Amitriptyline",
        medicationClass: "Antidepressants",
        gene: "CYP2D6",
        variant: "*1/*1",
        phenotype: "Normal Metabolizer",
        safetyLevel: "safe" as const,
        interpretation: "Normal CYP2D6 metabolism. Standard dosing appropriate.",
        recommendation: "Use standard dosing. No genetic contraindications identified.",
        evidenceLevel: "strong" as const,
        guidelineSource: "CPIC",
      },
      // Pain Management
      {
        medicationName: "Codeine",
        medicationClass: "Pain Management",
        gene: "CYP2D6",
        variant: "*1/*1",
        phenotype: "Normal Metabolizer",
        safetyLevel: "safe" as const,
        interpretation: "Normal CYP2D6 activity. Standard codeine metabolism expected.",
        recommendation: "Use standard dosing. Normal analgesic effect expected.",
        evidenceLevel: "strong" as const,
        guidelineSource: "CPIC, FDA",
      },
      {
        medicationName: "Tramadol",
        medicationClass: "Pain Management",
        gene: "CYP2D6",
        variant: "*1/*1",
        phenotype: "Normal Metabolizer",
        safetyLevel: "safe" as const,
        interpretation: "Normal CYP2D6 activity. Standard tramadol metabolism expected.",
        recommendation: "Use standard dosing. Normal analgesic effect expected.",
        evidenceLevel: "moderate" as const,
        guidelineSource: "CPIC",
      },
      {
        medicationName: "Ibuprofen",
        medicationClass: "Pain Management",
        gene: "CYP2C9",
        variant: "*1/*3",
        phenotype: "Intermediate Metabolizer",
        safetyLevel: "caution" as const,
        interpretation: "Reduced CYP2C9 activity may lead to increased ibuprofen levels.",
        recommendation: "Use standard dosing but monitor for side effects. Consider dose reduction if GI issues occur.",
        evidenceLevel: "weak" as const,
        guidelineSource: "PharmGKB",
      },
      // Diabetes
      {
        medicationName: "Metformin",
        medicationClass: "Diabetes",
        gene: "SLC22A1",
        variant: "Normal",
        phenotype: "Normal Function",
        safetyLevel: "safe" as const,
        interpretation: "Normal metformin transporter function. Standard response expected.",
        recommendation: "Use standard dosing. No genetic contraindications identified.",
        evidenceLevel: "moderate" as const,
        guidelineSource: "PharmGKB",
      },
      {
        medicationName: "Glipizide",
        medicationClass: "Diabetes",
        gene: "CYP2C9",
        variant: "*1/*3",
        phenotype: "Intermediate Metabolizer",
        safetyLevel: "caution" as const,
        interpretation: "Reduced CYP2C9 activity may increase glipizide levels and hypoglycemia risk.",
        recommendation: "Start with lower dose. Monitor blood glucose closely and adjust as needed.",
        evidenceLevel: "moderate" as const,
        guidelineSource: "PharmGKB",
      },
    ];

    // Insert all interactions
    for (const interaction of sampleInteractions) {
      await db.insert(medicationGeneInteractions).values({
        userId,
        genomicTestId: testId,
        ...interaction,
      });
    }

    return { success: true, message: "Sample genomic data created" };
  }),
});
