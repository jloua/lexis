import { NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import * as dotenv from "dotenv";

dotenv.config();

export async function GET() {
  try {
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-pro",
      temperature: 0.3,
      maxRetries: 2,
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You are a helpful assistant that translates {input_language} to {output_language}.",
      ],
      ["human", "{input}"],
    ]);

    const chain = prompt.pipe(llm);
    const aiResponse = await chain.invoke({
      input_language: "sv",
      output_language: "en",
      input: "Dags att återgå till arbetet",
    });

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const llm = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-pro",
      temperature: 0.3,
      maxRetries: 2,
    });

    const userInput = await request.json();

    if (userInput.type === "translation") {
      const { input_language, output_language, input } = userInput;
      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `You are a helpful assistant that translates text from ${input_language} to ${output_language}. Translate the following text directly.`,
        ],
        ["human", input],
      ]);

      const chain = prompt.pipe(llm);

      const aiResponse = await chain.invoke({
        input_language,
        output_language,
        input,
      });

      return NextResponse.json({ message: aiResponse });
    }

    if (userInput.type === "simplify") {
      const { input_language, input } = userInput;
      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `You are a helpful assistant that simplifies a text in ${input_language}. It could be to help someone with little knowledge in ${input_language} or someone with reading difficulties. Rephrase the following text directly.`,
        ],
        ["human", input],
      ]);

      const chain = prompt.pipe(llm);

      const aiResponse = await chain.invoke({
        input_language,
        input,
      });

      return NextResponse.json({ message: aiResponse });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Error requesting translation" },
      { status: 500 }
    );
  }
}
