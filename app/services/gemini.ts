import { AIMessageChunk } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {
  GeminiPostReqType,
  GeminiPostResultSchema,
  GeminiResponse,
} from "../types/gemini";
import axios from "axios";

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro",
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
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

  try {
    const response = await chain.invoke({
      input_language,
      output_language,
      input,
    });

    return validateResponse(response);
  } catch (error) {
    return error instanceof Error ? error.message : "Error invoking LLM";
  }
};

export const postGeminiRequest = async (data: GeminiPostReqType) => {
  try {
    const res = await axios.post<GeminiResponse>("../api/gemini", data);

    if (!res.data || !res.data.message || !res.data.message.content) {
      throw new Error("Invalid response structure from Gemini API");
    }

    const { content } = res.data.message;
    const failureIndicators = [
      "I cannot",
      "I am unable",
      "Error",
      "Failed",
      "Please provide the text",
    ];
    const containsFailure = failureIndicators.some((indicator) =>
      content.toLowerCase().includes(indicator.toLowerCase())
    );

    if (containsFailure) {
      throw new Error(
        "AI response indicates failure: " +
          content +
          "Please try another word or phrase."
      );
    }
    return content;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to post to Gemini");
  }
};
