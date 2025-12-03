import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { users, insuranceDetails } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const insuranceRouter = router({
  // Get user's insurance information
  getInsuranceInfo: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    // Get basic insurance from users table
    const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const user = userResult.length > 0 ? userResult[0] : null;

    if (!user) {
      throw new Error("User not found");
    }

    // Get extended insurance details
    const detailsResult = await db
      .select()
      .from(insuranceDetails)
      .where(eq(insuranceDetails.userId, userId))
      .limit(1);
    
    const details = detailsResult.length > 0 ? detailsResult[0] : null;

    return {
      // Primary insurance from users table
      primaryCarrier: user.insuranceCarrier || "",
      primaryPlan: user.insurancePlan || "",
      primaryMemberId: user.insuranceMemberId || "",
      
      // Extended details from insuranceDetails table
      primaryGroupNumber: details?.primaryGroupNumber || "",
      primaryRxBin: details?.primaryRxBin || "",
      primaryRxPcn: details?.primaryRxPcn || "",
      primaryRxGroup: details?.primaryRxGroup || "",
      
      // Secondary insurance
      hasSecondary: details?.hasSecondary || false,
      secondaryCarrier: details?.secondaryCarrier || "",
      secondaryPlan: details?.secondaryPlan || "",
      secondaryGroupNumber: details?.secondaryGroupNumber || "",
      secondaryMemberId: details?.secondaryMemberId || "",
      
      // Deductible
      deductibleMet: details?.deductibleMet || false,
      deductibleAmount: details?.deductibleAmount ? parseFloat(details.deductibleAmount) : null,
    };
  }),

  // Update insurance information
  updateInsuranceInfo: protectedProcedure
    .input(
      z.object({
        // Primary insurance
        primaryCarrier: z.string(),
        primaryPlan: z.string(),
        primaryMemberId: z.string(),
        primaryGroupNumber: z.string(),
        primaryRxBin: z.string(),
        primaryRxPcn: z.string(),
        primaryRxGroup: z.string(),
        
        // Secondary insurance
        hasSecondary: z.boolean(),
        secondaryCarrier: z.string().optional(),
        secondaryPlan: z.string().optional(),
        secondaryGroupNumber: z.string().optional(),
        secondaryMemberId: z.string().optional(),
        
        // Deductible
        deductibleMet: z.boolean(),
        deductibleAmount: z.number().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Update basic insurance in users table
      await db
        .update(users)
        .set({
          insuranceCarrier: input.primaryCarrier,
          insurancePlan: input.primaryPlan,
          insuranceMemberId: input.primaryMemberId,
        })
        .where(eq(users.id, userId));

      // Check if insurance details record exists
      const existingDetails = await db
        .select()
        .from(insuranceDetails)
        .where(eq(insuranceDetails.userId, userId))
        .limit(1);

      const detailsData = {
        userId,
        primaryGroupNumber: input.primaryGroupNumber,
        primaryRxBin: input.primaryRxBin,
        primaryRxPcn: input.primaryRxPcn,
        primaryRxGroup: input.primaryRxGroup,
        hasSecondary: input.hasSecondary,
        secondaryCarrier: input.secondaryCarrier || null,
        secondaryPlan: input.secondaryPlan || null,
        secondaryGroupNumber: input.secondaryGroupNumber || null,
        secondaryMemberId: input.secondaryMemberId || null,
        deductibleMet: input.deductibleMet,
        deductibleAmount: input.deductibleAmount?.toString() || null,
      };

      if (existingDetails.length > 0) {
        // Update existing record
        await db
          .update(insuranceDetails)
          .set(detailsData)
          .where(eq(insuranceDetails.userId, userId));
      } else {
        // Insert new record
        await db.insert(insuranceDetails).values(detailsData);
      }

      return { success: true };
    }),
});
