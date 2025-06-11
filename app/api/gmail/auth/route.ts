import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.GMAIL_CLIENT_ID!;
const REDIRECT_URI = process.env.GMAIL_REDIRECT_URI!;
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.modify",
];

export async function GET(req: NextRequest) {
  const state = "xyz"; // (pour l'instant on met du fixe, plus tard on sécurisera)
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES.join(
    "%20"
  )}&access_type=offline&prompt=consent&state=${state}`;
  return NextResponse.redirect(url);
}
