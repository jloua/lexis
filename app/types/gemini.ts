import { z } from "zod";

export const GeminiPostReqSchema = z.object({
  type: z.enum(["translate", "simplify"]),
  input_language: z.string(),
  output_language: z.string().optional(),
  input: z.string(),
});

export type GeminiPostReqType = z.infer<typeof GeminiPostReqSchema>;

export const GeminiPostResultSchema = z.object({
  content: z.string(),
});

export type GeminiPostResultType = z.infer<typeof GeminiPostResultSchema>;

export type GeminiResponse = {
  message: GeminiPostResultType;
};
