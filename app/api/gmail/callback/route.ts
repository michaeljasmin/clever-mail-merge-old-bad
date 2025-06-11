import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { saveTokens } from "../tokens";

const client = new OAuth2Client(
  process.env.GMAIL_CLIENT_ID!,
  process.env.GMAIL_CLIENT_SECRET!,
  process.env.GMAIL_REDIRECT_URI!
);

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Missing code" });

  const { tokens } = await client.getToken(code);

  // 👇 Ici tu pourrais mettre un vrai userId dynamique via OAuth profile
  const userId = "testuser";
  await saveTokens(userId, tokens);

  return NextResponse.redirect("http://localhost:3000/api/gmail/success");
}
