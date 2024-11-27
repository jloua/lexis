import { NextResponse } from "next/server";
import * as dotenv from "dotenv";
import { simplifyText, translateText } from "@/app/services/gemini";
import { GeminiPostReqSchema } from "@/app/types/gemini";

dotenv.config();

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const validatedRequest = GeminiPostReqSchema.safeParse(json);

    if (!validatedRequest.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validatedRequest.error.errors },
        { status: 400 }
      );
    }

    const {
      type,
      input_language,
      output_language = "en",
      input,
    } = validatedRequest.data;

    const result =
      type === "translation"
        ? await translateText(input_language, output_language, input)
        : type === "simplify"
        ? await simplifyText(input_language, input)
        : null;

    if (!result) {
      throw new Error("Invalid type");
    }

    return NextResponse.json({ message: result });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Error requesting API" },
      { status: 500 }
    );
  }
}
