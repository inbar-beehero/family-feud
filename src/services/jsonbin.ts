import type { Question, FastMoneyQuestion } from "@/types";

const JSONBIN_BASE = "https://api.jsonbin.io/v3";

export interface BinData {
  questions: Question[];
  fmQuestions: FastMoneyQuestion[];
}

export async function createBin(
  apiKey: string,
  data: BinData,
): Promise<string> {
  const res = await fetch(`${JSONBIN_BASE}/b`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": apiKey,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to create bin: ${res.status}`);
  }
  const json = await res.json();
  const binId = json.metadata?.id;
  if (!binId) throw new Error("No bin ID in response");
  return binId;
}

export async function readBin(apiKey: string, binId: string): Promise<BinData> {
  const res = await fetch(`${JSONBIN_BASE}/b/${binId}/latest?meta=false`, {
    method: "GET",
    headers: {
      "X-Master-Key": apiKey,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to read bin: ${res.status}`);
  }
  const json = await res.json();
  return {
    questions: Array.isArray(json.questions) ? json.questions : [],
    fmQuestions: Array.isArray(json.fmQuestions) ? json.fmQuestions : [],
  };
}

export async function updateBin(
  apiKey: string,
  binId: string,
  data: BinData,
): Promise<void> {
  const res = await fetch(`${JSONBIN_BASE}/b/${binId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": apiKey,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to update bin: ${res.status}`);
  }
}
