import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { 
  users, 
  userConditions, 
  userMedications, 
  userAllergies,
  familyHistory,
  insuranceDetails 
} from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const patientProfileRouter = router({
  // Get user's complete profile
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    // Get user basic info
    const userResult = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const user = userResult.length > 0 ? userResult[0] : null;

    if (!user) {
      throw new Error("User not found");
    }

    // Get medical conditions
    const conditions = await db.select().from(userConditions).where(eq(userConditions.userId, userId));
    
    // Get current medications
    const medications = await db.select().from(userMedications).where(eq(userMedications.userId, userId));
    
    // Get allergies
    const allergies = await db.select().from(userAllergies).where(eq(userAllergies.userId, userId));

    return {
      personalInfo: {
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
      },
      medicalConditions: conditions.map(c => c.condition),
      currentMedications: medications.map(m => ({
        id: m.id.toString(),
        name: m.medicationName,
        dosage: m.dosage,
        frequency: m.frequency || "",
      })),
      allergies: {
        medications: allergies.map(a => a.allergen),
        foods: "", // TODO: Add food allergies field if needed
      },
    };
  }),

  // Update personal information
  updatePersonalInfo: protectedProcedure
    .input(
      z.object({
        dateOfBirth: z.string().nullable(),
        gender: z.enum(["male", "female", "other", "prefer_not_to_say"]).nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(users)
        .set({
          dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
          gender: input.gender,
        })
        .where(eq(users.id, userId));

      return { success: true };
    }),

  // Update medical conditions
  updateMedicalConditions: protectedProcedure
    .input(z.object({ conditions: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Delete existing conditions
      await db.delete(userConditions).where(eq(userConditions.userId, userId));

      // Insert new conditions
      if (input.conditions.length > 0) {
        await db.insert(userConditions).values(
          input.conditions.map(condition => ({
            userId,
            condition,
          }))
        );
      }

      return { success: true };
    }),

  // Add current medication
  addCurrentMedication: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        dosage: z.string(),
        frequency: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(userMedications).values({
        userId,
        medicationName: input.name,
        dosage: input.dosage,
        frequency: input.frequency,
        quantity: 30, // Default quantity
      });

      return { success: true };
    }),

  // Remove current medication
  removeCurrentMedication: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .delete(userMedications)
        .where(eq(userMedications.id, input.id));

      return { success: true };
    }),

  // Update allergies
  updateAllergies: protectedProcedure
    .input(
      z.object({
        medications: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Delete existing allergies
      await db.delete(userAllergies).where(eq(userAllergies.userId, userId));

      // Insert new allergies
      if (input.medications.length > 0) {
        await db.insert(userAllergies).values(
          input.medications.map(allergen => ({
            userId,
            allergen,
            severity: "moderate" as const, // Default severity
          }))
        );
      }

      return { success: true };
    }),

  // Add family history
  addFamilyHistory: protectedProcedure
    .input(
      z.object({
        condition: z.string(),
        relation: z.enum([
          "mother",
          "father",
          "sibling",
          "maternal_grandmother",
          "maternal_grandfather",
          "paternal_grandmother",
          "paternal_grandfather",
          "child",
          "other"
        ]),
        ageOfOnset: z.number().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.insert(familyHistory).values({
        userId,
        condition: input.condition,
        relation: input.relation,
        ageOfOnset: input.ageOfOnset,
      });

      return { success: true };
    }),

  // Get family history
  getFamilyHistory: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const history = await db.select().from(familyHistory).where(eq(familyHistory.userId, userId));

    return history;
  }),

  // Remove family history
  removeFamilyHistory: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(familyHistory).where(eq(familyHistory.id, input.id));

      return { success: true };
    }),
});
