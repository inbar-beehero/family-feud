import type { Answer, FastMoneyQuestion } from "@/types";

export async function aiMatchAnswer(
  guess: string,
  question: string,
  availableAnswers: Answer[],
): Promise<number> {
  const answersStr = availableAnswers
    .map((a, i) => `${i}: "${a.text}"`)
    .join("\n");
  const prompt = `You are judging answers in a Hebrew Family Feud (פיוד משפחתי) game.

Question: "${question}"

Available answers on the board:
${answersStr}

Player's guess: "${guess}"

Does the player's guess match any of the available answers? Consider:
- Synonyms (e.g. "רכב" = "מכונית", "כעסני" = "כועס")
- Inflections and conjugations (e.g. "רצים" = "לרוץ", "גדולה" = "גדול")
- Slang and informal expressions (e.g. "פלאפון" = "טלפון", "תותח" = "מגניב")
- Partial matches where the core meaning is the same (e.g. "אוזניים ענקיות" matches "אוזניים עם קיות")
- Transliterations and loanwords (e.g. "פון" = "טלפון")
- The answer should genuinely refer to the same concept, not just share a word

Respond with ONLY a JSON object, no markdown:
{"match": true/false, "index": <number or null>}`;

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await resp.json();
    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    if (
      parsed.match &&
      typeof parsed.index === "number" &&
      parsed.index >= 0 &&
      parsed.index < availableAnswers.length
    ) {
      return parsed.index;
    }
    return -1;
  } catch (e) {
    console.error("AI match error:", e);
    const g = guess.toLowerCase().trim();
    return availableAnswers.findIndex((a) => a.text.toLowerCase().includes(g));
  }
}

export interface FastMoneyResult {
  p1: number;
  p2: number;
  details: Record<
    string,
    { matched: boolean; answer?: Answer; points?: number }
  >;
}

export async function aiMatchFastMoney(
  fmQuestions: FastMoneyQuestion[],
  fmAnswers: Record<string, string>,
): Promise<FastMoneyResult> {
  const items: {
    qi: number;
    player: number;
    guess: string;
    question: string;
    boardAnswers: Answer[];
  }[] = [];
  for (let i = 0; i < 5; i++) {
    const q = fmQuestions[i];
    for (const p of [1, 2]) {
      const ans = fmAnswers[`p${p}_q${i}`];
      if (ans)
        items.push({
          qi: i,
          player: p,
          guess: ans,
          question: q.question,
          boardAnswers: q.answers,
        });
    }
  }
  if (!items.length) return { p1: 0, p2: 0, details: {} };

  const prompt = `You are judging answers in a Hebrew Family Feud fast money round.

For each item below, determine if the player's guess matches any board answer. Consider synonyms, inflections, slang, partial matches where the core meaning is the same.

${items
  .map(
    (it, idx) => `Item ${idx}:
  Question: "${it.question}"
  Board answers: ${it.boardAnswers.map((a, j) => `${j}:"${a.text}"(${a.points}pts)`).join(", ")}
  Player guess: "${it.guess}"`,
  )
  .join("\n\n")}

Respond with ONLY a JSON array, no markdown. Each element: {"item": <index>, "match": true/false, "answerIndex": <number or null>}`;

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await resp.json();
    const text = data.content?.[0]?.text || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const results: { item: number; match: boolean; answerIndex: number }[] =
      JSON.parse(clean);

    let p1 = 0,
      p2 = 0;
    const matchDetails: Record<
      string,
      { matched: boolean; answer?: Answer; points?: number }
    > = {};
    for (const r of results) {
      const it = items[r.item];
      if (r.match && typeof r.answerIndex === "number") {
        const pts = it.boardAnswers[r.answerIndex]?.points || 0;
        if (it.player === 1) p1 += pts;
        else p2 += pts;
        matchDetails[`p${it.player}_q${it.qi}`] = {
          matched: true,
          answer: it.boardAnswers[r.answerIndex],
          points: pts,
        };
      } else {
        matchDetails[`p${it.player}_q${it.qi}`] = { matched: false };
      }
    }
    return { p1, p2, details: matchDetails };
  } catch (e) {
    console.error("AI FM match error:", e);
    let p1 = 0,
      p2 = 0;
    const matchDetails: Record<
      string,
      { matched: boolean; answer?: Answer; points?: number }
    > = {};
    for (let i = 0; i < 5; i++) {
      const q = fmQuestions[i];
      for (const p of [1, 2]) {
        const ans = (fmAnswers[`p${p}_q${i}`] || "").toLowerCase().trim();
        if (ans) {
          const m = q.answers.find((a) => a.text.toLowerCase().includes(ans));
          if (m) {
            if (p === 1) p1 += m.points;
            else p2 += m.points;
            matchDetails[`p${p}_q${i}`] = {
              matched: true,
              answer: m,
              points: m.points,
            };
          } else {
            matchDetails[`p${p}_q${i}`] = { matched: false };
          }
        }
      }
    }
    return { p1, p2, details: matchDetails };
  }
}
