import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { error: "Missing Authorization token" },
      { status: 401 }
    );
  }

  const res = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/drafts?format=full",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch drafts" },
      { status: res.status }
    );
  }

  const data = await res.json();

  return NextResponse.json(data);
}
