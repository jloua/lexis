import { z } from "zod";

export const TranslationFormSchema = z.object({
  type: z.enum(["translate", "simplify"]),
  input_language: z.string(),
  output_language: z.string(),
  input: z.string().max(500),
});

export type TranslationFormFields = z.infer<typeof TranslationFormSchema>;

export const QuizFilterSchema = z.object({
  type: z.enum(["translate", "simplify"]).optional(),
  any_language: z.boolean(),
  input_language: z.string().optional(),
  output_language: z.string().optional(),
  number: z.string(),
});

export type QuizFilterType = z.infer<typeof QuizFilterSchema>;
