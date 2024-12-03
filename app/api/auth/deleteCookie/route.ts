import { NextResponse } from "next/server";

export async function POST() {
  try {
    const token = "";

    const response = new NextResponse();
    response.cookies.set("firebaseAuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: "Error deleting cookies" },
      { status: 500 }
    );
  }
}
