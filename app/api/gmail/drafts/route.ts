import { google } from "googleapis";
import { loadTokens } from "../tokens";

export async function GET() {
  const userId = "testuser";
  const tokens = await loadTokens(userId);

  if (!tokens) {
    return new Response("No tokens found", { status: 400 });
  }

  const auth = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID!,
    process.env.GMAIL_CLIENT_SECRET!,
    process.env.GMAIL_REDIRECT_URI!
  );

  auth.setCredentials(tokens);

  const gmail = google.gmail({ version: "v1", auth });

  const res = await gmail.users.drafts.list({
    userId: "me",
    maxResults: 20,
  });

  // On simplifie la réponse : uniquement id + subject pour le frontend
  const simplified = await Promise.all(
    (res.data.drafts || []).map(async (draft: any) => {
      const fullDraft = await gmail.users.drafts.get({
        userId: "me",
        id: draft.id,
        format: "full",
      });

      const subjectHeader = fullDraft.data.message?.payload?.headers?.find(
        (h) => h.name === "Subject"
      );

      return {
        id: draft.id,
        subject: subjectHeader?.value || "(No subject)",
      };
    })
  );

  return Response.json(simplified);
}
