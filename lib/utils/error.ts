import { NextResponse } from "next/server";

export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

export function handleError(error: unknown) {
  console.error("[API Error]", error);

  if (error instanceof APIError) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }

  if (error instanceof SyntaxError) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export function success<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}
