import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";

export const safetyRouter = router({
  formatSafetyInfo: publicProcedure
    .input(
      z.object({
        blackBoxWarnings: z.array(z.string()),
        warnings: z.array(z.string()),
        contraindications: z.array(z.string()),
        adverseReactions: z.array(z.string()),
        drugInteractions: z.array(z.string()),
        medicationName: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        blackBoxWarnings,
        warnings,
        contraindications,
        adverseReactions,
        drugInteractions,
        medicationName,
      } = input;

      // Combine all safety data into a single text block
      const rawSafetyData = `
MEDICATION: ${medicationName}

${blackBoxWarnings.length > 0 ? `BLACK BOX WARNINGS:\n${blackBoxWarnings.join('\n\n')}` : ''}

${warnings.length > 0 ? `WARNINGS AND PRECAUTIONS:\n${warnings.join('\n\n')}` : ''}

${contraindications.length > 0 ? `CONTRAINDICATIONS:\n${contraindications.join('\n\n')}` : ''}

${adverseReactions.length > 0 ? `ADVERSE REACTIONS:\n${adverseReactions.join('\n\n')}` : ''}

${drugInteractions.length > 0 ? `DRUG INTERACTIONS:\n${drugInteractions.join('\n\n')}` : ''}
      `.trim();

      // Use LLM to format and organize the safety information
      const result = await invokeLLM({
        messages: [
          {
            role: "system",
            content: `You are a medical information formatter. Your task is to take raw FDA drug label safety information and format it into clear, organized, easy-to-read sections.

Guidelines:
- Remove excessive technical jargon while keeping medical accuracy
- Break long paragraphs into bullet points or shorter paragraphs
- Extract key points and highlight them
- Organize information hierarchically (most important first)
- Use clear headings and subheadings
- Keep the tone professional but accessible
- Preserve all critical safety information
- Remove redundant information
- Format drug names, dosages, and medical terms consistently

Return the formatted information as JSON with the following structure:
{
  "blackBoxWarnings": [{ "title": "string", "content": "string" }],
  "contraindications": [{ "title": "string", "content": "string" }],
  "drugInteractions": [{ "title": "string", "content": "string" }],
  "warnings": [{ "title": "string", "content": "string" }],
  "adverseReactions": [{ "title": "string", "content": "string" }]
}`,
          },
          {
            role: "user",
            content: `Please format this safety information:\n\n${rawSafetyData}`,
          },
        ],
        responseFormat: { type: "json_object" },
        maxTokens: 4000,
      });

      const formattedData = JSON.parse(
        result.choices[0].message.content as string
      );

      return {
        blackBoxWarnings: formattedData.blackBoxWarnings || [],
        contraindications: formattedData.contraindications || [],
        drugInteractions: formattedData.drugInteractions || [],
        warnings: formattedData.warnings || [],
        adverseReactions: formattedData.adverseReactions || [],
      };
    }),
});
