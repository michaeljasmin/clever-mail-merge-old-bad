import { NextResponse } from "next/server";

export async function GET() {
  return new Response("OAuth successful — ready for Gmail API");
}
