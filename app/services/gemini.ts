import { AIMessageChunk } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GeminiPostResultSchema } from "../types/gemini";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  temperature: 0.3,
  maxRetries: 2,
});

const validateResponse = (response: AIMessageChunk) => {
  const parsedResponse = GeminiPostResultSchema.safeParse(response);

  if (!parsedResponse.success) {
    throw new Error("Invalid response from Gemini API");
  }

  return parsedResponse.data;
};

export const simplifyText = async (input_language: string, input: string) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful assistant that simplifies a text in ${input_language}. It could be to help someone with little knowledge in ${input_language} or someone with reading difficulties. Rephrase the following text directly.`,
    ],
    ["human", input],
  ]);
  const chain = prompt.pipe(llm);

  const response = await chain.invoke({
    input_language,
    input,
  });

  return validateResponse(response);
};

export const translateText = async (
  input_language: string,
  output_language: string,
  input: string
) => {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful assistant that translates text from ${input_language} to ${output_language}. Translate the following text directly.`,
    ],
    ["human", input],
  ]);
  const chain = prompt.pipe(llm);

  const response = await chain.invoke({
    input_language,
    output_language,
    input,
  });

  return validateResponse(response);
};
