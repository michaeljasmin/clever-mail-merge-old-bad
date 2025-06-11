import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json(
      { error: "Missing Authorization token" },
      { status: 401 }
    );
  }

  const { draftId, recipient, variables } = await req.json();

  // Get draft full data
  const draftRes = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/drafts/${draftId}?format=full`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!draftRes.ok) {
    return NextResponse.json(
      { error: "Failed to fetch draft" },
      { status: draftRes.status }
    );
  }

  const draftData = await draftRes.json();

  // Extract subject
  const headers = draftData.message.payload.headers;
  let subjectHeader = headers.find((h: any) => h.name === "Subject");
  let subject = subjectHeader ? subjectHeader.value : "";

  // Replace placeholders in subject
  for (const key in variables) {
    const placeholder = `{{${key}}}`;
    subject = subject.replaceAll(placeholder, variables[key]);
  }

  // Extract HTML body
  const parts = draftData.message.payload.parts || [];
  const htmlPart = parts.find((p: any) => p.mimeType === "text/html");
  let body = htmlPart
    ? Buffer.from(htmlPart.body.data, "base64").toString("utf-8")
    : "";

  // Replace placeholders in body
  for (const key in variables) {
    const placeholder = `{{${key}}}`;
    body = body.replaceAll(placeholder, variables[key]);
  }

  // Send email
  const sendRes = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: Buffer.from(
          `To: ${recipient}\r\nSubject: ${subject}\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n${body}`
        )
          .toString("base64")
          .replace(/\+/g, "-")
          .replace(/\//g, "_"),
      }),
    }
  );

  if (!sendRes.ok) {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: sendRes.status }
    );
  }

  return NextResponse.json({ success: true });
}
