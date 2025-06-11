import fs from "fs-extra";
import path from "path";

const TOKENS_FILE = path.resolve(process.cwd(), "tokens.json");

interface TokenStore {
  [userId: string]: any;
}

export async function saveTokens(userId: string, tokens: any) {
  let existing: TokenStore = {};

  if (await fs.pathExists(TOKENS_FILE)) {
    existing = await fs.readJson(TOKENS_FILE);
  }

  existing[userId] = tokens;
  await fs.writeJson(TOKENS_FILE, existing);
}

export async function loadTokens(userId: string) {
  if (!(await fs.pathExists(TOKENS_FILE))) {
    return null;
  }

  const existing: TokenStore = await fs.readJson(TOKENS_FILE);
  return existing[userId] || null;
}
