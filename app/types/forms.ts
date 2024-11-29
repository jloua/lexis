import { z } from "zod";

export const TranslationFormSchema = z.object({
  type: z.enum(["translate", "simplify"]),
  input_language: z.string(),
  output_language: z.string().optional(),
  input: z.string().max(500),
});
export type TranslationFormFields = z.infer<typeof TranslationFormSchema>;
